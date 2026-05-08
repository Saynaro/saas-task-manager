import { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, CheckCircle2, MessageSquare, Paperclip, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './MemberTaskModal.css';

export function MemberTaskModal({ isOpen, onClose, task, onSuccess }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'Medium',
        dueDate: '',
        checklist: [],
        attachments: []
    });

    useEffect(() => {
        if (task) {
            setTaskData({
                title: task.name || task.title || '',
                description: task.description || '',
                status: task.status || 'TODO',
                priority: task.priority || 'Medium',
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date',
                checklist: task.tasks ? task.tasks.map((t, index) => ({
                    id: t.id || index,
                    text: t.title,
                    completed: t.status === 'DONE'
                })) : [],
                attachments: task.attachments || []
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const toggleChecklist = async (id) => {
        const newChecklist = taskData.checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );

        // Calculate new status based on checklist
        let newStatus = 'TODO';
        const completedCount = newChecklist.filter(i => i.completed).length;
        const totalCount = newChecklist.length;

        if (totalCount > 0) {
            if (completedCount === totalCount) {
                newStatus = 'DONE';
            } else if (completedCount > 0) {
                newStatus = 'IN_PROGRESS';
            }
        }

        setTaskData({
            ...taskData,
            checklist: newChecklist,
            status: newStatus
        });

        // Auto-save to backend
        try {
            const res = await fetch(`http://localhost:5001/api/projects/${task?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus,
                    tasks: newChecklist.map(item => ({
                        id: typeof item.id === 'string' ? item.id : undefined,
                        title: item.text,
                        status: item.completed ? 'DONE' : 'TODO'
                    }))
                })
            });

            const data = await res.json();
            if (res.ok) {
                onSuccess?.(data.data);
            }
        } catch (err) {
            console.error("Auto-save failed:", err);
            toast.error("Failed to sync progress");
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'TODO': return 'Pending';
            case 'IN_PROGRESS': return 'In Progress';
            case 'DONE': return 'Completed';
            default: return status;
        }
    };

    return (
        <div className="member-modal-overlay" onClick={onClose}>
            <div className="member-modal-content" onClick={e => e.stopPropagation()}>
                <button className="member-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="member-modal-header">
                    <div className="title-section">
                        <h1>{taskData.title}</h1>
                        <p className="member-description">{taskData.description}</p>
                    </div>
                    <div className={`status-badge ${taskData.status.toLowerCase().replace('_', '-')}`}>
                        {getStatusLabel(taskData.status)}
                    </div>
                </div>

                <div className="member-modal-meta">
                    <div className="meta-box">
                        <span className="meta-label">Priority</span>
                        <span className="meta-value priority">{taskData.priority}</span>
                    </div>
                    <div className="meta-box">
                        <span className="meta-label">Due Date</span>
                        <span className="meta-value">{taskData.dueDate}</span>
                    </div>
                    <div className="meta-box">
                        <span className="meta-label">Assigned To</span>
                        <div className="member-avatars">
                            <img src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                            <img src="https://i.pravatar.cc/150?u=2" alt="avatar" />
                            <img src="https://i.pravatar.cc/150?u=3" alt="avatar" />
                        </div>
                    </div>
                </div>

                <div className="member-modal-section">
                    <h2 className="section-title">Todo Checklist</h2>
                    <div className="member-checklist">
                        {taskData.checklist.map((item) => (
                            <div key={item.id} className="member-checklist-item" onClick={() => toggleChecklist(item.id)}>
                                <div className={`member-checkbox ${item.completed ? 'checked' : ''}`}>
                                    {item.completed && <CheckCircle2 size={16} />}
                                </div>
                                <span className={`member-item-text ${item.completed ? 'done' : ''}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="member-modal-section">
                    <h2 className="section-title">Attachments</h2>
                    <div className="member-attachments">
                        <div className="attachment-row">
                            <span className="attachment-num">01</span>
                            <span className="attachment-link">https://react.dev/</span>
                            <ExternalLink size={14} className="attachment-icon" />
                        </div>
                        <div className="attachment-row">
                            <span className="attachment-num">02</span>
                            <span className="attachment-link">https://tailwindcss.com/docs/</span>
                            <ExternalLink size={14} className="attachment-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
