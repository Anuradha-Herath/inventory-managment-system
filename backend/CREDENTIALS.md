# Test User Credentials

Dummy users have been inserted into the database for testing purposes.

## Test Accounts

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@smartinventory.com
- **Role:** ADMIN
- **Status:** Active

### Manager User
- **Username:** `manager`
- **Password:** `admin123`
- **Email:** manager@smartinventory.com
- **Role:** MANAGER
- **Status:** Active

### Regular User
- **Username:** `user`
- **Password:** `admin123`
- **Email:** user@smartinventory.com
- **Role:** USER
- **Status:** Active

## Login

Use these credentials to login via:
- **API Endpoint:** `POST http://localhost:8080/api/auth/login`
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

## Notes

⚠️ **Important:** All passwords are BCrypt encoded in the database. If you encounter login issues, you may need to:

1. Verify the password hash is correct
2. Ensure password encoding is properly configured in Spring Security
3. Regenerate password hashes using the `PasswordEncoderUtil` class

## Generate New Password Hash

If you need to generate a new BCrypt hash for a password, you can:

1. Use the `PasswordEncoderUtil` class in the codebase
2. Or use an online BCrypt generator: https://www.bcrypt-generator.com/
3. Or run this in a Spring Boot shell:
   ```java
   BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
   String hash = encoder.encode("yourpassword");
   System.out.println(hash);
   ```

## Security Warning

🔒 These are test credentials only. **Change all passwords in production!**
