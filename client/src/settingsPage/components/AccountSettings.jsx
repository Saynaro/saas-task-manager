import { useState } from 'react';
import { User, Lock, Bell, CreditCard } from 'lucide-react';
import './Settings.css';

export function AccountSettings({ user }) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    return (
        <div className="settings-container">
            <div className="settings-page-header">
                <div>
                    <h2 className="settings-page-title">Account Settings</h2>
                    <p className="settings-page-subtitle">Manage your personal profile and preferences.</p>
                </div>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={18} className="nav-icon" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <User size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Personal Information</h3>
                                        <p className="settings-card-subtitle">Update your name, role, and bio.</p>
                                    </div>
                                </div>
                                <img
                                    src={`https://i.pravatar.cc/150?u=${user.firstName}`}
                                    alt="profile"
                                    className="settings-profile-avatar"
                                    width={80}
                                />
                            </div>
                            <div className="settings-card-body">
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label>Full Name</label>
                                        <input type="text" defaultValue={`${user.firstName} ${user.lastName}`} className="settings-input" />
                                    </div>
                                    <div className="settings-form-group">
                                        <label>Email Address</label>
                                        <input type="email" defaultValue={user.email} className="settings-input" />
                                        <span className="settings-lock-hint"><Lock size={12} /> Managed by organization</span>
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <label>Job Title</label>
                                    <input type="text" defaultValue={user.jobTitle || 'Senior Product Designer'} className="settings-input" />
                                </div>
                                <div className="settings-form-group">
                                    <label>Bio</label>
                                    <textarea
                                        className="settings-textarea"
                                        defaultValue={user.bio || 'Passionate about creating intuitive user experiences and scalable design systems.'}
                                    />
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn">Cancel</button>
                                <button className="settings-primary-btn">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <Lock size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Security Settings</h3>
                                        <p className="settings-card-subtitle">Change your password to keep your account safe.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-card-body">
                                <div className="settings-form-group">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="Enter current password" className="settings-input" />
                                </div>
                                <div className="settings-form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter new password" className="settings-input" />
                                </div>
                                <div className="settings-form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="Confirm new password" className="settings-input" />
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-primary-btn">Update Password</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <Bell size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Notification Preferences</h3>
                                        <p className="settings-card-subtitle">Choose how and when you receive alerts.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-empty-panel">Push notifications are currently enabled.</div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <CreditCard size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Billing History</h3>
                                        <p className="settings-card-subtitle">View your receipts and payment methods.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-empty-panel">No payment methods attached to this account.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
