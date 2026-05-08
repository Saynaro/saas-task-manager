
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { ActiveProjects } from './components/ActiveProjects';
import { RecentTasks } from './components/RecentTasks';
import { Layout } from '../components/Layout';
import { TaskModal } from '../components/TaskModal';

import './HomePage.css';

export function HomePage({ currentUser }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Map workspaces to flatten projects and inject the workspace metadata

    const [projects, setProjects] = useState([]);


    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch("http://localhost:5001/api/projects", {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            const data = await response.json();
            setProjects(data.data || []);
        };

        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
    };

    return (
        <Layout currentUser={currentUser} onSuccess={handleProjectCreated}>
            <div className="content-header">
                <div>
                    <h1>Overview</h1>
                    <p className='overview-text'>Here's what's happening with your projects today.</p>
                </div>
                {currentUser?.role !== 'MEMBER' && (
                    <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>New project</span>
                    </button>
                )}
            </div>

            {/* cards */}
            <Cards projects={projects} />

            <div className="second-container">
                {/* Section des projets */}
                <ActiveProjects projects={projects} />

                {/* Section tasks */}
                <RecentTasks projects={projects} />
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="create"
                onSuccess={handleProjectCreated}
            />
        </Layout>
    );
}