import { useState } from 'react';
import { Building, Users, CreditCard, Grid, UserPlus, Trash2 } from 'lucide-react';
import './Settings.css';

export function WorkspaceSettings({ workspace, members }) {
    const [activeTab, setActiveTab] = useState('identity');

    const tabs = [
        { id: 'identity', label: 'Workspace Identity', icon: Building },
        { id: 'members', label: 'Members & Roles', icon: Users },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'integrations', label: 'Integrations', icon: Grid },
    ];

    return (
        <div className="settings-container">
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
                                    <input type="text" defaultValue={workspace.name} className="settings-input" />
                                </div>
                                <div className="settings-form-group">
                                    <label>Workspace URL</label>
                                    <div className="settings-url-row">
                                        <span className="settings-url-prefix">app.saaspro.com/</span>
                                        <input type="text" defaultValue={workspace.slug} className="settings-url-input" />
                                    </div>
                                </div>
                            </div>
                            <div className="settings-actions-bar">
                                <button className="settings-cancel-btn">Cancel</button>
                                <button className="settings-primary-btn">Save Identity</button>
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
                                                        <img src={`https://i.pravatar.cc/150?u=${m.user?.firstName || 'default'}`} alt="avatar" />
                                                        <div className="settings-user-info">
                                                            <strong>{m.user?.firstName} {m.user?.lastName}</strong>
                                                            <span>{m.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`settings-role-badge ${m.role === 'OWNER' ? 'settings-role-owner' : 'settings-role-member'}`}>
                                                        {m.role === 'OWNER' ? 'Owner' : 'Member'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="settings-status-cell">
                                                        <span className={`settings-status-dot ${m.active !== false ? 'settings-dot-active' : 'settings-dot-invited'}`}></span>
                                                        {m.active !== false ? 'Active' : 'Invited'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="settings-delete-btn"><Trash2 size={15} /></button>
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
