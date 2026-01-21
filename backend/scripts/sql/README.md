# SQL Scripts

This directory contains all SQL scripts organized by purpose.

## 📁 Directory Structure

### `/migrations`
Database migration scripts for schema changes:
- **migration-update-roles.sql** - Updates user roles and order statuses, adds suppliers table
- **migration-rollback.sql** - Rollback script to revert migration changes

### `/data`
Data seeding and initialization scripts:
- **insert-dummy-users.sql** - Inserts test users (admin, manager, user) for development

### `/utilities`
Utility and maintenance scripts:
- **generate-password-hash.sql** - Guide for generating BCrypt password hashes
- **update-passwords.sql** - Updates user passwords with BCrypt hashes
- **fix-password.sql** - Fixes password encoding issues

## 📝 Usage

### Running Migrations
1. Review the migration script in `/migrations`
2. Backup your database
3. Run the script: `mysql -u username -p database_name < scripts/sql/migrations/migration-update-roles.sql`
4. Verify changes

### Seeding Data
```bash
mysql -u username -p smart_inventory_db < scripts/sql/data/insert-dummy-users.sql
```

### Utilities
Run utility scripts as needed for maintenance tasks.

## ⚠️ Important Notes

- Always backup your database before running migration scripts
- Test scripts in a development environment first
- Review rollback scripts before applying migrations
- `data.sql` remains in `src/main/resources/` for Spring Boot auto-execution
