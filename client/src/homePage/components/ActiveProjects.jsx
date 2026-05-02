import './ActiveProjects.css'

export function ActiveProjects({ projects }) {

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h3>Active Projects</h3>
                <button className="view-all-btn">View All</button>
            </div>
            <div className="projects-body">
                {projects.map((project) => {
                    const totalTasks = project.tasks ? project.tasks.length : 0;
                    const completedTasks = project.tasks ? project.tasks.filter(t => t.status === "DONE").length : 0;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    let theme;
                    if (progress === 0) {
                        theme = { status: 'Planning', color: '#74777F', className: 'status-planning' };
                    } else if (progress < 60) {
                        theme = { status: 'At Risk', color: '#BA1A1A', className: 'status-at-risk' };
                    } else {
                        theme = { status: 'In Progress', color: '#005DA9', className: 'status-progress' };
                    }

                    return (
                        <div key={project.id} className="project-item">
                            <div className="project-info">
                                <div>
                                    <p className="project-name">{project.name}</p>
                                    <p className="project-client">{project.workspace?.name || 'No Workspace'}</p>
                                </div>
                                <span className={`status-badge ${theme.className}`}>{theme.status}</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-labels">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-fill" style={{ width: `${progress}%`, background: theme.color }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}