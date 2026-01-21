# Business Flow Implementation Guide

This document outlines the complete business flow implementation for the Smart Inventory Management System.

## 👥 User Roles

### ADMIN
- Full access to all features
- Can manage users, products, categories, suppliers, orders, and reports
- Access to all system settings

### STAFF  
- Limited access for daily operations
- Can view products
- Can manage inventory (add/reduce stock)
- Can create and update orders
- Cannot delete products, manage users, or access reports

---

## 🔐 Role-Based Access Control

### API Endpoints by Role

| Endpoint | ADMIN | STAFF |
|----------|-------|-------|
| `/users/**` | ✅ Full CRUD | ❌ No Access |
| `/categories/**` | ✅ Full CRUD | ❌ No Access |
| `/suppliers/**` | ✅ Full CRUD | ❌ No Access |
| `/products` (GET) | ✅ View | ✅ View |
| `/products` (POST/PUT/DELETE) | ✅ Full | ❌ No Access |
| `/orders` (GET) | ✅ View All | ✅ View All |
| `/orders` (POST/PUT) | ✅ Full | ✅ Create/Update |
| `/inventory/**` | ✅ Full | ✅ Update Stock |

---

## 📦 Order Creation Flow

### Business Logic (Critical!)

When an order is created:

1. **Validate User** - Verify user exists and is active
2. **Validate Products** - Check all products exist
3. **Check Stock Availability** - Verify sufficient quantity for each product
4. **Create Order** - Initialize order with PENDING status
5. **Create Order Items** - Process each item:
   - Calculate subtotal (quantity × unit price)
   - Link to product
6. **Calculate Total** - Sum all order item subtotals
7. **Reduce Stock** - Decrease product quantities (ATOMIC OPERATION)
8. **Save Order** - Persist order with items (transactional)
9. **Return Response** - Return created order with details

### Transaction Safety

All order creation operations are wrapped in `@Transactional` to ensure:
- If stock reduction fails, order is rolled back
- If any validation fails, no changes are committed
- Database consistency is maintained

---

## 🗂 Order Status Flow

```
PENDING → PAID → SHIPPED → COMPLETED
        ↘ CANCELLED
```

### Status Transitions

- **PENDING**: Initial state when order is created
- **PAID**: Payment received (Admin can set)
- **SHIPPED**: Order shipped to customer (Admin/Staff can set)
- **COMPLETED**: Order completed and delivered
- **CANCELLED**: Order cancelled (stock may need to be restored)

---

## 📊 Inventory Management

### Stock Operations

**Add Stock:**
- Admin/Staff can increase product quantity
- Updates product quantity field
- Creates stock history record (if implemented)

**Reduce Stock:**
- Automatically happens when order is created
- Admin/Staff can manually reduce stock
- System checks for negative stock (validation)

### Low Stock Alerts

- Products with quantity < `lowStockThreshold` are flagged
- Threshold can be set per product
- Dashboard shows low stock warnings

---

## 🔄 Daily Operations Flow

### Morning Routine (Staff)
1. Login → Dashboard
2. Check low stock alerts
3. Update inventory as needed
4. View pending orders

### Customer Order Processing (Staff)
1. Navigate to Orders → Create New Order
2. Select products and quantities
3. System validates stock availability
4. Order created → Stock automatically reduced
5. Order status: PENDING

### Admin Review (Admin)
1. View all orders from dashboard
2. Review order details
3. Update order status: PENDING → PAID → SHIPPED
4. Access reports for insights

---

## 🛡️ Security Implementation

### JWT-Based Authentication
- All endpoints (except `/auth/**`) require JWT token
- Token contains user ID and role
- Token validated on every request

### Role-Based Authorization
- `@PreAuthorize("hasRole('ADMIN')")` - Admin only
- `@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")` - Both roles
- Method-level security enforced by Spring Security

---

## 📝 Key Service Methods

### OrderService.createOrder()
```java
@Transactional
public OrderDTO createOrder(OrderDTO orderDTO) {
    // 1. Validate user
    // 2. Process order items
    // 3. Validate stock
    // 4. Calculate totals
    // 5. Reduce stock
    // 6. Save order
}
```

### ProductService.updateStock()
```java
public ProductDTO updateStock(Long productId, Integer quantityChange) {
    // Increase or decrease stock
    // Validate no negative stock
    // Update product
}
```

---

## 🚀 API Examples

### Create Order (Staff/Admin)
```json
POST /api/orders
{
  "userId": 2,
  "status": "PENDING",
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Response:**
- Order created with calculated total
- Stock automatically reduced
- Order items linked

### Update Order Status (Admin/Staff)
```json
PUT /api/orders/1
{
  "status": "PAID"
}
```

---

## ⚠️ Important Notes

1. **Stock Reduction** happens automatically on order creation
2. **Transaction Safety** ensures data consistency
3. **Role-Based Access** prevents unauthorized operations
4. **Order Status Flow** must be followed logically
5. **Stock Validation** prevents negative quantities

---

## 🔧 Future Enhancements

- Stock history tracking
- Order cancellation with stock restoration
- Email notifications
- Barcode scanning
- Advanced reporting
- Customer role for external orders
