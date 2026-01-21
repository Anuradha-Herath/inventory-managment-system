# Troubleshooting Guide

## Login Issues

### Issue: "Bad credentials" error

If you're getting "Bad credentials" when trying to login, follow these steps:

### Step 1: Verify Password Hash

The password hash in the database must be BCrypt encoded. To generate a proper hash:

1. **Option A: Use the GeneratePasswordHash utility**
   ```bash
   # After building the project
   cd backend
   mvn test-compile
   java -cp "target/test-classes:target/classes:$(mvn dependency:build-classpath -DincludeScope=test -q -Dmdep.outputFile=/dev/stdout)" com.smartinventory.util.GeneratePasswordHash
   ```

2. **Option B: Use an online BCrypt generator**
   - Visit: https://www.bcrypt-generator.com/
   - Enter password: `admin123`
   - Copy the generated hash
   - Update the database:
   ```sql
   UPDATE users SET password = 'YOUR_GENERATED_HASH' WHERE username = 'admin';
   ```

3. **Option C: Create a test endpoint (temporary)**
   Add this to a controller temporarily:
   ```java
   @GetMapping("/test/hash")
   public String generateHash(@RequestParam String password) {
       return new BCryptPasswordEncoder().encode(password);
   }
   ```
   Then visit: `http://localhost:8080/api/test/hash?password=admin123`

### Step 2: Update Database Password

Once you have the correct BCrypt hash, update the database:

```sql
USE smart_inventory_db;
UPDATE users SET password = '$2a$10$YOUR_GENERATED_HASH_HERE' WHERE username = 'admin';
UPDATE users SET password = '$2a$10$YOUR_GENERATED_HASH_HERE' WHERE username = 'manager';
UPDATE users SET password = '$2a$10$YOUR_GENERATED_HASH_HERE' WHERE username = 'user';
```

### Step 3: Verify User is Active

Make sure the user account is active:

```sql
SELECT username, active, role FROM users WHERE username = 'admin';
```

If `active` is 0, update it:
```sql
UPDATE users SET active = 1 WHERE username = 'admin';
```

## Frontend Issues

### Issue: Can't see input text (white text on white background)

**Fixed:** Added `text-gray-900` class to input fields in `frontend/app/login/page.tsx`

If you still see the issue, clear your browser cache and reload.

### Issue: API connection errors

1. Verify backend is running on `http://localhost:8080`
2. Check CORS configuration in `SecurityConfig.java`
3. Verify API URL in frontend `.env.local` or `next.config.js`

## Common Errors

### Error: 500 Internal Server Error
- Check backend logs for detailed error messages
- Verify database connection
- Ensure all required tables exist

### Error: 401 Unauthorized
- Verify username and password are correct
- Check that password hash is properly BCrypt encoded
- Verify user account is active

### Error: "User not found"
- Verify the user exists in the database
- Check username spelling (case-sensitive)
- Verify database connection

## Testing Login

### Using curl:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Using Postman:
1. POST to `http://localhost:8080/api/auth/login`
2. Body (raw JSON):
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

## Default Test Credentials

- **Username:** `admin`
- **Password:** `admin123`
- **Role:** ADMIN

If login still doesn't work after following these steps, check the backend application logs for more detailed error messages.
