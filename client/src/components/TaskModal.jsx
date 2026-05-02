import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Users, Paperclip } from 'lucide-react';
import './TaskModal.css';

export function TaskModal({ isOpen, onClose, task, mode = 'create' }) {
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

    useEffect(() => {
        if (task && mode === 'update') {
            setTaskData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'Medium',
                dueDate: task.dueDate || '2025-04-05',
                checklist: task.checklist || [
                    { id: 1, text: 'Create Product Card', completed: false },
                    { id: 2, text: 'Develop Category Filter UI', completed: false }
                ],
                attachments: task.attachments || [
                    { id: 1, name: 'react.dev' }
                ],
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
        if (newChecklistItem.trim()) {
            setTaskData({
                ...taskData,
                checklist: [...taskData.checklist, { id: Date.now(), text: newChecklistItem, completed: false }]
            });
            setNewChecklistItem('');
        }
    };

    const removeChecklist = (id) => {
        setTaskData({
            ...taskData,
            checklist: taskData.checklist.filter(item => item.id !== id)
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'create' ? 'Create Task' : 'Update Task'}</h2>
                    <div className="modal-header-right">
                        {mode === 'update' && (
                            <button className="delete-task-btn">
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
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Description</label>
                        <textarea 
                            className="modal-textarea" 
                            placeholder="Describe task"
                            value={taskData.description}
                            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                        />
                    </div>

                    <div className="modal-form-row">
                        <div className="modal-form-group flex-1">
                            <label>Priority</label>
                            <select 
                                className="modal-select"
                                value={taskData.priority}
                                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
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
                                    onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
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
                                    <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="item-text">{item.text}</span>
                                    <button className="remove-item-btn" onClick={() => removeChecklist(item.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="add-checklist-row">
                            <input 
                                type="text" 
                                placeholder="Enter Task" 
                                className="modal-input"
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
                            />
                            <button className="add-btn" onClick={handleAddChecklist}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
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
                    <button className="main-submit-btn">
                        {mode === 'create' ? 'CREATE TASK' : 'UPDATE TASK'}
                    </button>
                </div>
            </div>
        </div>
    );
}
