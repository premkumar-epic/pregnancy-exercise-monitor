import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import apiClient from '../utils/api'
import { getFoodIcon } from '../utils/foodIcons'

interface NutritionCategory {
    id: number
    name: string
    icon: string
    description: string
    food_count: number
}

interface NutritionFood {
    id: number
    name: string
    category_name: string
    category_icon: string
    description: string
    calories: number
    rich_in: string[]
    is_recommended: boolean
    is_avoid: boolean
}

export default function CategoryDetailView() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [category, setCategory] = useState<NutritionCategory | null>(null)
    const [foods, setFoods] = useState<NutritionFood[]>([])
    const [filteredFoods, setFilteredFoods] = useState<NutritionFood[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [trimesterFilter, setTrimesterFilter] = useState<string>('')

    useEffect(() => {
        fetchCategoryAndFoods()
    }, [id])

    useEffect(() => {
        filterFoods()
    }, [foods, searchTerm, trimesterFilter])

    const fetchCategoryAndFoods = async () => {
        try {
            const [categoryRes, foodsRes] = await Promise.all([
                apiClient.get('/nutrition/categories/'),
                apiClient.get(`/nutrition/foods/?category=${id}`)
            ])

            const cat = categoryRes.data.find((c: NutritionCategory) => c.id === parseInt(id!))
            setCategory(cat)
            setFoods(foodsRes.data)
            setFilteredFoods(foodsRes.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching category foods:', error)
            setLoading(false)
        }
    }

    const filterFoods = () => {
        let filtered = [...foods]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Trimester filter
        if (trimesterFilter) {
            // This will be handled by backend API call
            // For now, just show all
        }

        setFilteredFoods(filtered)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading foods...</p>
                </div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Category not found</p>
                    <button
                        onClick={() => navigate('/nutrition')}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Back to Nutrition
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/nutrition')}
                        className="flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Nutrition Guide
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-6xl">{category.icon}</div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">{category.name}</h1>
                            <p className="text-gray-600">{category.description}</p>
                            <p className="text-sm text-gray-500 mt-1">{category.food_count} foods in this category</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={trimesterFilter}
                            onChange={(e) => setTrimesterFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Trimesters</option>
                            <option value="1">Trimester 1</option>
                            <option value="2">Trimester 2</option>
                            <option value="3">Trimester 3</option>
                        </select>
                    </div>
                </motion.div>

                {/* Foods Grid */}
                {filteredFoods.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No foods found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFoods.map((food) => (
                            <motion.button
                                key={food.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => navigate(`/nutrition/food/${food.id}`)}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-5xl">{getFoodIcon(food.name, food.category_icon)}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{food.name}</h3>
                                        {food.is_recommended && (
                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                Recommended
                                            </span>
                                        )}
                                        {food.is_avoid && (
                                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                                Avoid
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">Calories</span>
                                    <span className="font-bold text-green-600">{food.calories} kcal</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {food.rich_in.slice(0, 4).map((nutrient, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            {nutrient}
                                        </span>
                                    ))}
                                    {food.rich_in.length > 4 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{food.rich_in.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
