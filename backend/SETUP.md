# Backend Setup Guide

## Prerequisites Check

✅ Java 17+ - Installed  
✅ Maven 3.6+ - Installed  
⚠️ MySQL 8+ - Verify installation

## Step-by-Step Setup

### Step 1: Install and Start MySQL

#### If MySQL is not installed:

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and select "Developer Default"
3. During installation, set root password (remember this!)
4. Complete the installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### Start MySQL Service:

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "MySQL80" or "MySQL" service
- Right-click → Start (if not running)

**macOS/Linux:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql
```

### Step 2: Create Database

Open MySQL Command Line Client or MySQL Workbench, or use terminal:

```bash
mysql -u root -p
```

Enter your root password when prompted, then run:

```sql
CREATE DATABASE smart_inventory_db;
USE smart_inventory_db;
SHOW DATABASES;
```

Expected output should show `smart_inventory_db` in the list.

### Step 3: Update Database Configuration

Open `backend/src/main/resources/application.yml` and update the database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_inventory_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root           # Change if your MySQL username is different
    password: your_password  # Change to your actual MySQL root password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**Important:** Replace `your_password` with your actual MySQL root password.

### Step 4: Navigate to Backend Directory

```bash
cd backend
```

### Step 5: Build the Project

```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests (if any)
- Create the JAR file

**Note:** First build may take a few minutes as Maven downloads dependencies.

### Step 6: Run the Application

#### Option A: Using Maven (Recommended for development)

```bash
mvn spring-boot:run
```

#### Option B: Using the JAR file

```bash
java -jar target/smart-inventory-management-1.0.0.jar
```

### Step 7: Verify Connection

When the application starts, you should see:

```
Started SmartInventoryApplication in X.XXX seconds
```

Check the console output for:
- ✅ No database connection errors
- ✅ "Hibernate" initialization messages
- ✅ "Tomcat started on port(s): 8080"

### Step 8: Test the API

#### Check if the API is running:

Open browser or use curl:

```bash
curl http://localhost:8080/api/swagger-ui.html
```

Or visit in browser:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

#### Test Health Endpoint (if available):

```bash
curl http://localhost:8080/api/actuator/health
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
1. Verify your MySQL username and password in `application.yml`
2. Check if MySQL service is running
3. Try resetting MySQL root password if needed

### Error: "Unknown database 'smart_inventory_db'"

**Solution:**
The application will create the database automatically if `createDatabaseIfNotExist=true` is in the URL. If it fails:
1. Create the database manually (see Step 2)
2. Or ensure the MySQL user has CREATE DATABASE privileges

### Error: "Communications link failure"

**Solution:**
1. Verify MySQL service is running
2. Check if MySQL is listening on port 3306:
   ```bash
   # Windows
   netstat -an | findstr 3306
   
   # macOS/Linux
   netstat -an | grep 3306
   ```
3. Check firewall settings

### Error: "Port 8080 already in use"

**Solution:**
1. Change the port in `application.yml`:
   ```yaml
   server:
     port: 8081  # Use a different port
   ```
2. Or stop the process using port 8080

### Build Error: "Maven dependencies download failed"

**Solution:**
1. Check internet connection
2. Try again - sometimes it's a temporary network issue
3. Check Maven settings in `~/.m2/settings.xml`

## Verify Database Tables Were Created

After running the application, check if tables were created:

```sql
mysql -u root -p
USE smart_inventory_db;
SHOW TABLES;
```

You should see tables like:
- `users`
- `products`
- `categories`
- `orders`
- `order_items`
- `payments`

## Next Steps

1. ✅ Backend is running on `http://localhost:8080`
2. ✅ API is accessible at `http://localhost:8080/api`
3. ✅ Swagger UI available at `http://localhost:8080/swagger-ui.html`
4. 🚀 Now you can start the frontend application!

## Useful Commands

```bash
# Stop the application: Press Ctrl+C in the terminal

# Check if port 8080 is in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # macOS/Linux

# View application logs
# Logs will appear in the terminal where you ran mvn spring-boot:run
```
