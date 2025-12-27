import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import { getCampaigns, deleteCampaign, sendCampaign } from '../../services/adminApi';

interface Campaign {
  id: number;
  title: string;
  subject: string;
  segment_display: string;
  status_display: string;
  recipients_count: number;
  sent_count: number;
  created_at: string;
}

const EmailCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;
    try {
      await sendCampaign(id);
      alert('Campaign sent successfully!');
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to send campaign:', error);
      alert('Failed to send campaign');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await deleteCampaign(id);
      await loadCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div className="page-header">
          <div>
            <h1>Email Campaigns</h1>
            <p>Send targeted emails to user segments</p>
          </div>
          <Link to="/admin/campaigns/new" className="btn-primary">
            + New Campaign
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading campaigns...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Segment</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Sent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td><strong>{campaign.title}</strong></td>
                    <td>{campaign.segment_display}</td>
                    <td>
                      <span className={`status-badge ${campaign.status_display.toLowerCase()}`}>
                        {campaign.status_display}
                      </span>
                    </td>
                    <td>{campaign.recipients_count}</td>
                    <td>{campaign.sent_count}</td>
                    <td>
                      <div className="action-buttons">
                        {campaign.status_display === 'Draft' && (
                          <button className="btn-send" onClick={() => handleSend(campaign.id)}>
                            Send
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => handleDelete(campaign.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {campaigns.length === 0 && (
              <div className="no-data">No campaigns found. Create your first campaign!</div>
            )}
          </div>
        )}

        <style>{`
          .admin-layout {
            min-height: 100vh;
            background: #f9fafb;
          }
          
          .admin-content {
            padding-top: 120px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 40px;
          }
          
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 32px;
          }
          
          .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 8px 0;
          }
          
          .page-header p {
            color: #6b7280;
            margin: 0;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .data-table thead {
            background: #f9fafb;
          }
          
          .data-table th {
            padding: 16px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .data-table td {
            padding: 16px;
            border-top: 1px solid #f3f4f6;
            font-size: 14px;
            color: #374151;
          }
          
          .data-table tbody tr:hover {
            background: #f9fafb;
          }
          
          .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
          }
          
          .status-badge.draft {
            background: #e5e7eb;
            color: #374151;
          }
          
          .status-badge.sent {
            background: #d1fae5;
            color: #065f46;
          }
          
          .status-badge.sending {
            background: #fef3c7;
            color: #92400e;
          }
          
          .action-buttons {
            display: flex;
            gap: 8px;
          }
          
          .btn-send {
            background: #10b981;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
          }
          
          .btn-delete {
            background: #ef4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
          }
          
          .loading, .no-data {
            padding: 48px;
            text-align: center;
            color: #6b7280;
            font-size: 16px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EmailCampaigns;
