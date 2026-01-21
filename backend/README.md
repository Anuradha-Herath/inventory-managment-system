# Smart Inventory Management System - Backend

This is the backend REST API for the Smart Inventory Management System, built with Spring Boot 3, Java 17, and Maven.

## Features

- 🔐 JWT-based authentication and authorization
- 📦 Product management
- 🏷️ Category management
- 🛒 Order management
- 👥 User management
- 💳 Payment tracking
- 📚 Swagger/OpenAPI documentation
- 🛡️ Global exception handling
- 🏗️ Clean architecture with layered structure

## Technology Stack

- **Spring Boot 3.2.0**
- **Java 17**
- **Maven**
- **Spring Data JPA & Hibernate**
- **MySQL/PostgreSQL**
- **JWT (jjwt)**
- **Lombok**
- **MapStruct**
- **Swagger/OpenAPI**

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8+ or PostgreSQL 12+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Database Setup

1. Create a database:
   - **MySQL**: `CREATE DATABASE smart_inventory_db;`
   - **PostgreSQL**: `CREATE DATABASE smart_inventory_db;`

2. Update `application.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_inventory_db
    username: your_username
    password: your_password
```

### Running the Application

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

4. The API will be available at `http://localhost:8080/api`

5. Swagger UI will be available at `http://localhost:8080/swagger-ui.html`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/smartinventory/
│   │   │   ├── controller/        # REST controllers
│   │   │   ├── service/           # Service interfaces
│   │   │   │   └── impl/         # Service implementations
│   │   │   ├── repository/        # JPA repositories
│   │   │   ├── domain/            # Domain layer
│   │   │   │   ├── entity/       # JPA entities
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   └── enums/        # Enumerations
│   │   │   ├── mapper/            # MapStruct mappers
│   │   │   ├── security/          # Security components
│   │   │   ├── config/            # Configuration classes
│   │   │   ├── exception/         # Exception handling
│   │   │   └── util/              # Utility classes
│   │   └── resources/
│   │       └── application.yml    # Application configuration
│   └── test/                      # Test files
└── pom.xml                        # Maven configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## Configuration

### JWT Configuration

Update JWT secret in `application.yml`:
```yaml
jwt:
  secret: your-256-bit-secret-key-change-this-in-production
  expiration: 86400000  # 24 hours in milliseconds
```

## TODO

- [ ] Implement password encoding in UserService
- [ ] Complete order item creation logic
- [ ] Add payment service
- [ ] Add refresh token mechanism
- [ ] Add user registration endpoint
- [ ] Add pagination to list endpoints
- [ ] Add filtering and sorting
- [ ] Add comprehensive tests
- [ ] Add logging
- [ ] Add validation for business rules

## Security

- JWT tokens are used for authentication
- Passwords should be encoded (TODO: implement BCrypt encoding)
- CORS is configured for frontend communication
- All endpoints except `/auth/**` require authentication

## License

This project is part of the Smart Inventory Management System.
