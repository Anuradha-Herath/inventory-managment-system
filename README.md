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
- ✅ JWT-based authentication
- ✅ MySQL/PostgreSQL support
- ✅ Swagger/OpenAPI documentation
- ✅ Global exception handling
- ✅ MapStruct for DTO mapping
- ✅ Spring Data JPA with Hibernate

### Frontend
- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS for styling
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Admin dashboard
- ✅ Product management
- ✅ Category management
- ✅ Order management
- ✅ User management

## 📦 Domain Entities

- **User**: System users with roles (ADMIN, MANAGER, USER)
- **Product**: Inventory items with pricing and stock
- **Category**: Product categorization
- **Order**: Customer orders
- **OrderItem**: Items within an order
- **Payment**: Payment information for orders

## 🔐 Authentication

The system uses JWT tokens for authentication. Login via:
- Endpoint: `POST /api/auth/login`
- Request body: `{ "username": "admin", "password": "password" }`
- Response includes JWT token to use in Authorization header: `Bearer <token>`

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

## 📝 TODO

### Backend
- [ ] Implement password encoding with BCrypt
- [ ] Complete order item creation logic
- [ ] Add payment service implementation
- [ ] Add refresh token mechanism
- [ ] Add user registration endpoint
- [ ] Add pagination to list endpoints
- [ ] Add filtering and sorting capabilities
- [ ] Add comprehensive unit and integration tests
- [ ] Add logging framework
- [ ] Add business rule validations

### Frontend
- [ ] Add product creation/edit forms
- [ ] Add category creation/edit forms
- [ ] Add order creation form
- [ ] Add user creation/edit forms
- [ ] Add loading states and error handling
- [ ] Add pagination to tables
- [ ] Add search and filter functionality
- [ ] Add dashboard statistics with real data
- [ ] Add data visualization charts

## 📄 License

This project is created for academic purposes.

## 👥 Contributing

This is a template project structure. Feel free to extend and customize according to your needs.

## 📞 Support

For issues and questions, please refer to the individual README files in the `backend/` and `frontend/` directories.
