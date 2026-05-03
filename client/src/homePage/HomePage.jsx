import { data } from '../../data/data.js';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { ActiveProjects } from './components/ActiveProjects';
import { RecentTasks } from './components/RecentTasks';
import { Layout } from '../components/Layout';
import { TaskModal } from '../components/TaskModal';

import './HomePage.css';

export function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Map workspaces to flatten projects and inject the workspace metadata
    const projects = data.workspaces.flatMap(ws =>
        ws.projects.map(p => ({
            ...p,
            workspace: { name: ws.name }
        }))
    );

    return (
        <Layout>
            <div className="content-header">
                <div>
                    <h1>Overview</h1>
                    <p className='overview-text'>Here's what's happening with your projects today.</p>
                </div>
                <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>New project</span>
                </button>
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
            />
        </Layout>
    );
}