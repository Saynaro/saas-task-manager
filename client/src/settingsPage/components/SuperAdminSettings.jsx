import { useState, useEffect } from 'react';
import { Globe, Users, Shield, Building2, Loader2, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/apiFetch';
import './SuperAdminSettings.css';

export function SuperAdminSettings() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [wsToDelete, setWsToDelete] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await apiFetch("http://localhost:5001/api/admin/stats", {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error("Admin stats fetch failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDeleteWorkspace = async () => {
        if (!wsToDelete) return;
        try {
            const res = await apiFetch(`http://localhost:5001/api/admin/workspaces/${wsToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Workspace deleted successfully');
                setStats(prev => ({
                    ...prev,
                    workspaces: prev.workspaces.filter(ws => ws.id !== wsToDelete.id),
                    totalWorkspaces: prev.totalWorkspaces - 1
                }));
            } else {
                toast.error('Failed to delete workspace');
            }
        } catch (err) {
            console.error('Delete workspace error:', err);
            toast.error('Network error');
        } finally {
            setIsDeleteModalOpen(false);
            setWsToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Loader2 size={40} className="animate-spin" />
                <span>Loading statistics...</span>
            </div>
        );
    }

    return (
        <div className="super-admin-settings">
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteWorkspace}
                title="Delete Workspace"
                message={`Are you sure you want to permanently delete "${wsToDelete?.name}"? This will delete all projects, tasks, and data within it.`}
                confirmText="Delete"
                confirmVariant="danger"
            />

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
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.workspaces?.map(ws => (
                                    <tr key={ws.id}>
                                        <td className="ws-name">{ws.name}</td>
                                        <td>{ws.owner}</td>
                                        <td>{ws.membersCount}</td>
                                        <td>{ws.projectsCount}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="manage-btn">Manage</button>
                                                <button 
                                                    className="admin-delete-btn"
                                                    onClick={() => {
                                                        setWsToDelete(ws);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
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
                            <span className="stat-count">{stats?.totalUsers?.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Globe size={18} />
                        <div className="stat-info">
                            <span className="stat-label">Active Workspaces</span>
                            <span className="stat-count">{stats?.totalWorkspaces?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
