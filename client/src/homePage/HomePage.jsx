
import { useState, useEffect } from 'react';
import { Users, Globe, FolderOpen, UserCheck } from 'lucide-react';
import { Cards } from './components/Cards';
import { TaskDonutChart, TaskPriorityChart, AdminWorkspaceBarChart, AdminStatsDonut } from './Schema';
import { RecentTasks } from './components/RecentTasks';
import { Layout } from '../components/Layout';

import './HomePage.css';
import { apiFetch } from '../utils/apiFetch';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const getFormattedDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateVal = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    let suffix = 'th';
    if (dateVal === 1 || dateVal === 21 || dateVal === 31) suffix = 'st';
    else if (dateVal === 2 || dateVal === 22) suffix = 'nd';
    else if (dateVal === 3 || dateVal === 23) suffix = 'rd';
    
    return `${dayName} ${dateVal}${suffix} ${monthName} ${year}`;
};

export function HomePage({ currentUser, refreshUser }) {
    const [projects, setProjects] = useState([]);
    const [adminStats, setAdminStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.role === 'ADMIN') {
                try {
                    const res = await apiFetch("http://localhost:5001/api/admin/stats", {
                        credentials: "include"
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setAdminStats(data);
                    }
                } catch (err) {
                    console.error("Admin stats fetch error:", err);
                }
            } else {
                setProjects([]);
                try {
                    const response = await apiFetch("http://localhost:5001/api/projects", {
                        credentials: "include"
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setProjects(data.data || []);
                    }
                } catch (err) {
                    console.error("Projects fetch error:", err);
                }
            }
        };

        fetchData();
    }, [currentUser?.workspace?.id, currentUser?.role]);

    const handleProjectCreated = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
    };

    const isAdmin = currentUser?.role === 'ADMIN';

    // Derived admin totals
    const totalProjects = adminStats?.workspaces?.reduce((s, ws) => s + (ws.projectsCount || 0), 0) ?? 0;
    const totalMembers  = adminStats?.workspaces?.reduce((s, ws) => s + (ws.membersCount  || 0), 0) ?? 0;

    const adminStatCards = [
        { label: 'Total Users',        value: adminStats?.totalUsers ?? 0,      theme: 'card-total',     icon: <Users size={20} /> },
        { label: 'Active Workspaces',  value: adminStats?.totalWorkspaces ?? 0, theme: 'card-pending',   icon: <Globe size={20} /> },
        { label: 'Total Projects',     value: totalProjects,                    theme: 'card-progress',  icon: <FolderOpen size={20} /> },
        { label: 'Total Members',      value: totalMembers,                     theme: 'card-completed', icon: <UserCheck size={20} /> },
    ];

    return (
        <Layout currentUser={currentUser} onSuccess={handleProjectCreated} refreshUser={refreshUser}>
            <div className="content-header">
                <div>
                    <h1>{getGreeting()}! {currentUser?.firstName || ''} {currentUser?.lastName || ''}</h1>
                    <p className='overview-text'>{getFormattedDate()}</p>
                </div>
            </div>

            {/* ── ADMIN Dashboard ── */}
            {isAdmin ? (
                <div className="admin-dashboard">
                    {/* Stat Cards */}
                    <div className="admin-dash-cards">
                        {adminStatCards.map(card => (
                            <div key={card.label} className={`metric-card ${card.theme}`}>
                                <div className="card-accent" />
                                <div className="card-content">
                                    <div className="card-info">
                                        <span className="card-label">{card.label}</span>
                                        <h2 className="card-value">{card.value.toLocaleString()}</h2>
                                    </div>
                                    <div className="card-media">
                                        <div className="icon-wrapper">{card.icon}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="second-container">
                        <div className="charts-grid">
                            <AdminStatsDonut
                                totalUsers={adminStats?.totalUsers ?? 0}
                                totalWorkspaces={adminStats?.totalWorkspaces ?? 0}
                                totalProjects={totalProjects}
                            />
                            <AdminWorkspaceBarChart workspaces={adminStats?.workspaces ?? []} />
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Regular User Dashboard ── */
                <>
                    <Cards projects={projects} stats={null} />
                    <div className="second-container">
                        <div className="charts-grid">
                            <TaskDonutChart projects={projects} />
                            <TaskPriorityChart projects={projects} />
                        </div>
                        <RecentTasks projects={projects} />
                    </div>
                </>
            )}
        </Layout>
    );
}