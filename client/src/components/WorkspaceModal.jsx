import { useState, useEffect } from 'react';
import { X, Plus, Mail, Globe, Palette, AlignLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './WorkspaceModal.css';

export function WorkspaceModal({ isOpen, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        invites: []
    });
    const [currentEmail, setCurrentEmail] = useState('');

    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
        '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'
    ];

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')     // Remove all non-word chars
            .replace(/--+/g, '-');       // Replace multiple - with single -
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                slug: '',
                description: '',
                color: '#3b82f6',
                invites: []
            });
        }
    }, [isOpen]);

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: slugify(name)
        });
    };

    const addInvite = () => {
        if (currentEmail && !formData.invites.includes(currentEmail)) {
            if (currentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setFormData({
                    ...formData,
                    invites: [...formData.invites, currentEmail]
                });
                setCurrentEmail('');
            }
        }
    };

    const removeInvite = (email) => {
        setFormData({
            ...formData,
            invites: formData.invites.filter(e => e !== email)
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name || !formData.slug) {
            toast.error("Please fill in name and slug");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Workspace
            const res = await fetch("http://localhost:5001/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                const newWsId = data.data?.id; // backend should return the workspace object in data.data

                toast.success("Workspace created successfully!");
                
                // 2. Automatically select the new workspace
                if (newWsId) {
                    await fetch("http://localhost:5001/api/auth/select-workspace", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ workspaceId: newWsId })
                    });
                }

                if (onUpdate) await onUpdate();
                onClose();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create workspace");
            }
        } catch (err) {
            console.error("Create workspace error:", err);
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content workspace-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title-wrapper">
                        <div className="workspace-preview-icon" style={{ backgroundColor: formData.color }}>
                            {formData.name ? formData.name.charAt(0).toUpperCase() : <ImageIcon size={20} />}
                        </div>
                        <div>
                            <h2>Create New Workspace</h2>
                            <p>Build a space for your team to collaborate.</p>
                        </div>
                    </div>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-form-row">
                        <div className="modal-form-group flex-2">
                            <label><Plus size={14} /> Workspace Name</label>
                            <input 
                                type="text" 
                                className="modal-input" 
                                placeholder="e.g. Design Studio"
                                value={formData.name}
                                onChange={handleNameChange}
                                autoFocus
                            />
                        </div>
                        <div className="modal-form-group flex-1">
                            <label><Globe size={14} /> Workspace Slug</label>
                            <div className="slug-input-wrapper">
                                <span className="slug-prefix">/</span>
                                <input 
                                    type="text" 
                                    className="modal-input slug-input" 
                                    placeholder="design-studio"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label><AlignLeft size={14} /> Description (Optional)</label>
                        <textarea 
                            className="modal-textarea" 
                            placeholder="What is this workspace about?"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="modal-form-group">
                        <label><Palette size={14} /> Brand Color</label>
                        <div className="color-presets">
                            {colors.map(c => (
                                <button 
                                    key={c}
                                    className={`color-swatch ${formData.color === c ? 'active' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setFormData({...formData, color: c})}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label><Mail size={14} /> Invite Members</label>
                        <div className="invite-input-row">
                            <input 
                                type="email" 
                                className="modal-input" 
                                placeholder="colleague@example.com"
                                value={currentEmail}
                                onChange={(e) => setCurrentEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addInvite()}
                            />
                            <button className="add-invite-btn" onClick={addInvite}>
                                Invite
                            </button>
                        </div>
                        {formData.invites.length > 0 && (
                            <div className="invite-chips">
                                {formData.invites.map(email => (
                                    <span key={email} className="invite-chip">
                                        {email}
                                        <button onClick={() => removeInvite(email)}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="workspace-submit-btn" 
                        style={{ backgroundColor: formData.color }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Workspace'}
                    </button>
                </div>
            </div>
        </div>
    );
}
