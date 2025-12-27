# Deployment Guide - Pregnancy Exercise Monitor

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- PostgreSQL database (or use Docker Compose)
- SMTP credentials for email

## Quick Start with Docker Compose

### 1. Clone and Configure

```bash
git clone <repository-url>
cd pregnancy-exercise-monitor
```

### 2. Configure Environment

```bash
# Backend configuration
cd backend
cp .env.production.example .env.production

# Edit .env.production with your values:
# - Generate SECRET_KEY
# - Set your domain in ALLOWED_HOSTS
# - Configure database credentials
# - Add email SMTP settings
```

### 3. Generate Secret Key

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 4. Build and Run

```bash
# From project root
docker-compose up -d --build
```

### 5. Run Migrations

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### 6. Collect Static Files

```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

## Manual Deployment

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure Environment**
```bash
cp .env.production.example .env
# Edit .env with production values
```

3. **Database Setup**
```bash
# Create PostgreSQL database
createdb pregnancy_db

# Run migrations
python manage.py migrate
python manage.py createsuperuser
```

4. **Collect Static Files**
```bash
python manage.py collectstatic --noinput
```

5. **Run with Gunicorn**
```bash
gunicorn --bind 0.0.0.0:8000 --workers 3 pregnancy.wsgi:application
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Build for Production**
```bash
npm run build
```

3. **Serve with Nginx**
```nginx
# Copy nginx.conf to /etc/nginx/sites-available/pregnancy-app
# Update server_name with your domain
# Enable site: ln -s /etc/nginx/sites-available/pregnancy-app /etc/nginx/sites-enabled/
# Test: nginx -t
# Reload: systemctl reload nginx
```

## SSL Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

## Environment Variables Reference

### Critical Variables

| Variable | Description | Example |
|----------|-------------|---------|
| SECRET_KEY | Django secret key | Random 50-char string |
| DEBUG | Debug mode | False |
| ALLOWED_HOSTS | Allowed domains | yourdomain.com,www.yourdomain.com |
| DB_ENGINE | Database engine | django.db.backends.postgresql |
| DB_NAME | Database name | pregnancy_db |
| DB_USER | Database user | postgres_user |
| DB_PASSWORD | Database password | Secure password |
| DB_HOST | Database host | localhost or db |
| DB_PORT | Database port | 5432 |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| CORS_ALLOWED_ORIGINS | Frontend URLs | http://localhost:5173 |
| JWT_ACCESS_LIFETIME | Token lifetime (min) | 15 |
| THROTTLE_ANON | Anonymous rate limit | 50/hour |
| THROTTLE_USER | User rate limit | 500/hour |
| LOG_LEVEL | Logging level | WARNING |
| SENTRY_DSN | Error tracking | None |

## Health Checks

### Backend Health
```bash
curl http://localhost:8000/api/admin/system-health/
```

### Frontend Health
```bash
curl http://localhost/
```

### Database Health
```bash
docker-compose exec db pg_isready
```

## Monitoring

### Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Application logs
tail -f backend/logs/django.log
```

### Error Tracking

Configure Sentry in .env:
```
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

## Backup Strategy

### Database Backup

```bash
# Create backup
docker-compose exec db pg_dump -U postgres_user pregnancy_db > backup.sql

# Restore backup
docker-compose exec -T db psql -U postgres_user pregnancy_db < backup.sql
```

### Media Files Backup

```bash
# Backup media files
tar -czf media-backup.tar.gz backend/media/

# Restore media files
tar -xzf media-backup.tar.gz -C backend/
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or HAProxy
2. **Multiple Backend Instances**: Scale with Docker Compose
```bash
docker-compose up -d --scale backend=3
```

3. **Database Read Replicas**: Configure PostgreSQL replication

### Vertical Scaling

Adjust worker count in gunicorn:
```bash
gunicorn --workers $((2 * $(nproc) + 1)) pregnancy.wsgi:application
```

## Troubleshooting

### Common Issues

**Issue**: Static files not loading
```bash
# Solution
python manage.py collectstatic --noinput
# Check STATIC_ROOT in settings.py
```

**Issue**: Database connection error
```bash
# Solution
# Check DB_HOST, DB_PORT in .env
# Ensure PostgreSQL is running
docker-compose ps
```

**Issue**: CORS errors
```bash
# Solution
# Add frontend domain to CORS_ALLOWED_ORIGINS in .env
```

### Debug Mode

**NEVER** enable DEBUG=True in production. For debugging:
1. Check logs: `docker-compose logs -f backend`
2. Use Sentry for error tracking
3. Enable verbose logging temporarily

## Security Checklist

- [ ] DEBUG = False
- [ ] Strong SECRET_KEY generated
- [ ] ALLOWED_HOSTS configured
- [ ] HTTPS enabled with valid SSL
- [ ] CORS restricted to frontend domain
- [ ] Database password is strong
- [ ] Email credentials secured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting set up

## Performance Optimization

1. **Enable Redis Caching**
```python
# In settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/0',
    }
}
```

2. **Database Indexing**
```bash
python manage.py sqlmigrate app_name migration_name
# Review and add indexes as needed
```

3. **CDN for Static Files**
- Configure AWS S3 or Cloudflare
- Update STATIC_URL in settings

## Support

For issues or questions:
- Check logs first
- Review this deployment guide
- Check environment variables
- Verify all services are running

## Maintenance

### Regular Tasks

- **Daily**: Monitor logs and errors
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Full backup test, disaster recovery drill
