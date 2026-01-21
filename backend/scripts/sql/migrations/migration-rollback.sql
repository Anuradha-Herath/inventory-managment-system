-- Rollback Script: Revert Database Changes
-- Use this only if you need to rollback the migration

USE smart_inventory_db;

-- ============================================
-- ROLLBACK ORDER STATUSES
-- ============================================
-- Revert COMPLETED back to DELIVERED
UPDATE orders 
SET status = 'DELIVERED' 
WHERE status = 'COMPLETED';

-- Revert PAID back to PROCESSING
UPDATE orders 
SET status = 'PROCESSING' 
WHERE status = 'PAID';

-- ============================================
-- ROLLBACK USER ROLES
-- ============================================
-- Note: This will set all STAFF back to USER
-- You may need to manually update specific users
UPDATE users 
SET role = 'USER' 
WHERE role = 'STAFF';

-- ============================================
-- REMOVE NEW COLUMNS FROM PRODUCTS
-- ============================================
ALTER TABLE products 
DROP FOREIGN KEY IF EXISTS fk_product_supplier,
DROP INDEX IF EXISTS idx_product_supplier,
DROP INDEX IF EXISTS idx_product_low_stock,
DROP COLUMN IF EXISTS supplier_id,
DROP COLUMN IF EXISTS low_stock_threshold;

-- ============================================
-- DROP SUPPLIERS TABLE
-- ============================================
-- WARNING: This will delete all supplier data
-- DROP TABLE IF EXISTS suppliers;

-- ============================================
-- ROLLBACK COMPLETE
-- ============================================
SELECT 'Rollback completed!' as status;
