import React, { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import './admin.css';

interface Notification {
    id: number;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'info',
            title: 'New User Registered',
            message: 'Jane Smith just created an account',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false
        },
        {
            id: 2,
            type: 'warning',
            title: 'High Server Load',
            message: 'CPU usage is at 85%. Consider scaling resources.',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            read: false
        },
        {
            id: 3,
            type: 'success',
            title: 'Campaign Sent',
            message: 'Welcome email campaign sent to 150 users',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            read: true
        },
        {
            id: 4,
            type: 'error',
            title: 'Failed Login Attempts',
            message: '5 failed login attempts detected for user admin',
            timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
            read: true
        }
    ]);

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getIcon = (type: string) => {
        const icons = {
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌',
            success: '✅'
        };
        return icons[type as keyof typeof icons] || 'ℹ️';
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>🔔 Notification Center</h1>
                        <p>Stay updated with real-time system notifications</p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="btn-mark-all-read" onClick={markAllAsRead}>
                            Mark All as Read ({unreadCount})
                        </button>
                    )}
                </div>

                <div className="notification-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>

                <div className="notifications-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="no-notifications">
                            <div className="no-notif-icon">🔕</div>
                            <h3>No notifications</h3>
                            <p>You're all caught up!</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-card ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                            >
                                <div className="notification-icon">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h4>{notification.title}</h4>
                                        <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                                    </div>
                                    <p className="notification-message">{notification.message}</p>
                                </div>
                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button
                                            className="btn-icon"
                                            onClick={() => markAsRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            ✓
                                        </button>
                                    )}
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => deleteNotification(notification.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="notification-settings">
                    <h3>💡 Notification Settings</h3>
                    <p>Configure how you receive notifications (WebSocket integration ready)</p>
                    <div className="settings-grid">
                        <label className="setting-item">
                            <input type="checkbox" defaultChecked />
                            <span>Email notifications</span>
                        </label>
                        <label className="setting-item">
                            <input type="checkbox" defaultChecked />
                            <span>Browser notifications</span>
                        </label>
                        <label className="setting-item">
                            <input type="checkbox" defaultChecked />
                            <span>System alerts</span>
                        </label>
                        <label className="setting-item">
                            <input type="checkbox" />
                            <span>Marketing updates</span>
                        </label>
                    </div>
                </div>

                <style>{`
          .notification-filters {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
          }
          
          .filter-btn {
            padding: 10px 20px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .filter-btn:hover {
            border-color: #667eea;
            color: #667eea;
          }
          
          .filter-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
          }
          
          .btn-mark-all-read {
            padding: 12px 24px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .btn-mark-all-read:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          
          .notifications-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 32px;
          }
          
          .notification-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            gap: 16px;
            align-items: flex-start;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: all 0.2s;
            border-left: 4px solid transparent;
          }
          
          .notification-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          }
          
          .notification-card.unread {
            background: #f0f9ff;
          }
          
          .notification-card.info {
            border-left-color: #3b82f6;
          }
          
          .notification-card.warning {
            border-left-color: #f59e0b;
          }
          
          .notification-card.error {
            border-left-color: #ef4444;
          }
          
          .notification-card.success {
            border-left-color: #10b981;
          }
          
          .notification-icon {
            font-size: 28px;
            line-height: 1;
          }
          
          .notification-content {
            flex: 1;
          }
          
          .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .notification-header h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .notification-time {
            font-size: 12px;
            color: #9ca3af;
          }
          
          .notification-message {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          }
          
          .notification-actions {
            display: flex;
            gap: 8px;
          }
          
          .btn-icon {
            background: #f3f4f6;
            border: none;
            border-radius: 6px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
          }
          
          .btn-icon:hover {
            background: #e5e7eb;
          }
          
          .btn-icon.delete:hover {
            background: #fee2e2;
          }
          
          .no-notifications {
            text-align: center;
            padding: 80px 20px;
            background: white;
            border-radius: 12px;
          }
          
          .no-notif-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          
          .no-notifications h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .no-notifications p {
            margin: 0;
            color: #6b7280;
          }
          
          .notification-settings {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .notification-settings h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .notification-settings p {
            margin: 0 0 20px 0;
            color: #6b7280;
            font-size: 14px;
          }
          
          .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          
          .setting-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .setting-item:hover {
            background: #f3f4f6;
          }
          
          .setting-item input {
            cursor: pointer;
          }
          
          .setting-item span {
            font-size: 14px;
            color: #374151;
          }
        `}</style>
            </div>
        </div>
    );
};

export default NotificationCenter;
