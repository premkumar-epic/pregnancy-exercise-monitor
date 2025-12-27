import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getSystemHealth } from '../../services/adminApi';

const SystemHealth: React.FC = () => {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealth();
        const interval = setInterval(loadHealth, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const loadHealth = async () => {
        try {
            const data = await getSystemHealth();
            setHealth(data);
        } catch (error) {
            console.error('Failed to load system health:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminNav />
                <div className="admin-content">
                    <div className="loading">Loading system health...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <h1>System Health</h1>
                    <div className="status-badge" style={{
                        background: health?.status === 'healthy' ? '#d1fae5' : '#fef3c7',
                        color: health?.status === 'healthy' ? '#065f46' : '#92400e'
                    }}>
                        {health?.status === 'healthy' ? '● Healthy' : '● Warning'}
                    </div>
                </div>

                <div className="health-grid">
                    {/* Database Health */}
                    <div className="health-card">
                        <h2>Database</h2>
                        <div className="health-metrics">
                            <div className="health-metric">
                                <span className="metric-label">Status</span>
                                <span className="metric-value">{health?.database?.status}</span>
                            </div>
                            <div className="health-metric">
                                <span className="metric-label">Connection Time</span>
                                <span className="metric-value">{health?.database?.connection_time_ms} ms</span>
                            </div>
                        </div>
                        <div className="table-counts">
                            <h3>Table Records</h3>
                            <div className="count-grid">
                                <div className="count-item">
                                    <span>Users</span>
                                    <strong>{health?.database?.tables?.users}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Sessions</span>
                                    <strong>{health?.database?.tables?.sessions}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Activities</span>
                                    <strong>{health?.database?.tables?.activities}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Vitals</span>
                                    <strong>{health?.database?.tables?.vitals}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Performance */}
                    <div className="health-card">
                        <h2>API Performance</h2>
                        <div className="health-metrics">
                            <div className="health-metric">
                                <span className="metric-label">Status</span>
                                <span className="metric-value">{health?.api_performance?.status}</span>
                            </div>
                            <div className="health-metric">
                                <span className="metric-label">Simple Query</span>
                                <span className="metric-value">{health?.api_performance?.simple_query_ms} ms</span>
                            </div>
                            <div className="health-metric">
                                <span className="metric-label">Complex Query</span>
                                <span className="metric-value">{health?.api_performance?.complex_query_ms} ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Statistics */}
                    <div className="health-card">
                        <h2>Data Statistics</h2>
                        <div className="stats-section">
                            <h3>Today's Activity</h3>
                            <div className="count-grid">
                                <div className="count-item">
                                    <span>Sessions</span>
                                    <strong>{health?.data_statistics?.today?.sessions}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Activities</span>
                                    <strong>{health?.data_statistics?.today?.activities}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="stats-section">
                            <h3>Total Records</h3>
                            <div className="count-grid">
                                <div className="count-item">
                                    <span>Sessions</span>
                                    <strong>{health?.data_statistics?.total?.sessions}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Activities</span>
                                    <strong>{health?.data_statistics?.total?.activities}</strong>
                                </div>
                                <div className="count-item">
                                    <span>Vitals</span>
                                    <strong>{health?.data_statistics?.total?.vitals}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
          .status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .health-grid {
            display: grid;
            gap: 24px;
          }
          
          .health-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .health-card h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 20px 0;
          }
          
          .health-card h3 {
            font-size: 15px;
            font-weight: 600;
            color: #374151;
            margin: 20px 0 12px 0;
          }
          
          .health-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          
          .health-metric {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .metric-label {
            font-size: 13px;
            color: #6b7280;
          }
          
          .metric-value {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            text-transform: capitalize;
          }
          
          .count-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
          }
          
          .count-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .count-item span {
            font-size: 13px;
            color: #6b7280;
          }
          
          .count-item strong {
            font-size: 18px;
            color: #1f2937;
          }
        `}</style>
            </div>
        </div>
    );
};

export default SystemHealth;
