import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import { getAuditLogs } from '../../services/adminApi';

interface AuditLog {
    id: number;
    username: string;
    action: string;
    action_display: string;
    model_name: string;
    object_id: number | null;
    object_repr: string;
    changes: any;
    ip_address: string | null;
    timestamp: string;
}

const AuditLogs: React.FC = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        model: '',
        limit: 100
    });
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        loadLogs();
    }, [filters]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs(filters);
            setLogs(data.logs || []);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create': return '#10b981';
            case 'update': return '#f59e0b';
            case 'delete': return '#ef4444';
            case 'view': return '#3b82f6';
            case 'export': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>📋 Audit Logs</h1>
                        <p>Track all administrative actions and changes</p>
                    </div>
                    <button
                        className="btn-export-header"
                        onClick={() => navigate('/admin/audit-logs/export')}
                    >
                        📥 Export Logs
                    </button>
                </div>

                <div className="filters-section">
                    <div className="filter-group">
                        <label>Action</label>
                        <select
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                        >
                            <option value="">All Actions</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="view">View</option>
                            <option value="export">Export</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Model</label>
                        <select
                            value={filters.model}
                            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                        >
                            <option value="">All Models</option>
                            <option value="User">User</option>
                            <option value="Exercise">Exercise</option>
                            <option value="NutritionFood">Nutrition Food</option>
                            <option value="GuidanceArticle">Guidance Article</option>
                            <option value="EmailCampaign">Email Campaign</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Limit</label>
                        <select
                            value={filters.limit}
                            onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
                        >
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading audit logs...</div>
                ) : (
                    <div className="table-container">
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Model</th>
                                    <th>Object</th>
                                    <th>IP Address</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="log-row">
                                            <td>{formatDate(log.timestamp)}</td>
                                            <td><strong>{log.username}</strong></td>
                                            <td>
                                                <span
                                                    className="action-badge"
                                                    style={{ background: `${getActionColor(log.action)}20`, color: getActionColor(log.action) }}
                                                >
                                                    {log.action_display}
                                                </span>
                                            </td>
                                            <td>{log.model_name}</td>
                                            <td>{log.object_repr || `#${log.object_id}`}</td>
                                            <td>{log.ip_address || 'N/A'}</td>
                                            <td>
                                                {log.changes && Object.keys(log.changes).length > 0 && (
                                                    <button
                                                        className="expand-btn"
                                                        onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                                                    >
                                                        {expandedRow === log.id ? '▼' : '▶'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {expandedRow === log.id && log.changes && (
                                            <tr className="expanded-row">
                                                <td colSpan={7}>
                                                    <div className="changes-detail">
                                                        <h4>Changes:</h4>
                                                        <pre>{JSON.stringify(log.changes, null, 2)}</pre>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>

                        {logs.length === 0 && (
                            <div className="no-data">No audit logs found</div>
                        )}
                    </div>
                )}

                <style>{`
          .page-header {
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
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
          
          .btn-export-header {
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
          
          .btn-export-header:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          
          .filters-section {
            background: white;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            gap: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .filter-group {
            flex: 1;
          }
          
          .filter-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .filter-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .audit-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .audit-table thead {
            background: #f9fafb;
          }
          
          .audit-table th {
            padding: 16px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .audit-table td {
            padding: 16px;
            border-top: 1px solid #f3f4f6;
            font-size: 14px;
            color: #374151;
          }
          
          .log-row:hover {
            background: #f9fafb;
          }
          
          .action-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
          }
          
          .expand-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            color: #6b7280;
            padding: 4px 8px;
          }
          
          .expand-btn:hover {
            color: #374151;
          }
          
          .expanded-row {
            background: #f9fafb;
          }
          
          .changes-detail {
            padding: 16px;
          }
          
          .changes-detail h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
          }
          
          .changes-detail pre {
            background: white;
            padding: 16px;
            border-radius: 8px;
            font-size: 12px;
            overflow-x: auto;
            border: 1px solid #e5e7eb;
          }
          
          .no-data {
            padding: 48px;
            text-align: center;
            color: #6b7280;
            font-size: 16px;
          }
          
          .loading {
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

export default AuditLogs;
