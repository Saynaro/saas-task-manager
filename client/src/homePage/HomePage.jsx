
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { TaskDonutChart, TaskPriorityChart } from './Schema';
import { RecentTasks } from './components/RecentTasks';
import { Layout } from '../components/Layout';
import { TaskModal } from '../components/TaskModal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Map workspaces to flatten projects and inject the workspace metadata

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
                setProjects([]); // Clear old projects
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

    return (
        <Layout currentUser={currentUser} onSuccess={handleProjectCreated} refreshUser={refreshUser}>
            <div className="content-header">
                <div>
                    <h1>{getGreeting()}! {currentUser?.firstName || ''} {currentUser?.lastName || ''}</h1>
                    <p className='overview-text'>{getFormattedDate()}</p>
                </div>
                {(currentUser?.role === 'OWNER' || (currentUser?.role !== 'MEMBER' && currentUser?.workspace)) && (
                    <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>New project</span>
                    </button>
                )}
            </div>

            {/* cards */}
            <Cards projects={projects} stats={adminStats} />

            {currentUser?.role !== 'ADMIN' && (
                <div className="second-container">
                    {/* Charts Grid */}
                    <div className="charts-grid">
                        <TaskDonutChart projects={projects} />
                        <TaskPriorityChart projects={projects} />
                    </div>

                    {/* Section tasks */}
                    <RecentTasks projects={projects} />
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="create"
                onSuccess={handleProjectCreated}
            />
        </Layout>
    );
}