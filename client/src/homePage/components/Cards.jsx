import { Activity, CircleCheckBig, CircleDashed, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { calculateMonthOverMonthChange } from '../../utils/statsUtils';
import './Cards.css';

export function Cards({ projects = [], stats = null }) {
    const totalProjectsCount = stats ? stats.totalProjects : projects.length;
    const activeProjectsCount = stats ? 0 : projects.filter(p => p.status === 'IN_PROGRESS').length;
    const completedProjectsCount = stats ? 0 : projects.filter(p => p.status === 'DONE').length;
    const pendingProjectsCount = stats ? 0 : projects.filter(p => p.status === 'TODO').length;
    
    // MoM growth calculation
    const projectGrowth = stats ? 0 : calculateMonthOverMonthChange(projects);

    const TrendBadge = ({ change }) => {
        const isPositive = change >= 0;
        return (
            <div className={`trend-badge ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(change)}%</span>
            </div>
        );
    };

    return (
        <div className="cards-wrapper">
            <div className="cards-grid-container">
                {/* Total Projects Card */}
                <div className="metric-card card-total">
                    <div className="card-accent" />
                    <div className="card-content">
                        <div className="card-info">
                            <span className="card-label">Total Projects</span>
                            <h2 className="card-value">{totalProjectsCount}</h2>
                        </div>
                        <div className="card-media">
                            <div className="icon-wrapper">
                                <Layers size={20} />
                            </div>
                            <TrendBadge change={projectGrowth} />
                        </div>
                    </div>
                </div>

                {/* Pending Projects Card */}
                <div className="metric-card card-pending">
                    <div className="card-accent" />
                    <div className="card-content">
                        <div className="card-info">
                            <span className="card-label">Pending Projects</span>
                            <h2 className="card-value">{pendingProjectsCount}</h2>
                        </div>
                        <div className="card-media">
                            <div className="icon-wrapper">
                                <CircleDashed size={20} />
                            </div>
                            <TrendBadge change={projectGrowth} />
                        </div>
                    </div>
                </div>

                {/* In Progress Card */}
                <div className="metric-card card-progress">
                    <div className="card-accent" />
                    <div className="card-content">
                        <div className="card-info">
                            <span className="card-label">In Progress</span>
                            <h2 className="card-value">{activeProjectsCount}</h2>
                        </div>
                        <div className="card-media">
                            <div className="icon-wrapper">
                                <Activity size={20} />
                            </div>
                            <TrendBadge change={projectGrowth} />
                        </div>
                    </div>
                </div>

                {/* Completed Projects Card */}
                <div className="metric-card card-completed">
                    <div className="card-accent" />
                    <div className="card-content">
                        <div className="card-info">
                            <span className="card-label">Completed Projects</span>
                            <h2 className="card-value">{completedProjectsCount}</h2>
                        </div>
                        <div className="card-media">
                            <div className="icon-wrapper">
                                <CircleCheckBig size={20} />
                            </div>
                            <TrendBadge change={projectGrowth} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
