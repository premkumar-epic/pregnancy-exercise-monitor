# Monitoring and Alerting Setup Guide

## Overview

This guide covers setting up comprehensive monitoring and alerting for the Pregnancy Exercise Monitor application.

## 1. Sentry Error Tracking

### Setup

1. **Create Sentry Account**
   - Sign up at https://sentry.io
   - Create a new project for Django

2. **Get DSN**
   - Copy your project DSN from Sentry dashboard
   - Format: `https://xxxxx@sentry.io/xxxxx`

3. **Configure Environment**
   ```bash
   # Add to .env.production
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_ENVIRONMENT=production
   SENTRY_TRACES_SAMPLE_RATE=0.1
   ```

4. **Update Settings**
   ```python
   # backend/pregnancy/settings.py
   import sentry_sdk
   from sentry_sdk.integrations.django import DjangoIntegration
   
   if not DEBUG and config('SENTRY_DSN', default=''):
       sentry_sdk.init(
           dsn=config('SENTRY_DSN'),
           integrations=[DjangoIntegration()],
           traces_sample_rate=float(config('SENTRY_TRACES_SAMPLE_RATE', default=0.1)),
           environment=config('SENTRY_ENVIRONMENT', default='production'),
           send_default_pii=False,
       )
   ```

### Features

- **Automatic Error Capture**: All unhandled exceptions
- **Performance Monitoring**: Transaction traces
- **Release Tracking**: Deploy notifications
- **User Context**: User information with errors

### Alerts

Configure in Sentry dashboard:
- Email on new errors
- Slack notifications
- PagerDuty integration

## 2. Application Performance Monitoring (APM)

### Option A: New Relic

1. **Install Agent**
   ```bash
   pip install newrelic
   ```

2. **Configure**
   ```bash
   newrelic-admin generate-config YOUR_LICENSE_KEY newrelic.ini
   ```

3. **Run Application**
   ```bash
   NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program gunicorn pregnancy.wsgi
   ```

### Option B: DataDog

1. **Install Agent**
   ```bash
   pip install ddtrace
   ```

2. **Run with DataDog**
   ```bash
   ddtrace-run gunicorn pregnancy.wsgi
   ```

## 3. Uptime Monitoring

### Recommended Services

**UptimeRobot** (Free tier available)
- Monitor: https://yourdomain.com/health/
- Check interval: 5 minutes
- Alerts: Email, SMS, Slack

**Pingdom**
- More detailed monitoring
- Performance insights
- Global monitoring locations

**StatusCake**
- Free tier available
- SSL monitoring
- Page speed monitoring

### Setup

1. Add health check endpoint to monitoring
2. Configure alert contacts
3. Set up status page (optional)

## 4. Log Aggregation

### Option A: ELK Stack (Self-hosted)

**Components:**
- Elasticsearch: Log storage
- Logstash: Log processing
- Kibana: Visualization

**Docker Compose:**
```yaml
elasticsearch:
  image: elasticsearch:8.11.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

logstash:
  image: logstash:8.11.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

kibana:
  image: kibana:8.11.0
  ports:
    - "5601:5601"
```

### Option B: Cloud Services

**Loggly**
- Easy setup
- Good free tier
- Python integration

**Papertrail**
- Simple log aggregation
- Real-time tail
- Alerts on patterns

## 5. Metrics and Dashboards

### Prometheus + Grafana

**Install Prometheus**
```yaml
# docker-compose.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
```

**Django Metrics**
```bash
pip install django-prometheus
```

```python
# settings.py
INSTALLED_APPS = [
    'django_prometheus',
    ...
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    ...
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]
```

### Key Metrics to Monitor

**Application Metrics:**
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Active users

**System Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network I/O

**Database Metrics:**
- Query time
- Connection pool usage
- Slow queries
- Deadlocks

**Cache Metrics:**
- Hit rate
- Miss rate
- Eviction rate
- Memory usage

## 6. Alerting Rules

### Critical Alerts (Page immediately)

- **Application Down**: Health check fails
- **High Error Rate**: >5% of requests fail
- **Database Down**: Cannot connect
- **Disk Full**: >90% usage

### Warning Alerts (Email/Slack)

- **High Response Time**: p95 >1s
- **Memory Usage**: >80%
- **Cache Miss Rate**: >50%
- **SSL Expiring**: <30 days

### Info Alerts (Log only)

- **Deployment**: New version deployed
- **Backup**: Daily backup completed
- **Scale Event**: Instances scaled

## 7. Alert Channels

### Email
```python
# settings.py
ADMINS = [
    ('Admin Name', 'admin@example.com'),
]
```

### Slack
1. Create Slack webhook
2. Configure in monitoring service
3. Test notification

### PagerDuty
1. Create PagerDuty account
2. Set up escalation policy
3. Integrate with monitoring

## 8. Monitoring Dashboard

### Grafana Dashboard

**Panels to Include:**
1. Request Rate (requests/second)
2. Response Time (p50, p95, p99)
3. Error Rate (%)
4. Active Users
5. Database Queries/sec
6. Cache Hit Rate
7. CPU Usage
8. Memory Usage

**Import Dashboard:**
```bash
# Use pre-built Django dashboard
# Dashboard ID: 9528
```

## 9. Health Check Monitoring

### Endpoints

```bash
# Application health
curl https://yourdomain.com/health/

# Readiness (for load balancer)
curl https://yourdomain.com/ready/

# Liveness (for Kubernetes)
curl https://yourdomain.com/alive/
```

### Load Balancer Configuration

**Nginx:**
```nginx
upstream backend {
    server backend1:8000 max_fails=3 fail_timeout=30s;
    server backend2:8000 max_fails=3 fail_timeout=30s;
}

server {
    location /health/ {
        proxy_pass http://backend;
        proxy_connect_timeout 1s;
        proxy_read_timeout 1s;
    }
}
```

**AWS ALB:**
```json
{
    "HealthCheckPath": "/health/",
    "HealthCheckIntervalSeconds": 30,
    "HealthCheckTimeoutSeconds": 5,
    "HealthyThresholdCount": 2,
    "UnhealthyThresholdCount": 3
}
```

## 10. Incident Response

### Runbook Template

**Incident:** Application Down

**Detection:**
- Health check fails
- Sentry error spike
- User reports

**Investigation:**
1. Check application logs
2. Check system resources
3. Check database connectivity
4. Check recent deployments

**Resolution:**
1. Restart application
2. Rollback if needed
3. Scale resources if needed

**Post-Mortem:**
1. Document root cause
2. Implement fixes
3. Update monitoring

## 11. Testing Monitoring

### Test Error Tracking
```python
# Trigger test error
raise Exception("Test error for Sentry")
```

### Test Alerts
```bash
# Simulate high load
ab -n 10000 -c 100 https://yourdomain.com/

# Simulate errors
for i in {1..100}; do
    curl https://yourdomain.com/api/nonexistent/
done
```

### Test Health Checks
```bash
# Should return 200
curl -I https://yourdomain.com/health/

# Should return 503 if database is down
docker-compose stop db
curl -I https://yourdomain.com/health/
```

## 12. Monitoring Checklist

- [ ] Sentry configured and tested
- [ ] Uptime monitoring active
- [ ] Log aggregation set up
- [ ] Metrics collection enabled
- [ ] Dashboards created
- [ ] Alert rules configured
- [ ] Alert channels tested
- [ ] Runbooks documented
- [ ] Team trained on alerts
- [ ] Incident response tested

## 13. Cost Optimization

**Free Tier Options:**
- Sentry: 5,000 events/month
- UptimeRobot: 50 monitors
- Loggly: 200MB/day
- Grafana Cloud: 10,000 series

**Paid Recommendations:**
- Start small, scale as needed
- Use sampling for traces (10-20%)
- Aggregate logs before sending
- Set retention policies

## 14. Best Practices

1. **Monitor What Matters**: Focus on user-facing metrics
2. **Reduce Alert Fatigue**: Only alert on actionable items
3. **Document Everything**: Runbooks for common issues
4. **Test Regularly**: Monthly alert drills
5. **Review Metrics**: Weekly metric reviews
6. **Optimize Costs**: Review and adjust sampling rates

## Support

For monitoring setup assistance:
- Sentry Docs: https://docs.sentry.io
- Grafana Docs: https://grafana.com/docs
- Prometheus Docs: https://prometheus.io/docs
