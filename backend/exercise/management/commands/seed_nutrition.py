"""
Seed nutrition data for pregnancy guide
"""

from django.core.management.base import BaseCommand
from exercise.models import NutritionCategory, NutritionFood, NutritionTip


class Command(BaseCommand):
    help = 'Seed nutrition database with pregnancy-safe foods and tips'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding nutrition data...')
        
        # Clear existing data
        NutritionFood.objects.all().delete()
        NutritionCategory.objects.all().delete()
        NutritionTip.objects.all().delete()
        
        # Create categories
        categories = self.create_categories()
        
        # Create foods
        self.create_foods(categories)
        
        # Create tips
        self.create_tips()
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded nutrition data!'))
    
    def create_categories(self):
        categories_data = [
            {'name': 'Fruits', 'icon': '🍎', 'description': 'Fresh fruits rich in vitamins and fiber', 'order': 1},
            {'name': 'Vegetables', 'icon': '🥬', 'description': 'Nutrient-dense vegetables for healthy pregnancy', 'order': 2},
            {'name': 'Proteins', 'icon': '🥚', 'description': 'Protein sources for baby development', 'order': 3},
            {'name': 'Dairy', 'icon': '🥛', 'description': 'Calcium-rich dairy products', 'order': 4},
            {'name': 'Grains', 'icon': '🌾', 'description': 'Whole grains for energy and fiber', 'order': 5},
            {'name': 'Nuts & Seeds', 'icon': '🥜', 'description': 'Healthy fats and protein', 'order': 6},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat = NutritionCategory.objects.create(**cat_data)
            categories[cat_data['name']] = cat
            self.stdout.write(f'Created category: {cat.name}')
        
        return categories
    
    def create_foods(self, categories):
        foods_data = [
            # Fruits
            {
                'category': categories['Fruits'],
                'name': 'Avocado',
                'description': 'Creamy fruit rich in healthy fats and folate',
                'calories': 160,
                'protein': 2.0,
                'carbs': 8.5,
                'fats': 14.7,
                'fiber': 6.7,
                'benefits': 'High in folate for baby\'s brain development. Rich in healthy fats for brain growth. Contains potassium to prevent leg cramps.',
                'serving_size': '1/2 avocado (100g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Folate', 'Healthy Fats', 'Potassium', 'Vitamin K'],
                'is_recommended': True,
            },
            {
                'category': categories['Fruits'],
                'name': 'Oranges',
                'description': 'Citrus fruit packed with vitamin C',
                'calories': 47,
                'protein': 0.9,
                'carbs': 11.8,
                'fats': 0.1,
                'fiber': 2.4,
                'benefits': 'Excellent source of vitamin C for immune system. Contains folate for neural tube development. Helps with iron absorption.',
                'serving_size': '1 medium orange (130g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Vitamin C', 'Folate', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Fruits'],
                'name': 'Bananas',
                'description': 'Energy-rich fruit with potassium',
                'calories': 89,
                'protein': 1.1,
                'carbs': 22.8,
                'fats': 0.3,
                'fiber': 2.6,
                'benefits': 'Prevents leg cramps with potassium. Quick energy source. Helps with morning sickness. Contains vitamin B6.',
                'serving_size': '1 medium banana (120g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Potassium', 'Vitamin B6', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Fruits'],
                'name': 'Berries (Mixed)',
                'description': 'Antioxidant-rich berries',
                'calories': 57,
                'protein': 0.7,
                'carbs': 14.5,
                'fats': 0.3,
                'fiber': 2.4,
                'benefits': 'High in antioxidants. Rich in vitamin C. Low glycemic index. Helps prevent constipation.',
                'serving_size': '1 cup (150g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Antioxidants', 'Vitamin C', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Fruits'],
                'name': 'Apples',
                'description': 'Fiber-rich crunchy fruit',
                'calories': 52,
                'protein': 0.3,
                'carbs': 13.8,
                'fats': 0.2,
                'fiber': 2.4,
                'benefits': 'High in fiber for digestion. Contains vitamin C. Helps control blood sugar. Good for snacking.',
                'serving_size': '1 medium apple (180g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Fiber', 'Vitamin C'],
                'is_recommended': True,
            },
            
            # Vegetables
            {
                'category': categories['Vegetables'],
                'name': 'Spinach',
                'description': 'Leafy green powerhouse',
                'calories': 23,
                'protein': 2.9,
                'carbs': 3.6,
                'fats': 0.4,
                'fiber': 2.2,
                'benefits': 'Extremely high in folate for neural tube development. Rich in iron to prevent anemia. Contains calcium for bone health.',
                'serving_size': '1 cup cooked (180g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Folate', 'Iron', 'Calcium', 'Vitamin K'],
                'is_recommended': True,
            },
            {
                'category': categories['Vegetables'],
                'name': 'Sweet Potatoes',
                'description': 'Orange root vegetable',
                'calories': 86,
                'protein': 1.6,
                'carbs': 20.1,
                'fats': 0.1,
                'fiber': 3.0,
                'benefits': 'High in beta-carotene (vitamin A) for baby\'s development. Rich in fiber. Provides sustained energy.',
                'serving_size': '1 medium (130g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Vitamin A', 'Fiber', 'Vitamin C'],
                'is_recommended': True,
            },
            {
                'category': categories['Vegetables'],
                'name': 'Broccoli',
                'description': 'Cruciferous vegetable',
                'calories': 34,
                'protein': 2.8,
                'carbs': 6.6,
                'fats': 0.4,
                'fiber': 2.6,
                'benefits': 'Rich in folate and calcium. High in fiber. Contains vitamin C and K. Supports immune system.',
                'serving_size': '1 cup cooked (156g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Folate', 'Calcium', 'Vitamin C', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Vegetables'],
                'name': 'Carrots',
                'description': 'Orange crunchy vegetable',
                'calories': 41,
                'protein': 0.9,
                'carbs': 9.6,
                'fats': 0.2,
                'fiber': 2.8,
                'benefits': 'Excellent source of beta-carotene. Good for eye development. High in fiber. Low calorie snack.',
                'serving_size': '1 cup raw (128g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Vitamin A', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Vegetables'],
                'name': 'Bell Peppers',
                'description': 'Colorful sweet peppers',
                'calories': 31,
                'protein': 1.0,
                'carbs': 6.0,
                'fats': 0.3,
                'fiber': 2.1,
                'benefits': 'Very high in vitamin C. Contains folate. Low calorie. Adds color to meals.',
                'serving_size': '1 cup chopped (150g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Vitamin C', 'Vitamin A'],
                'is_recommended': True,
            },
            
            # Proteins
            {
                'category': categories['Proteins'],
                'name': 'Eggs',
                'description': 'Complete protein source',
                'calories': 155,
                'protein': 13.0,
                'carbs': 1.1,
                'fats': 11.0,
                'fiber': 0.0,
                'benefits': 'Complete protein with all essential amino acids. Rich in choline for brain development. Contains vitamin D.',
                'serving_size': '2 large eggs (100g)',
                'trimester_recommended': [1, 2, 3],
                'warnings': 'Cook thoroughly to avoid salmonella',
                'rich_in': ['Protein', 'Choline', 'Vitamin D', 'B Vitamins'],
                'is_recommended': True,
            },
            {
                'category': categories['Proteins'],
                'name': 'Salmon (Cooked)',
                'description': 'Omega-3 rich fish',
                'calories': 206,
                'protein': 22.0,
                'carbs': 0.0,
                'fats': 13.0,
                'fiber': 0.0,
                'benefits': 'High in omega-3 DHA for baby\'s brain development. Excellent protein source. Contains vitamin D.',
                'serving_size': '3 oz (85g)',
                'trimester_recommended': [1, 2, 3],
                'warnings': 'Limit to 2-3 servings per week. Choose low-mercury fish.',
                'rich_in': ['Omega-3', 'Protein', 'Vitamin D'],
                'is_recommended': True,
            },
            {
                'category': categories['Proteins'],
                'name': 'Chicken Breast',
                'description': 'Lean protein source',
                'calories': 165,
                'protein': 31.0,
                'carbs': 0.0,
                'fats': 3.6,
                'fiber': 0.0,
                'benefits': 'Lean protein for baby\'s growth. Low in fat. Rich in B vitamins. Versatile for cooking.',
                'serving_size': '3 oz cooked (85g)',
                'trimester_recommended': [1, 2, 3],
                'warnings': 'Cook thoroughly to 165°F',
                'rich_in': ['Protein', 'B Vitamins', 'Iron'],
                'is_recommended': True,
            },
            {
                'category': categories['Proteins'],
                'name': 'Lentils',
                'description': 'Plant-based protein',
                'calories': 116,
                'protein': 9.0,
                'carbs': 20.0,
                'fats': 0.4,
                'fiber': 7.9,
                'benefits': 'High in protein and fiber. Rich in folate and iron. Plant-based option. Helps prevent constipation.',
                'serving_size': '1/2 cup cooked (100g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Protein', 'Folate', 'Iron', 'Fiber'],
                'is_recommended': True,
            },
            {
                'category': categories['Proteins'],
                'name': 'Greek Yogurt',
                'description': 'Protein-rich yogurt',
                'calories': 59,
                'protein': 10.0,
                'carbs': 3.6,
                'fats': 0.4,
                'fiber': 0.0,
                'benefits': 'High in protein and calcium. Contains probiotics for gut health. Good for snacking.',
                'serving_size': '1 cup (170g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Protein', 'Calcium', 'Probiotics'],
                'is_recommended': True,
            },
            
            # Dairy
            {
                'category': categories['Dairy'],
                'name': 'Milk',
                'description': 'Calcium-rich beverage',
                'calories': 61,
                'protein': 3.2,
                'carbs': 4.8,
                'fats': 3.3,
                'fiber': 0.0,
                'benefits': 'Excellent source of calcium for bone development. Contains vitamin D. Provides protein.',
                'serving_size': '1 cup (240ml)',
                'trimester_recommended': [1, 2, 3],
                'warnings': 'Choose pasteurized milk only',
                'rich_in': ['Calcium', 'Vitamin D', 'Protein'],
                'is_recommended': True,
            },
            {
                'category': categories['Dairy'],
                'name': 'Cheese (Pasteurized)',
                'description': 'Calcium-rich dairy',
                'calories': 402,
                'protein': 25.0,
                'carbs': 1.3,
                'fats': 33.0,
                'fiber': 0.0,
                'benefits': 'High in calcium and protein. Good source of vitamin B12. Satisfying snack.',
                'serving_size': '1 oz (28g)',
                'trimester_recommended': [1, 2, 3],
                'warnings': 'Only eat pasteurized cheese. Avoid soft cheeses.',
                'rich_in': ['Calcium', 'Protein', 'Vitamin B12'],
                'is_recommended': True,
            },
            
            # Grains
            {
                'category': categories['Grains'],
                'name': 'Oatmeal',
                'description': 'Whole grain breakfast',
                'calories': 68,
                'protein': 2.4,
                'carbs': 12.0,
                'fats': 1.4,
                'fiber': 1.7,
                'benefits': 'High in fiber. Provides sustained energy. Helps prevent constipation. Contains iron.',
                'serving_size': '1/2 cup cooked (117g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Fiber', 'Iron', 'B Vitamins'],
                'is_recommended': True,
            },
            {
                'category': categories['Grains'],
                'name': 'Quinoa',
                'description': 'Complete protein grain',
                'calories': 120,
                'protein': 4.4,
                'carbs': 21.3,
                'fats': 1.9,
                'fiber': 2.8,
                'benefits': 'Complete protein source. High in fiber. Rich in iron and magnesium. Gluten-free.',
                'serving_size': '1/2 cup cooked (93g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Protein', 'Fiber', 'Iron', 'Magnesium'],
                'is_recommended': True,
            },
            {
                'category': categories['Grains'],
                'name': 'Brown Rice',
                'description': 'Whole grain rice',
                'calories': 111,
                'protein': 2.6,
                'carbs': 23.0,
                'fats': 0.9,
                'fiber': 1.8,
                'benefits': 'Provides sustained energy. Good source of fiber. Contains B vitamins. Versatile base.',
                'serving_size': '1/2 cup cooked (98g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Fiber', 'B Vitamins', 'Magnesium'],
                'is_recommended': True,
            },
            
            # Nuts & Seeds
            {
                'category': categories['Nuts & Seeds'],
                'name': 'Almonds',
                'description': 'Nutrient-dense nuts',
                'calories': 164,
                'protein': 6.0,
                'carbs': 6.1,
                'fats': 14.2,
                'fiber': 3.5,
                'benefits': 'High in healthy fats. Rich in vitamin E. Good source of protein. Contains calcium.',
                'serving_size': '1 oz (28g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Healthy Fats', 'Vitamin E', 'Protein', 'Calcium'],
                'is_recommended': True,
            },
            {
                'category': categories['Nuts & Seeds'],
                'name': 'Walnuts',
                'description': 'Omega-3 rich nuts',
                'calories': 185,
                'protein': 4.3,
                'carbs': 3.9,
                'fats': 18.5,
                'fiber': 1.9,
                'benefits': 'Excellent source of omega-3. Supports brain development. Rich in antioxidants.',
                'serving_size': '1 oz (28g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Omega-3', 'Healthy Fats', 'Antioxidants'],
                'is_recommended': True,
            },
            {
                'category': categories['Nuts & Seeds'],
                'name': 'Chia Seeds',
                'description': 'Tiny nutritional powerhouse',
                'calories': 138,
                'protein': 4.7,
                'carbs': 12.0,
                'fats': 8.7,
                'fiber': 9.8,
                'benefits': 'Very high in fiber. Rich in omega-3. Contains calcium and iron. Helps with hydration.',
                'serving_size': '1 oz (28g)',
                'trimester_recommended': [1, 2, 3],
                'rich_in': ['Fiber', 'Omega-3', 'Calcium', 'Iron'],
                'is_recommended': True,
            },
            
            # Foods to Avoid
            {
                'category': categories['Proteins'],
                'name': 'Raw Fish/Sushi',
                'description': 'Uncooked seafood',
                'calories': 0,
                'benefits': '',
                'serving_size': 'N/A',
                'trimester_recommended': [],
                'warnings': 'Risk of parasites and bacteria. Can cause food poisoning. Avoid during pregnancy.',
                'is_recommended': False,
                'is_avoid': True,
            },
            {
                'category': categories['Dairy'],
                'name': 'Unpasteurized Cheese',
                'description': 'Soft cheeses like brie, feta',
                'calories': 0,
                'benefits': '',
                'serving_size': 'N/A',
                'trimester_recommended': [],
                'warnings': 'Risk of listeria bacteria. Can cause miscarriage. Only eat pasteurized cheese.',
                'is_recommended': False,
                'is_avoid': True,
            },
        ]
        
        for food_data in foods_data:
            NutritionFood.objects.create(**food_data)
            self.stdout.write(f'Created food: {food_data["name"]}')
    
    def create_tips(self):
        tips_data = [
            {
                'title': 'Eat Iron-Rich Foods',
                'content': 'Include iron-rich foods like spinach, lentils, and lean meat to prevent anemia during pregnancy.',
                'trimester': 0,
                'icon': '🥬',
                'order': 1,
            },
            {
                'title': 'Stay Hydrated',
                'content': 'Drink at least 8-10 glasses of water daily to support increased blood volume and amniotic fluid.',
                'trimester': 0,
                'icon': '💧',
                'order': 2,
            },
            {
                'title': 'Folate is Essential',
                'content': 'Take 400-800mcg of folate daily to prevent neural tube defects. Found in leafy greens and fortified grains.',
                'trimester': 1,
                'icon': '🥗',
                'order': 3,
            },
            {
                'title': 'Small Frequent Meals',
                'content': 'Eat small meals every 2-3 hours to manage morning sickness and maintain energy levels.',
                'trimester': 1,
                'icon': '🍽️',
                'order': 4,
            },
            {
                'title': 'Calcium for Bones',
                'content': 'Consume 1000mg of calcium daily through dairy, fortified foods, or supplements for baby\'s bone development.',
                'trimester': 2,
                'icon': '🥛',
                'order': 5,
            },
            {
                'title': 'Omega-3 for Brain',
                'content': 'Include omega-3 rich foods like salmon, walnuts, and chia seeds for baby\'s brain development.',
                'trimester': 2,
                'icon': '🐟',
                'order': 6,
            },
            {
                'title': 'Fiber Prevents Constipation',
                'content': 'Eat high-fiber foods like fruits, vegetables, and whole grains to prevent constipation.',
                'trimester': 3,
                'icon': '🌾',
                'order': 7,
            },
            {
                'title': 'Protein for Growth',
                'content': 'Increase protein intake to 75-100g daily in the third trimester for rapid baby growth.',
                'trimester': 3,
                'icon': '🥚',
                'order': 8,
            },
        ]
        
        for tip_data in tips_data:
            NutritionTip.objects.create(**tip_data)
            self.stdout.write(f'Created tip: {tip_data["title"]}')
