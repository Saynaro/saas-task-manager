import { useState, useEffect } from 'react';
import { Shield, Building2, Loader2, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/apiFetch';
import { API_BASE_URL } from '../../utils/config';
import './SuperAdminSettings.css';

export function SuperAdminSettings() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [wsToDelete, setWsToDelete] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/admin/stats`, {
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
            const res = await apiFetch(`${API_BASE_URL}/api/admin/workspaces/${wsToDelete.id}`, {
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

            {/* Workspaces Table */}
            <section className="admin-section all-workspaces">
                <div className="section-head">
                    <Building2 size={20} />
                    <h2>Global Workspaces</h2>
                </div>

                {/* Desktop Table */}
                <div className="workspace-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Workspace Name</th>
                                <th style={{ textAlign: 'center' }}>Owner</th>
                                <th style={{ textAlign: 'center' }}>Members</th>
                                <th style={{ textAlign: 'center' }}>Projects</th>
                                <th style={{ textAlign: 'center', width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.workspaces?.map(ws => (
                                <tr key={ws.id}>
                                    <td className="ws-name">{ws.name}</td>
                                    <td style={{ textAlign: 'center' }}>{ws.owner}</td>
                                    <td style={{ textAlign: 'center' }}>{ws.membersCount}</td>
                                    <td style={{ textAlign: 'center' }}>{ws.projectsCount}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="admin-delete-btn"
                                            style={{ margin: '0 auto' }}
                                            onClick={() => {
                                                setWsToDelete(ws);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="admin-mobile-cards">
                    {stats?.workspaces?.map(ws => (
                        <div key={ws.id} className="admin-ws-card">
                            <div className="admin-ws-card-header">
                                <span className="admin-ws-name">{ws.name}</span>
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
                            <div className="admin-ws-card-meta">
                                <span className="admin-ws-meta-item">
                                    <span className="admin-ws-meta-label">Owner</span>
                                    <span>{ws.owner}</span>
                                </span>
                                <span className="admin-ws-meta-item centered">
                                    <span className="admin-ws-meta-label">Members</span>
                                    <span>{ws.membersCount}</span>
                                </span>
                                <span className="admin-ws-meta-item centered">
                                    <span className="admin-ws-meta-label">Projects</span>
                                    <span>{ws.projectsCount}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
