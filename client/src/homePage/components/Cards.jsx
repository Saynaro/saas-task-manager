import { Activity, CircleCheckBig, CircleDashed, TrendingUp } from 'lucide-react'
import './Cards.css'


export function Cards({ projects }) {
    const tasks = projects.flatMap(p => p.tasks || []);

    const activeTasks = tasks.filter(p => p.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter(p => p.status === 'DONE').length;
    const pendingTasks = tasks.filter(p => p.status === 'TODO').length;
    return (
        <div className="content-body">
            <div className="cards">
                <div className="active-tasks-card">
                    <div className="card-header">
                        <span className='active-icon'><Activity size={20} color='#005DA9' /></span>
                        <div className="trend-percentage">
                            <TrendingUp size={15} color='green' />
                            <span className='trend-percent'>20%</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Active Tasks</h3>
                        <p className='active-tasks-count'>{activeTasks}</p>
                    </div>
                </div>

                <div className="completed-tasks-card">
                    <div className="card-header">
                        <span className='completed-icon'><CircleCheckBig size={20} color='green' /></span>
                        <div className="trend-percentage">
                            <TrendingUp size={15} color='green' />
                            <span className='trend-percent'>20%</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Completed Tasks</h3>
                        <p className='completed-tasks-count'>{completedTasks}</p>
                    </div>
                </div>

                <div className="pending-tasks-card">
                    <div className="card-header">
                        <span className='pending-icon'><CircleDashed size={20} color='orange' /></span>
                        <div className="trend-percentage">
                            <TrendingUp size={15} color='green' />
                            <span className='trend-percent'>20%</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>Pending Tasks</h3>
                        <p className='pending-tasks-count'>{pendingTasks}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
