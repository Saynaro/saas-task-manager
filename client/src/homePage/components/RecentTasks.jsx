import './RecentTasks.css';
import { ArrowRight } from 'lucide-react';

export function RecentTasks({ projects = [] }) {
    // Sort projects by createdAt descending and take top 7
    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 7);

    const getStatusColor = (status) => {
        switch (status) {
            case 'DONE': return 'status-done';
            case 'IN_PROGRESS': return 'status-progress';
            case 'TODO': return 'status-todo';
            default: return 'status-pending';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toUpperCase()) {
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            case 'LOW': return 'priority-low';
            default: return 'priority-low';
        }
    };

    return (
        <div className="recent-tasks-container">
            <div className="tasks-header">
                <h3>Recent Projects</h3>
                <button className="see-all-btn">
                    See All <ArrowRight size={14} />
                </button>
            </div>

            <div className="tasks-table-wrapper">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Created at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentProjects.map(project => (
                            <tr key={project.id}>
                                <td className="task-name-cell">{project.name}</td>
                                <td className="task-project-cell">{project.description || 'No description'}</td>
                                <td>
                                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <span className={`priority-badge ${getPriorityColor(project.priority)}`}>
                                        {project.priority}
                                    </span>
                                </td>
                                <td>
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
