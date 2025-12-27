#!/bin/bash
# Automated Backup Script for Pregnancy Exercise Monitor
# Run this script daily via cron: 0 2 * * * /path/to/backup.sh

set -e  # Exit on error

# Configuration
BACKUP_DIR="/var/backups/pregnancy-app"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Database Configuration
DB_NAME="${DB_NAME:-pregnancy_db}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# 1. Backup PostgreSQL Database
echo "Backing up database..."
pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# 2. Backup Media Files
echo "Backing up media files..."
tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" -C /app media/

# 3. Backup Configuration Files
echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" \
    /app/.env.production \
    /app/docker-compose.yml \
    /app/nginx.conf

# 4. Create backup manifest
echo "Creating manifest..."
cat > "$BACKUP_DIR/manifest_$DATE.txt" <<EOF
Backup Date: $(date)
Database: $DB_NAME
Files:
- db_backup_$DATE.sql.gz
- media_backup_$DATE.tar.gz
- config_backup_$DATE.tar.gz
EOF

# 5. Remove old backups
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.txt" -mtime +$RETENTION_DAYS -delete

# 6. Verify backups
echo "Verifying backups..."
if [ -f "$BACKUP_DIR/db_backup_$DATE.sql.gz" ] && \
   [ -f "$BACKUP_DIR/media_backup_$DATE.tar.gz" ]; then
    echo "Backup completed successfully at $(date)"
    
    # Optional: Upload to S3 or remote storage
    # aws s3 cp "$BACKUP_DIR" s3://your-bucket/backups/ --recursive
    
    exit 0
else
    echo "Backup failed! Check logs."
    exit 1
fi
