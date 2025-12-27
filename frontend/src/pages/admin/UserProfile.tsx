import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import './admin.css';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        // Mock data - replace with actual API call
        const mockProfile = {
            id: 1,
            username: 'admin',
            email: 'admin@pregnancy-app.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin'
        };
        setProfile(mockProfile);
        setFormData({
            first_name: mockProfile.first_name,
            last_name: mockProfile.last_name,
            email: mockProfile.email,
            current_password: '',
            new_password: '',
            confirm_password: '',
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            alert('New passwords do not match!');
            return;
        }

        try {
            // API call would go here
            alert('Profile updated successfully!');
            setEditing(false);
            loadProfile();
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        }
    };

    if (!profile) {
        return (
            <div className="admin-layout">
                <AdminNav />
                <div className="admin-content">
                    <div className="loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminNav />
            <div className="admin-content">
                <div className="page-header">
                    <h1>👤 My Profile</h1>
                    <p>Manage your account settings and preferences</p>
                </div>

                <div className="profile-container">
                    {/* Avatar Section */}
                    <div className="profile-card avatar-section">
                        <div className="avatar-wrapper">
                            <div className="avatar-large">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {profile.first_name[0]}{profile.last_name[0]}
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <label className="avatar-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    📷 Change Photo
                                </label>
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>{profile.first_name} {profile.last_name}</h2>
                            <p className="profile-role">{profile.role}</p>
                            <p className="profile-email">{profile.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="profile-card">
                        <div className="card-header">
                            <h2>Profile Information</h2>
                            {!editing && (
                                <button className="btn-edit" onClick={() => setEditing(true)}>
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        disabled={!editing}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        disabled={!editing}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!editing}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        disabled
                                    />
                                    <small>Username cannot be changed</small>
                                </div>
                            </div>

                            {editing && (
                                <>
                                    <div className="divider">
                                        <span>Change Password (Optional)</span>
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                value={formData.current_password}
                                                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                                placeholder="Enter current password to change"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                value={formData.new_password}
                                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                                placeholder="New password"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={formData.confirm_password}
                                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => {
                                                setEditing(false);
                                                loadProfile();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            💾 Save Changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>

                <style>{`
          .profile-container {
            max-width: 800px;
          }
          
          .profile-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          
          .avatar-section {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          
          .avatar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          
          .avatar-large {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #667eea;
          }
          
          .avatar-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .avatar-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 36px;
            font-weight: 700;
          }
          
          .avatar-upload {
            padding: 8px 16px;
            background: #f3f4f6;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .avatar-upload:hover {
            background: #e5e7eb;
          }
          
          .profile-info h2 {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 8px 0;
          }
          
          .profile-role {
            display: inline-block;
            padding: 4px 12px;
            background: #dbeafe;
            color: #1e40af;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            text-transform: capitalize;
            margin-bottom: 8px;
          }
          
          .profile-email {
            color: #6b7280;
            font-size: 14px;
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          
          .card-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .form-group.full-width {
            grid-column: 1 / -1;
          }
          
          .divider {
            margin: 32px 0;
            text-align: center;
            position: relative;
          }
          
          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e5e7eb;
          }
          
          .divider span {
            position: relative;
            background: white;
            padding: 0 16px;
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
            </div>
        </div>
    );
};

export default UserProfile;
