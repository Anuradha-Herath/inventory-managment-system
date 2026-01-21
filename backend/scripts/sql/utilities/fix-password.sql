-- Direct SQL fix: Update all users with a verified BCrypt hash for password "admin123"
-- This hash is generated using BCrypt with strength 10

USE smart_inventory_db;

-- Note: BCrypt hashes are salted, so each encoding produces a different hash
-- The hash below is just an example. We need to generate it properly.

-- First, let's check current users
SELECT username, LEFT(password, 30) as current_hash FROM users;

-- IMPORTANT: You need to generate a proper BCrypt hash.
-- Since the test endpoint isn't working, use one of these options:

-- Option 1: Use online generator at https://www.bcrypt-generator.com/
--           Password: admin123
--           Copy the generated hash and replace HASH_HERE below

-- Option 2: Restart backend after rebuilding, then use:
--           http://localhost:8080/api/test/hash?password=admin123

-- Example (replace HASH_HERE with your generated hash):
-- UPDATE users SET password = 'HASH_HERE' WHERE username = 'admin';
-- UPDATE users SET password = 'HASH_HERE' WHERE username = 'manager';
-- UPDATE users SET password = 'HASH_HERE' WHERE username = 'user';
