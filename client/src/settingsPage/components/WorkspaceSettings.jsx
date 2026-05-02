import { useState } from 'react';
import { Building, Users, CreditCard, Grid, Sun, Moon, UserPlus, Trash2 } from 'lucide-react';
import './WorkspaceSettings.css';

export function WorkspaceSettings({ workspace, members }) {
    const [activeTab, setActiveTab] = useState('identity');

    return (
        <div className="ws-settings-container">
            <div className="ws-header-row">
                <div>
                    <h2 className="ws-title">Workspace Settings</h2>
                    <p className="ws-subtitle">Manage your team's workspace identity and member access.</p>
                </div>
                <div className="ws-actions">
                    <div className="ws-theme-toggle">
                        <button className="ws-theme-btn active"><Sun size={16} /></button>
                        <button className="ws-theme-btn"><Moon size={16} /></button>
                    </div>
                    <button className="ws-save-btn">Save Changes</button>
                </div>
            </div>

            <div className="ws-layout">
                <div className="ws-sidebar">
                    <button className={`ws-nav-btn ${activeTab === 'identity' ? 'active' : ''}`} onClick={() => setActiveTab('identity')}>
                        <Building size={18} /> Workspace Identity
                    </button>
                    <button className={`ws-nav-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
                        <Users size={18} /> Members & Roles
                    </button>
                    <button className={`ws-nav-btn ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
                        <CreditCard size={18} /> Billing
                    </button>
                    <button className={`ws-nav-btn ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>
                        <Grid size={18} /> Integrations
                    </button>
                </div>

                <div className="ws-content">
                    {activeTab === 'identity' && (
                        <div className="ws-card">
                            <div className="ws-card-header-icon">
                                <Building color="#2563eb" size={20} />
                                <h3>Workspace Identity</h3>
                            </div>

                            <div className="ws-card-body">
                                <div className="ws-logo-section">
                                    <div className="ws-logo-box">
                                        <span className="ws-logo-text">WORK<br />SPACE</span>
                                    </div>
                                    <div className="ws-logo-info">
                                        <strong>Workspace Logo</strong>
                                        <p>Recommended size: 256x256px. Max file size: 2MB.</p>
                                        <button className="ws-upload-btn">Upload New</button>
                                    </div>
                                </div>

                                <hr className="ws-divider" />

                                <div className="ws-form-group">
                                    <label>Workspace Name</label>
                                    <input type="text" defaultValue={workspace.name} className="ws-input" />
                                </div>

                                <div className="ws-form-group">
                                    <label>Workspace URL</label>
                                    <div className="ws-url-input">
                                        <span className="ws-url-prefix">app.saaspro.com/</span>
                                        <input type="text" defaultValue={workspace.slug} className="ws-input-trailing" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="ws-card">
                            <div className="ws-card-header-icon ws-space-between">
                                <div className="ws-icon-group">
                                    <Users color="#2563eb" size={20} />
                                    <h3>Members & Roles</h3>
                                </div>
                                <button className="ws-invite-btn"><UserPlus size={16} /> Invite Member</button>
                            </div>

                            <div className="ws-table-container">
                                <table className="ws-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map(m => (
                                            <tr key={m.id}>
                                                <td>
                                                    <div className="ws-user-cell">
                                                        <img src={`https://i.pravatar.cc/150?u=${m.user?.firstName || 'default'}`} alt="avatar" />
                                                        <div className="ws-user-info">
                                                            <strong>{m.user?.firstName} {m.user?.lastName}</strong>
                                                            <span>{m.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`ws-badge ${m.role === 'OWNER' ? 'ws-owner' : 'ws-member'}`}>
                                                        {m.role === 'OWNER' ? 'Owner' : 'Member'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="ws-status">
                                                        <span className={`ws-status-dot ${m.active !== false ? 'ws-active-dot' : 'ws-invited-dot'}`}></span>
                                                        {m.active !== false ? 'Active' : 'Invited'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="ws-delete-btn"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="ws-card">
                            <div className="ws-card-header-icon">
                                <CreditCard color="#2563eb" size={20} />
                                <h3>Billing & Invoices</h3>
                            </div>
                            <div className="ws-card-body">
                                <p>No active subscriptions found for this workspace.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="ws-card">
                            <div className="ws-card-header-icon">
                                <Grid color="#2563eb" size={20} />
                                <h3>Integrations</h3>
                            </div>
                            <div className="ws-card-body">
                                <p>Connect popular tools like GitHub, Slack, and Zoom.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
