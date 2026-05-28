import { Plus } from 'lucide-react';
import './TasksHeader.css';

export function TasksHeader({ tasks, activeFilter, setActiveFilter, onNewProject, currentUser }) {
    const all = tasks.length;
    const pending = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    const isMember = currentUser?.role === 'MEMBER';

    return (
        <div className="tasks-header">
            <div className="tasks-header-top">
                <h2>My Tasks</h2>
                {!isMember && (
                    <button className="new-project-btn" onClick={onNewProject}>
                        <Plus size={16} /> New Project
                    </button>
                )}
            </div>
            
            <div className="tasks-tabs">
                <button 
                    className={`tab-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('ALL')}
                >
                    All <span className={`tab-badge ${activeFilter === 'ALL' ? 'tab-badge-active' : ''}`}>{all}</span>
                </button>
                <button 
                    className={`tab-btn ${activeFilter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('PENDING')}
                >
                    Pending <span className={`tab-badge ${activeFilter === 'PENDING' ? 'tab-badge-active' : ''}`}>{pending}</span>
                </button>
                <button 
                    className={`tab-btn ${activeFilter === 'IN_PROGRESS' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('IN_PROGRESS')}
                >
                    In Progress <span className={`tab-badge ${activeFilter === 'IN_PROGRESS' ? 'tab-badge-active' : ''}`}>{inProgress}</span>
                </button>
                <button 
                    className={`tab-btn ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('COMPLETED')}
                >
                    Completed <span className={`tab-badge ${activeFilter === 'COMPLETED' ? 'tab-badge-active' : ''}`}>{completed}</span>
                </button>
            </div>
        </div>
    );
}
