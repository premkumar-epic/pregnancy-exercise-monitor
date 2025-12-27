"""
API Documentation Generator
Generates OpenAPI/Swagger documentation for the Pregnancy Exercise Monitor API
"""

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Pregnancy Exercise Monitor API",
        default_version='v1',
        description="""
# Pregnancy Exercise Monitor API Documentation

## Overview
This API provides endpoints for managing pregnancy exercise monitoring, including:
- User authentication and authorization
- Exercise session tracking
- Health vitals monitoring
- Nutrition management
- Guidance and educational content
- Admin dashboard analytics
- Email campaign management

## Authentication
All endpoints require JWT authentication unless otherwise specified.

### Obtaining Tokens
```
POST /api/auth/token/
{
    "username": "your_username",
    "password": "your_password"
}
```

### Using Tokens
Include the access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Refreshing Tokens
```
POST /api/auth/token/refresh/
{
    "refresh": "your_refresh_token"
}
```

## Rate Limiting
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

## Response Format
All responses follow this structure:
```json
{
    "data": {},
    "message": "Success message",
    "status": "success"
}
```

## Error Handling
Errors follow this structure:
```json
{
    "error": "Error message",
    "details": {},
    "status": "error"
}
```

## Pagination
List endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 50, max: 100)

## Filtering
Many endpoints support filtering with query parameters.
Example: `/api/exercises/?difficulty=beginner&trimester=1`

## Versioning
The API version is included in the URL: `/api/v1/...`
        """,
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@pregnancycare.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
