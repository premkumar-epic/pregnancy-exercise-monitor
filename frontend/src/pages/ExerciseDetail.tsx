import { useParams, useNavigate } from 'react-router-dom'
import { EXERCISES, type ExerciseType } from '../types'

export default function ExerciseDetail() {
    const { id } = useParams<{ id: ExerciseType }>()
    const navigate = useNavigate()

    const exercise = id ? EXERCISES[id as ExerciseType] : null

    if (!exercise) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Exercise Not Found</h2>
                    <button
                        onClick={() => navigate('/exercises')}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        ← Back to Library
                    </button>
                </div>
            </div>
        )
    }

    const getDifficultyColor = () => {
        switch (exercise.difficulty) {
            case 'low': return 'bg-green-100 text-green-800 border-green-300'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'high': return 'bg-red-100 text-red-800 border-red-300'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/exercises')}
                    className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                    ← Back to Exercise Library
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="text-7xl mb-4">{exercise.icon}</div>
                                <h1 className="text-4xl font-bold mb-2">{exercise.name}</h1>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getDifficultyColor()} bg-white`}>
                                        {exercise.difficulty.toUpperCase()} DIFFICULTY
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                                        Safe for: T{exercise.trimesterSafe.join(', T')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {/* Benefits */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                ✨ Benefits
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {exercise.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                                        <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* How to Stand/Position */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🧍‍♀️ Starting Position
                            </h2>
                            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                <ol className="space-y-3">
                                    {exercise.howToStand.map((step, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700 pt-1">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {/* Instructions */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                📋 How to Perform
                            </h2>
                            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                                <ol className="space-y-3">
                                    {exercise.instructions.map((instruction, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700 pt-1">{instruction}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {/* Safety Tips */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                ⚠️ Safety Tips
                            </h2>
                            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300">
                                <ul className="space-y-3">
                                    {exercise.safetyTips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-amber-600 text-xl flex-shrink-0">⚠️</span>
                                            <span className="text-gray-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Start Exercise Button */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate(`/exercises/${exercise.id}/execute`)}
                                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                🎯 Start Exercise →
                            </button>
                            <button
                                onClick={() => navigate('/exercises')}
                                className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                Browse More
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                            <p className="text-sm text-blue-800">
                                <strong>💡 Tip:</strong> Make sure you have enough space and a stable internet connection for the AI pose tracking to work properly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
