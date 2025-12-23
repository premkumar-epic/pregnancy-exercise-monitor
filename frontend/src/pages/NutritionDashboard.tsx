import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Leaf, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import apiClient from '../utils/api'
import { getFoodIcon, getAvoidFoodIcon } from '../utils/foodIcons'

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

interface NutritionTip {
    id: number
    title: string
    content: string
    icon: string
    trimester_display: string
}

export default function NutritionDashboard() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<NutritionCategory[]>([])
    const [recommendedFoods, setRecommendedFoods] = useState<NutritionFood[]>([])
    const [avoidFoods, setAvoidFoods] = useState<NutritionFood[]>([])
    const [tips, setTips] = useState<NutritionTip[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNutritionData()
    }, [])

    const fetchNutritionData = async () => {
        try {
            const [categoriesRes, recommendedRes, avoidRes, tipsRes] = await Promise.all([
                apiClient.get('/nutrition/categories/'),
                apiClient.get('/nutrition/recommended/'),
                apiClient.get('/nutrition/avoid/'),
                apiClient.get('/nutrition/tips/')
            ])

            setCategories(categoriesRes.data)
            setRecommendedFoods(recommendedRes.data.recommended_foods || [])
            setAvoidFoods(avoidRes.data)
            setTips(tipsRes.data.slice(0, 3)) // Show first 3 tips
            setLoading(false)
        } catch (error) {
            console.error('Error fetching nutrition data:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading nutrition guide...</p>
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
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Nutrition Guide</h1>
                            <p className="text-gray-600">Your pregnancy nutrition companion</p>
                        </div>
                    </div>
                </motion.div>

                {/* Daily Tips */}
                {tips.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{tips[0].icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{tips[0].title}</h3>
                                    <p className="text-green-50">{tips[0].content}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                                        {tips[0].trimester_display}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Categories Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Food Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/nutrition/category/${category.id}`)}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="text-5xl mb-3">{category.icon}</div>
                                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-500">{category.food_count} foods</p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Recommended Foods */}
                {recommendedFoods.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedFoods.slice(0, 6).map((food) => (
                                <motion.button
                                    key={food.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/nutrition/food/${food.id}`)}
                                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all text-left"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">{getFoodIcon(food.name, food.category_icon)}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-1">{food.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{food.description}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {food.rich_in.slice(0, 3).map((nutrient, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                                    >
                                                        {nutrient}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Foods to Avoid */}
                {avoidFoods.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Foods to Avoid</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {avoidFoods.map((food) => (
                                <div
                                    key={food.id}
                                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl flex-shrink-0">{getAvoidFoodIcon(food.name)}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">{food.name}</h3>
                                            <p className="text-sm text-gray-700">{food.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
