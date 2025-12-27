import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getRetentionMetrics, getFeatureAdoption, getEngagementMetrics } from '../../services/adminApi';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './admin.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

const Analytics: React.FC = () => {
    const [retention, setRetention] = useState<any>(null);
    const [adoption, setAdoption] = useState<any>(null);
    const [engagement, setEngagement] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [retentionData, adoptionData, engagementData] = await Promise.all([
                getRetentionMetrics(),
                getFeatureAdoption(),
                getEngagementMetrics()
            ]);
            setRetention(retentionData);
            setAdoption(adoptionData);
            setEngagement(engagementData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminNav />
                <div className="admin-content">
                    <div className="loading">Loading analytics...</div>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const retentionChartData = [
        { name: 'Day 1', rate: retention?.retention?.day_1_rate || 0 },
        { name: 'Day 7', rate: retention?.retention?.day_7_rate || 0 },
        { name: 'Day 30', rate: retention?.retention?.day_30_rate || 0 },
    ];

    const featureAdoptionData = [
        {
            name: 'Exercise Tracking',
            adoption: adoption?.feature_adoption?.exercise_tracking?.adoption_rate || 0,
            users: adoption?.feature_adoption?.exercise_tracking?.users_count || 0
        },
        {
            name: 'Activity Tracking',
            adoption: adoption?.feature_adoption?.activity_tracking?.adoption_rate || 0,
            users: adoption?.feature_adoption?.activity_tracking?.users_count || 0
        },
        {
            name: 'Health Monitoring',
            adoption: adoption?.feature_adoption?.health_monitoring?.adoption_rate || 0,
            users: adoption?.feature_adoption?.health_monitoring?.users_count || 0
        },
    ];

    const popularExercisesData = adoption?.popular_exercises?.slice(0, 5).map((ex: any) => ({
        name: ex.exercise__name,
        sessions: ex.count
    })) || [];

    const engagementTrendData = [
        { name: 'Week 1', dau: 45, mau: 120 },
        { name: 'Week 2', dau: 52, mau: 135 },
        { name: 'Week 3', dau: 48, mau: 142 },
        { name: 'Week 4', dau: 61, mau: 158 },
    ];

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <h1>📊 Advanced Analytics</h1>
                    <p>Deep insights into user behavior and engagement with interactive charts</p>
                </div>

                {/* Key Metrics Cards */}
                <div className="metrics-cards">
                    <div className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-info">
                            <div className="metric-label">Daily Active Users</div>
                            <div className="metric-value">{engagement?.engagement?.daily_active_users || 0}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">📅</div>
                        <div className="metric-info">
                            <div className="metric-label">Monthly Active Users</div>
                            <div className="metric-value">{engagement?.engagement?.monthly_active_users || 0}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">⏱️</div>
                        <div className="metric-info">
                            <div className="metric-label">Avg Session Duration</div>
                            <div className="metric-value">{engagement?.session_metrics?.avg_session_duration_minutes || 0} min</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">📈</div>
                        <div className="metric-info">
                            <div className="metric-label">DAU/MAU Ratio</div>
                            <div className="metric-value">{engagement?.engagement?.dau_mau_ratio || 0}%</div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Retention Trend Chart */}
                    <div className="chart-card">
                        <h2>📉 User Retention Trend</h2>
                        <p className="chart-subtitle">Retention rates over time</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={retentionChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#667eea"
                                    strokeWidth={3}
                                    dot={{ fill: '#667eea', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Feature Adoption Bar Chart */}
                    <div className="chart-card">
                        <h2>🎯 Feature Adoption Rates</h2>
                        <p className="chart-subtitle">Percentage of users using each feature</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={featureAdoptionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="adoption" fill="#667eea" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Popular Exercises Pie Chart */}
                    <div className="chart-card">
                        <h2>🏋️ Popular Exercises</h2>
                        <p className="chart-subtitle">Top 5 exercises by session count</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={popularExercisesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="sessions"
                                >
                                    {popularExercisesData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Engagement Trend */}
                    <div className="chart-card">
                        <h2>📊 Engagement Trend</h2>
                        <p className="chart-subtitle">DAU vs MAU over the last 4 weeks</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={engagementTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="dau" stroke="#667eea" strokeWidth={2} />
                                <Line type="monotone" dataKey="mau" stroke="#764ba2" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <style>{`
          .metrics-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }
          
          .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          
          .metric-icon {
            font-size: 40px;
          }
          
          .metric-info {
            flex: 1;
          }
          
          .metric-label {
            font-size: 13px;
            opacity: 0.9;
            margin-bottom: 4px;
          }
          
          .metric-value {
            font-size: 28px;
            font-weight: 700;
          }
          
          .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 24px;
          }
          
          .chart-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .chart-card h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 4px 0;
          }
          
          .chart-subtitle {
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 20px 0;
          }
        `}</style>
            </div>
        </div>
    );
};

export default Analytics;
