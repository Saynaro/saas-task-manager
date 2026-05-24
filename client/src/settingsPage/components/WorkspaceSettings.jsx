import { useState, useEffect } from 'react';
import { Building, Users, CreditCard, Grid, UserPlus, Trash2, Loader2, Mail } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/apiFetch';
import './Settings.css';

export function WorkspaceSettings({ workspace, members, onUpdate }) {
    const [activeTab, setActiveTab] = useState('identity');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: workspace?.name || '',
        slug: workspace?.slug || ''
    });

    useEffect(() => {
        if (workspace) {
            setFormData({
                name: workspace.name || '',
                slug: workspace.slug || ''
            });
        }
    }, [workspace]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveIdentity = async () => {
        setIsSaving(true);
        try {
            const res = await apiFetch('http://localhost:5001/api/workspaces/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
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
            const res = await apiFetch(`http://localhost:5001/api/workspaces/members/${userToDelete.id}`, {
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

    const tabs = [
        { id: 'identity', label: 'Workspace Identity', icon: Building },
        { id: 'members', label: 'Members & Roles', icon: Users },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'integrations', label: 'Integrations', icon: Grid },
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
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={18} className="nav-icon" />
                                {tab.label}
                            </button>
                        );
                    })}
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
                                    <div className="settings-logo-box">
                                        <span className="settings-logo-text">WORK<br />SPACE</span>
                                    </div>
                                    <div className="settings-logo-info">
                                        <strong>Workspace Logo</strong>
                                        <p>Recommended 256×256px. Max 2MB.</p>
                                        <button className="settings-upload-btn">Upload New</button>
                                    </div>
                                </div>

                                <hr className="settings-divider" />

                                <div className="settings-form-group">
                                    <label>Workspace Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                            className="settings-url-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn" onClick={() => setFormData({ name: workspace.name, slug: workspace.slug })}>Cancel</button>
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
                                <button className="settings-invite-btn">
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

                    {activeTab === 'billing' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <CreditCard size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Billing & Invoices</h3>
                                        <p className="settings-card-subtitle">Manage your subscription and payment history.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-empty-panel">No active subscriptions for this workspace.</div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <div className="settings-card-title-group">
                                    <Grid size={20} className="icon" />
                                    <div>
                                        <h3 className="settings-card-title">Integrations</h3>
                                        <p className="settings-card-subtitle">Connect your favourite tools and services.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-empty-panel">Connect tools like GitHub, Slack, and Zoom.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
