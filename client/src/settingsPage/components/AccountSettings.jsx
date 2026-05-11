import { useState } from 'react';
import { User, Lock, LogOut, Loader2 } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import './Settings.css';

export function AccountSettings({ user, onUpdate }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        jobTitle: '', // Placeholder as it's not in schema
        bio: ''       // Placeholder
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:5001/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Profile updated!');
                if (onUpdate) onUpdate();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (err) {
            console.error('Update account error:', err);
            toast.error('Network error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5001/api/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    return (
        <div className="settings-container">
            <div className="settings-page-header">
                <div>
                    <h2 className="settings-page-title">Account Settings</h2>
                    <p className="settings-page-subtitle">Manage your personal profile and preferences.</p>
                </div>
                <button className="settings-logout-btn" onClick={() => setIsLogOutOpen(true)}>
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            <ConfirmationModal 
                isOpen={isLogOutOpen}
                onClose={() => setIsLogOutOpen(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to log out?"
                confirmText="Logout"
                confirmVariant="danger"
            />

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
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random`}
                                    alt="profile"
                                    className="settings-profile-avatar"
                                    width={80}
                                />
                            </div>
                            <div className="settings-card-body">
                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label>First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            value={formData.firstName} 
                                            onChange={handleInputChange}
                                            className="settings-input" 
                                        />
                                    </div>
                                    <div className="settings-form-group">
                                        <label>Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            value={formData.lastName} 
                                            onChange={handleInputChange}
                                            className="settings-input" 
                                        />
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={user.email} 
                                        disabled
                                        className="settings-input disabled" 
                                    />
                                    <span className="settings-lock-hint"><Lock size={12} /> Email cannot be changed here</span>
                                </div>
                                <div className="settings-form-group">
                                    <label>Job Title</label>
                                    <input 
                                        type="text" 
                                        name="jobTitle"
                                        value={formData.jobTitle} 
                                        onChange={handleInputChange}
                                        className="settings-input" 
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        className="settings-textarea"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn" onClick={() => setFormData({ firstName: user.firstName, lastName: user.lastName, jobTitle: '', bio: '' })}>Cancel</button>
                                <button 
                                    className="settings-primary-btn" 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
                                </button>
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



                    {/* TODO: Add notifications and billing */}

                    {/* {activeTab === 'notifications' && (
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
                    )} */}
                </div>
            </div>
        </div>
    );
}
