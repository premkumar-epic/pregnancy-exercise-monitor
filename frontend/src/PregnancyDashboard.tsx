import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { getErrorMessage } from './utils/api'
import { toast } from './components/Toast'
import type { PregnancyProfile, PregnancyContent } from './types'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PregnancyDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<PregnancyProfile | null>(null)
  const [content, setContent] = useState<PregnancyContent[]>([])
  const [lmpDate, setLmpDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    init()
  }, [])

  /**
   * Initialize dashboard - load profile and content
   */
  const init = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/pregnancy-profile/')
      const prof = res.data.id ? res.data : null
      setProfile(prof)
      setLmpDate(prof?.lmp_date || '')

      if (prof?.current_week && prof?.trimester) {
        await loadContent(prof.current_week, prof.trimester)
      }
    } catch (err) {
      console.error('Pregnancy load error:', err)
      // Don't show error toast for initial load if profile doesn't exist
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load trimester-specific content
   */
  const loadContent = async (week: number, trimester: number) => {
    try {
      const params = new URLSearchParams([
        ['week', week.toString()],
        ['trimester', trimester.toString()]
      ])
      const res = await apiClient.get(`/pregnancy-content/?${params}`)
      setContent(res.data)
    } catch (err) {
      console.error('Content load error:', err)
      setContent([])
    }
  }

  /**
   * Validate LMP date
   */
  const validateLmpDate = (date: string): string | null => {
    if (!date) {
      return 'Please enter a date'
    }

    const lmpDateObj = new Date(date)
    const today = new Date()

    // Check if date is in the future
    if (lmpDateObj > today) {
      return 'LMP date cannot be in the future'
    }

    // Check if date is too far in the past (more than 280 days)
    const daysDiff = Math.floor((today.getTime() - lmpDateObj.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff > 280) {
      return 'LMP date is more than 40 weeks ago. Please verify the date.'
    }

    return null
  }

  /**
   * Save LMP date and update profile
   */
  const saveLMP = async () => {
    const error = validateLmpDate(lmpDate)
    if (error) {
      toast.error(error)
      return
    }

    setSaving(true)
    try {
      await apiClient.patch('/pregnancy-profile/', {
        lmp_date: lmpDate
      })

      await init()
      toast.success(`✅ Pregnancy profile updated! Week ${profile?.current_week || '?'} guidance loaded.`)
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(`Failed to update profile: ${message}`)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Reset profile
   */
  const resetProfile = () => {
    setLmpDate('')
    setProfile(null)
    setContent([])
    toast.success('Profile reset')
  }

  if (loading) {
    return (
      <div className="text-center p-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl mt-10">
        <div className="text-2xl font-bold text-rose-600 mb-4">🤰 Loading...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
      </div>
    )
  }

  const showStats = profile?.lmp_date && profile?.current_week > 0
  const chartData = showStats ? {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [profile.current_week, profile.weeks_remaining],
      backgroundColor: ['#10B981', '#9CA3AF'],
      borderWidth: 0,
    }]
  } : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calculator */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-rose-800 text-center">🤰 Pregnancy Calculator</h2>

            {!showStats ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="lmp-date" className="block text-sm font-semibold text-rose-700 mb-2">
                    Last Menstrual Period (LMP)
                  </label>
                  <input
                    id="lmp-date"
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full p-4 border-2 border-rose-200 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:outline-none text-lg"
                    max={new Date().toISOString().split('T')[0]}
                    disabled={saving}
                  />
                </div>
                <button
                  onClick={saveLMP}
                  disabled={saving || !lmpDate}
                  className="w-full p-4 bg-rose-500 text-white font-bold text-lg rounded-2xl hover:bg-rose-600 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '⏳ Calculating...' : 'Calculate Pregnancy'}
                </button>
                <p className="text-sm text-rose-600 text-center">
                  Enter your Last Menstrual Period (LMP) date
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-4xl font-black bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  Week {profile.current_week}
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  Trimester {profile.trimester}
                </div>
                <div className="text-lg text-gray-600">
                  {profile.weeks_remaining} weeks remaining
                </div>
                <div className="text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl inline-block">
                  Due Date: {new Date(profile.due_date).toLocaleDateString()}
                </div>
                <div className="w-64 h-64 mx-auto p-4 bg-white rounded-2xl shadow-lg">
                  {chartData && <Doughnut data={chartData} options={{ maintainAspectRatio: true }} />}
                </div>
                <button
                  onClick={resetProfile}
                  className="text-rose-500 hover:text-rose-600 font-medium underline transition-colors"
                >
                  Change LMP Date
                </button>
              </div>
            )}
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl -mx-8 -mt-8 mb-6">
              📚 Week {profile?.current_week || '?'} Guidance
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-white rounded-2xl shadow-inner">
              {!showStats ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-lg font-semibold">Enter your LMP date</p>
                  <p className="text-sm mt-2">Get personalized trimester guidance</p>
                </div>
              ) : content.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-lg font-semibold">No guidance available</p>
                  <p className="text-sm mt-2">Content for Week {profile.current_week} coming soon</p>
                </div>
              ) : (
                content.map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border-l-4 shadow-md transition-all hover:shadow-lg ${item.content_type === 'warnings' ? 'bg-red-50 border-red-400' :
                    item.is_safe ? 'bg-emerald-50 border-emerald-400' : 'bg-yellow-50 border-yellow-400'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {item.content_type === 'nutrition' ? '🥗' :
                          item.content_type === 'exercise' ? '🏃‍♀️' :
                            item.content_type === 'emotional' ? '💝' : '⚠️'}
                      </span>
                      <div className="font-bold text-xl capitalize">{item.content_type}</div>
                    </div>
                    <div className="text-lg mb-3 font-semibold">{item.title}</div>
                    <div className="text-gray-700 leading-relaxed">{item.body}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
