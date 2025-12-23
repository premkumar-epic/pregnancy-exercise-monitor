import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, BarChart3, Baby, LogOut, FileText, Leaf, UserCircle } from 'lucide-react'
import apiClient, { getErrorMessage } from './utils/api'
import { toast } from './components/Toast'
import { APP_CONFIG } from './utils/constants'
import LandingPage from './pages/LandingPage'
import ExerciseLibrary from './pages/ExerciseLibrary'
import ExerciseDetail from './pages/ExerciseDetail'
import ExerciseExecution from './pages/ExerciseExecution'
import ActivityUpload from './ActivityUpload'
import PregnancyDashboard from './PregnancyDashboard'
import WeeklyReport from './pages/WeeklyReport'
import AdminDashboard from './pages/AdminDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import NotificationsPage from './pages/NotificationsPage'
import ReminderManager from './pages/ReminderManager'
import NutritionDashboard from './pages/NutritionDashboard'
import CategoryDetailView from './pages/CategoryDetailView'
import FoodDetailView from './pages/FoodDetailView'
import ProfilePage from './pages/ProfilePage'
import PregnancyGuidance from './pages/PregnancyGuidance'
import PregnancyProgressWidget from './components/PregnancyProgressWidget'
import HealthMonitoringPanel from './components/HealthMonitoringPanel'
import NotificationBell from './components/NotificationBell'
import './index.css'

interface AuthContextType {
  token: string | null
  user: { username: string; role: string } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Animated Routes Wrapper
function AnimatedRoutes({ user, logout }: { user: { username: string; role: string }, logout: () => void }) {
  const location = useLocation()

  // Admin routes
  if (user.role === 'admin') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    )
  }

  // Doctor/Physiotherapist routes
  if (user.role === 'doctor') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    )
  }

  // Patient routes
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<Dashboard user={user} logout={logout} />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reminders" element={<ReminderManager />} />
        <Route path="/nutrition" element={<NutritionDashboard />} />
        <Route path="/nutrition/category/:id" element={<CategoryDetailView />} />
        <Route path="/nutrition/food/:id" element={<FoodDetailView />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/exercises/:id/execute" element={<ExerciseExecution />} />
        <Route path="/activity" element={<ActivityUpload />} />
        <Route path="/pregnancy" element={<PregnancyDashboard />} />
        <Route path="/reports" element={<WeeklyReport />} />
        <Route path="/guidance" element={<PregnancyGuidance />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY)
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setLoading(false)
    } else if (savedToken) {
      setToken(savedToken)
      apiClient.get('/pregnancy-profile/')
        .then(() => {
          setUser({ username: 'User', role: 'patient' })
        })
        .catch(() => {
          localStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY)
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/token/', { username, password })
      const { access, user: userData } = res.data

      setToken(access)
      setUser(userData)
      localStorage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, access)
      localStorage.setItem('user', JSON.stringify(userData))

      toast.success(`Welcome back, ${username}!`)
      return true
    } catch (err) {
      const message = getErrorMessage(err)
      toast.error(`Login failed: ${message}`)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      <BrowserRouter>
        {user ? (
          <AnimatedRoutes user={user} logout={logout} />
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

// Welcome Card Component - Shows only for first 3 days
function WelcomeCard({ user }: { user: { username: string } }) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [accountAge, setAccountAge] = useState(0)

  useEffect(() => {
    // Get account creation date from localStorage or API
    const userDataStr = localStorage.getItem('user')
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      const createdDate = userData.date_joined ? new Date(userData.date_joined) : new Date()
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - createdDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setAccountAge(diffDays)
      setShowWelcome(diffDays <= 3)
    }
  }, [])

  if (!showWelcome) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-lg p-6 mb-8 text-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold mb-2">Welcome to Your Pregnancy Fitness Journey! 🎉</h3>
          <p className="text-white/90 mb-4">
            Our AI-powered platform helps you stay active and healthy throughout your pregnancy with:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-white">✓</span>
              <span>Real-time pose detection and correction</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-white">✓</span>
              <span>Trimester-specific exercise filtering</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-white">✓</span>
              <span>Activity tracking and health alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-white">✓</span>
              <span>Personalized pregnancy guidance</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setShowWelcome(false)}
          className="text-white/80 hover:text-white text-2xl font-bold"
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

// Dashboard Component with Icons
function Dashboard({ user, logout }: { user: { username: string }, logout: () => void }) {
  const navigate = (path: string) => window.location.href = path

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8 p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Pregnancy Care
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              title="My Profile"
            >
              <UserCircle className="w-6 h-6" />
            </button>
            <NotificationBell />
            <button
              onClick={logout}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* Welcome Card - Only for first 3 days */}
        <WelcomeCard user={user} />

        {/* Pregnancy Progress Widget */}
        <PregnancyProgressWidget />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Nutrition Guide - First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate('/nutrition')}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nutrition Guide</h2>
              <p className="text-gray-600">Pregnancy-safe foods and nutrition tips</p>
            </div>
          </motion.div>

          {/* Exercise Library - Second */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate('/exercises')}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Exercise Library</h2>
              <p className="text-gray-600">Browse 10 pregnancy-safe exercises with AI tracking</p>
            </div>
          </motion.div>

          {/* Activity Tracking - Third */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate('/activity')}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Activity Tracking</h2>
              <p className="text-gray-600">Upload and analyze your fitness data</p>
            </div>
          </motion.div>

          {/* Weekly Reports - Fourth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => navigate('/reports')}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Weekly Reports</h2>
              <p className="text-gray-600">View comprehensive health and fitness analytics</p>
            </div>
          </motion.div>
        </div>

        {/* Health Monitoring Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <HealthMonitoringPanel />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Login Page Component
function LoginPage({ login }: { login: (u: string, p: string) => Promise<boolean> }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please enter username and password')
      return
    }

    setLoading(true)
    if (isRegister) {
      if (!email) {
        toast.error('Please enter your email address')
        setLoading(false)
        return
      }
      try {
        await apiClient.post('/auth/register/', { username, email, password })
        toast.success('Registration successful! Please login.')
        setIsRegister(false)
        setEmail('')
        setPassword('')
      } catch (err) {
        const message = getErrorMessage(err)
        toast.error(`Registration failed: ${message}`)
      }
    } else {
      await login(username, password)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Baby className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI-Powered Pregnancy Care
          </h1>
          <p className="text-gray-600">AI-powered fitness tracking for expecting mothers</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </motion.button>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setEmail('')
                setPassword('')
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </form>


      </motion.div>
    </div>
  )
}

export default App
