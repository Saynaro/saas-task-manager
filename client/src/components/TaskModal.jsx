import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Users, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmationModal } from './ConfirmationModal';
import './TaskModal.css';
import { apiFetch } from '../utils/apiFetch';

export function TaskModal({ isOpen, onClose, task, mode = 'create', onSuccess, onDelete, currentUser }) {
    const today = new Date().toISOString().split('T')[0];
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: today,
        checklist: [],
        attachments: [],
        assignee: []
    });

    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [workspaceMembers, setWorkspaceMembers] = useState([]);
    const [isMemberPickerOpen, setIsMemberPickerOpen] = useState(false);

    const isMember = currentUser?.role === 'MEMBER';
    const canManageValue = currentUser?.role === 'ADMIN' || currentUser?.role === 'OWNER';

    // For members, let's keep it simple: if NOT admin/owner OR if is member
    const isReadOnly = isMember;

    useEffect(() => {
        if (isOpen) {
            const fetchMembers = async () => {
                if (!currentUser?.workspace?.id) {
                    setWorkspaceMembers([]);
                    return;
                }
                try {
                    const res = await apiFetch("http://localhost:5001/api/workspaces/members", {
                        credentials: "include"
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setWorkspaceMembers(data);
                    }
                } catch (err) {
                    console.error("Error fetching workspace members:", err);
                }
            };
            fetchMembers();

            if (task && mode === 'update') {
                setTaskData({
                    title: task.name || task.title || '',
                    description: task.description || '',
                    priority: task.priority ? (task.priority.charAt(0) + task.priority.slice(1).toLowerCase()) : 'Medium',
                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : today,
                    checklist: task.tasks ? task.tasks.map((t, index) => ({
                        id: t.id || index,
                        text: t.title,
                        completed: t.status === 'DONE'
                    })) : [],
                    attachments: task.attachments || [],
                    assignee: task.members ? task.members.map(m => m.user.id) : []
                });
            } else {
                setTaskData({
                    title: '',
                    description: '',
                    priority: 'Low',
                    dueDate: today,
                    checklist: [],
                    attachments: [],
                    assignee: []
                });
            }
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

    const toggleMemberSelection = (memberId) => {
        setTaskData(prev => {
            const isSelected = prev.assignee.includes(memberId);
            if (isSelected) {
                return { ...prev, assignee: prev.assignee.filter(id => id !== memberId) };
            } else {
                return { ...prev, assignee: [...prev.assignee, memberId] };
            }
        });
    };

    const handleDeleteProject = async () => {
        try {
            const res = await apiFetch(`http://localhost:5001/api/projects/${task?.id}`, {
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
                tasks: taskData.checklist.map(item => ({ title: item.text })),
                memberIds: taskData.assignee
            };

            const url = mode === 'create'
                ? "http://localhost:5001/api/projects"
                : `http://localhost:5001/api/projects/${task?.id}`;

            const method = mode === 'create' ? "POST" : "PATCH";

            const res = await apiFetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(mode === 'create' ? "Project created successfully" : "Project updated successfully");
                onSuccess?.(data.data);
                onClose();

            } else {
                const errorData = await res.json();
                toast.error(errorData.error || `Failed to ${mode} project`);
            }
        } catch (err) {
            toast.error(`Error during ${mode}`);
            console.error(`Error submitting task for ${mode}:`, err);
        }
    };

    const getSelectedMembers = () => {
        return workspaceMembers.filter(m => taskData.assignee.includes(m.id));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'create' ? 'Create Project' : 'Update Project'}</h2>
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
                            <div className="assignee-selector-container">
                                {taskData.assignee.length === 0 ? (
                                    <button
                                        className="add-members-btn"
                                        onClick={() => setIsMemberPickerOpen(!isMemberPickerOpen)}
                                        disabled={isReadOnly}
                                    >
                                        <Users size={16} /> Add Members
                                    </button>
                                ) : (
                                    <div className="avatar-group" onClick={() => !isReadOnly && setIsMemberPickerOpen(!isMemberPickerOpen)}>
                                        {getSelectedMembers().map(member => (
                                            <img
                                                key={member.id}
                                                src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=random`}
                                                alt={member.fullName}
                                                title={member.fullName}
                                            />
                                        ))}
                                        {!isReadOnly && (
                                            <button className="add-assignee-btn-circle" title="Add members">
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {isMemberPickerOpen && (
                                    <div className="member-picker-dropdown">
                                        <div className="member-picker-header">
                                            <span>Select Members</span>
                                            <button onClick={() => setIsMemberPickerOpen(false)}><X size={14} /></button>
                                        </div>
                                        <div className="member-picker-list">
                                            {workspaceMembers.map(member => (
                                                <div
                                                    key={member.id}
                                                    className={`member-picker-item ${taskData.assignee.includes(member.id) ? 'selected' : ''}`}
                                                    onClick={() => toggleMemberSelection(member.id)}
                                                >
                                                    <img src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=random`} alt="" />
                                                    <div className="member-info">
                                                        <span className="member-name">{member.fullName}</span>
                                                        <span className="member-email">{member.email}</span>
                                                    </div>
                                                    {taskData.assignee.includes(member.id) && <Check size={16} className="check-icon" />}
                                                </div>
                                            ))}
                                            {workspaceMembers.length === 0 && <div className="no-members">No members in workspace</div>}
                                        </div>
                                        <div className="member-picker-footer">
                                            <button className="picker-ok-btn" onClick={() => setIsMemberPickerOpen(false)}>OK</button>
                                        </div>
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
                                        {currentUser?.role === 'MEMBER' && (
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
