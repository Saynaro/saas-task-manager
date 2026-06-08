import { useState, useEffect } from 'react';
import { Building, Users, UserPlus, Trash2, Loader2, Mail, LogOut } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { InviteModal } from '../../components/InviteModal';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/apiFetch';
import { API_BASE_URL } from '../../utils/config';
import './Settings.css';

export function WorkspaceSettings({ workspace, members, currentUser, onUpdate }) {
    const [activeTab, setActiveTab] = useState('identity');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: workspace?.name || '',
        slug: workspace?.slug || '',
        userName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || '',
        logoFile: null,
        logoPreview: null
    });

    useEffect(() => {
        if (workspace) {
            setFormData({
                name: workspace.name || '',
                slug: workspace.slug || '',
                userName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || '',
                logoFile: null,
                logoPreview: null
            });
        }
    }, [workspace, currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInputFocus = (e) => {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    const handleSaveIdentity = async () => {
        setIsSaving(true);
        try {
            // Update User Name if it has changed
            const currentFullName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ');
            if (formData.userName !== currentFullName) {
                const nameParts = formData.userName.trim().split(/\s+/);
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                const userBody = new FormData();
                userBody.append('firstName', firstName);
                userBody.append('lastName', lastName);

                const userRes = await apiFetch(`${API_BASE_URL}/api/auth/me`, {
                    method: 'PATCH',
                    body: userBody
                });

                if (!userRes.ok) {
                    toast.error('Failed to update user name');
                }
            }

            const body = new FormData();
            if (formData.name !== undefined) body.append('name', formData.name);
            if (formData.slug !== undefined) body.append('slug', formData.slug);
            if (formData.logoFile) body.append('avatar', formData.logoFile);

            const res = await apiFetch(`${API_BASE_URL}/api/workspaces/update`, {
                method: 'PATCH',
                credentials: 'include',
                body
            });

            if (res.ok) {
                toast.success('Workspace updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update workspace');
            }
        } catch (err) {
            console.error('Update workspace failed:', err);
            toast.error('Network error');
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteModal = (member) => {
        setUserToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteMember = async () => {
        if (!userToDelete) return;
        
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/workspaces/members/${userToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Member removed from workspace');
                if (onUpdate) await onUpdate(); // Refresh whole user/settings context
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to remove member');
            }
        } catch (err) {
            console.error('Delete member error:', err);
            toast.error('Error occurred');
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleLogout = async () => {
        try {
            await apiFetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const tabs = [
        { id: 'identity', label: 'Workspace Identity', icon: Building },
        { id: 'members', label: 'Members & Roles', icon: Users },
    ];

    return (
        <div className="settings-container">
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteMember}
                title="Remove Member"
                message={`Are you sure you want to remove ${userToDelete?.fullName} from the workspace? They will lose access to all projects and tasks.`}
                confirmText="Remove"
                confirmVariant="danger"
            />

            <ConfirmationModal 
                isOpen={isLogOutOpen}
                onClose={() => setIsLogOutOpen(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to log out?"
                confirmText="Logout"
                confirmVariant="logout"
            />

            <div className="settings-page-header">
                <div>
                    <h2 className="settings-page-title">Workspace Settings</h2>
                    <p className="settings-page-subtitle">Manage your team workspace, members and integrations.</p>
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
                    {activeTab === 'identity' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <Building size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Workspace Identity</h3>
                                        <p className="settings-card-subtitle">Configure your workspace name and branding.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-card-body">
                                <div className="settings-logo-section">
                                    <div className="avatar-upload-wrapper">
                                        {formData.logoPreview || workspace?.avatarUrl ? (
                                            <img
                                                src={formData.logoPreview || workspace.avatarUrl}
                                                alt="workspace logo"
                                                className="settings-profile-avatar"
                                                width={80}
                                                style={{ borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="settings-logo-box">
                                                <span className="settings-logo-text">WORK<br />SPACE</span>
                                            </div>
                                        )}
                                        <label className="avatar-upload-label" htmlFor="workspace-logo-input">
                                            Change
                                        </label>
                                        <input
                                            id="workspace-logo-input"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                if (file.size > 2 * 1024 * 1024) {
                                                    toast.error('Max file size is 2MB');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = () => setFormData(prev => ({
                                                    ...prev,
                                                    logoFile: file,
                                                    logoPreview: reader.result
                                                }));
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                    </div>
                                    <div className="settings-logo-info">
                                        <strong>Workspace Logo</strong>
                                        <p>Recommended 256×256px. Max 2MB.</p>
                                    </div>
                                </div>

                                <hr className="settings-divider" />

                                <div className="settings-form-group">
                                    <label>User Name</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="settings-input"
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label>Workspace Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        className="settings-input"
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label>Workspace URL</label>
                                    <div className="settings-url-row">
                                        <span className="settings-url-prefix">app.saaspro.com/</span>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            onFocus={handleInputFocus}
                                            className="settings-url-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn" onClick={() => setFormData({ name: workspace.name, slug: workspace.slug, userName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || '', logoFile: null, logoPreview: null })}>Cancel</button>
                                <button
                                    className="settings-primary-btn"
                                    onClick={handleSaveIdentity}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Identity'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <Users size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Members & Roles</h3>
                                        <p className="settings-card-subtitle">Manage who has access to this workspace.</p>
                                    </div>
                                </div>
                                <button className="settings-invite-btn" onClick={() => setIsInviteOpen(true)}>
                                    <UserPlus size={16} /> Invite Member
                                </button>
                            </div>
                            <div className="settings-table-wrap">
                                <table className="settings-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map(m => (
                                            <tr key={m.id}>
                                                <td>
                                                    <div className="settings-user-cell">
                                                        <img src={m.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&background=random`} alt="avatar" />
                                                        <div className="settings-user-info">
                                                            <strong>{m.fullName}</strong>
                                                            <span>{m.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`settings-role-badge ${m.isCreator ? 'settings-role-owner' : (m.role === 'OWNER' ? 'settings-role-admin' : 'settings-role-member')}`}>
                                                        {m.isCreator ? 'Owner' : (m.role === 'OWNER' ? 'Admin' : 'Member')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="settings-status-cell">
                                                        <span className={`settings-status-dot settings-dot-active`}></span>
                                                        Active
                                                    </div>
                                                </td>
                                                <td>
                                                     {!m.isCreator && (
                                                         <button 
                                                             className="settings-delete-btn"
                                                             onClick={() => openDeleteModal(m)}
                                                             title="Remove member"
                                                         >
                                                             <Trash2 size={15} />
                                                         </button>
                                                     )}
                                                 </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                </div>
            </div>
            
            <InviteModal 
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                workspaceName={workspace?.name}
                workspaceId={workspace?.id}
            />
        </div>
    );
}
