# Database Migration Guide

This guide helps you update your database to match the new business flow implementation.

## 📋 Changes Summary

1. **User Roles:** MANAGER and USER → STAFF
2. **Order Statuses:** PROCESSING → PAID, DELIVERED → COMPLETED
3. **New Table:** Suppliers
4. **Product Updates:** Added supplier_id and low_stock_threshold columns

---

## 🚀 Quick Migration

### Step 1: Backup Your Database (IMPORTANT!)

```sql
-- Create backup
mysqldump -u root -p smart_inventory_db > backup_before_migration.sql
```

### Step 2: Run Migration Script

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p smart_inventory_db < backend/src/main/resources/migration-update-roles.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your database
3. Open `backend/src/main/resources/migration-update-roles.sql`
4. Execute the script

**Option C: Copy and Paste**
1. Open the migration script
2. Copy all SQL commands
3. Paste into MySQL client
4. Execute

---

## 📝 Migration Script Details

### What the Script Does:

1. **Updates User Roles**
   - Changes all `MANAGER` and `USER` roles to `STAFF`
   - Keeps `ADMIN` roles unchanged

2. **Updates Order Statuses**
   - `PROCESSING` → `PAID`
   - `DELIVERED` → `COMPLETED`
   - Keeps `PENDING`, `SHIPPED`, `CANCELLED` unchanged

3. **Creates Suppliers Table**
   - New table with all required fields
   - Includes indexes and constraints

4. **Updates Products Table**
   - Adds `supplier_id` column (nullable)
   - Adds `low_stock_threshold` column (default: 10)
   - Adds foreign key constraint
   - Adds indexes for performance

5. **Inserts Sample Suppliers**
   - 3 sample suppliers for testing
   - Can be removed if not needed

---

## ✅ Verification Steps

After running the migration, verify the changes:

### 1. Check User Roles
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

**Expected Result:**
- ADMIN: (your admin users)
- STAFF: (all former MANAGER and USER)

### 2. Check Order Statuses
```sql
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

**Expected Result:**
- PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
- No PROCESSING or DELIVERED

### 3. Check Suppliers Table
```sql
SELECT * FROM suppliers;
```

**Expected Result:**
- 3 sample suppliers (if you kept them)

### 4. Check Products Table Structure
```sql
DESCRIBE products;
```

**Expected Result:**
- Should show `supplier_id` and `low_stock_threshold` columns

---

## 🔄 Rollback (If Needed)

If you need to revert the changes:

```bash
mysql -u root -p smart_inventory_db < backend/src/main/resources/migration-rollback.sql
```

**Note:** Rollback will:
- Revert order statuses
- Revert user roles to USER (you may need to manually fix)
- Remove new columns from products
- Does NOT drop suppliers table (commented out for safety)

---

## ⚠️ Important Notes

1. **Backup First:** Always backup your database before migration
2. **Test Environment:** Test migration on a copy first if possible
3. **Data Loss:** Migration updates existing data - ensure you understand the changes
4. **Foreign Keys:** Products can have NULL supplier_id initially
5. **Low Stock Threshold:** Default is 10, can be customized per product

---

## 🐛 Troubleshooting

### Issue: Foreign Key Constraint Error
**Solution:** Make sure suppliers table is created before adding foreign key to products

### Issue: Column Already Exists
**Solution:** The script uses `IF NOT EXISTS` - safe to run multiple times

### Issue: Role Update Failed
**Solution:** Check if users table has the role column and it's VARCHAR type

### Issue: Status Update Failed
**Solution:** Check if orders table exists and has status column

---

## 📊 Expected Database Schema After Migration

### Users Table
- `role` enum: 'ADMIN' or 'STAFF'

### Orders Table
- `status` enum: 'PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'

### Suppliers Table (New)
- `id` (Primary Key)
- `name` (Unique)
- `contact_person`
- `email`
- `phone_number`
- `address`
- `active`
- `created_at`
- `updated_at`

### Products Table (Updated)
- Existing columns...
- `supplier_id` (Foreign Key to suppliers.id, nullable)
- `low_stock_threshold` (INT, default 10)

---

## 🧪 Testing After Migration

1. **Test User Login:**
   - Login with admin user
   - Login with staff user (formerly manager/user)

2. **Test Order Status:**
   - Create a new order (should be PENDING)
   - Update order status to PAID, SHIPPED, COMPLETED

3. **Test Suppliers:**
   - View suppliers list
   - Create/edit supplier (Admin only)

4. **Test Products:**
   - View products
   - Check if supplier_id column exists
   - Update product with supplier

---

## 📞 Support

If you encounter issues:
1. Check the error message
2. Verify database connection
3. Ensure you have proper permissions
4. Check the rollback script if needed

---

## ✅ Migration Checklist

- [ ] Database backup created
- [ ] Migration script reviewed
- [ ] Migration script executed
- [ ] User roles verified
- [ ] Order statuses verified
- [ ] Suppliers table created
- [ ] Products table updated
- [ ] Sample data inserted (optional)
- [ ] Application tested
- [ ] Rollback plan ready (if needed)
