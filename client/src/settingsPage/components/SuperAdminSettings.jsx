import { Globe, Users, Shield, Building2 } from 'lucide-react';
import './SuperAdminSettings.css';

export function SuperAdminSettings() {
    // Mock data for workspaces - in real app this comes from API
    const workspaces = [
        { 
            id: '1', 
            name: 'Enterprise Design', 
            owner: 'Khalid Sainaro', 
            members: 14, 
            projects: 8,
            plan: 'Premium'
        },
        { 
            id: '2', 
            name: 'Marketing Team', 
            owner: 'Alice Smith', 
            members: 5, 
            projects: 3,
            plan: 'Basic'
        }
    ];

    return (
        <div className="super-admin-settings">
            <header className="admin-header">
                <div className="admin-title-row">
                    <Shield className="admin-icon" size={24} />
                    <h1>System Administration</h1>
                </div>
                <p>Manage all workspaces, users, and overall system health.</p>
            </header>

            <div className="admin-grid">
                <section className="admin-section all-workspaces">
                    <div className="section-head">
                        <Building2 size={20} />
                        <h2>Global Workspaces</h2>
                    </div>
                    <div className="workspace-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Workspace Name</th>
                                    <th>Owner</th>
                                    <th>Members</th>
                                    <th>Projects</th>
                                    <th>Plan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workspaces.map(ws => (
                                    <tr key={ws.id}>
                                        <td className="ws-name">{ws.name}</td>
                                        <td>{ws.owner}</td>
                                        <td>{ws.members}</td>
                                        <td>{ws.projects}</td>
                                        <td><span className={`plan-badge ${ws.plan.toLowerCase()}`}>{ws.plan}</span></td>
                                        <td><button className="manage-btn">Manage</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="admin-sidebar-stats">
                    <div className="stat-card">
                        <Users size={18} />
                        <div className="stat-info">
                            <span className="stat-label">Total Users</span>
                            <span className="stat-count">1,240</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Globe size={18} />
                        <div className="stat-info">
                            <span className="stat-label">Active Workspaces</span>
                            <span className="stat-count">42</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
