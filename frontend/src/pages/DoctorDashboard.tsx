import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Heart, TrendingUp, Calendar, LogOut, X, BarChart3 } from 'lucide-react'
import apiClient from '../utils/api'
import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Patient {
    id: number
    username: string
    email: string
    date_joined: string
    last_active: string
    pregnancy_week: number | null
    trimester: number | null
    statistics: {
        total_sessions: number
        total_reps: number
        avg_posture_score: number
        activity_uploads: number
    }
    latest_vitals: {
        heart_rate: number
        spo2: number
        stress_level: string
        energy_level: number
        timestamp: string
    } | null
}

interface PatientDetail {
    patient_info: any
    pregnancy_info: any
    recent_sessions: any[]
    health_vitals: any[]
    recent_activity: any[]
    trends: {
        posture_over_time: any[]
    }
    summary: {
        total_sessions: number
        total_reps: number
        avg_posture_score: number
        total_activity_days: number
    }
}

export default function DoctorDashboard() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [detailLoading, setDetailLoading] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/doctor/patients/')
            setPatients(response.data.patients)
        } catch (error) {
            console.error('Failed to fetch patients:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPatientDetail = async (patientId: number) => {
        try {
            setDetailLoading(true)
            const response = await apiClient.get(`/doctor/patient/${patientId}/`)
            setPatientDetail(response.data)
        } catch (error) {
            console.error('Failed to fetch patient details:', error)
        } finally {
            setDetailLoading(false)
        }
    }

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient)
        fetchPatientDetail(patient.id)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading patients...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Doctor Dashboard
                        </h1>
                        <p className="text-gray-600">Patient Monitoring & Health Overview</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Total Patients</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{patients.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Active Today</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {patients.filter(p => {
                                const lastActive = new Date(p.last_active)
                                const today = new Date()
                                return lastActive.toDateString() === today.toDateString()
                            }).length}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Heart className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Avg Posture</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {patients.length > 0
                                ? Math.round(patients.reduce((sum, p) => sum + p.statistics.avg_posture_score, 0) / patients.length)
                                : 0}%
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Total Sessions</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {patients.reduce((sum, p) => sum + p.statistics.total_sessions, 0)}
                        </p>
                    </motion.div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient List</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patients.map((patient, index) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handlePatientClick(patient)}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-300"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{patient.username}</h3>
                                        <p className="text-sm text-gray-600">{patient.email}</p>
                                    </div>
                                    {patient.pregnancy_week && (
                                        <div className="bg-pink-100 px-3 py-1 rounded-full">
                                            <span className="text-xs font-semibold text-pink-600">
                                                Week {patient.pregnancy_week}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-white rounded-lg p-2">
                                        <p className="text-xs text-gray-600">Sessions</p>
                                        <p className="text-lg font-bold text-gray-800">{patient.statistics.total_sessions}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-2">
                                        <p className="text-xs text-gray-600">Posture</p>
                                        <p className="text-lg font-bold text-gray-800">{patient.statistics.avg_posture_score}%</p>
                                    </div>
                                </div>

                                {patient.latest_vitals && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Heart className="w-4 h-4 text-red-500" />
                                        <span className="text-gray-700">{patient.latest_vitals.heart_rate} BPM</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-700">{patient.latest_vitals.spo2}% SpO₂</span>
                                    </div>
                                )}

                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    Last active: {new Date(patient.last_active).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Patient Detail Modal */}
                {selectedPatient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">{selectedPatient.username}</h2>
                                    <p className="text-gray-600">{selectedPatient.email}</p>
                                    {selectedPatient.pregnancy_week && (
                                        <div className="mt-2 inline-block bg-pink-100 px-4 py-2 rounded-full">
                                            <span className="text-sm font-semibold text-pink-600">
                                                Week {selectedPatient.pregnancy_week} • Trimester {selectedPatient.trimester}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedPatient(null)
                                        setPatientDetail(null)
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {detailLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading patient details...</p>
                                </div>
                            ) : patientDetail ? (
                                <div className="space-y-6">
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                                            <p className="text-2xl font-bold text-blue-600">{patientDetail.summary.total_sessions}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Total Reps</p>
                                            <p className="text-2xl font-bold text-green-600">{patientDetail.summary.total_reps}</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Avg Posture</p>
                                            <p className="text-2xl font-bold text-purple-600">{patientDetail.summary.avg_posture_score}%</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Activity Days</p>
                                            <p className="text-2xl font-bold text-orange-600">{patientDetail.summary.total_activity_days}</p>
                                        </div>
                                    </div>

                                    {/* Posture Trend Chart */}
                                    {patientDetail.trends.posture_over_time.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5" />
                                                Posture Score Trend (Last 14 Days)
                                            </h3>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={patientDetail.trends.posture_over_time.reverse()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="date"
                                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    />
                                                    <YAxis domain={[0, 100]} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="avg_posture_score" stroke="#8b5cf6" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {/* Recent Sessions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Exercise Sessions</h3>
                                        <div className="space-y-2">
                                            {patientDetail.recent_sessions.slice(0, 5).map((session, index) => (
                                                <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{session.exercise_name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {session.rep_count} reps • {session.avg_posture_score}% posture
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(session.end_time).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {session.duration_minutes?.toFixed(1)} min
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Latest Health Vitals */}
                                    {patientDetail.health_vitals.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Latest Health Vitals</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-red-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600">Heart Rate</p>
                                                    <p className="text-xl font-bold text-red-600">{patientDetail.health_vitals[0].heart_rate} BPM</p>
                                                </div>
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600">SpO₂</p>
                                                    <p className="text-xl font-bold text-blue-600">{patientDetail.health_vitals[0].spo2}%</p>
                                                </div>
                                                <div className="bg-yellow-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600">Stress</p>
                                                    <p className="text-xl font-bold text-yellow-600 capitalize">{patientDetail.health_vitals[0].stress_level}</p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600">Energy</p>
                                                    <p className="text-xl font-bold text-green-600">{patientDetail.health_vitals[0].energy_level}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
