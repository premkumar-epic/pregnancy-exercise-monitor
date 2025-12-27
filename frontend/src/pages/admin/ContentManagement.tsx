import React from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';

const ContentManagement: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <div className="page-header">
          <h1>Content Management</h1>
          <p>Manage exercises, nutrition, and guidance content</p>
        </div>

        <div className="content-grid">
          <Link to="/admin/content/exercises" className="content-card">
            <div className="card-icon">🏋️</div>
            <h2>Exercises</h2>
            <p>Manage pregnancy-safe exercises</p>
            <div className="card-action">Manage →</div>
          </Link>

          <Link to="/admin/content/nutrition" className="content-card">
            <div className="card-icon">🥗</div>
            <h2>Nutrition</h2>
            <p>Manage nutrition foods and categories</p>
            <div className="card-action">Manage →</div>
          </Link>

          <Link to="/admin/content/guidance" className="content-card">
            <div className="card-icon">📖</div>
            <h2>Guidance</h2>
            <p>Manage articles and FAQs</p>
            <div className="card-action">Manage →</div>
          </Link>
        </div>

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
          
          .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }
          
          .content-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-decoration: none;
            color: inherit;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .content-card:not(.disabled):hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.12);
          }
          
          .content-card.disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .card-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          
          .content-card h2 {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 8px 0;
          }
          
          .content-card p {
            color: #6b7280;
            margin: 0 0 16px 0;
          }
          
          .card-action {
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .content-card.disabled .card-action {
            background: #e5e7eb;
            color: #9ca3af;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ContentManagement;
