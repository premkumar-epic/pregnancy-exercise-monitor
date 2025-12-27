import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import Pagination from '../../components/admin/Pagination';
import { getUserList, changeUserRole, deleteUser } from '../../services/adminApi';
import './admin.css';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    last_login: string;
    date_joined: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUserList();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
    };

    const submitRoleChange = async () => {
        if (!selectedUser) return;
        try {
            await changeUserRole(selectedUser.id, newRole);
            alert('User role updated successfully!');
            await loadUsers();
            setShowRoleModal(false);
        } catch (error) {
            console.error('Failed to change role:', error);
            alert('Failed to change user role');
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) return;
        try {
            await deleteUser(user.id);
            alert('User deleted successfully!');
            await loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <div>
                        <h1>User Management</h1>
                        <p>Manage users, roles, and permissions</p>
                    </div>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Roles</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Last Login</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td><strong>{user.username}</strong></td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-edit" onClick={() => handleRoleChange(user)}>
                                                    Change Role
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(user)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="no-data">No users found matching your criteria.</div>
                        )}

                        {filteredUsers.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                pageSize={pageSize}
                                onPageSizeChange={(size) => {
                                    setPageSize(size);
                                    setCurrentPage(1);
                                }}
                            />
                        )}
                    </div>
                )}

                {showRoleModal && selectedUser && (
                    <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Change User Role</h2>
                            <p>User: <strong>{selectedUser.username}</strong></p>
                            <p>Current Role: <strong>{selectedUser.role}</strong></p>

                            <div className="form-group">
                                <label>New Role</label>
                                <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button className="btn-secondary" onClick={() => setShowRoleModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={submitRoleChange}>
                                    Update Role
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
          .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .search-input {
            flex: 1;
            padding: 10px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .filter-select {
            padding: 10px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            min-width: 150px;
          }
          
          .role-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
            text-transform: capitalize;
          }
          
          .role-badge.patient {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .role-badge.doctor {
            background: #d1fae5;
            color: #065f46;
          }
          
          .role-badge.admin {
            background: #fce7f3;
            color: #9f1239;
          }
          
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal-content {
            background: white;
            padding: 32px;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
          }
          
          .modal-content h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          }
          
          .modal-content p {
            margin: 8px 0;
            color: #6b7280;
          }
          
          .form-group {
            margin: 24px 0;
          }
          
          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          
          .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
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

export default UserManagement;
