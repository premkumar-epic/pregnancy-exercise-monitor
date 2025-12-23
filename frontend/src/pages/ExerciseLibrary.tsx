import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXERCISES, type ExerciseType, type DifficultyLevel } from '../types'
import apiClient from '../utils/api'
import type { PregnancyProfile } from '../types'
import { useEffect } from 'react'

export default function ExerciseLibrary() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all')
    const [trimesterFilter, setTrimesterFilter] = useState<number | 'all'>('all')
    const [profile, setProfile] = useState<PregnancyProfile | null>(null)

    // Load pregnancy profile
    useEffect(() => {
        apiClient.get('/pregnancy-profile/')
            .then(res => {
                if (res.data.id) {
                    setProfile(res.data)
                    setTrimesterFilter(res.data.trimester) // Auto-filter by current trimester
                }
            })
            .catch(() => setProfile(null))
    }, [])

    // Filter exercises
    const filteredExercises = useMemo(() => {
        const exerciseList = Object.values(EXERCISES)

        return exerciseList.filter(exercise => {
            // Search filter
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exercise.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))

            // Difficulty filter
            const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter

            // Trimester filter
            const matchesTrimester = trimesterFilter === 'all' || exercise.trimesterSafe.includes(trimesterFilter)

            return matchesSearch && matchesDifficulty && matchesTrimester
        })
    }, [searchQuery, difficultyFilter, trimesterFilter])

    const getDifficultyColor = (difficulty: DifficultyLevel) => {
        switch (difficulty) {
            case 'low': return 'bg-green-100 text-green-800 border-green-300'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'high': return 'bg-red-100 text-red-800 border-red-300'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        🏃‍♀️ Exercise Library
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {profile ? `Trimester ${profile.trimester} • Week ${profile.current_week}` : 'Browse pregnancy-safe exercises'}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Search Exercises
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or benefits..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value as DifficultyLevel | 'all')}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Levels</option>
                                <option value="low">Low (Beginner)</option>
                                <option value="medium">Medium (Intermediate)</option>
                                <option value="high">High (Advanced)</option>
                            </select>
                        </div>

                        {/* Trimester Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Trimester Safety
                            </label>
                            <select
                                value={trimesterFilter}
                                onChange={(e) => setTrimesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Trimesters</option>
                                <option value="1">1st Trimester</option>
                                <option value="2">2nd Trimester</option>
                                <option value="3">3rd Trimester</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {difficultyFilter !== 'all' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)} difficulty
                            </span>
                        )}
                        {trimesterFilter !== 'all' && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                Trimester {trimesterFilter}
                            </span>
                        )}
                        {searchQuery && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                Search: "{searchQuery}"
                            </span>
                        )}
                    </div>
                </div>

                {/* Exercise Grid */}
                {filteredExercises.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No exercises found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                onClick={() => navigate(`/exercises/${exercise.id}`)}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-transparent hover:border-blue-300 hover:scale-105"
                            >
                                {/* Exercise Icon/Image */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center h-64 overflow-hidden">
                                    {exercise.imageUrl ? (
                                        <img
                                            src={exercise.imageUrl}
                                            alt={exercise.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                                            {exercise.icon}
                                        </div>
                                    )}
                                </div>

                                {/* Exercise Info */}
                                <div className="p-6">
                                    {/* Title and Difficulty */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 flex-1">
                                            {exercise.name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(exercise.difficulty)} whitespace-nowrap ml-2`}>
                                            {exercise.difficulty.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Benefits Preview */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {exercise.benefits[0]}
                                    </p>

                                    {/* Trimester Safety */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-semibold text-gray-700">Safe for:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(t => (
                                                <span
                                                    key={t}
                                                    className={`px-2 py-1 rounded ${exercise.trimesterSafe.includes(t)
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    T{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-8 text-center text-gray-600">
                    Showing {filteredExercises.length} of {Object.keys(EXERCISES).length} exercises
                </div>
            </div>
        </div>
    )
}
