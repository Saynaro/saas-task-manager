import { useState } from 'react';
import { X, Mail, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './InviteModal.css';

export function InviteModal({ isOpen, onClose, workspaceName, workspaceId }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/invitations/send", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    email, 
                    role: 'MEMBER',
                    workspaceId: workspaceId
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Invitation sent successfully!");
                setEmail('');
                onClose();
            } else {
                toast.error(data.error || "Failed to send invitation");
            }
        } catch (err) {
            console.error("Invite error:", err);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-modal-overlay" onClick={onClose}>
            <div className="invite-modal-content" onClick={e => e.stopPropagation()}>
                <button className="invite-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="invite-modal-header">
                    <div className="invite-icon-circle">
                        <Mail size={24} />
                    </div>
                    <h2>Invite to {workspaceName}</h2>
                    <p>Send an invitation to someone to join your workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="invite-form">
                    <div className="input-group">
                        <label htmlFor="invite-email">Email Address</label>
                        <input
                            id="invite-email"
                            type="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="send-invite-btn" disabled={loading}>
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /> Sending...</>
                        ) : (
                            <><Send size={18} /> Send Invitation</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
