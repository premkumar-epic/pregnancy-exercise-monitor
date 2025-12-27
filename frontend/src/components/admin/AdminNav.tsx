import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
    { path: '/admin/content', label: 'Content', icon: '📝' },
    { path: '/admin/campaigns', label: 'Campaigns', icon: '📧' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/system-health', label: 'Health', icon: '💚' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <Link to="/admin" className="navbar-brand">
          <h2>🔐 Admin Portal</h2>
        </Link>

        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      <style>{`
        .admin-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .navbar-container {
          max-width: 100%;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
        }
        
        .navbar-brand {
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .navbar-brand:hover {
          opacity: 0.9;
        }
        
        .navbar-brand h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          color: white;
        }
        
        .navbar-links {
          display: flex;
          gap: 8px;
          flex: 1;
        }
        
        .navbar-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .navbar-link:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }
        
        .navbar-link.active {
          background: rgba(255,255,255,0.2);
          color: white;
          font-weight: 500;
        }
        
        .nav-icon {
          font-size: 18px;
        }
        
        .nav-label {
          font-size: 14px;
        }
        
        .navbar-actions {
          display: flex;
          align-items: center;
        }
        
        .logout-btn {
          padding: 8px 16px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .logout-btn:hover {
          background: rgba(220, 38, 38, 1);
        }
        
        @media (max-width: 768px) {
          .nav-label {
            display: none;
          }
          
          .navbar-brand h2 {
            font-size: 16px;
          }
        }
      `}</style>
    </nav>
  );
};

export default AdminNav;
