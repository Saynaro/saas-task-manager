import React from 'react';
import { AlertCircle, X, LogOut } from 'lucide-react';
import './ConfirmationModal.css';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, confirmVariant = "danger" }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <div className={`warning-icon-wrapper ${confirmVariant}`}>
                        {confirmVariant === 'logout' ? (
                            <LogOut className="warning-icon" size={24} />
                        ) : (
                            <AlertCircle className="warning-icon" size={24} />
                        )}
                    </div>
                    <button className="confirm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="confirm-modal-body">
                    <h3>{title || "Are you sure?"}</h3>
                    <p>{message || "This action cannot be undone."}</p>
                </div>

                <div className="confirm-modal-footer">
                    <button className="confirm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className={`confirm-confirm-btn ${confirmVariant}`} onClick={() => {
                        onConfirm();
                        onClose();
                    }}>{confirmText || "Confirm"}</button>
                </div>
            </div>
        </div>
    );
}
