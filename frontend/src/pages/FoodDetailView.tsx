import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, AlertCircle, CheckCircle } from 'lucide-react'
import apiClient from '../utils/api'

interface NutritionFood {
    id: number
    name: string
    category_name: string
    category_icon: string
    description: string
    calories: number
    protein: number
    fiber: number
    iron: number
    calcium: number
    rich_in: string[]
    benefits: string
    trimester_recommended: number[]
    warnings: string
    is_recommended: boolean
    is_avoid: boolean
}

export default function FoodDetailView() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [food, setFood] = useState<NutritionFood | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFoodDetail()
    }, [id])

    const fetchFoodDetail = async () => {
        try {
            const response = await apiClient.get(`/nutrition/foods/${id}/`)
            setFood(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching food detail:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading food details...</p>
                </div>
            </div>
        )
    }

    if (!food) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Food not found</p>
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                </motion.div>

                {/* Food Header Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                >
                    <div className="flex items-start gap-6">
                        <div className="text-8xl">{food.category_icon}</div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{food.name}</h1>
                                    <p className="text-gray-600">{food.category_name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600">{food.calories}</div>
                                    <div className="text-sm text-gray-500">calories</div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {food.is_recommended && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                        <CheckCircle className="w-4 h-4" />
                                        Recommended
                                    </span>
                                )}
                                {food.is_avoid && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                                        <AlertCircle className="w-4 h-4" />
                                        Avoid During Pregnancy
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-700 mt-4">{food.description}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Nutritional Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Nutritional Information</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{food.protein}g</div>
                            <div className="text-sm text-gray-600">Protein</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{food.fiber}g</div>
                            <div className="text-sm text-gray-600">Fiber</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{food.iron}mg</div>
                            <div className="text-sm text-gray-600">Iron</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{food.calcium}mg</div>
                            <div className="text-sm text-gray-600">Calcium</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">Rich In:</h3>
                        <div className="flex flex-wrap gap-2">
                            {food.rich_in.map((nutrient, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-100 to-green-100 text-gray-700 rounded-lg font-medium"
                                >
                                    {nutrient}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Benefits */}
                {food.benefits && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg p-8 mb-6 text-white"
                    >
                        <div className="flex items-start gap-3">
                            <Heart className="w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold mb-3">Benefits for Pregnancy</h2>
                                <p className="text-green-50 leading-relaxed">{food.benefits}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Trimester Recommendations */}
                {food.trimester_recommended && food.trimester_recommended.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Trimesters</h2>
                        <div className="flex gap-4">
                            {[1, 2, 3].map((trimester) => (
                                <div
                                    key={trimester}
                                    className={`flex-1 rounded-xl p-4 text-center ${food.trimester_recommended.includes(trimester)
                                            ? 'bg-green-100 border-2 border-green-500'
                                            : 'bg-gray-100 opacity-50'
                                        }`}
                                >
                                    <div className="text-2xl font-bold text-gray-800">T{trimester}</div>
                                    <div className="text-sm text-gray-600">
                                        {food.trimester_recommended.includes(trimester) ? 'Recommended' : 'Not specified'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Warnings */}
                {food.warnings && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-red-50 border-2 border-red-200 rounded-2xl shadow-lg p-8"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-red-800 mb-3">Important Warning</h2>
                                <p className="text-red-700 leading-relaxed">{food.warnings}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
