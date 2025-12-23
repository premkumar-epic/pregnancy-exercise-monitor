"""
Test nutrition API endpoints
"""

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

# Get or create test user
user = User.objects.first()
if not user:
    user = User.objects.create_user(username='testuser', password='testpass')

# Get JWT token
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

# Create API client
client = APIClient()
client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

print("=" * 60)
print("TESTING NUTRITION API ENDPOINTS")
print("=" * 60)

# Test 1: Get categories
print("\n1. GET /api/nutrition/categories/")
response = client.get('/api/nutrition/categories/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Categories found: {len(response.data)}")
    for cat in response.data[:3]:
        print(f"  - {cat['icon']} {cat['name']}: {cat['food_count']} foods")

# Test 2: Get all foods
print("\n2. GET /api/nutrition/foods/")
response = client.get('/api/nutrition/foods/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Foods found: {len(response.data)}")
    for food in response.data[:5]:
        print(f"  - {food['name']} ({food['category_name']})")

# Test 3: Get foods by category
print("\n3. GET /api/nutrition/foods/?category=1")
response = client.get('/api/nutrition/foods/?category=1')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Foods in category: {len(response.data)}")

# Test 4: Search foods
print("\n4. GET /api/nutrition/foods/?search=spinach")
response = client.get('/api/nutrition/foods/?search=spinach')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Search results: {len(response.data)}")
    if response.data:
        print(f"  Found: {response.data[0]['name']}")

# Test 5: Get food detail
print("\n5. GET /api/nutrition/foods/1/")
response = client.get('/api/nutrition/foods/1/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    food = response.data
    print(f"  Name: {food['name']}")
    print(f"  Calories: {food['calories']}")
    print(f"  Benefits: {food['benefits'][:60]}...")

# Test 6: Get recommended foods
print("\n6. GET /api/nutrition/recommended/")
response = client.get('/api/nutrition/recommended/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"  Trimester: {response.data.get('trimester', 'N/A')}")
    print(f"  Recommended foods: {len(response.data.get('recommended_foods', []))}")

# Test 7: Get foods to avoid
print("\n7. GET /api/nutrition/avoid/")
response = client.get('/api/nutrition/avoid/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Foods to avoid: {len(response.data)}")
    for food in response.data:
        print(f"  - {food['name']}: {food['warnings'][:50]}...")

# Test 8: Get nutrition tips
print("\n8. GET /api/nutrition/tips/")
response = client.get('/api/nutrition/tips/')
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"Tips found: {len(response.data)}")
    for tip in response.data[:3]:
        print(f"  {tip['icon']} {tip['title']}")

print("\n" + "=" * 60)
print("ALL TESTS COMPLETED!")
print("=" * 60)
