import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Calendar,
    TrendingUp,
    Activity,
    Heart,
    Moon,
    Dumbbell,
    Download,
    ArrowLeft,
    Target
} from 'lucide-react'
import apiClient, { getErrorMessage } from '../utils/api'
import { toast } from '../components/Toast'
import { generatePDFReport } from '../utils/pdfReportGenerator'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

interface WeeklyReportData {
    week_start: string
    week_end: string
    activity_summary: {
        total_steps: number
        total_calories: number
        avg_heart_rate: number
        total_sleep_hours: number
    }
    exercise_summary: {
        total_sessions: number
        total_reps: number
        avg_posture_score: number
        exercises: Array<{ exercise_type: string; count: number }>
    }
    daily_data: Array<{
        date: string
        steps: number
        calories: number
        heart_rate?: number
        sleep_hours?: number
    }>
    recommendations: string[]
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444']

export default function WeeklyReport() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [reportData, setReportData] = useState<WeeklyReportData | null>(null)
    const [dateRange, setDateRange] = useState({
        start: getLastWeekStart(),
        end: getToday()
    })

    function getLastWeekStart() {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        return date.toISOString().split('T')[0]
    }

    function getToday() {
        return new Date().toISOString().split('T')[0]
    }

    useEffect(() => {
        fetchReport()
    }, [dateRange])

    const fetchReport = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get('/weekly-report/', {
                params: {
                    start_date: dateRange.start,
                    end_date: dateRange.end
                }
            })
            setReportData(response.data)
        } catch (err) {
            const message = getErrorMessage(err)
            toast.error(`Failed to load report: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    const exportToPDF = () => {
        if (!reportData) {
            toast.error('No data to export')
            return
        }

        try {
            generatePDFReport(reportData)
            toast.success('PDF report generated successfully!')
        } catch (error) {
            console.error('PDF generation error:', error)
            toast.error('Failed to generate PDF report')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading report...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Weekly Health Report
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {reportData ? `${reportData.week_start} to ${reportData.week_end}` : 'Select date range'}
                            </p>
                        </div>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Export PDF
                        </button>
                    </div>
                </motion.div>

                {/* Date Range Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                    <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {reportData && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <SummaryCard
                                icon={Activity}
                                title="Total Steps"
                                value={reportData.activity_summary.total_steps.toLocaleString()}
                                color="blue"
                                delay={0.2}
                            />
                            <SummaryCard
                                icon={TrendingUp}
                                title="Total Calories"
                                value={reportData.activity_summary.total_calories.toLocaleString()}
                                color="purple"
                                delay={0.3}
                            />
                            <SummaryCard
                                icon={Heart}
                                title="Avg Heart Rate"
                                value={`${Math.round(reportData.activity_summary.avg_heart_rate)} bpm`}
                                color="pink"
                                delay={0.4}
                            />
                            <SummaryCard
                                icon={Moon}
                                title="Total Sleep"
                                value={`${reportData.activity_summary.total_sleep_hours.toFixed(1)} hrs`}
                                color="indigo"
                                delay={0.5}
                            />
                        </div>

                        {/* Exercise Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <SummaryCard
                                icon={Dumbbell}
                                title="Exercise Sessions"
                                value={reportData.exercise_summary.total_sessions.toString()}
                                color="green"
                                delay={0.6}
                            />
                            <SummaryCard
                                icon={Target}
                                title="Total Reps"
                                value={reportData.exercise_summary.total_reps.toString()}
                                color="orange"
                                delay={0.7}
                            />
                            <SummaryCard
                                icon={TrendingUp}
                                title="Avg Posture Score"
                                value={`${Math.round(reportData.exercise_summary.avg_posture_score)}%`}
                                color="emerald"
                                delay={0.8}
                            />
                        </div>

                        {/* Activity Trends */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Trends</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reportData.daily_data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#3B82F6" strokeWidth={2} name="Steps" />
                                    <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#8B5CF6" strokeWidth={2} name="Calories" />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Exercise Distribution */}
                        {reportData.exercise_summary.exercises.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={reportData.exercise_summary.exercises}
                                            dataKey="count"
                                            nameKey="exercise_type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {reportData.exercise_summary.exercises.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}

                        {/* Health Recommendations */}
                        {reportData.recommendations.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Recommendations</h2>
                                <ul className="space-y-3">
                                    {reportData.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-gray-700">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// Summary Card Component
function SummaryCard({
    icon: Icon,
    title,
    value,
    color,
    delay
}: {
    icon: any
    title: string
    value: string
    color: string
    delay: number
}) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
        indigo: 'from-indigo-500 to-indigo-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        emerald: 'from-emerald-500 to-emerald-600'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </motion.div>
    )
}
