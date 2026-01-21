-- Dummy users for testing
-- Passwords are BCrypt encoded
-- Default password for all users: admin123

-- Admin user
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('admin', 'admin@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Manager user
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('manager', 'manager@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Manager', 'User', 'MANAGER', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Regular user
INSERT INTO users (username, email, password, first_name, last_name, role, active, created_at, updated_at)
VALUES ('user', 'user@smartinventory.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Regular', 'User', 'USER', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;
