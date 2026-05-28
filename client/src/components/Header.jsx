import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Check, X, Loader2, Plus, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { WorkspaceModal } from './WorkspaceModal';
import './Header.css';
import { apiFetch } from '../utils/apiFetch';

export function Header({ toggleMenu, openWorkspaceModal, currentUser, refreshUser }) {
    const [invitations, setInvitations] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isWsSelectorOpen, setIsWsSelectorOpen] = useState(false);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [isSwitching, setIsSwitching] = useState(false);
    const notifRef = useRef(null);
    const wsRef = useRef(null);

    const userRole = currentUser?.role || 'USER';
    const isMember = currentUser?.role === 'MEMBER';
    const canSwitch = !isMember || (currentUser?.allWorkspaces?.length >= 2);

    const handleWorkspaceSelect = async (workspaceId) => {
        if (workspaceId === currentUser?.workspace?.id) return;
        
        setIsSwitching(true);
        try {
            const res = await apiFetch("http://localhost:5001/api/auth/select-workspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ workspaceId })
            });

            if (res.ok) {
                if (refreshUser) await refreshUser();
                setIsWsSelectorOpen(false);
            } else {
                toast.error("Failed to switch workspace");
            }
        } catch (err) {
            console.error("Switch workspace error:", err);
            toast.error("Network error");
        } finally {
            setIsSwitching(false);
        }
    };

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const res = await apiFetch("http://localhost:5001/api/invitations/my", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setInvitations(data);
                }
            } catch (err) {
                console.error("Fetch invitations error:", err);
            }
        };

        if (currentUser) {
            fetchInvitations();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchInvitations, 30000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (wsRef.current && !wsRef.current.contains(event.target)) {
                setIsWsSelectorOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInvitationAction = async (id, action) => {
        setLoadingIds(prev => new Set(prev).add(id));
        try {
            const res = await apiFetch(`http://localhost:5001/api/invitations/${id}/${action}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success(action === 'accept' ? "Joined workspace!" : "Invitation declined");
                setInvitations(prev => prev.filter(inv => inv.id !== id));
                if (action === 'accept') {
                    // Refresh page to show new workspace
                    window.location.reload();
                }
            } else {
                toast.error("Action failed");
            }
        } catch (err) {
            console.error("Invitation action error:", err);
            toast.error("Error occurred");
        } finally {
            setLoadingIds(prev => {
                const updated = new Set(prev);
                updated.delete(id);
                return updated;
            });
        }
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="burger-btn" onClick={toggleMenu}>
                    <Menu size={24} color="#4f566b" />
                </button>

                <div className="workspace" ref={wsRef}>
                    {currentUser?.workspace ? (
                        <>
                            <div 
                                className={`workspace-selector-trigger ${canSwitch ? 'clickable' : ''}`}
                                onClick={() => canSwitch && setIsWsSelectorOpen(!isWsSelectorOpen)}
                            >
                                <h3>{currentUser.workspace.name}</h3>
                                {canSwitch && <ChevronDown size={16} className={`chevron-icon ${isWsSelectorOpen ? 'open' : ''}`} />}
                            </div>

                            {isWsSelectorOpen && (
                                <div className="workspace-dropdown">
                                    <div className="dropdown-label">Switch Workspace</div>
                                    <div className="workspace-list">
                                        {currentUser.allWorkspaces.map(ws => (
                                            <div 
                                                key={ws.id} 
                                                className={`workspace-item ${ws.id === currentUser.workspace.id ? 'active' : ''}`}
                                                onClick={() => handleWorkspaceSelect(ws.id)}
                                            >
                                                <div className="ws-dot" />
                                                <span className="ws-name">{ws.name}</span>
                                                {ws.id === currentUser.workspace.id && <Check size={14} className="check-icon" />}
                                            </div>
                                        ))}
                                    </div>
                                    {!isMember && (
                                        <>
                                            <div className="dropdown-divider" />
                                            <button className="dropdown-action-btn" onClick={() => { openWorkspaceModal(); setIsWsSelectorOpen(false); }}>
                                                <Plus size={14} />
                                                Create New Workspace
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        !isMember && (
                            <button className="create-ws-header-btn" onClick={() => openWorkspaceModal()}>
                                <Plus size={16} />
                                <span className="desktop-txt">Create workspace</span>
                                <span className="mobile-txt">New Workspace</span>
                            </button>
                        )
                    )}
                </div>
            </div>
            
            <div className="header-right">
                <div className="header-actions">
                    <div className="notification-wrapper" ref={notifRef}>
                        <button 
                            className={`notif-btn ${invitations.length > 0 ? 'has-notifs' : ''}`}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell size={20} color="#4f566b" />
                            {invitations.length > 0 && <span className="notif-badge">{invitations.length}</span>}
                        </button>

                        {isNotifOpen && (
                            <div className="notif-dropdown">
                                <div className="notif-dropdown-header">
                                    <h4>Notifications</h4>
                                </div>
                                <div className="notif-list">
                                    {invitations.length === 0 ? (
                                        <div className="no-notifs">No new notifications</div>
                                    ) : (
                                        invitations.map(inv => (
                                            <div key={inv.id} className="notif-item">
                                                <div className="notif-content">
                                                    <p>
                                                        <strong>{inv.inviter?.firstName} {inv.inviter?.lastName}</strong> invited you to join <strong>{inv.workspace?.name}</strong>
                                                    </p>
                                                </div>
                                                <div className="notif-actions">
                                                    <button 
                                                        className="notif-accept" 
                                                        onClick={() => handleInvitationAction(inv.id, 'accept')}
                                                        disabled={loadingIds.has(inv.id)}
                                                    >
                                                        {loadingIds.has(inv.id) ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        Accept
                                                    </button>
                                                    <button 
                                                        className="notif-decline" 
                                                        onClick={() => handleInvitationAction(inv.id, 'decline')}
                                                        disabled={loadingIds.has(inv.id)}
                                                    >
                                                        <X size={14} />
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="user-info">
                    <span className="user-role-badge">{userRole}</span>
                    <div className="profile-badge">
                        <img
                            src={
                                (currentUser?.role === 'OWNER' && currentUser?.workspace?.avatarUrl)
                                    ? currentUser.workspace.avatarUrl
                                    : currentUser?.avatarUrl || "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
                            }
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}