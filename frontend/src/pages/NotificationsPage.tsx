import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, X, Trash2, Filter, ArrowLeft } from 'lucide-react'
import apiClient from '../utils/api'

interface Notification {
    id: number
    notification_type: string
    priority: string
    title: string
    message: string
    is_read: boolean
    created_at: string
    action_url?: string
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [priorityFilter, setPriorityFilter] = useState<string>('all')

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/notifications/?page_size=100')
            setNotifications(response.data.notifications)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: number) => {
        try {
            await apiClient.post(`/notifications/${id}/read/`)
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ))
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const markAsUnread = async (id: number) => {
        try {
            // Toggle locally (backend doesn't have unread endpoint yet)
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: false } : n
            ))
        } catch (error) {
            console.error('Failed to mark as unread:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await apiClient.post('/notifications/mark-all-read/')
            setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const deleteNotification = async (id: number) => {
        try {
            await apiClient.delete(`/notifications/${id}/delete/`)
            setNotifications(notifications.filter(n => n.id !== id))
        } catch (error) {
            console.error('Failed to delete notification:', error)
        }
    }

    const clearAll = async () => {
        if (!window.confirm('Are you sure you want to delete all notifications?')) {
            return
        }
        try {
            await apiClient.delete('/notifications/clear-all/')
            setNotifications([])
        } catch (error) {
            console.error('Failed to clear notifications:', error)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id)
        }
        if (notification.action_url) {
            window.location.href = notification.action_url
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'border-red-500 bg-red-50'
            case 'high':
                return 'border-orange-500 bg-orange-50'
            case 'medium':
                return 'border-blue-500 bg-blue-50'
            case 'low':
                return 'border-gray-500 bg-gray-50'
            default:
                return 'border-gray-300 bg-white'
        }
    }

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-500 text-white'
            case 'high':
                return 'bg-orange-500 text-white'
            case 'medium':
                return 'bg-blue-500 text-white'
            case 'low':
                return 'bg-gray-500 text-white'
            default:
                return 'bg-gray-400 text-white'
        }
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    // Filter notifications
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread' && n.is_read) return false
        if (filter === 'read' && !n.is_read) return false
        if (priorityFilter !== 'all' && n.priority !== priorityFilter) return false
        return true
    })

    const unreadCount = notifications.filter(n => !n.is_read).length

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
                                Notifications
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Mark All Read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="font-semibold text-gray-700">Filters:</span>
                        </div>

                        {/* Read/Unread Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                            <button
                                onClick={() => setFilter('read')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'read'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Read ({notifications.length - unreadCount})
                            </button>
                        </div>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No notifications</p>
                            <p className="text-gray-400 mt-2">
                                {filter !== 'all' ? `No ${filter} notifications found` : "You're all caught up!"}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getPriorityColor(
                                    notification.priority
                                )} ${!notification.is_read ? 'ring-2 ring-blue-200' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            {/* Unread Indicator */}
                                            {!notification.is_read && (
                                                <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
                                            )}

                                            {/* Priority Badge */}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(
                                                    notification.priority
                                                )}`}
                                            >
                                                {notification.priority.toUpperCase()}
                                            </span>

                                            {/* Type */}
                                            <span className="text-xs text-gray-500">
                                                {notification.notification_type.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <h3
                                            className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {notification.title}
                                        </h3>

                                        <p className="text-gray-700 mb-3">{notification.message}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{formatTime(notification.created_at)}</span>
                                            {notification.action_url && (
                                                <button
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {notification.is_read ? (
                                            <button
                                                onClick={() => markAsUnread(notification.id)}
                                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Mark as unread"
                                            >
                                                <Bell className="w-5 h-5 text-gray-600" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="w-5 h-5 text-green-600" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <X className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    )
}
