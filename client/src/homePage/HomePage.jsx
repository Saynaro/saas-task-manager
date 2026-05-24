
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { ActiveProjects } from './components/ActiveProjects';
import { RecentTasks } from './components/RecentTasks';
import { Layout } from '../components/Layout';
import { TaskModal } from '../components/TaskModal';

import './HomePage.css';
import { apiFetch } from '../utils/apiFetch';

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
                    <h1>Overview</h1>
                    <p className='overview-text'>Here's what's happening with your projects today.</p>
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
                    {/* Section des projets */}
                    <ActiveProjects projects={projects} />

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