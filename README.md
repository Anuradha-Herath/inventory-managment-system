# Smart Inventory Management System

A full-stack inventory management system built with Spring Boot 3 and Next.js 14.

## 🏗️ Project Structure

```
.
├── backend/          # Spring Boot REST API
├── frontend/         # Next.js 14 Web Application
└── README.md         # This file
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Ensure MySQL/PostgreSQL is running and create a database:
```sql
CREATE DATABASE smart_inventory_db;
```

3. Update `src/main/resources/application.yml` with your database credentials

4. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Features

### Backend
- ✅ Spring Boot 3 with Java 17
- ✅ RESTful API with clean architecture
- ✅ JWT-based authentication with role-based access control
- ✅ BCrypt password encoding
- ✅ MySQL/PostgreSQL support
- ✅ Swagger/OpenAPI documentation
- ✅ Global exception handling
- ✅ MapStruct for DTO mapping
- ✅ Spring Data JPA with Hibernate
- ✅ Transaction-safe order creation with stock management
- ✅ Role-based security with method-level authorization

### Frontend
- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS for styling
- ✅ JWT authentication
- ✅ Protected routes with role-based navigation
- ✅ Admin dashboard with real-time statistics
- ✅ Product management (Full CRUD)
- ✅ Category management (Full CRUD)
- ✅ Order management (Full CRUD with stock validation)
- ✅ User management (Full CRUD with status control)
- ✅ Supplier management (Full CRUD)
- ✅ Low stock alerts
- ✅ Order status tracking
- ✅ Responsive design

## 📦 Domain Entities

- **User**: System users with roles (ADMIN, STAFF) and active/inactive status
- **Product**: Inventory items with pricing, stock, and low stock threshold
- **Category**: Product categorization
- **Supplier**: Supplier information with contact details
- **Order**: Customer orders with status tracking (PENDING, PAID, SHIPPED, COMPLETED, CANCELLED)
- **OrderItem**: Items within an order with quantity and pricing
- **Payment**: Payment information for orders

## 🔐 Authentication & Authorization

The system uses JWT tokens for authentication with role-based access control:

- **Login Endpoint**: `POST /api/auth/login`
- **Request body**: `{ "username": "admin", "password": "password" }`
- **Response**: Includes JWT token to use in Authorization header: `Bearer <token>`

### Role-Based Access Control

- **ADMIN**: Full access to all features (users, products, categories, suppliers, orders)
- **STAFF**: Limited access (view products, create/update orders)

All endpoints are protected by JWT authentication, with method-level security enforcing role-based permissions.

## 📚 API Documentation

Once the backend is running, access Swagger UI at:
`http://localhost:8080/swagger-ui.html`

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.2.0
- Java 17
- Maven
- Spring Data JPA
- Hibernate
- JWT (jjwt 0.12.3)
- Lombok
- MapStruct
- Swagger/OpenAPI
- MySQL/PostgreSQL

### Frontend
- Next.js 14.1.0
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Zustand (state management)

## 🎯 Key Features Implemented

### Dashboard
- Real-time statistics (products, orders, users, revenue)
- Today's metrics tracking
- Recent orders list
- Order status breakdown with visual progress bars
- Low stock alerts with color-coded indicators
- Role-based statistics display

### Product Management
- Full CRUD operations
- Stock tracking with low stock threshold
- Supplier relationship
- Category assignment
- Role-based permissions (Admin: full access, Staff: view only)

### Order Management
- Complete order lifecycle (PENDING → PAID → SHIPPED → COMPLETED)
- Stock validation before order creation
- Automatic stock reduction on order creation
- Transaction-safe operations
- Order cancellation support

### User Management
- Full CRUD operations (Admin only)
- Role assignment (ADMIN/STAFF)
- Active/Inactive status control
- Password management with BCrypt encoding
- Self-protection (cannot delete/disable own account)

### Supplier Management
- Full CRUD operations (Admin only)
- Contact information management
- Active/Inactive status tracking

## 📄 License

This project is created for academic purposes.

## 👥 Contributing

This is a template project structure. Feel free to extend and customize according to your needs.

## 📚 Documentation

Project documentation is organized in the following structure:

- **Project Documentation**: `docs/` - Project-wide documentation
- **Backend Documentation**: `backend/docs/` - Setup, migrations, troubleshooting
- **Frontend Documentation**: `frontend/docs/` - Implementation guides and features
- **SQL Scripts**: `backend/scripts/sql/` - Database scripts organized by purpose

See individual README files in each directory for detailed navigation.

## 📞 Support

For issues and questions, please refer to:
- Individual README files in `backend/` and `frontend/` directories
- Documentation in `docs/`, `backend/docs/`, and `frontend/docs/`
