-- SQL script to insert dummy users for testing
-- Run this script in MySQL to add test users
-- Default password for all users: admin123

USE smart_inventory_db;

-- Admin user
-- Username: admin
-- Password: admin123
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('admin', 'admin@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Manager user
-- Username: manager
-- Password: admin123
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('manager', 'manager@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Manager', 'User', 'MANAGER', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Regular user
-- Username: user
-- Password: admin123
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('user', 'user@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Regular', 'User', 'USER', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Verify the users were inserted
SELECT id, username, email, first_name, last_name, role, active FROM users;
