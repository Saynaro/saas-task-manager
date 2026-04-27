import './ActiveProjects.css'

export function ActiveProjects() {
    return (
        <div className="projects-container">
            <div className="projects-header">
                <h3>Active Projects</h3>
                <button className="view-all-btn">View All</button>
            </div>
            <div className="projects-body">
                {/* Project 1 */}
                <div className="project-item">
                    <div className="project-info">
                        <div>
                            <p className="project-name">Project Phoenix Restructure</p>
                            <p className="project-client">Client: Acme Corp</p>
                        </div>
                        <span className="status-badge status-progress">In Progress</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-labels"><span>Progress</span><span>65%</span></div>
                        <div className="progress-bar-bg">
                            <div className="progress-fill" style={{ width: '65%', background: '#005DA9' }}></div>
                        </div>
                    </div>
                </div>

                {/* Project 2 */}
                <div className="project-item">
                    <div className="project-info">
                        <div>
                            <p className="project-name">Q3 Marketing Campaign</p>
                            <p className="project-client">Internal</p>
                        </div>
                        <span className="status-badge status-at-risk">At Risk</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-labels"><span>Progress</span><span>32%</span></div>
                        <div className="progress-bar-bg">
                            <div className="progress-fill" style={{ width: '32%', background: '#BA1A1A' }}></div>
                        </div>
                    </div>
                </div>

                {/* Project 3 */}
                <div className="project-item">
                    <div className="project-info">
                        <div>
                            <p className="project-name">Security Audit 2024</p>
                            <p className="project-client">Compliance</p>
                        </div>
                        <span className="status-badge status-planning">Planning</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-labels"><span>Progress</span><span>10%</span></div>
                        <div className="progress-bar-bg">
                            <div className="progress-fill" style={{ width: '10%', background: '#74777F' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}