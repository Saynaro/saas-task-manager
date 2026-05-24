import { useState, useEffect } from 'react';
import { Layout } from "../components/Layout";
import { MemberCards } from "./components/MemberCards";
import { InviteModal } from "../components/InviteModal";
import { Plus } from 'lucide-react';
import "./TeamPage.css";
import { apiFetch } from '../utils/apiFetch';

export function TeamPage({ currentUser, refreshUser }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!currentUser?.workspace?.id) {
                setLoading(false);
                return;
            }
            try {
                const res = await apiFetch("http://localhost:5001/api/workspaces/members", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();

                    // Add dummy stats for now as requested by the UI design
                    const formattedMembers = data.map(m => ({
                        ...m,
                        // If backend doesn't provide stats yet, we use 0
                        pending: m.pending || 0,
                        inProgress: m.inProgress || 0,
                        completed: m.completed || 0
                    }));

                    setMembers(formattedMembers);
                }
            } catch (err) {
                console.error("Error fetching members:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [currentUser?.workspace?.id]);

    return (
        <Layout currentUser={currentUser} refreshUser={refreshUser}>
            <div className="teampage-content">
                <div className="teampage-header">
                    <div className="header-text">
                        <h2>Team Members</h2>
                        <p className="workspace-name-display">{currentUser?.workspace?.name}</p>
                    </div>
                    {currentUser?.role === 'OWNER' && (
                        <button
                            className="add-members-page-btn"
                            onClick={() => setIsInviteModalOpen(true)}
                        >
                            <Plus size={16} /> Invite Members
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading-state">Loading members...</div>
                ) : (
                    <MemberCards members={members} currentUserId={currentUser?.id} />
                )}

                <InviteModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    workspaceName={currentUser?.workspace?.name}
                    workspaceId={currentUser?.workspace?.id}
                />
            </div>
        </Layout>
    );
}
