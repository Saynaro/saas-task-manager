import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Users, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';
import './TaskModal.css';

export function TaskModal({ isOpen, onClose, task, mode = 'create', onSuccess, onDelete, currentUser }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: '2025-04-05',
        checklist: [],
        attachments: [],
        assignee: []
    });

    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isMember = currentUser?.role === 'MEMBER';
    const canManage = currentUser?.role === 'ADMIN' || (currentUser?.role === 'OWNER' && (mode === 'create' || task?.creatorId === currentUser?.id));
    
    // For members, let's keep it simple: if NOT admin/owner OR if is member
    const isReadOnly = isMember;

    useEffect(() => {
        if (task && mode === 'update') {
            setTaskData({
                title: task.name || task.title || '',
                description: task.description || '',
                priority: task.priority ? (task.priority.charAt(0) + task.priority.slice(1).toLowerCase()) : 'Medium',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '2025-04-05',
                checklist: task.tasks ? task.tasks.map((t, index) => ({
                    id: t.id || index,
                    text: t.title,
                    completed: t.status === 'DONE'
                })) : [],
                attachments: task.attachments || [],
                assignee: task.assignee ? [task.assignee] : []
            });
        } else {
            setTaskData({
                title: '',
                description: '',
                priority: 'Low',
                dueDate: '2025-04-05',
                checklist: [],
                attachments: [],
                assignee: []
            });
        }
    }, [task, mode, isOpen]);

    if (!isOpen) return null;

    const handleAddChecklist = () => {
        if (isReadOnly) return;
        if (newChecklistItem.trim()) {
            setTaskData({
                ...taskData,
                checklist: [...taskData.checklist, { id: Date.now(), text: newChecklistItem, completed: false }]
            });
            setNewChecklistItem('');
        }
    };

    const removeChecklist = (id) => {
        if (isReadOnly) return;
        setTaskData({
            ...taskData,
            checklist: taskData.checklist.filter(item => item.id !== id)
        });
    };

    const toggleChecklistCount = (id) => {
        setTaskData({
            ...taskData,
            checklist: taskData.checklist.map(item => 
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        });
    };

    const handleDeleteProject = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/projects/${task?.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.ok) {
                toast.success("Project deleted successfully");
                onDelete?.(task.id);
                onClose();
            } else {
                toast.error("Failed to delete project");
            }
        } catch (err) {
            toast.error("Error deleting project");
            console.error("Error deleting project:", err);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                name: taskData.title,
                description: taskData.description,
                priority: taskData.priority.toUpperCase(),
                dueDate: taskData.dueDate, // Will be parsed by new Date() in backend
                tasks: taskData.checklist.map(item => ({ title: item.text }))
            };

            const url = mode === 'create'
                ? "http://localhost:5001/api/projects"
                : `http://localhost:5001/api/projects/${task?.id}`;

            const method = mode === 'create' ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(mode === 'create' ? "Project created successfully" : "Project updated successfully");
                // call onSuccess callback to update the parent component
                onSuccess?.(data.data);
                onClose();

            } else {
                toast.error(`Failed to ${mode} project`);
            }
        } catch (err) {
            toast.error(`Error during ${mode}`);
            console.error(`Error submitting task for ${mode}:`, err);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'create' ? 'Create Task' : 'Update Task'}</h2>
                    <div className="modal-header-right">
                        {mode === 'update' && !isReadOnly && (
                            <button className="delete-task-btn" onClick={() => setIsConfirmOpen(true)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                        <button className="close-modal-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-form-group">
                        <label>Task Title</label>
                        <input
                            type="text"
                            className="modal-input"
                            placeholder="Create App UI"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Description</label>
                        <textarea
                            className="modal-textarea"
                            placeholder="Describe task"
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="modal-form-row">
                        <div className="modal-form-group flex-1">
                            <label>Priority</label>
                            <select
                                className="modal-select"
                                value={taskData.priority}
                                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                                disabled={isReadOnly}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="modal-form-group flex-1">
                            <label>Due Date</label>
                            <div className="input-with-icon">
                                <input
                                    type="date"
                                    className="modal-input"
                                    value={taskData.dueDate}
                                    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                                    disabled={isReadOnly}
                                />
                                <Calendar size={16} className="input-icon" />
                            </div>
                        </div>
                        <div className="modal-form-group flex-1">
                            <label>Assign To</label>
                            <div className="assignee-selector">
                                {mode === 'create' ? (
                                    <button className="add-members-btn">
                                        <Users size={16} /> Add Members
                                    </button>
                                ) : (
                                    <div className="avatar-group">
                                        <img src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                                        <img src="https://i.pravatar.cc/150?u=2" alt="avatar" />
                                        {currentUser?.role === 'OWNER' && (
                                            <button className="add-assignee-btn-circle" title="Add members">
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label>TODO Checklist</label>
                        <div className="checklist-items">
                            {taskData.checklist.map((item, index) => (
                                <div key={item.id} className="checklist-item">
                                    <div className="checklist-item-left">
                                        {currentUser?.role !== 'OWNER' && (
                                            <input 
                                                type="checkbox" 
                                                checked={item.completed} 
                                                onChange={() => toggleChecklistCount(item.id)}
                                                className="task-checkbox"
                                            />
                                        )}
                                        <span className={`item-text ${item.completed ? 'completed' : ''}`}>{item.text}</span>
                                    </div>
                                    {!isReadOnly && (
                                        <button className="remove-item-btn" onClick={() => removeChecklist(item.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!isReadOnly && (
                            <div className="add-checklist-row">
                                <input
                                    type="text"
                                    placeholder="Enter Task"
                                className="modal-input"
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
                            />
                            <button type="button" className="add-btn" onClick={handleAddChecklist}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        )}
                    </div>

                    <div className="modal-form-group">
                        <label>Add Attachments</label>
                        <div className="attachments-list">
                            {taskData.attachments.map(file => (
                                <div key={file.id} className="attachment-item">
                                    <Paperclip size={14} />
                                    <span className="file-name">{file.name}</span>
                                    <button className="remove-item-btn">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="add-attachment-row">
                            <div className="input-with-icon flex-1">
                                <input type="text" placeholder="Add File Link" className="modal-input" />
                                <Paperclip size={16} className="input-icon" />
                            </div>
                            <button className="add-btn">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="main-submit-btn" onClick={handleSubmit}>
                        {mode === 'create' ? 'CREATE TASK' : 'UPDATE TASK'}
                    </button>
                </div>

                <ConfirmationModal 
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteProject}
                    title="Delete Project"
                    message="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
                />
            </div>
        </div>
    );
}
