import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/apiFetch';
import './MemberTaskModal.css';

export function MemberTaskModal({ isOpen, onClose, task, onSuccess, currentUser }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'Medium',
        dueDate: '',
        checklist: [],
        attachments: [],
        members: []
    });

    const [comments, setComments] = useState([
        {
            id: 1,
            userName: "Alex Rivera",
            userAvatar: "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png",
            text: "I've started working on the main screen layout. Will push updates soon.",
            createdAt: "2 hours ago"
        },
        {
            id: 2,
            userName: "Sarah Chen",
            userAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0891b2&color=fff",
            text: "Looks great! Let me know if you need help with the CSS styling.",
            createdAt: "1 hour ago"
        },
        {
            id: 3,
            userName: "Sarah Chen",
            userAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0891b2&color=fff",
            text: "Looks great! Let me know if you need help with the CSS styling.",
            createdAt: "1 hour ago"
        }
    ]);
    const [newCommentText, setNewCommentText] = useState('');
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    const handleInputFocus = () => {
        setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments, isOpen]);

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
                attachments: task.attachments || [],
                members: task.members || []
            });
        }
    }, [task, isOpen]);

    const handleSendComment = (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const userName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email : "You";
        const userAvatar = currentUser?.role === 'OWNER' && currentUser?.workspace?.avatarUrl
            ? currentUser.workspace.avatarUrl
            : currentUser?.avatarUrl;

        const newComment = {
            id: Date.now(),
            userName: userName,
            userAvatar: userAvatar,
            text: newCommentText.trim(),
            createdAt: "Just now"
        };

        setComments(prev => [...prev, newComment]);
        setNewCommentText('');
    };

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
            const res = await apiFetch(`http://localhost:5001/api/projects/${task?.id}`, {
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
                            {taskData.members.map(m => (
                                <img
                                    key={m.user.id}
                                    src={m.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${m.user.firstName || ''} ${m.user.lastName || ''}`)}&background=random`}
                                    alt={`${m.user.firstName} ${m.user.lastName}`}
                                    title={`${m.user.firstName} ${m.user.lastName}`}
                                />
                            ))}
                            {taskData.members.length === 0 && <span className="no-assignees">No one assigned</span>}
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
                    <h2 className="section-title">Discussion & Comments</h2>
                    <div className="chat-container">
                        <div className="chat-messages">
                            {comments.map((comment) => (
                                <div key={comment.id} className="chat-message">
                                    <img
                                        src={comment.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=random`}
                                        alt={comment.userName}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-message-content">
                                        <div className="chat-message-header">
                                            <span className="chat-user-name">{comment.userName}</span>
                                            <span className="chat-time">{comment.createdAt}</span>
                                        </div>
                                        <div className="chat-message-text">{comment.text}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleSendComment} className="chat-input-form">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Write a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                onFocus={handleInputFocus}
                                className="chat-input"
                            />
                            <button type="submit" className="chat-send-btn">
                                <Send size={16} />
                                <span>Send</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="member-modal-footer">
                    <button className="finish-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
}
