import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import StatsCard from '../../components/admin/StatsCard';
import { getAdminAnalytics, getSystemHealth } from '../../services/adminApi';

interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  exercises: {
    total_sessions: number;
    total_reps: number;
    avg_posture_score: number;
  };
  activity: {
    total_records: number;
    avg_daily_steps: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, healthData] = await Promise.all([
        getAdminAnalytics(),
        getSystemHealth()
      ]);
      setStats(analyticsData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNav />
        <div className="admin-content">
          <div className="loading">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="system-status">
            <span className={`status-indicator ${systemHealth?.status === 'healthy' ? 'healthy' : 'warning'}`}>
              {systemHealth?.status === 'healthy' ? '● Healthy' : '● Warning'}
            </span>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard
            title="Total Users"
            value={stats?.users.total || 0}
            icon="👥"
            color="#667eea"
          />
          <StatsCard
            title="Active Users"
            value={stats?.users.active || 0}
            icon="✅"
            color="#10b981"
          />
          <StatsCard
            title="Total Sessions"
            value={stats?.exercises.total_sessions || 0}
            icon="🏋️"
            color="#f59e0b"
          />
          <StatsCard
            title="Avg Posture Score"
            value={`${stats?.exercises.avg_posture_score.toFixed(1) || 0}%`}
            icon="📊"
            color="#8b5cf6"
          />
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <a href="/admin/content" className="action-card">
                <span className="action-icon">📝</span>
                <span className="action-label">Manage Content</span>
              </a>
              <a href="/admin/campaigns" className="action-card">
                <span className="action-icon">📧</span>
                <span className="action-label">Email Campaigns</span>
              </a>
              <a href="/admin/analytics" className="action-card">
                <span className="action-icon">📈</span>
                <span className="action-label">View Analytics</span>
              </a>
              <a href="/admin/audit-logs" className="action-card">
                <span className="action-icon">📋</span>
                <span className="action-label">Audit Logs</span>
              </a>
            </div>
          </div>

          <div className="section">
            <h2>System Overview</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <div className="overview-label">Database Status</div>
                <div className="overview-value">{systemHealth?.database?.status || 'Unknown'}</div>
              </div>
              <div className="overview-item">
                <div className="overview-label">Total Records</div>
                <div className="overview-value">
                  {(systemHealth?.database?.tables?.sessions || 0) +
                    (systemHealth?.database?.tables?.activities || 0)}
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-label">API Performance</div>
                <div className="overview-value">{systemHealth?.api_performance?.status || 'Unknown'}</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .admin-layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: #f9fafb;
          }
          
          .admin-content {
            padding-top: 120px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 40px;
          }
          
          .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
          }
          
          .admin-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
          }
          
          .system-status {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .status-indicator {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .status-indicator.healthy {
            background: #d1fae5;
            color: #065f46;
          }
          
          .status-indicator.warning {
            background: #fef3c7;
            color: #92400e;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }
          
          .dashboard-sections {
            display: grid;
            gap: 24px;
          }
          
          .section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .section h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 20px 0;
          }
          
          .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          
          .action-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .action-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
          }
          
          .action-icon {
            font-size: 32px;
          }
          
          .action-label {
            font-size: 16px;
            font-weight: 500;
          }
          
          .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
          }
          
          .overview-item {
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
          }
          
          .overview-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          
          .overview-value {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            text-transform: capitalize;
          }
          
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-size: 18px;
            color: #6b7280;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminDashboard;
