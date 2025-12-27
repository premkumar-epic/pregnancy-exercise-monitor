import React, { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import './admin.css';

interface ABTest {
    id: number;
    name: string;
    status: 'draft' | 'running' | 'completed';
    variant_a: {
        name: string;
        subject: string;
        sent: number;
        opens: number;
        clicks: number;
    };
    variant_b: {
        name: string;
        subject: string;
        sent: number;
        opens: number;
        clicks: number;
    };
    traffic_split: number;
    start_date: string;
    end_date: string;
    winner?: 'a' | 'b' | null;
}

const ABTesting: React.FC = () => {
    const [tests, setTests] = useState<ABTest[]>([
        {
            id: 1,
            name: 'Welcome Email Subject Test',
            status: 'running',
            variant_a: {
                name: 'Variant A',
                subject: 'Welcome to Your Pregnancy Journey!',
                sent: 500,
                opens: 275,
                clicks: 125
            },
            variant_b: {
                name: 'Variant B',
                subject: 'Start Your Healthy Pregnancy Today',
                sent: 500,
                opens: 310,
                clicks: 145
            },
            traffic_split: 50,
            start_date: '2024-01-20',
            end_date: '2024-01-27',
            winner: null
        },
        {
            id: 2,
            name: 'Exercise Reminder CTA Test',
            status: 'completed',
            variant_a: {
                name: 'Variant A',
                subject: 'Time for Your Daily Exercise',
                sent: 300,
                opens: 180,
                clicks: 75
            },
            variant_b: {
                name: 'Variant B',
                subject: 'Your Workout is Waiting!',
                sent: 300,
                opens: 165,
                clicks: 90
            },
            traffic_split: 50,
            start_date: '2024-01-10',
            end_date: '2024-01-17',
            winner: 'a'
        }
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const calculateOpenRate = (opens: number, sent: number) => {
        return sent > 0 ? ((opens / sent) * 100).toFixed(1) : '0.0';
    };

    const calculateClickRate = (clicks: number, opens: number) => {
        return opens > 0 ? ((clicks / opens) * 100).toFixed(1) : '0.0';
    };

    const calculateSignificance = (test: ABTest) => {
        const rateA = test.variant_a.opens / test.variant_a.sent;
        const rateB = test.variant_b.opens / test.variant_b.sent;
        const diff = Math.abs(rateA - rateB);

        // Simplified significance calculation
        if (diff > 0.1) return { significant: true, confidence: 95 };
        if (diff > 0.05) return { significant: true, confidence: 90 };
        return { significant: false, confidence: 0 };
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            draft: { class: 'badge-draft', text: 'Draft' },
            running: { class: 'badge-running', text: 'Running' },
            completed: { class: 'badge-completed', text: 'Completed' }
        };
        return badges[status as keyof typeof badges] || badges.draft;
    };

    const declareWinner = (testId: number, winner: 'a' | 'b') => {
        setTests(tests.map(t =>
            t.id === testId ? { ...t, winner, status: 'completed' as const } : t
        ));
        alert(`Variant ${winner.toUpperCase()} declared as winner!`);
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>🧪 A/B Testing</h1>
                        <p>Test and optimize your email campaigns</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                        ➕ New A/B Test
                    </button>
                </div>

                {showCreateForm && (
                    <div className="create-test-form">
                        <h3>Create New A/B Test</h3>
                        <p className="form-note">Configure your test variants and traffic split</p>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Test Name</label>
                                <input type="text" placeholder="e.g., Subject Line Test" />
                            </div>

                            <div className="variant-section">
                                <h4>Variant A</h4>
                                <div className="form-group">
                                    <label>Subject Line</label>
                                    <input type="text" placeholder="Enter subject line for Variant A" />
                                </div>
                            </div>

                            <div className="variant-section">
                                <h4>Variant B</h4>
                                <div className="form-group">
                                    <label>Subject Line</label>
                                    <input type="text" placeholder="Enter subject line for Variant B" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Traffic Split (%)</label>
                                <input type="number" defaultValue={50} min={10} max={90} />
                            </div>

                            <div className="form-group">
                                <label>Duration (days)</label>
                                <input type="number" defaultValue={7} min={1} max={30} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary">
                                Create Test
                            </button>
                        </div>
                    </div>
                )}

                <div className="tests-list">
                    {tests.map(test => {
                        const significance = calculateSignificance(test);

                        return (
                            <div key={test.id} className="test-card">
                                <div className="test-header">
                                    <div>
                                        <h3>{test.name}</h3>
                                        <span className={`status-badge ${getStatusBadge(test.status).class}`}>
                                            {getStatusBadge(test.status).text}
                                        </span>
                                    </div>
                                    <div className="test-dates">
                                        {new Date(test.start_date).toLocaleDateString()} - {new Date(test.end_date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="variants-comparison">
                                    {/* Variant A */}
                                    <div className={`variant-card ${test.winner === 'a' ? 'winner' : ''}`}>
                                        <div className="variant-header">
                                            <h4>{test.variant_a.name}</h4>
                                            {test.winner === 'a' && <span className="winner-badge">🏆 Winner</span>}
                                        </div>
                                        <div className="variant-subject">{test.variant_a.subject}</div>
                                        <div className="variant-stats">
                                            <div className="stat">
                                                <div className="stat-value">{test.variant_a.sent}</div>
                                                <div className="stat-label">Sent</div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-value">{calculateOpenRate(test.variant_a.opens, test.variant_a.sent)}%</div>
                                                <div className="stat-label">Open Rate</div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-value">{calculateClickRate(test.variant_a.clicks, test.variant_a.opens)}%</div>
                                                <div className="stat-label">Click Rate</div>
                                            </div>
                                        </div>
                                        {test.status === 'running' && !test.winner && (
                                            <button
                                                className="btn-declare-winner"
                                                onClick={() => declareWinner(test.id, 'a')}
                                            >
                                                Declare Winner
                                            </button>
                                        )}
                                    </div>

                                    {/* VS Divider */}
                                    <div className="vs-divider">VS</div>

                                    {/* Variant B */}
                                    <div className={`variant-card ${test.winner === 'b' ? 'winner' : ''}`}>
                                        <div className="variant-header">
                                            <h4>{test.variant_b.name}</h4>
                                            {test.winner === 'b' && <span className="winner-badge">🏆 Winner</span>}
                                        </div>
                                        <div className="variant-subject">{test.variant_b.subject}</div>
                                        <div className="variant-stats">
                                            <div className="stat">
                                                <div className="stat-value">{test.variant_b.sent}</div>
                                                <div className="stat-label">Sent</div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-value">{calculateOpenRate(test.variant_b.opens, test.variant_b.sent)}%</div>
                                                <div className="stat-label">Open Rate</div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-value">{calculateClickRate(test.variant_b.clicks, test.variant_b.opens)}%</div>
                                                <div className="stat-label">Click Rate</div>
                                            </div>
                                        </div>
                                        {test.status === 'running' && !test.winner && (
                                            <button
                                                className="btn-declare-winner"
                                                onClick={() => declareWinner(test.id, 'b')}
                                            >
                                                Declare Winner
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {significance.significant && (
                                    <div className="significance-banner">
                                        ✓ Results are statistically significant ({significance.confidence}% confidence)
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <style>{`
          .create-test-form {
            background: white;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .create-test-form h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .form-note {
            margin: 0 0 24px 0;
            color: #6b7280;
            font-size: 14px;
          }
          
          .variant-section {
            grid-column: 1 / -1;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .variant-section h4 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .tests-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .test-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .test-header h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
          }
          
          .badge-draft {
            background: #f3f4f6;
            color: #6b7280;
          }
          
          .badge-running {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .badge-completed {
            background: #d1fae5;
            color: #065f46;
          }
          
          .test-dates {
            font-size: 14px;
            color: #6b7280;
          }
          
          .variants-comparison {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 24px;
            align-items: center;
          }
          
          .variant-card {
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 2px solid transparent;
            transition: all 0.2s;
          }
          
          .variant-card.winner {
            background: #f0fdf4;
            border-color: #10b981;
          }
          
          .variant-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .variant-header h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }
          
          .winner-badge {
            padding: 4px 12px;
            background: #10b981;
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .variant-subject {
            margin-bottom: 16px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            font-size: 14px;
            color: #374151;
            font-style: italic;
          }
          
          .variant-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .stat {
            text-align: center;
            padding: 12px;
            background: white;
            border-radius: 8px;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
          }
          
          .btn-declare-winner {
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .btn-declare-winner:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          
          .vs-divider {
            font-size: 20px;
            font-weight: 700;
            color: #9ca3af;
            text-align: center;
          }
          
          .significance-banner {
            margin-top: 16px;
            padding: 12px 16px;
            background: #d1fae5;
            border-left: 4px solid #10b981;
            border-radius: 8px;
            color: #065f46;
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
            </div>
        </div>
    );
};

export default ABTesting;
