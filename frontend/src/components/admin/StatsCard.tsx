import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = '#667eea' }) => {
    return (
        <div className="stats-card">
            <div className="stats-icon" style={{ background: `${color}20`, color }}>
                {icon}
            </div>
            <div className="stats-content">
                <div className="stats-title">{title}</div>
                <div className="stats-value">{value}</div>
                {trend && (
                    <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <style>{`
        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        
        .stats-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }
        
        .stats-content {
          flex: 1;
        }
        
        .stats-title {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .stats-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .stats-trend {
          font-size: 13px;
          font-weight: 500;
          margin-top: 4px;
        }
        
        .stats-trend.positive {
          color: #10b981;
        }
        
        .stats-trend.negative {
          color: #ef4444;
        }
      `}</style>
        </div>
    );
};

export default StatsCard;
