import React, { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getAuditLogs } from '../../services/adminApi';
import './admin.css';

const ExportAuditLogs: React.FC = () => {
    const [exporting, setExporting] = useState(false);
    const [filters, setFilters] = useState({
        action: '',
        startDate: '',
        endDate: '',
    });

    const exportToCSV = async () => {
        setExporting(true);
        try {
            const data = await getAuditLogs(filters);

            // Convert to CSV
            const headers = ['Timestamp', 'User', 'Action', 'Model', 'Object', 'IP Address'];
            const csvContent = [
                headers.join(','),
                ...data.map((log: any) => [
                    new Date(log.timestamp).toLocaleString(),
                    log.user_username || 'System',
                    log.action,
                    log.model_name,
                    log.object_repr,
                    log.ip_address || 'N/A'
                ].join(','))
            ].join('\n');

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            alert('Audit logs exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export audit logs');
        } finally {
            setExporting(false);
        }
    };

    const exportToJSON = async () => {
        setExporting(true);
        try {
            const data = await getAuditLogs(filters);

            // Download JSON
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            alert('Audit logs exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export audit logs');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <h1>📥 Export Audit Logs</h1>
                    <p>Download audit logs in CSV or JSON format</p>
                </div>

                <div className="export-card">
                    <h2>Export Filters</h2>

                    <div className="filter-grid">
                        <div className="form-group">
                            <label>Action Type</label>
                            <select
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            >
                                <option value="">All Actions</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="export-actions">
                        <button
                            className="btn-export csv"
                            onClick={exportToCSV}
                            disabled={exporting}
                        >
                            📄 Export as CSV
                        </button>
                        <button
                            className="btn-export json"
                            onClick={exportToJSON}
                            disabled={exporting}
                        >
                            📋 Export as JSON
                        </button>
                    </div>
                </div>

                <style>{`
          .export-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            max-width: 800px;
          }
          
          .export-card h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 24px 0;
          }
          
          .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .export-actions {
            display: flex;
            gap: 12px;
          }
          
          .btn-export {
            flex: 1;
            padding: 14px 24px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .btn-export.csv {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          
          .btn-export.json {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }
          
          .btn-export:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .btn-export:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
        `}</style>
            </div>
        </div>
    );
};

export default ExportAuditLogs;
