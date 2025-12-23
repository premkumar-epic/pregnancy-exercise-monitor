import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchNotifications()
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/notifications/')
            setNotifications(response.data.notifications)
            setUnreadCount(response.data.unread_count)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const markAsRead = async (id: number) => {
        try {
            await apiClient.post(`/notifications/${id}/read/`)
            fetchNotifications()
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            setLoading(true)
            await apiClient.post('/notifications/mark-all-read/')
            fetchNotifications()
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteNotification = async (id: number) => {
        try {
            await apiClient.delete(`/notifications/${id}/delete/`)
            fetchNotifications()
        } catch (error) {
            console.error('Failed to delete notification:', error)
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
                return 'bg-red-100 border-red-300'
            case 'high':
                return 'bg-orange-100 border-orange-300'
            case 'medium':
                return 'bg-blue-100 border-blue-300'
            case 'low':
                return 'bg-gray-100 border-gray-300'
            default:
                return 'bg-gray-100 border-gray-300'
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
        return date.toLocaleDateString()
    }

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Notification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                                <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            disabled={loading}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Notification List */}
                            <div className="overflow-y-auto flex-1">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No notifications</p>
                                        <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-4 cursor-pointer transition-colors relative ${!notification.is_read
                                                    ? 'bg-blue-50 hover:bg-blue-100'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                {/* Unread Indicator */}
                                                {!notification.is_read && (
                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                                                )}

                                                <div className="flex items-start gap-3 pl-4">
                                                    {/* Priority Badge */}
                                                    <div
                                                        className={`w-1 h-full absolute left-0 top-0 ${notification.priority === 'critical'
                                                            ? 'bg-red-500'
                                                            : notification.priority === 'high'
                                                                ? 'bg-orange-500'
                                                                : notification.priority === 'medium'
                                                                    ? 'bg-blue-500'
                                                                    : 'bg-gray-400'
                                                            }`}
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <span className="text-xs text-gray-400 mt-2 block">
                                                            {formatTime(notification.created_at)}
                                                        </span>
                                                    </div>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteNotification(notification.id)
                                                        }}
                                                        className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                                                    >
                                                        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 bg-gray-50">
                                <div className="grid grid-cols-2 divide-x divide-gray-200">
                                    <button
                                        onClick={() => {
                                            window.location.href = '/notifications'
                                            setIsOpen(false)
                                        }}
                                        className="p-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium transition-colors"
                                    >
                                        View All
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = '/reminders'
                                            setIsOpen(false)
                                        }}
                                        className="p-3 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 font-medium transition-colors"
                                    >
                                        ⏰ Reminders
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
