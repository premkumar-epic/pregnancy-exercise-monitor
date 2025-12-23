/**
 * Food-specific icon mapping for nutrition guide
 * Maps food names to unique emoji icons
 */

export const FOOD_ICONS: Record<string, string> = {
    // Fruits
    'Apple': '🍎',
    'Apples': '🍎',
    'Banana': '🍌',
    'Bananas': '🍌',
    'Orange': '🍊',
    'Oranges': '🍊',
    'Berries': '🫐',
    'Strawberries': '🍓',
    'Blueberries': '🫐',
    'Mango': '🥭',
    'Mangoes': '🥭',
    'Avocado': '🥑',
    'Avocados': '🥑',
    'Watermelon': '🍉',
    'Grapes': '🍇',
    'Pear': '🍐',
    'Pears': '🍐',
    'Peach': '🍑',
    'Peaches': '🍑',
    'Kiwi': '🥝',

    // Vegetables
    'Spinach': '🥬',
    'Broccoli': '🥦',
    'Carrot': '🥕',
    'Carrots': '🥕',
    'Tomato': '🍅',
    'Tomatoes': '🍅',
    'Sweet Potato': '🍠',
    'Sweet Potatoes': '🍠',
    'Lettuce': '🥬',
    'Kale': '🥬',
    'Bell Pepper': '🫑',
    'Bell Peppers': '🫑',
    'Cucumber': '🥒',
    'Cucumbers': '🥒',
    'Pumpkin': '🎃',
    'Corn': '🌽',
    'Eggplant': '🍆',
    'Potato': '🥔',
    'Potatoes': '🥔',

    // Proteins
    'Eggs': '🥚',
    'Egg': '🥚',
    'Chicken': '🍗',
    'Fish': '🐟',
    'Salmon': '🐟',
    'Tuna': '🐟',
    'Lentils': '🫘',
    'Beans': '🫘',
    'Chickpeas': '🫘',
    'Tofu': '🧈',
    'Meat': '🥩',
    'Beef': '🥩',
    'Pork': '🥓',
    'Turkey': '🍗',
    'Shrimp': '🦐',

    // Dairy
    'Milk': '🥛',
    'Yogurt': '🥛',
    'Cheese': '🧀',
    'Cottage Cheese': '🧀',
    'Butter': '🧈',
    'Cream': '🥛',

    // Grains
    'Oats': '🌾',
    'Oatmeal': '🥣',
    'Rice': '🍚',
    'Brown Rice': '🍚',
    'Quinoa': '🌾',
    'Bread': '🍞',
    'Whole Wheat Bread': '🍞',
    'Pasta': '🍝',
    'Cereal': '🥣',
    'Barley': '🌾',

    // Nuts & Seeds
    'Almonds': '🥜',
    'Walnuts': '🥜',
    'Cashews': '🥜',
    'Peanuts': '🥜',
    'Chia Seeds': '🌰',
    'Flax Seeds': '🌰',
    'Sunflower Seeds': '🌻',
    'Pumpkin Seeds': '🎃',
    'Pistachios': '🥜',

    // Beverages
    'Water': '💧',
    'Coconut Water': '🥥',
    'Herbal Tea': '🍵',
    'Green Tea': '🍵',
    'Juice': '🧃',
    'Orange Juice': '🍊',

    // Foods to Avoid
    'Raw Fish': '🐟',
    'Sushi': '🍣',
    'Alcohol': '🍷',
    'Coffee': '☕',
    'Caffeine': '☕',
    'Soft Cheese': '🧀',
    'Deli Meat': '🥩',
    'Raw Eggs': '🥚',
    'Unpasteurized Milk': '🥛',
    'High Mercury Fish': '🐟',
    'Liver': '🥩',
    'Unwashed Vegetables': '🥬',
    'Raw Sprouts': '🌱',

    // Default fallbacks by category
    'Fruits': '🍎',
    'Vegetables': '🥬',
    'Proteins': '🥚',
    'Dairy': '🥛',
    'Grains': '🌾',
    'Nuts': '🥜',
    'Seeds': '🌰',
}

/**
 * Get icon for a food item
 * Falls back to category icon if specific food icon not found
 */
export function getFoodIcon(foodName: string, categoryIcon?: string): string {
    // Try exact match first
    if (FOOD_ICONS[foodName]) {
        return FOOD_ICONS[foodName]
    }

    // Try partial match (case-insensitive)
    const lowerName = foodName.toLowerCase()
    for (const [key, icon] of Object.entries(FOOD_ICONS)) {
        if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
            return icon
        }
    }

    // Fall back to category icon or default
    return categoryIcon || '🍽️'
}

/**
 * Get icon for foods to avoid
 */
export function getAvoidFoodIcon(foodName: string): string {
    return getFoodIcon(foodName, '⚠️')
}
