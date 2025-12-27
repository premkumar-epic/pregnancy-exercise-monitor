# API Documentation

## Base URL
```
Production: https://api.pregnancycare.com
Development: http://localhost:8000
```

## Authentication

All API requests require authentication using JWT tokens.

### Get Access Token
```http
POST /api/auth/token/
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Use Access Token
```http
GET /api/endpoint/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Refresh Token
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## User Management

### List Users
```http
GET /api/user-list/
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "username": "user1",
        "email": "user1@example.com",
        "role": "patient",
        "is_active": true
    }
]
```

### Change User Role
```http
POST /api/admin/users/{user_id}/change-role/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "role": "doctor"
}
```

### Delete User
```http
DELETE /api/admin/users/{user_id}/delete/
Authorization: Bearer <admin_token>
```

---

## Email Campaigns

### List Campaigns
```http
GET /api/admin/campaigns/
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "Welcome Campaign",
        "subject": "Welcome to Pregnancy Care",
        "message": "Welcome message...",
        "segment": "all",
        "status": "draft",
        "recipients_count": 100,
        "created_at": "2025-12-27T10:00:00Z"
    }
]
```

### Create Campaign
```http
POST /api/admin/campaigns/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "title": "New Campaign",
    "subject": "Email Subject",
    "message": "Email content...",
    "segment": "trimester_1"
}
```

### Get Campaign
```http
GET /api/admin/campaigns/{campaign_id}/
Authorization: Bearer <admin_token>
```

### Update Campaign
```http
PUT /api/admin/campaigns/{campaign_id}/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "title": "Updated Title",
    "subject": "Updated Subject"
}
```

### Delete Campaign
```http
DELETE /api/admin/campaigns/{campaign_id}/
Authorization: Bearer <admin_token>
```

### Send Campaign
```http
POST /api/admin/campaigns/{campaign_id}/send/
Authorization: Bearer <admin_token>
```

---

## Analytics

### Admin Analytics
```http
GET /api/admin-analytics/
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
    "total_users": 500,
    "active_users": 350,
    "total_sessions": 1200,
    "avg_session_duration": 25.5
}
```

### Retention Metrics
```http
GET /api/admin/analytics/retention/
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
    {"day": 1, "retention_rate": 100},
    {"day": 7, "retention_rate": 75},
    {"day": 30, "retention_rate": 50}
]
```

### Feature Adoption
```http
GET /api/admin/analytics/feature-adoption/
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
    {"feature": "Exercise Tracking", "adoption_rate": 85},
    {"feature": "Nutrition Logging", "adoption_rate": 60}
]
```

### Engagement Metrics
```http
GET /api/admin/analytics/engagement/
Authorization: Bearer <admin_token>
```

---

## Health Monitoring

### System Health
```http
GET /api/admin/system-health/
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
    "database": "healthy",
    "cache": "healthy",
    "storage": "healthy",
    "cpu_usage": 45.2,
    "memory_usage": 62.8
}
```

### Health Check (Public)
```http
GET /health/
```

**Response:**
```json
{
    "status": "healthy",
    "checks": {
        "database": {"status": "healthy", "latency_ms": 2.5},
        "cache": {"status": "healthy", "latency_ms": 1.2}
    }
}
```

### Readiness Check
```http
GET /ready/
```

### Liveness Check
```http
GET /alive/
```

---

## Audit Logs

### List Audit Logs
```http
GET /api/admin/audit-logs/
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `action`: Filter by action type (create, update, delete, etc.)
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)
- `user`: Filter by user ID

**Response:**
```json
[
    {
        "id": 1,
        "user": "admin",
        "action": "create",
        "model_name": "EmailCampaign",
        "object_id": 5,
        "timestamp": "2025-12-27T10:00:00Z",
        "ip_address": "192.168.1.1"
    }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid input",
    "details": {
        "field": ["This field is required."]
    }
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "message": "An unexpected error occurred."
}
```

---

## Rate Limiting

- **Anonymous users:** 100 requests/hour
- **Authenticated users:** 1000 requests/hour

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 50, max: 100)

**Response:**
```json
{
    "count": 250,
    "next": "http://api.example.com/endpoint/?page=2",
    "previous": null,
    "results": [...]
}
```

---

## Filtering and Sorting

Many endpoints support filtering and sorting:

**Filtering:**
```http
GET /api/exercises/?difficulty=beginner&trimester=1
```

**Sorting:**
```http
GET /api/exercises/?ordering=-created_at
```

Use `-` prefix for descending order.

---

## Webhooks (Coming Soon)

Subscribe to events:
- `campaign.sent`
- `user.created`
- `session.completed`

---

## Support

For API support:
- Email: api-support@pregnancycare.com
- Documentation: https://docs.pregnancycare.com
- Status Page: https://status.pregnancycare.com
