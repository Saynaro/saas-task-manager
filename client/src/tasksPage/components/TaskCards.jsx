import { Paperclip } from 'lucide-react';
import './TaskCards.css';

export function TaskCards({ tasks, onTaskClick }) {
    const getStatusTheme = (status) => {
        if (status === 'IN_PROGRESS') return { bg: '#e0f2fe', color: '#0891b2', border: '#06b6d4', text: 'In Progress' };
        if (status === 'DONE') return { bg: '#dcfce7', color: '#16a34a', border: '#22c55e', text: 'Completed' };
        return { bg: '#f3e8ff', color: '#9333ea', border: '#a855f7', text: 'Pending' };
    };

    const getPriorityTheme = (priority) => {
        if (priority === 'HIGH') return { bg: '#fce7f3', color: '#db2777', text: 'High Priority' };
        if (priority === 'MEDIUM') return { bg: '#fef08a', color: '#ca8a04', text: 'Medium Priority' };
        return { bg: '#dcfce7', color: '#16a34a', text: 'Low Priority' };
    };

    return (
        <div className="task-cards-grid">
            {tasks.map(task => {
                const sTheme = getStatusTheme(task.status);
                const pTheme = getPriorityTheme(task.priority);
                
                const tasksList = task.tasks || [];
                const totalNum = tasksList.length;
                const doneNum = tasksList.filter(t => t.status === 'DONE').length;
                const pct = totalNum > 0 ? (doneNum / totalNum) * 100 : 0;

                return (
                    <div className="task-card" key={task.id} onClick={() => onTaskClick(task)} style={{ cursor: 'pointer' }}>
                        <div className="task-card-badges">
                            <span className="card-badge" style={{ backgroundColor: sTheme.bg, color: sTheme.color }}>
                                {sTheme.text}
                            </span>
                            <span className="card-badge" style={{ backgroundColor: pTheme.bg, color: pTheme.color }}>
                                {pTheme.text}
                            </span>
                        </div>

                        <div className="task-card-content" style={{ borderLeft: `4px solid ${sTheme.border}` }}>
                            <h4>{task.name || task.title}</h4>
                            <p className="task-desc">{task.description}</p>
                            
                            <div className="task-progress-text">
                                Task Done: <strong>{doneNum} / {totalNum}</strong>
                            </div>
                            <div className="task-progress-bar">
                                <div className="task-progress-fill" style={{ width: `${pct}%`, backgroundColor: sTheme.border }}></div>
                            </div>
                        </div>

                        <div className="task-card-dates">
                            <div className="date-block">
                                <span className="date-label">Start Date</span>
                                <span className="date-value">{new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="date-block text-right">
                                <span className="date-label">Due Date</span>
                                <span className="date-value">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}</span>
                            </div>
                        </div>

                        <div className="task-card-footer">
                            <div className="card-avatar-group">
                                {task.assignee ? (
                                     <img src={`https://i.pravatar.cc/150?u=${task.assignee.id}`} alt="avatar" />
                                ) : (
                                    <>
                                        <img src="https://i.pravatar.cc/150?u=12" alt="avatar" />
                                        <img src="https://i.pravatar.cc/150?u=23" alt="avatar" />
                                    </>
                                )}
                            </div>
                            <div className="attachment-badge">
                                <Paperclip size={14} /> {Math.floor(Math.random() * 4) + 1}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
