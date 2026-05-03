import './RecentTasks.css';
import { MoreHorizontal, ArrowRight } from 'lucide-react';

export function RecentTasks({ projects }) {
    // Collect all tasks from all projects
    const allTasks = projects.flatMap(project => 
        project.tasks.map(task => ({
            ...task,
            projectName: project.name
        }))
    ).slice(0, 7); // Taking first 7 for "Recent"

    const getStatusColor = (status) => {
        switch (status) {
            case 'DONE': return 'status-done';
            case 'IN_PROGRESS': return 'status-progress';
            case 'TODO': return 'status-todo';
            default: return 'status-pending';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            case 'LOW': return 'priority-low';
            default: return 'priority-low';
        }
    };

    return (
        <div className="recent-tasks-container">
            <div className="tasks-header">
                <h3>Recent Tasks</h3>
                <button className="see-all-btn">
                    See All <ArrowRight size={14} />
                </button>
            </div>
            
            <div className="tasks-table-wrapper">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTasks.map(task => (
                            <tr key={task.id}>
                                <td className="task-name-cell">{task.title}</td>
                                <td className="task-project-cell">{task.projectName}</td>
                                <td>
                                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button className="task-action-btn">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
