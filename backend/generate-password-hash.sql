-- This script will help you generate and verify BCrypt password hashes
-- 
-- STEP 1: Start your backend server
-- STEP 2: Visit this URL in your browser to generate a hash for "admin123":
--         http://localhost:8080/api/test/hash?password=admin123
-- STEP 3: Copy the "hash" value from the response
-- STEP 4: Run the UPDATE statement below with your generated hash

-- Example UPDATE (replace YOUR_HASH_HERE with the hash from step 3):
-- UPDATE users SET password = 'YOUR_HASH_HERE' WHERE username = 'admin';
-- UPDATE users SET password = 'YOUR_HASH_HERE' WHERE username = 'manager';
-- UPDATE users SET password = 'YOUR_HASH_HERE' WHERE username = 'user';

-- To verify the hash works, visit:
-- http://localhost:8080/api/test/verify?password=admin123&hash=YOUR_HASH_HERE
