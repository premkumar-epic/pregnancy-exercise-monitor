import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react'
import apiClient, { getErrorMessage } from './utils/api'
import { toast } from './components/Toast'
import { HEALTH_THRESHOLDS, APP_CONFIG } from './utils/constants'
import type { ActivityDay } from './types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function ActivityUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activities, setActivities] = useState<ActivityDay[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  /**
   * Download CSV template
   */
  const downloadTemplate = () => {
    const csv = `date,steps,calories,heart_rate,sleep_hours,distance,active_minutes
2024-01-01,8500,2100,72,7.5,5.2,45
2024-01-02,10200,2300,75,8.0,6.1,60
2024-01-03,7800,2000,70,7.0,4.8,40
2024-01-04,9500,2200,73,7.5,5.5,50
2024-01-05,11000,2400,76,8.0,6.5,65
2024-01-06,6500,1900,68,6.5,4.0,35
2024-01-07,8000,2050,71,7.0,5.0,42`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'activity_template.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Template downloaded!')
  }

  /**
   * Validate CSV file before upload
   */
  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.csv')) {
      return 'Please upload a CSV file'
    }

    if (file.size > APP_CONFIG.MAX_CSV_SIZE) {
      return 'File size must be less than 5MB'
    }

    return null
  }

  /**
   * Parse and preview CSV data
   */
  const previewCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.trim().split('\n')

    if (lines.length < 2) {
      toast.error('CSV file is empty or invalid')
      return
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const requiredColumns = ['date', 'steps', 'calories']
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))

    if (missingColumns.length > 0) {
      toast.error(`Missing required columns: ${missingColumns.join(', ')}`)
      return
    }

    const preview = lines.slice(1, 6).map(line => {
      const values = line.split(',')
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    setPreviewData(preview)
    setShowPreview(true)
  }

  /**
   * Handle file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (selectedFile) {
      const error = validateFile(selectedFile)
      if (error) {
        toast.error(error)
        return
      }

      setFile(selectedFile)
      previewCSV(selectedFile)
    }
  }

  /**
   * Upload CSV file
   */
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    setShowPreview(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post('/activity-uploads/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success(`✅ Uploaded ${response.data.count} activity records`)
      setFile(null)
      fetchActivities()
    } catch (err) {
      const message = getErrorMessage(err)
      toast.error(`Upload failed: ${message}`)
    } finally {
      setUploading(false)
    }
  }

  /**
   * Fetch user's activity data
   */
  const fetchActivities = async () => {
    try {
      const response = await apiClient.get('/activity-data/')
      setActivities(response.data)
      analyzeActivities(response.data)
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    }
  }

  /**
   * Analyze activities for health alerts
   */
  const analyzeActivities = (data: ActivityDay[]) => {
    const newAlerts: string[] = []

    data.forEach(day => {
      if (day.steps < HEALTH_THRESHOLDS.MIN_STEPS) {
        newAlerts.push(`Low activity on ${day.date}: Only ${day.steps} steps`)
      }
      if (day.heart_rate && day.heart_rate > HEALTH_THRESHOLDS.MAX_HEART_RATE) {
        newAlerts.push(`High heart rate on ${day.date}: ${day.heart_rate} bpm`)
      }
      if (day.sleep_hours && day.sleep_hours < HEALTH_THRESHOLDS.MIN_SLEEP) {
        newAlerts.push(`Insufficient sleep on ${day.date}: ${day.sleep_hours} hours`)
      }
    })

    setAlerts(newAlerts)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
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
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Activity Data Upload
          </h1>
          <p className="text-gray-600 mt-2">Upload your daily activity data for comprehensive health tracking</p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600" />
            Upload Your Data
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <FileText className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {file ? file.name : 'Click to select CSV file'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                </div>
              </label>
            </div>

            {showPreview && previewData.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3">Preview (first 5 rows):</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        {Object.keys(previewData[0]).map(key => (
                          <th key={key} className="px-4 py-2 text-left font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="px-4 py-2">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload CSV
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Upload Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">📋 Upload Instructions</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>File format:</strong> CSV only</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>Required columns:</strong> date, steps, calories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>Optional columns:</strong> heart_rate, sleep_hours, distance, active_minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-01-15)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>Data frequency:</strong> One row per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span><strong>Missing data:</strong> Leave blank or use 0</span>
                </li>
              </ul>

              <button
                onClick={downloadTemplate}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Sample Template
              </button>
            </div>
          </div>
        </motion.div>

        {/* Health Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-yellow-900 mb-3">Health Alerts</h3>
                <ul className="space-y-2">
                  {alerts.map((alert, idx) => (
                    <li key={idx} className="text-gray-700">{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity Chart */}
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="#3B82F6" strokeWidth={2} name="Steps" />
                <Line type="monotone" dataKey="calories" stroke="#8B5CF6" strokeWidth={2} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  )
}
