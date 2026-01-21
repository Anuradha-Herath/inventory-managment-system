# Quick Fix: Update Password Hash

The test endpoint requires rebuilding the backend. Here's the fastest way to fix the password:

## Option 1: Use Online BCrypt Generator (Fastest - 2 minutes)

1. **Visit this website:**
   https://www.bcrypt-generator.com/

2. **Enter the password:**
   ```
   admin123
   ```

3. **Select rounds:** Keep default (10 rounds)

4. **Click "Generate Hash"**

5. **Copy the generated hash** (it will look like: `$2a$10$...`)

6. **Update the database:**
   ```sql
   USE smart_inventory_db;
   UPDATE users SET password = 'PASTE_YOUR_GENERATED_HASH_HERE' WHERE username = 'admin';
   UPDATE users SET password = 'PASTE_YOUR_GENERATED_HASH_HERE' WHERE username = 'manager';
   UPDATE users SET password = 'PASTE_YOUR_GENERATED_HASH_HERE' WHERE username = 'user';
   ```

7. **Try logging in again!**

## Option 2: Rebuild Backend and Use Test Endpoint

1. **Stop the backend** (if it's running)

2. **Rebuild the backend:**
   ```powershell
   cd backend
   mvn clean compile
   ```

3. **Start the backend:**
   ```powershell
   mvn spring-boot:run
   ```

4. **Wait for it to start** (look for "Started SmartInventoryApplication")

5. **Generate hash by visiting:**
   ```
   http://localhost:8080/api/test/hash?password=admin123
   ```

6. **Copy the hash and update database** (same as Option 1, step 6)

## Option 3: Direct SQL Update (If you have a working hash)

If you already have a verified BCrypt hash for "admin123", just run:

```sql
USE smart_inventory_db;
UPDATE users SET password = 'YOUR_BCRYPT_HASH_HERE' WHERE username = 'admin';
UPDATE users SET password = 'YOUR_BCRYPT_HASH_HERE' WHERE username = 'manager';
UPDATE users SET password = 'YOUR_BCRYPT_HASH_HERE' WHERE username = 'user';
```

## Verify the Fix

After updating:

1. **Check the hash was updated:**
   ```sql
   SELECT username, LEFT(password, 30) as hash_preview FROM users;
   ```

2. **Try logging in:**
   - Username: `admin`
   - Password: `admin123`

## Recommended: Use Option 1 (Online Generator)

It's the fastest and doesn't require rebuilding the backend!
