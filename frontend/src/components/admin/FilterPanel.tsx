import React, { useState } from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: FilterState) => void;
    onClearFilters: () => void;
}

export interface FilterState {
    search: string;
    dateRange: {
        start: string;
        end: string;
    };
    status?: string;
    category?: string;
    tags?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, onClearFilters }) => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        dateRange: { start: '', end: '' },
        status: '',
        category: '',
        tags: []
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterUpdate = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDateRangeUpdate = (type: 'start' | 'end', value: string) => {
        const newDateRange = { ...filters.dateRange, [type]: value };
        const newFilters = { ...filters, dateRange: newDateRange };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        const clearedFilters: FilterState = {
            search: '',
            dateRange: { start: '', end: '' },
            status: '',
            category: '',
            tags: []
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    const hasActiveFilters = filters.search || filters.dateRange.start || filters.dateRange.end ||
        filters.status || filters.category || (filters.tags && filters.tags.length > 0);

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <div className="filter-title">
                    <span>🔍 Advanced Filters</span>
                    {hasActiveFilters && <span className="active-badge">{getActiveFilterCount(filters)} active</span>}
                </div>
                <div className="filter-actions">
                    {hasActiveFilters && (
                        <button className="btn-clear-filters" onClick={handleClear}>
                            Clear All
                        </button>
                    )}
                    <button
                        className="btn-toggle-filters"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '▲ Collapse' : '▼ Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="filter-content">
                    <div className="filter-grid">
                        {/* Search Filter */}
                        <div className="filter-group">
                            <label>Search</label>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) => handleFilterUpdate('search', e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        {/* Date Range Filter */}
                        <div className="filter-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={filters.dateRange.start}
                                onChange={(e) => handleDateRangeUpdate('start', e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={filters.dateRange.end}
                                onChange={(e) => handleDateRangeUpdate('end', e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterUpdate('status', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterUpdate('category', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                <option value="exercise">Exercise</option>
                                <option value="nutrition">Nutrition</option>
                                <option value="guidance">Guidance</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .filter-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .filter-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .active-badge {
          padding: 4px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .filter-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-clear-filters {
          padding: 8px 16px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-clear-filters:hover {
          background: #fecaca;
        }
        
        .btn-toggle-filters {
          padding: 8px 16px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-toggle-filters:hover {
          background: #e5e7eb;
        }
        
        .filter-content {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        
        .filter-group label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        
        .filter-input,
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>
        </div>
    );
};

// Helper function to count active filters
const getActiveFilterCount = (filters: FilterState): number => {
    let count = 0;
    if (filters.search) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.status) count++;
    if (filters.category) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
};

export default FilterPanel;
