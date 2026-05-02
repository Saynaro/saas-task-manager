import { useState } from 'react';
import { Lock } from 'lucide-react';
import './AccountSettings.css';

export function AccountSettings({ user }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="acc-settings-container">
            <div className="acc-header">
                <div>
                    <h2 className="acc-title">Account Settings</h2>
                    <p className="acc-subtitle">Manage your account details and preferences.</p>
                </div>
            </div>

            <div className="acc-layout">
                <div className="acc-sidebar">
                    <button className={`acc-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                    <button className={`acc-nav-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
                    <button className={`acc-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
                    <button className={`acc-nav-btn ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>Billing</button>
                </div>

                <div className="acc-content">
                    {activeTab === 'profile' && (
                        <div className="acc-card">
                            <div className="acc-card-header">
                                <div>
                                    <h3 className="acc-card-title">Personal Information</h3>
                                    <p className="acc-card-subtitle">Update your basic profile details.</p>
                                </div>
                                <img src={`https://i.pravatar.cc/150?u=${user.firstName}`} alt="profile" className="acc-profile-avatar" />
                            </div>
                            
                            <div className="acc-card-body">
                                <div className="acc-form-row">
                                    <div className="acc-form-group">
                                        <label>Full Name</label>
                                        <input type="text" defaultValue={`${user.firstName} ${user.lastName}`} className="acc-input" />
                                    </div>
                                    <div className="acc-form-group">
                                        <label>Email Address</label>
                                        <input type="email" defaultValue={user.email} className="acc-input" />
                                        <span className="acc-lock-text"><Lock size={12}/> Managed by organization</span>
                                    </div>
                                </div>
                                
                                <div className="acc-form-group">
                                    <label>Job Title</label>
                                    <input type="text" defaultValue={user.jobTitle || "Senior Product Designer"} className="acc-input" />
                                </div>
                                
                                <div className="acc-form-group">
                                    <label>Bio</label>
                                    <textarea className="acc-textarea" defaultValue={user.bio || "Passionate about creating intuitive user experiences and scalable design systems."}></textarea>
                                </div>
                            </div>
                            <div className="acc-actions-bar">
                                <button className="acc-cancel-btn">Cancel</button>
                                <button className="acc-save-btn">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="acc-card">
                            <div className="acc-card-header">
                                <div>
                                    <h3 className="acc-card-title">Security Settings</h3>
                                    <p className="acc-card-subtitle">Update your password to keep your account secure.</p>
                                </div>
                            </div>
                            <div className="acc-card-body">
                                <div className="acc-form-group">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="Enter current password" className="acc-input" />
                                </div>
                                <div className="acc-form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter new password" className="acc-input" />
                                </div>
                                <div className="acc-form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" placeholder="Confirm new password" className="acc-input" />
                                </div>
                            </div>
                            <div className="acc-actions-bar">
                                <button className="acc-save-btn">Update Password</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="acc-card">
                            <div className="acc-card-header">
                                <div>
                                    <h3 className="acc-card-title">Notification Preferences</h3>
                                    <p className="acc-card-subtitle">Select when and how you'll be notified.</p>
                                </div>
                            </div>
                            <div className="acc-card-body">
                                <p style={{ fontSize: '14px', color: '#475569' }}>Push notifications are currently enabled.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="acc-card">
                            <div className="acc-card-header">
                                <div>
                                    <h3 className="acc-card-title">Billing History</h3>
                                    <p className="acc-card-subtitle">Your personal receipts and billing methods.</p>
                                </div>
                            </div>
                            <div className="acc-card-body">
                                <p style={{ fontSize: '14px', color: '#475569' }}>No payment methods are attached to this account.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
