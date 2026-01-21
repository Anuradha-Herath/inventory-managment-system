-- Migration Script: Update Database for Business Flow Changes
-- Run this script to update your database schema and data

USE smart_inventory_db;

-- ============================================
-- 1. UPDATE USER ROLES
-- ============================================
-- Step 1: Add STAFF to the enum (keeping old values temporarily)
ALTER TABLE users 
MODIFY COLUMN role ENUM('ADMIN', 'MANAGER', 'USER', 'STAFF') NOT NULL;

-- Step 2: Update existing MANAGER and USER roles to STAFF
UPDATE users 
SET role = 'STAFF' 
WHERE role IN ('MANAGER', 'USER');

-- Step 3: Now remove old enum values (only ADMIN and STAFF remain)
ALTER TABLE users 
MODIFY COLUMN role ENUM('ADMIN', 'STAFF') NOT NULL;

-- Verify the update
SELECT id, username, role FROM users;

-- ============================================
-- 2. UPDATE ORDER STATUSES
-- ============================================
-- Step 1: Add new enum values (keeping old values temporarily)
ALTER TABLE orders 
MODIFY COLUMN status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'PAID', 'COMPLETED') NOT NULL;

-- Step 2: Update existing order statuses to match new enum
-- PROCESSING -> PAID (assuming processing means payment received)
UPDATE orders 
SET status = 'PAID' 
WHERE status = 'PROCESSING';

-- DELIVERED -> COMPLETED
UPDATE orders 
SET status = 'COMPLETED' 
WHERE status = 'DELIVERED';

-- Step 3: Now remove old enum values (only new values remain)
ALTER TABLE orders 
MODIFY COLUMN status ENUM('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED') NOT NULL;

-- Verify the update
SELECT id, order_number, status FROM orders;

-- ============================================
-- 3. CREATE SUPPLIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    address VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE KEY unique_supplier_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. UPDATE PRODUCTS TABLE
-- ============================================
-- Add supplier_id column (nullable, can be added later)
-- Note: Check if columns exist first to avoid errors
SET @dbname = DATABASE();
SET @tablename = 'products';
SET @columnname1 = 'supplier_id';
SET @columnname2 = 'low_stock_threshold';

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname1)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname1, ' BIGINT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname2, ' INT NULL DEFAULT 10')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign key constraint for supplier (only if it doesn't exist)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE table_schema = DATABASE() 
  AND table_name = 'products' 
  AND constraint_name = 'fk_product_supplier');

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE products ADD CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for better performance (only if they don't exist)
-- Check and create supplier_id index
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE table_schema = DATABASE() 
  AND table_name = 'products' 
  AND index_name = 'idx_product_supplier');

SET @sql = IF(@index_exists = 0, 
  'CREATE INDEX idx_product_supplier ON products(supplier_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and create low_stock_threshold index
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE table_schema = DATABASE() 
  AND table_name = 'products' 
  AND index_name = 'idx_product_low_stock');

SET @sql = IF(@index_exists = 0, 
  'CREATE INDEX idx_product_low_stock ON products(low_stock_threshold)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 5. INSERT SAMPLE SUPPLIERS (Optional)
-- ============================================
INSERT INTO suppliers (name, contact_person, email, phone_number, address, active, created_at, updated_at)
VALUES 
    ('Tech Supplies Co.', 'John Smith', 'contact@techsupplies.com', '+1-555-0101', '123 Tech Street, City', TRUE, NOW(), NOW()),
    ('Global Electronics', 'Sarah Johnson', 'info@globalelectronics.com', '+1-555-0102', '456 Electronics Ave, City', TRUE, NOW(), NOW()),
    ('Office Solutions Ltd', 'Mike Brown', 'sales@officesolutions.com', '+1-555-0103', '789 Office Blvd, City', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================
-- Check user roles
SELECT 'User Roles' as check_type, COUNT(*) as count, role 
FROM users 
GROUP BY role;

-- Check order statuses
SELECT 'Order Statuses' as check_type, COUNT(*) as count, status 
FROM orders 
GROUP BY status;

-- Check suppliers table
SELECT 'Suppliers' as check_type, COUNT(*) as count 
FROM suppliers;

-- Check products table structure
DESCRIBE products;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
SELECT 'Migration completed successfully!' as status;
