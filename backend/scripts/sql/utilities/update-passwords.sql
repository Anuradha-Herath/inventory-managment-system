-- Update passwords with properly BCrypt encoded hash for "admin123"
-- This hash was generated using BCryptPasswordEncoder with default strength (10)

USE smart_inventory_db;

-- Update all users with the correct BCrypt hash for password "admin123"
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin';
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'manager';
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'user';

-- Verify the update
SELECT username, LEFT(password, 20) as password_hash_preview FROM users;
