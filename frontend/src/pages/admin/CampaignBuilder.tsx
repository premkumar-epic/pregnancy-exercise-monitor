import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { getCampaign, createCampaign, updateCampaign } from '../../services/adminApi';
import './admin.css';

const CampaignBuilder: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        message: '',
        segment: 'all'
    });

    useEffect(() => {
        if (id) {
            loadCampaign();
        }
    }, [id]);

    const loadCampaign = async () => {
        try {
            const data = await getCampaign(Number(id));
            setFormData({
                title: data.title,
                subject: data.subject,
                message: data.message,
                segment: data.segment
            });
        } catch (error) {
            console.error('Failed to load campaign:', error);
            alert('Failed to load campaign');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateCampaign(Number(id), formData);
                alert('Campaign updated successfully!');
            } else {
                await createCampaign(formData);
                alert('Campaign created successfully!');
            }
            navigate('/admin/campaigns');
        } catch (error) {
            console.error('Failed to save campaign:', error);
            alert('Failed to save campaign');
        } finally {
            setLoading(false);
        }
    };

    const getRecipientEstimate = () => {
        // This would normally call an API to get actual counts
        const estimates: Record<string, number> = {
            all: 150,
            trimester_1: 45,
            trimester_2: 52,
            trimester_3: 53,
            active: 120,
            inactive: 30
        };
        return estimates[formData.segment] || 0;
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>{id ? 'Edit Campaign' : 'Create Campaign'}</h1>
                        <p>Design and send targeted email campaigns with rich formatting</p>
                    </div>
                </div>

                <div className="campaign-builder">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Campaign Details</h2>

                            <div className="form-group">
                                <label>Campaign Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Internal campaign name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Subject *</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Subject line for the email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Message *</label>
                                <RichTextEditor
                                    value={formData.message}
                                    onChange={(value) => setFormData({ ...formData, message: value })}
                                    placeholder="Write your email message here... (Markdown supported)"
                                />
                                <small>Use markdown formatting for rich content (bold, italic, lists, links, etc.)</small>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Target Audience</h2>

                            <div className="form-group">
                                <label>Segment *</label>
                                <select
                                    value={formData.segment}
                                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                >
                                    <option value="all">All Users</option>
                                    <option value="trimester_1">Trimester 1</option>
                                    <option value="trimester_2">Trimester 2</option>
                                    <option value="trimester_3">Trimester 3</option>
                                    <option value="active">Active Users (Last 7 days)</option>
                                    <option value="inactive">Inactive Users (30+ days)</option>
                                </select>
                            </div>

                            <div className="recipient-estimate">
                                <div className="estimate-icon">👥</div>
                                <div className="estimate-content">
                                    <div className="estimate-label">Estimated Recipients</div>
                                    <div className="estimate-value">{getRecipientEstimate()} users</div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/admin/campaigns')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : id ? 'Update Campaign' : 'Create Campaign'}
                            </button>
                        </div>
                    </form>
                </div>

                <style>{`
          .campaign-builder {
            max-width: 800px;
          }
          
          .form-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .form-section h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 20px 0;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
          }
          
          .form-group small {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            color: #6b7280;
          }
          
          .recipient-estimate {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: #f0f9ff;
            border-radius: 8px;
            border: 1px solid #bae6fd;
          }
          
          .estimate-icon {
            font-size: 32px;
          }
          
          .estimate-label {
            font-size: 13px;
            color: #0369a1;
            margin-bottom: 4px;
          }
          
          .estimate-value {
            font-size: 24px;
            font-weight: 700;
            color: #0c4a6e;
          }
          
          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          }
          
          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          }
        `}</style>
            </div>
        </div>
    );
};

export default CampaignBuilder;
