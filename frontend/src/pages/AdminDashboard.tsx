import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Users,
    TrendingUp,
    Dumbbell,
    ArrowLeft,
    UserCheck,
    Search,
    Download,
    LogOut,
    Filter,
    UserX
} from 'lucide-react'
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
import apiClient, { getErrorMessage } from '../utils/api'
import { toast } from '../components/Toast'
import { useAuth } from '../App'

interface AnalyticsData {
    users: {
        total: number
        active: number
        inactive: number
    }
    exercises: {
        total_sessions: number
        total_reps: number
        avg_posture_score: number
        popular: Array<{ exercise__name: string; count: number }>
    }
    activity: {
        total_records: number
        avg_daily_steps: number
    }
}

interface UserData {
    id: number
    username: string
    email: string
    role: string
    date_joined: string
    last_login: string | null
    exercise_sessions: number
    activity_records: number
}

interface GrowthData {
    date: string
    count: number
}

interface TrendData {
    date: string
    avg_steps: number
    avg_calories: number
    total_activities: number
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [users, setUsers] = useState<UserData[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
    const [growthData, setGrowthData] = useState<GrowthData[]>([])
    const [trendData, setTrendData] = useState<TrendData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'patient'>('all')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchQuery, roleFilter])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [analyticsRes, usersRes, growthRes, trendsRes] = await Promise.all([
                apiClient.get('/admin-analytics/'),
                apiClient.get('/user-list/'),
                apiClient.get('/user-growth/'),
                apiClient.get('/activity-trends/')
            ])
            setAnalytics(analyticsRes.data)
            setUsers(usersRes.data)
            setGrowthData(growthRes.data)
            setTrendData(trendsRes.data)
        } catch (err) {
            const message = getErrorMessage(err)
            toast.error(`Failed to load data: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter)
        }

        setFilteredUsers(filtered)
    }

    const handleDeleteUser = async (userId: number, username: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"? This will delete all their data and cannot be undone.`)) {
            return
        }

        try {
            await apiClient.delete(`/admin/users/${userId}/delete/`)
            toast.success(`User "${username}" deleted successfully`)
            fetchData() // Refresh data
        } catch (err) {
            const message = getErrorMessage(err)
            toast.error(`Failed to delete user: ${message}`)
        }
    }

    const exportToCSV = () => {
        const headers = ['Username', 'Email', 'Role', 'Joined', 'Sessions', 'Activities']
        const rows = filteredUsers.map(u => [
            u.username,
            u.email,
            u.role,
            new Date(u.date_joined).toLocaleDateString(),
            u.exercise_sessions,
            u.activity_records
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Users exported to CSV!')
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading admin dashboard...</p>
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
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">System-wide analytics and user management</p>
                </motion.div>

                {/* System Overview Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={analytics.users.total.toString()}
                            color="blue"
                            delay={0.1}
                        />
                        <StatCard
                            icon={UserCheck}
                            title="Active Users"
                            value={analytics.users.active.toString()}
                            subtitle="Last 7 days"
                            color="green"
                            delay={0.2}
                        />
                        <StatCard
                            icon={UserX}
                            title="Inactive Users"
                            value={analytics.users.inactive.toString()}
                            subtitle="7+ days"
                            color="orange"
                            delay={0.25}
                        />
                        <StatCard
                            icon={Dumbbell}
                            title="Total Sessions"
                            value={analytics.exercises.total_sessions.toString()}
                            color="purple"
                            delay={0.3}
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Avg Posture Score"
                            value={`${analytics.exercises.avg_posture_score}%`}
                            color="pink"
                            delay={0.4}
                        />
                        <StatCard
                            icon={Users}
                            title="Avg Sessions/User"
                            value={analytics.users.total > 0
                                ? (analytics.exercises.total_sessions / analytics.users.total).toFixed(1)
                                : '0'}
                            color="indigo"
                            delay={0.45}
                        />
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">User Growth (Last 30 Days)</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Activity Trends Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Trends (Last 30 Days)</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="avg_steps" stroke="#8B5CF6" strokeWidth={2} name="Avg Steps" />
                                <Line type="monotone" dataKey="avg_calories" stroke="#EC4899" strokeWidth={2} name="Avg Calories" />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Exercise Distribution */}
                    {analytics && analytics.exercises.popular.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Exercise Distribution</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={analytics.exercises.popular}
                                        dataKey="count"
                                        nameKey="exercise__name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {analytics.exercises.popular.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                </div>

                {/* User Management Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by username or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'patient')}
                                className="pl-10 pr-8 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sessions</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activities</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, idx) => (
                                    <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 text-sm text-gray-800">{user.username}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(user.date_joined).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{user.exercise_sessions}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{user.activity_records}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No users found matching your criteria
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    delay
}: {
    icon: any
    title: string
    value: string
    subtitle?: string
    color: string
    delay: number
}) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
        orange: 'from-orange-500 to-orange-600',
        indigo: 'from-indigo-500 to-indigo-600'
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
            {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </motion.div>
    )
}
