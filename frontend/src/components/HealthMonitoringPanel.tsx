import { Heart, Activity, Brain, Battery, Clock, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiClient from '../utils/api'

interface HealthVitals {
    heart_rate: number
    spo2: number
    stress_level: 'low' | 'medium' | 'high'
    fatigue_level: number
    daily_active_minutes: number
    is_simulated: boolean
    pregnancy_week?: number
    trimester?: string
}

interface VitalCardProps {
    icon: any
    label: string
    value: string
    status: 'normal' | 'caution' | 'warning' | 'good'
    color: string
}

function VitalCard({ icon: Icon, label, value, status, color }: VitalCardProps) {
    const statusColors = {
        normal: 'bg-blue-50 border-blue-200',
        good: 'bg-green-50 border-green-200',
        caution: 'bg-yellow-50 border-yellow-200',
        warning: 'bg-red-50 border-red-200'
    }

    const textColors = {
        normal: 'text-blue-600',
        good: 'text-green-600',
        caution: 'text-yellow-600',
        warning: 'text-red-600'
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${statusColors[status]} border-2 rounded-xl p-4 transition-all`}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <div className={`text-2xl font-bold ${textColors[status]}`}>
                {value}
            </div>
        </motion.div>
    )
}

export default function HealthMonitoringPanel() {
    const [vitals, setVitals] = useState<HealthVitals | null>(null)
    const [loading, setLoading] = useState(true)
    const [showInfo, setShowInfo] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchHealthVitals()
        // Update every 30 seconds
        const interval = setInterval(fetchHealthVitals, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchHealthVitals = async () => {
        try {
            setError(null)
            const response = await apiClient.get('/current-health-vitals/')
            setVitals(response.data)
            setLoading(false)
        } catch (err: any) {
            console.error('Failed to fetch health vitals:', err)
            setError('Failed to load health data')
            setLoading(false)
        }
    }

    const getHeartRateStatus = (hr?: number): 'normal' | 'caution' | 'warning' | 'good' => {
        if (!hr) return 'normal'
        if (hr < 70) return 'good'
        if (hr <= 100) return 'normal'
        if (hr <= 110) return 'caution'
        return 'warning'
    }

    const getSpo2Status = (spo2?: number): 'normal' | 'caution' | 'warning' | 'good' => {
        if (!spo2) return 'normal'
        if (spo2 >= 98) return 'good'
        if (spo2 >= 95) return 'normal'
        return 'warning'
    }

    const getStressColor = (level?: string): string => {
        switch (level) {
            case 'low': return 'bg-green-500'
            case 'medium': return 'bg-yellow-500'
            case 'high': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStressStatus = (level?: string): 'normal' | 'caution' | 'warning' | 'good' => {
        switch (level) {
            case 'low': return 'good'
            case 'medium': return 'caution'
            case 'high': return 'warning'
            default: return 'normal'
        }
    }

    const getEnergyLevel = (fatigue?: number): number => {
        return fatigue ? 100 - fatigue : 50
    }

    const getEnergyStatus = (fatigue?: number): 'normal' | 'caution' | 'warning' | 'good' => {
        const energy = getEnergyLevel(fatigue)
        if (energy >= 70) return 'good'
        if (energy >= 50) return 'normal'
        if (energy >= 30) return 'caution'
        return 'warning'
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center text-red-600">
                    <p className="font-semibold mb-2">⚠️ {error}</p>
                    <button
                        onClick={fetchHealthVitals}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Health Monitoring</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time vital signs</p>
                </div>
                <div className="flex items-center gap-2">
                    {vitals?.is_simulated && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                            Simulated Data
                        </span>
                    )}
                    <button
                        onClick={() => setShowInfo(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="About health monitoring"
                    >
                        <Info className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Vital Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Heart Rate */}
                <VitalCard
                    icon={Heart}
                    label="Heart Rate"
                    value={`${vitals?.heart_rate || '--'} BPM`}
                    status={getHeartRateStatus(vitals?.heart_rate)}
                    color="bg-red-500"
                />

                {/* Blood Oxygen */}
                <VitalCard
                    icon={Activity}
                    label="Blood Oxygen"
                    value={`${vitals?.spo2 || '--'}%`}
                    status={getSpo2Status(vitals?.spo2)}
                    color="bg-blue-500"
                />

                {/* Stress Level */}
                <VitalCard
                    icon={Brain}
                    label="Stress Level"
                    value={vitals?.stress_level ? vitals.stress_level.charAt(0).toUpperCase() + vitals.stress_level.slice(1) : '--'}
                    status={getStressStatus(vitals?.stress_level)}
                    color={getStressColor(vitals?.stress_level)}
                />

                {/* Energy Level */}
                <VitalCard
                    icon={Battery}
                    label="Energy Level"
                    value={`${getEnergyLevel(vitals?.fatigue_level)}%`}
                    status={getEnergyStatus(vitals?.fatigue_level)}
                    color="bg-green-500"
                />

                {/* Active Minutes */}
                <VitalCard
                    icon={Clock}
                    label="Active Today"
                    value={`${vitals?.daily_active_minutes || 0} min`}
                    status="normal"
                    color="bg-purple-500"
                />

                {/* Pregnancy Context */}
                {vitals?.pregnancy_week && (
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-pink-500">
                                <span className="text-white text-lg">🤰</span>
                            </div>
                            <span className="text-sm font-medium text-gray-600">Pregnancy</span>
                        </div>
                        <div className="text-2xl font-bold text-pink-600">
                            Week {vitals.pregnancy_week}
                        </div>
                        {vitals.trimester && (
                            <div className="text-xs text-gray-600 mt-1">{vitals.trimester}</div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">About Health Monitoring</h2>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">📱 Simulated Wearable Data</h3>
                                <p className="text-sm text-blue-800">
                                    The health vitals displayed (heart rate, SpO₂, stress level) are <strong>simulated for demonstration purposes</strong>.
                                    This system showcases how wearable device data could be integrated for pregnancy health monitoring.
                                </p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-yellow-900 mb-2">🎓 Academic Purpose</h3>
                                <p className="text-sm text-yellow-800">
                                    This is a research project demonstrating multimodal health monitoring concepts.
                                    For actual health tracking, please use certified medical devices and consult healthcare professionals.
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-900 mb-2">🛡️ Safety Features</h3>
                                <p className="text-sm text-green-800">
                                    The system demonstrates intelligent safety alerts by combining exercise posture analysis with health indicators,
                                    showing the potential of AI-assisted pregnancy fitness monitoring.
                                </p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-900 mb-2">📊 Vital Signs Explained</h3>
                                <ul className="text-sm text-purple-800 space-y-2">
                                    <li><strong>Heart Rate:</strong> 70-110 BPM is normal during pregnancy</li>
                                    <li><strong>Blood Oxygen (SpO₂):</strong> 95-100% is normal</li>
                                    <li><strong>Stress Level:</strong> Based on perceived stress indicators</li>
                                    <li><strong>Energy Level:</strong> Inverse of fatigue (higher is better)</li>
                                    <li><strong>Active Minutes:</strong> Daily physical activity duration</li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInfo(false)}
                            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Got it!
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Last Updated */}
            <div className="mt-4 text-center text-xs text-gray-500">
                Updates every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    )
}
