import { Activity, CircleCheckBig, CircleDashed, TrendingUp, TrendingDown, Briefcase } from 'lucide-react'
import { calculateMonthOverMonthChange } from '../../utils/statsUtils';
import './Cards.css'


export function Cards({ projects = [], stats = null }) {
    const totalProjects = stats ? stats.totalProjects : projects.length;
    const tasks = projects.flatMap(p => p.tasks || []);

    const activeTasksCount = stats ? stats.activeTasks : tasks.filter(p => p.status === 'IN_PROGRESS').length;
    const completedTasksCount = stats ? stats.completedTasks : tasks.filter(p => p.status === 'DONE').length;
    const pendingTasksCount = stats ? stats.pendingTasks : tasks.filter(p => p.status === 'TODO').length;
    
    // Use 0 growth if we are in admin mode for now, or fetch history later
    const projectGrowth = stats ? 0 : calculateMonthOverMonthChange(projects);
    const taskGrowth = stats ? 0 : calculateMonthOverMonthChange(tasks);

    const TrendIcon = ({ change }) => {
        if (change >= 0) return <TrendingUp size={15} color='green' />;
        return <TrendingDown size={15} color='red' />;
    };

    return (
        <div className="content-body">
            <div className="cards">
                <div className="total-projects-card">
                    <div className="card-header">
                        <span className='project-icon' style={{ background: '#e0f2fe', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                            <Briefcase size={20} color='#0ea5e9' />
                        </span>
                        <div className="trend-percentage">
                            <TrendIcon change={projectGrowth} />
                            <span className='trend-percent' style={{ color: projectGrowth >= 0 ? 'green' : 'red' }}>
                                {Math.abs(projectGrowth)}%
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Total Projects</h3>
                        <p className='active-tasks-count'>{totalProjects}</p>
                    </div>
                </div>

                <div className="active-tasks-card">
                    <div className="card-header">
                        <span className='active-icon'><Activity size={20} color='#005DA9' /></span>
                        <div className="trend-percentage">
                            <TrendIcon change={taskGrowth} />
                            <span className='trend-percent' style={{ color: taskGrowth >= 0 ? 'green' : 'red' }}>
                                {Math.abs(taskGrowth)}%
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Active Tasks</h3>
                        <p className='active-tasks-count'>{activeTasksCount}</p>
                    </div>
                </div>

                <div className="completed-tasks-card">
                    <div className="card-header">
                        <span className='completed-icon'><CircleCheckBig size={20} color='green' /></span>
                        <div className="trend-percentage">
                            <TrendIcon change={taskGrowth} />
                            <span className='trend-percent' style={{ color: taskGrowth >= 0 ? 'green' : 'red' }}>
                                {Math.abs(taskGrowth)}%
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Completed Tasks</h3>
                        <p className='completed-tasks-count'>{completedTasksCount}</p>
                    </div>
                </div>

                <div className="pending-tasks-card">
                    <div className="card-header">
                        <span className='pending-icon'><CircleDashed size={20} color='orange' /></span>
                        <div className="trend-percentage">
                            <TrendIcon change={taskGrowth} />
                            <span className='trend-percent' style={{ color: taskGrowth >= 0 ? 'green' : 'red' }}>
                                {Math.abs(taskGrowth)}%
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Pending Tasks</h3>
                        <p className='pending-tasks-count'>{pendingTasksCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
