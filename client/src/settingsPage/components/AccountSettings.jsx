import { useState, useEffect } from 'react';
import { User, Lock, LogOut, Loader2, Eye, EyeOff } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/apiFetch';
import './Settings.css';

export function AccountSettings({ user, onUpdate }) {
    if (!user) return null;
    const [activeTab, setActiveTab] = useState('profile');
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        avatarFile: null,
        avatarPreview: null
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                avatarFile: null,
                avatarPreview: null
            });
        }
    }, [user]);

    // Password Update States
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdatePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(passwordData.newPassword)) {
            toast.error('Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 number');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const res = await apiFetch('http://localhost:5001/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (res.ok) {
                toast.success('Password updated successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
                // Reset eye states
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmNewPassword(false);
            } else {
                const data = await res.json();
                toast.error(data.message || data.error || 'Failed to update password');
            }
        } catch (err) {
            console.error('Password update error:', err);
            toast.error('Network error');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInputFocus = (e) => {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            if (formData.avatarFile) {
                formDataToSend.append('avatar', formData.avatarFile);
            }

            const res = await apiFetch('http://localhost:5001/api/auth/me', {
                method: 'PATCH',
                body: formDataToSend
            });

            if (res.ok) {
                const data = await res.json();
                toast.success('Profile updated!');
                if (onUpdate) onUpdate(data.data.user);
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
            await apiFetch('http://localhost:5001/api/auth/logout', {
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
            </div>

            <ConfirmationModal
                isOpen={isLogOutOpen}
                onClose={() => setIsLogOutOpen(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to log out?"
                confirmText="Logout"
                confirmVariant="logout"
            />

            <div className="settings-layout">
                <div className="settings-sidebar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    setActiveTab(tab.id);
                                    if (window.innerWidth <= 1150) {
                                        e.currentTarget.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'nearest',
                                            inline: 'center'
                                        });
                                    }
                                }}
                            >
                                <Icon size={18} className="nav-icon" />
                                {tab.label}
                            </button>
                        );
                    })}
                    <button className="settings-nav-logout-btn" onClick={() => setIsLogOutOpen(true)}>
                        <LogOut size={18} className="nav-icon" />
                        Logout
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <User size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Personal Information</h3>
                                        <p className="settings-card-subtitle">Update your name, surname and avatar.</p>
                                    </div>
                                </div>
                                <div className="avatar-upload-wrapper">
                                    <img
                                        src={formData.avatarPreview || user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random`}
                                        alt="profile"
                                        className="settings-profile-avatar"
                                        width={80}
                                    />
                                    <label className="avatar-upload-label" htmlFor="avatar-input">
                                        Change
                                    </label>
                                    <input
                                        id="avatar-input"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            if (file.size > 2 * 1024 * 1024) {
                                                toast.error("Max file size is 2MB");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = () => setFormData(prev => ({
                                                ...prev,
                                                avatarFile: file,
                                                avatarPreview: reader.result
                                            }));
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </div>
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
                                            onFocus={handleInputFocus}
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
                                            onFocus={handleInputFocus}
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
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn" onClick={() => setFormData({ firstName: user.firstName, lastName: user.lastName, avatarFile: null, avatarPreview: null })}>Cancel</button>
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
                                    <div className="password-wrapper">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            placeholder="Enter current password"
                                            className="settings-input"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            onFocus={handleInputFocus}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <label>New Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="settings-input"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            onFocus={handleInputFocus}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <label>Confirm New Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showConfirmNewPassword ? "text" : "password"}
                                            name="confirmNewPassword"
                                            placeholder="Confirm new password"
                                            className="settings-input"
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            onFocus={handleInputFocus}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button
                                    className="settings-primary-btn"
                                    onClick={handleUpdatePassword}
                                    disabled={isUpdatingPassword}
                                >
                                    {isUpdatingPassword ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update Password'}
                                </button>
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
