import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, Bell, Trash2, Edit2, Power, ArrowLeft } from 'lucide-react'
import apiClient from '../utils/api'

interface Reminder {
    id: number
    reminder_type: string
    title: string
    message: string
    scheduled_time: string
    frequency: string
    days_of_week: number[]
    is_active: boolean
    send_email: boolean
    send_notification: boolean
    last_sent: string | null
    created_at: string
}

export default function ReminderManager() {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

    useEffect(() => {
        fetchReminders()
    }, [])

    const fetchReminders = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/reminders/')
            setReminders(response.data)
        } catch (error) {
            console.error('Failed to fetch reminders:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleReminder = async (id: number) => {
        try {
            await apiClient.post(`/reminders/${id}/toggle/`)
            fetchReminders()
        } catch (error) {
            console.error('Failed to toggle reminder:', error)
        }
    }

    const deleteReminder = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this reminder?')) {
            return
        }
        try {
            await apiClient.delete(`/reminders/${id}/`)
            fetchReminders()
        } catch (error) {
            console.error('Failed to delete reminder:', error)
        }
    }

    const getReminderTypeIcon = (type: string) => {
        switch (type) {
            case 'medicine': return '💊'
            case 'appointment': return '📅'
            case 'exercise': return '🏃'
            case 'water': return '💧'
            case 'meal': return '🍽️'
            default: return '⏰'
        }
    }

    const getFrequencyText = (frequency: string, days: number[]) => {
        if (frequency === 'daily') return 'Every day'
        if (frequency === 'once') return 'One time'
        if (frequency === 'weekly') {
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            return days.map(d => dayNames[d]).join(', ')
        }
        if (frequency === 'monthly') return 'Monthly'
        return frequency
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Custom Reminders
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Set up personalized reminders for medicine, appointments, and more
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setEditingReminder(null)
                                setShowAddModal(true)
                            }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Reminder
                        </button>
                    </div>
                </div>

                {/* Reminders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading reminders...</p>
                        </div>
                    ) : reminders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No reminders yet</p>
                            <p className="text-gray-400 mt-2">Create your first reminder to get started!</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create Reminder
                            </button>
                        </div>
                    ) : (
                        reminders.map((reminder) => (
                            <motion.div
                                key={reminder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-xl shadow-lg p-6 ${!reminder.is_active ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl">{getReminderTypeIcon(reminder.reminder_type)}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{reminder.title}</h3>
                                                <p className="text-sm text-gray-500 capitalize">{reminder.reminder_type}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4">{reminder.message}</p>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <span className="font-semibold">{reminder.scheduled_time.slice(0, 5)}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                    {getFrequencyText(reminder.frequency, reminder.days_of_week)}
                                                </span>
                                            </div>

                                            {reminder.send_email && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <Bell className="w-4 h-4" />
                                                    <span>Email</span>
                                                </div>
                                            )}

                                            {reminder.send_notification && (
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <Bell className="w-4 h-4" />
                                                    <span>In-app</span>
                                                </div>
                                            )}
                                        </div>

                                        {reminder.last_sent && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Last sent: {new Date(reminder.last_sent).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => toggleReminder(reminder.id)}
                                            className={`p-2 rounded-lg transition-colors ${reminder.is_active
                                                    ? 'bg-green-100 hover:bg-green-200 text-green-600'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                                }`}
                                            title={reminder.is_active ? 'Deactivate' : 'Activate'}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingReminder(reminder)
                                                setShowAddModal(true)
                                            }}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() => deleteReminder(reminder.id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddReminderModal
                        reminder={editingReminder}
                        onClose={() => {
                            setShowAddModal(false)
                            setEditingReminder(null)
                        }}
                        onSuccess={() => {
                            setShowAddModal(false)
                            setEditingReminder(null)
                            fetchReminders()
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Add Reminder Modal Component
function AddReminderModal({
    reminder,
    onClose,
    onSuccess,
}: {
    reminder: Reminder | null
    onClose: () => void
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        reminder_type: reminder?.reminder_type || 'medicine',
        title: reminder?.title || '',
        message: reminder?.message || '',
        scheduled_time: reminder?.scheduled_time || '09:00:00',
        frequency: reminder?.frequency || 'daily',
        days_of_week: reminder?.days_of_week || [0, 1, 2, 3, 4, 5, 6],
        send_email: reminder?.send_email || false,
        send_notification: reminder?.send_notification || true,
    })

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (reminder) {
                await apiClient.put(`/reminders/${reminder.id}/`, formData)
            } else {
                await apiClient.post('/reminders/', formData)
            }
            onSuccess()
        } catch (error) {
            console.error('Failed to save reminder:', error)
            alert('Failed to save reminder')
        } finally {
            setLoading(false)
        }
    }

    const toggleDay = (day: number) => {
        if (formData.days_of_week.includes(day)) {
            setFormData({
                ...formData,
                days_of_week: formData.days_of_week.filter(d => d !== day)
            })
        } else {
            setFormData({
                ...formData,
                days_of_week: [...formData.days_of_week, day].sort()
            })
        }
    }

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
                <h2 className="text-2xl font-bold mb-6">
                    {reminder ? 'Edit Reminder' : 'Add New Reminder'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reminder Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reminder Type
                        </label>
                        <select
                            value={formData.reminder_type}
                            onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="medicine">💊 Medicine</option>
                            <option value="appointment">📅 Appointment</option>
                            <option value="exercise">🏃 Exercise</option>
                            <option value="water">💧 Water Intake</option>
                            <option value="meal">🍽️ Meal</option>
                            <option value="custom">⏰ Custom</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Take Prenatal Vitamins"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Reminder message..."
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Time
                        </label>
                        <input
                            type="time"
                            value={formData.scheduled_time.slice(0, 5)}
                            onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value + ':00' })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Frequency
                        </label>
                        <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="once">Once</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Days of Week (for weekly) */}
                    {formData.frequency === 'weekly' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Days of Week
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {dayNames.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${formData.days_of_week.includes(index)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notification Options */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.send_notification}
                                onChange={(e) => setFormData({ ...formData, send_notification: e.target.checked })}
                                className="w-5 h-5 text-blue-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Send in-app notification</span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.send_email}
                                onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                                className="w-5 h-5 text-blue-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Send email notification</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : reminder ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
