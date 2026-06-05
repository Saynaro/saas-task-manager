import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Header } from './Header';
import { SideBar } from './SideBar';
import { TaskModal } from './TaskModal';
import { WorkspaceModal } from './WorkspaceModal';
import { apiFetch } from '../utils/apiFetch';
import { handleRateLimit } from '../utils/handleRateLimit';
import './Layout.css';

export function Layout({ children, currentUser, onSuccess, refreshUser }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openTaskModal = () => {
        setIsTaskModalOpen(true);
        if (isMenuOpen) setIsMenuOpen(false); // Close sidebar on mobile after clicking
    };

    const openWorkspaceModal = () => {
        setIsWorkspaceModalOpen(true);
    };

    const handleVerifyClick = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const res = await apiFetch("http://localhost:5001/api/email/resend-verification", {
                method: "POST"
            });
            const data = await res.json();
            if (handleRateLimit(res, data)) return;
            if (res.ok) {
                toast.success(data.message || "Verification email sent successfully!");
                navigate('/verify-email');
            } else {
                toast.error(data.error || "Failed to send verification email");
            }
        } catch (err) {
            console.error("Resend error:", err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="home-layout">
            <SideBar
                isOpen={isMenuOpen}
                toggleMenu={toggleMenu}
                openCreateModal={openTaskModal}
                currentUser={currentUser}
            />

            <div className="first-container">
                <Header
                    toggleMenu={toggleMenu}
                    openWorkspaceModal={openWorkspaceModal}
                    currentUser={currentUser}
                    refreshUser={refreshUser}
                />
                <main className="content">
                    {currentUser && !currentUser.isVerified && (
                        <div className="verify-email-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <span>Your email address is not verified. Please check your inbox for the verification link. </span>
                            <button onClick={handleVerifyClick} disabled={isSending} className="verify-now-btn" style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: 'inherit', fontWeight: 'bold', cursor: 'pointer', marginLeft: '6px' }}>
                                {isSending ? "Sending link..." : "Verify Now"}
                            </button>
                        </div>
                    )}
                    {children}
                </main>
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                mode="create"
                onSuccess={onSuccess}
                currentUser={currentUser}
            />

            <WorkspaceModal
                isOpen={isWorkspaceModalOpen}
                onClose={() => setIsWorkspaceModalOpen(false)}
                currentUser={currentUser}
                onUpdate={refreshUser}
            />
        </div>
    );
}
