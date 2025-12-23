import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, Baby } from 'lucide-react'
import apiClient from '../utils/api'

interface UserProfile {
    lmp_date: string | null
    pregnancy_week: number | null
    trimester: number | null
    due_date: string | null
    days_until_due: number | null
}

export default function PregnancyProgressWidget() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/profile/')
            setProfile(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching profile:', error)
            setLoading(false)
        }
    }

    if (loading || !profile?.lmp_date) return null

    const progressPercentage = profile.pregnancy_week ? (profile.pregnancy_week / 40) * 100 : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white mb-8"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Baby className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Your Pregnancy Journey</h3>
                    <p className="text-pink-100 text-sm">Week {profile.pregnancy_week} • Trimester {profile.trimester}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span>Week {profile.pregnancy_week} of 40</span>
                    <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-white rounded-full"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <Heart className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{profile.pregnancy_week}</p>
                    <p className="text-xs text-pink-100">Weeks</p>
                </div>
                <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{profile.days_until_due}</p>
                    <p className="text-xs text-pink-100">Days to go</p>
                </div>
                <div className="text-center">
                    <Baby className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-2xl font-bold">T{profile.trimester}</p>
                    <p className="text-xs text-pink-100">Trimester</p>
                </div>
            </div>

            {profile.due_date && (
                <div className="mt-4 pt-4 border-t border-white/20 text-center">
                    <p className="text-sm text-pink-100">Due Date</p>
                    <p className="text-lg font-bold">{new Date(profile.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            )}
        </motion.div>
    )
}
