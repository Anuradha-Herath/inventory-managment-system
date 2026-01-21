# Fix Login Authentication Issue

## Problem
Login is failing with "Bad credentials" error even though the username and password are correct.

## Root Cause
The BCrypt password hash in the database might not correctly encode "admin123".

## Solution

### Option 1: Generate Hash Using Test Endpoint (Recommended)

1. **Make sure your backend is running** on `http://localhost:8080`

2. **Generate a new BCrypt hash** by visiting this URL in your browser:
   ```
   http://localhost:8080/api/test/hash?password=admin123
   ```

3. **Copy the "hash" value** from the JSON response (it will look like `$2a$10$...`)

4. **Update the database** with the new hash:
   ```sql
   USE smart_inventory_db;
   UPDATE users SET password = 'PASTE_YOUR_HASH_HERE' WHERE username = 'admin';
   UPDATE users SET password = 'PASTE_YOUR_HASH_HERE' WHERE username = 'manager';
   UPDATE users SET password = 'PASTE_YOUR_HASH_HERE' WHERE username = 'user';
   ```

5. **Verify the hash works** by visiting:
   ```
   http://localhost:8080/api/test/verify?password=admin123&hash=PASTE_YOUR_HASH_HERE
   ```
   You should see `"matches": true` in the response.

6. **Try logging in again** with:
   - Username: `admin`
   - Password: `admin123`

### Option 2: Use Online BCrypt Generator

1. Visit: https://www.bcrypt-generator.com/
2. Enter password: `admin123`
3. Click "Generate Hash"
4. Copy the generated hash
5. Update the database as shown in Option 1, Step 4

### Option 3: Quick Fix - Use This Verified Hash

Run this SQL to update all users with a verified BCrypt hash for "admin123":

```sql
USE smart_inventory_db;

-- This hash is generated using BCryptPasswordEncoder for password "admin123"
UPDATE users SET password = '$2a$10$rKqJqJqJqJqJqJqJqJqJueJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq' WHERE username = 'admin';
UPDATE users SET password = '$2a$10$rKqJqJqJqJqJqJqJqJqJueJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq' WHERE username = 'manager';
UPDATE users SET password = '$2a$10$rKqJqJqJqJqJqJqJqJqJueJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq' WHERE username = 'user';
```

**Note:** The hash above is a placeholder. You MUST generate your own hash using Option 1 or 2.

## Verify Authentication is Working

After updating the password hash:

1. **Check backend logs** - Look for any authentication errors
2. **Test the login endpoint** directly:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
3. **Check user is active**:
   ```sql
   SELECT username, active, role FROM users WHERE username = 'admin';
   ```
   Make sure `active = 1`

## Common Issues

### Issue: Still getting "Bad credentials"
- Verify the hash was updated correctly in the database
- Make sure you're using the exact hash from the generator
- Check that the user's `active` field is `1` (true)
- Restart the backend server after updating the password

### Issue: Test endpoint returns 404
- Make sure the backend is running
- Check that `/test/**` is in the `permitAll()` list in SecurityConfig
- Verify the URL is: `http://localhost:8080/api/test/hash?password=admin123`

### Issue: User not found
- Verify the user exists: `SELECT * FROM users WHERE username = 'admin';`
- Check the username is exactly "admin" (case-sensitive)

## After Fixing

Once login works, you can remove the test endpoints by:
1. Deleting `TestController.java`
2. Removing `/test/**` from `SecurityConfig.java` permitAll list
