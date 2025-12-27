import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import './admin.css';

interface Widget {
    id: string;
    title: string;
    type: 'stat' | 'chart' | 'list' | 'alert';
    position: number;
    enabled: boolean;
}

const DashboardWidgets: React.FC = () => {
    const [widgets, setWidgets] = useState<Widget[]>([
        { id: 'recent-activities', title: 'Recent Activities', type: 'list', position: 1, enabled: true },
        { id: 'quick-stats', title: 'Quick Stats', type: 'stat', position: 2, enabled: true },
        { id: 'system-alerts', title: 'System Alerts', type: 'alert', position: 3, enabled: true },
        { id: 'user-growth', title: 'User Growth', type: 'chart', position: 4, enabled: true },
        { id: 'top-exercises', title: 'Top Exercises', type: 'list', position: 5, enabled: true },
    ]);

    const [recentActivities] = useState([
        { user: 'john_doe', action: 'Created new exercise', time: '5 min ago' },
        { user: 'jane_smith', action: 'Updated nutrition plan', time: '12 min ago' },
        { user: 'admin', action: 'Sent email campaign', time: '1 hour ago' },
    ]);

    const [systemAlerts] = useState([
        { type: 'warning', message: 'Server CPU usage at 85%', time: '10 min ago' },
        { type: 'info', message: 'Database backup completed', time: '2 hours ago' },
    ]);

    const toggleWidget = (id: string) => {
        setWidgets(widgets.map(w =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
        ));
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>📊 Dashboard Widgets</h1>
                        <p>Customize your dashboard with draggable widgets</p>
                    </div>
                </div>

                <div className="widget-controls">
                    <h3>Widget Settings</h3>
                    <div className="widget-toggles">
                        {widgets.map(widget => (
                            <label key={widget.id} className="widget-toggle">
                                <input
                                    type="checkbox"
                                    checked={widget.enabled}
                                    onChange={() => toggleWidget(widget.id)}
                                />
                                <span>{widget.title}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="widgets-grid">
                    {/* Recent Activities Widget */}
                    {widgets.find(w => w.id === 'recent-activities')?.enabled && (
                        <div className="widget-card">
                            <div className="widget-header">
                                <h3>📝 Recent Activities</h3>
                                <button className="widget-menu">⋮</button>
                            </div>
                            <div className="widget-content">
                                {recentActivities.map((activity, idx) => (
                                    <div key={idx} className="activity-item">
                                        <div className="activity-info">
                                            <strong>{activity.user}</strong>
                                            <span>{activity.action}</span>
                                        </div>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Widget */}
                    {widgets.find(w => w.id === 'quick-stats')?.enabled && (
                        <div className="widget-card">
                            <div className="widget-header">
                                <h3>⚡ Quick Stats</h3>
                                <button className="widget-menu">⋮</button>
                            </div>
                            <div className="widget-content">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-value">1,234</div>
                                        <div className="stat-label">Total Users</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">456</div>
                                        <div className="stat-label">Active Today</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">89</div>
                                        <div className="stat-label">New This Week</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Alerts Widget */}
                    {widgets.find(w => w.id === 'system-alerts')?.enabled && (
                        <div className="widget-card">
                            <div className="widget-header">
                                <h3>🔔 System Alerts</h3>
                                <button className="widget-menu">⋮</button>
                            </div>
                            <div className="widget-content">
                                {systemAlerts.map((alert, idx) => (
                                    <div key={idx} className={`alert-item ${alert.type}`}>
                                        <div className="alert-icon">
                                            {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </div>
                                        <div className="alert-info">
                                            <div className="alert-message">{alert.message}</div>
                                            <div className="alert-time">{alert.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* User Growth Widget */}
                    {widgets.find(w => w.id === 'user-growth')?.enabled && (
                        <div className="widget-card">
                            <div className="widget-header">
                                <h3>📈 User Growth</h3>
                                <button className="widget-menu">⋮</button>
                            </div>
                            <div className="widget-content">
                                <div className="growth-chart">
                                    <div className="chart-placeholder">
                                        <div className="chart-bar" style={{ height: '40%' }}></div>
                                        <div className="chart-bar" style={{ height: '60%' }}></div>
                                        <div className="chart-bar" style={{ height: '80%' }}></div>
                                        <div className="chart-bar" style={{ height: '100%' }}></div>
                                    </div>
                                    <div className="chart-labels">
                                        <span>Week 1</span>
                                        <span>Week 2</span>
                                        <span>Week 3</span>
                                        <span>Week 4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Exercises Widget */}
                    {widgets.find(w => w.id === 'top-exercises')?.enabled && (
                        <div className="widget-card">
                            <div className="widget-header">
                                <h3>🏋️ Top Exercises</h3>
                                <button className="widget-menu">⋮</button>
                            </div>
                            <div className="widget-content">
                                <div className="top-list">
                                    <div className="top-item">
                                        <span className="top-rank">#1</span>
                                        <span className="top-name">Prenatal Yoga</span>
                                        <span className="top-count">342 sessions</span>
                                    </div>
                                    <div className="top-item">
                                        <span className="top-rank">#2</span>
                                        <span className="top-name">Walking</span>
                                        <span className="top-count">298 sessions</span>
                                    </div>
                                    <div className="top-item">
                                        <span className="top-rank">#3</span>
                                        <span className="top-name">Swimming</span>
                                        <span className="top-count">215 sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <style>{`
          .widget-controls {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .widget-controls h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .widget-toggles {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }
          
          .widget-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f9fafb;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .widget-toggle:hover {
            background: #f3f4f6;
          }
          
          .widget-toggle input {
            cursor: pointer;
          }
          
          .widgets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 24px;
          }
          
          .widget-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          
          .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .widget-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .widget-menu {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            padding: 4px 8px;
          }
          
          .widget-content {
            padding: 20px;
          }
          
          .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .activity-item:last-child {
            border-bottom: none;
          }
          
          .activity-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .activity-info strong {
            color: #1f2937;
            font-size: 14px;
          }
          
          .activity-info span {
            color: #6b7280;
            font-size: 13px;
          }
          
          .activity-time {
            color: #9ca3af;
            font-size: 12px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          
          .stat-item {
            text-align: center;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #6b7280;
          }
          
          .alert-item {
            display: flex;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
          }
          
          .alert-item.warning {
            background: #fef3c7;
          }
          
          .alert-item.info {
            background: #dbeafe;
          }
          
          .alert-icon {
            font-size: 20px;
          }
          
          .alert-info {
            flex: 1;
          }
          
          .alert-message {
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 4px;
          }
          
          .alert-time {
            font-size: 12px;
            color: #6b7280;
          }
          
          .growth-chart {
            padding: 20px 0;
          }
          
          .chart-placeholder {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 150px;
            gap: 8px;
            margin-bottom: 12px;
          }
          
          .chart-bar {
            flex: 1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px 4px 0 0;
            transition: all 0.3s;
          }
          
          .chart-labels {
            display: flex;
            justify-content: space-around;
            font-size: 12px;
            color: #6b7280;
          }
          
          .top-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .top-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .top-rank {
            font-size: 18px;
            font-weight: 700;
            color: #667eea;
            min-width: 40px;
          }
          
          .top-name {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }
          
          .top-count {
            font-size: 13px;
            color: #6b7280;
          }
        `}</style>
            </div>
        </div>
    );
};

export default DashboardWidgets;
