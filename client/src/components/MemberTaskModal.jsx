import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/apiFetch';
import socket from '../utils/socket';
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

    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    // get comments and connect to socket
    useEffect(() => {
        if (!isOpen || !task?.id) return;

        const fetchComments = async () => {
            try {
                const res = await apiFetch(`http://localhost:5001/api/projects/${task?.id}/comments`);
                const data = await res.json();

                setComments(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchComments();

        // connect to project room
        socket.connect();
        socket.emit("join_project", task.id);

        // listen to new comment event
        socket.on("new_comment", (comment) => {
            setComments(prev => [...prev, comment]);
        });


        return () => {
            socket.emit("leave_project", task.id);
            socket.off("new_comment");
            socket.disconnect();
        }

    }, [isOpen, task?.id])


    // set first task like default
    useEffect(() => {
        if (task?.tasks?.length > 0) {
            setSelectedTaskId(task.tasks[0].id)
        }
    }, [task])


    // Scroll chat messages container down when comments change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [comments]);


    const handleInputFocus = () => {
        setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };


    useEffect(() => {
        if (task) {
            setTaskData({
                title: task.name || task.title || '',
                description: task.description || '',
                status: task.status || 'TODO',
                priority: task.priority || 'Medium',
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : 'No date',
                checklist: task.tasks ? task.tasks.map((t, index) => ({
                    id: t.id || index,
                    text: t.title,
                    completed: t.status === 'DONE'
                })) : [],
                members: task.members || []
            });
        }
    }, [task, isOpen]);

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim() || !selectedTaskId || isSending) return;

        setIsSending(true);
        try {
            await apiFetch(`http://localhost:5001/api/projects/${task.id}/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    content: newCommentText.trim(),
                    taskId: selectedTaskId,
                })
            });

            setNewCommentText('');
        } catch (error) {
            toast.error("Failed to send comment");
        } finally {
            setIsSending(false)
        };

        const userName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email : "You";
        const userAvatar = currentUser?.role === 'OWNER' && currentUser?.workspace?.avatarUrl
            ? currentUser.workspace.avatarUrl
            : currentUser?.avatarUrl;
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

    const formatTimeOnly = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    // Group comments by calendar day
    const groupedComments = comments.reduce((groups, comment) => {
        const key = new Date(comment.createdAt).toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(comment);
        return groups;
    }, {});

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
                    <h2 className="modal-section-title">Todo Checklist</h2>
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
                    <h2 className="modal-section-title">Discussion & Comments</h2>
                    <div className="chat-container">
                        <div ref={chatContainerRef} className="chat-messages">
                            {comments.length === 0 && (
                                <p className="no-comments">
                                    No Comments Yet!
                                </p>
                            )}
                            {Object.entries(groupedComments).map(([dateKey, dayComments]) => (
                                <div key={dateKey}>
                                    <div className="chat-date-separator">
                                        <span>{formatDateLabel(dayComments[0].createdAt)}</span>
                                    </div>
                                    {dayComments.map((comment) => (
                                        <div key={comment.id} className={`chat-message ${comment.user?.id === currentUser?.id ? 'own' : ''}`}>
                                            <img
                                                src={comment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent((comment.user?.firstName || '') + ' ' + (comment.user?.lastName || ''))}&background=random`}
                                                alt={(comment.user?.firstName || '') + ' ' + (comment.user?.lastName || '')}
                                                className="chat-avatar"
                                            />
                                            <div className="chat-message-content">
                                                <div className="chat-message-header">
                                                    <span className="chat-user-name">
                                                        {(comment.user?.firstName || '') + ' ' + (comment.user?.lastName || '')}
                                                    </span>
                                                </div>
                                                <div className="chat-message-text">
                                                    {comment.task && (
                                                        <span className="chat-task-ref">re: {comment.task.title}</span>
                                                    )}
                                                    <div className="chat-bubble-row">
                                                        <span className="chat-text-body">{comment.content}</span>
                                                        <span className="chat-time">{formatTimeOnly(comment.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}

                        </div>

                        {/* Task selector + input */}
                        <form onSubmit={handleSendComment} className="chat-input-form">
                            <div className="chat-task-select-container">
                                <span className="chat-task-select-label">Regarding:</span>
                                <select
                                    value={selectedTaskId || ''}
                                    onChange={e => setSelectedTaskId(e.target.value)}
                                    className="chat-task-select"
                                >
                                    {taskData.checklist.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="chat-input-row">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newCommentText}
                                    onChange={e => setNewCommentText(e.target.value)}
                                    onFocus={handleInputFocus}
                                    className="chat-input"
                                />
                                <button type="submit" className="chat-send-btn" disabled={isSending}>
                                    <Send size={16} />
                                    <span>Send</span>
                                </button>
                            </div>
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