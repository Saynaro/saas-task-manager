import { useState, useEffect } from 'react';
import { X, Plus, Mail, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/apiFetch';
import { API_BASE_URL } from '../utils/config';
import './WorkspaceModal.css';

export function WorkspaceModal({ isOpen, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logoFile: null,
        logoPreview: null,
        invites: []
    });
    const [currentEmail, setCurrentEmail] = useState('');

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')     // Remove all non-word chars
            .replace(/--+/g, '-');       // Replace multiple - with single -
    };

    const handleInputFocus = (e) => {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                slug: '',
                logoFile: null,
                logoPreview: null,
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
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('slug', formData.slug);
            formDataToSend.append('invites', JSON.stringify(formData.invites));
            if (formData.logoFile) {
                formDataToSend.append('avatar', formData.logoFile);
            }

            // 1. Create Workspace
            const res = await apiFetch(`${API_BASE_URL}/api/workspaces`, {
                method: "POST",
                credentials: "include",
                body: formDataToSend
            });

            if (res.ok) {
                const data = await res.json();
                const newWsId = data.data?.id; // backend should return the workspace object in data.data

                toast.success("Workspace created successfully!");

                // 2. Automatically select the new workspace
                if (newWsId) {
                    await apiFetch(`${API_BASE_URL}/api/auth/select-workspace`, {
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
                        <div className="workspace-preview-icon">
                            {formData.logoPreview ? (
                                <img src={formData.logoPreview} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                formData.name ? formData.name.charAt(0).toUpperCase() : <ImageIcon size={20} />
                            )}
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
                                onFocus={handleInputFocus}
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
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    onFocus={handleInputFocus}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label><ImageIcon size={14} /> Workspace Logo</label>
                        <div className="workspace-logo-upload-row" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
                            <div className="avatar-upload-wrapper" style={{ position: 'relative' }}>
                                {formData.logoPreview ? (
                                    <img
                                        src={formData.logoPreview}
                                        alt="preview"
                                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                    />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold', fontSize: '24px', border: '1px dashed #bfdbfe' }}>
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : <ImageIcon size={28} />}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="avatar-upload-label" htmlFor="workspace-logo-upload" style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', border: '1px solid #dbeafe', textAlign: 'center', transition: 'all 0.2s' }}>
                                    Upload Logo
                                </label>
                                <input
                                    id="workspace-logo-upload"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        if (file.size > 2 * 1024 * 1024) {
                                            toast.error("Max file size is 2MB");
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = () => setFormData(prev => ({
                                            ...prev,
                                            logoFile: file,
                                            logoPreview: reader.result
                                        }));
                                        reader.readAsDataURL(file);
                                    }}
                                />
                                <span style={{ fontSize: '12px', color: '#64748b' }}>JPG, PNG or WEBP. Max 2MB.</span>
                            </div>
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
                                onFocus={handleInputFocus}
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
