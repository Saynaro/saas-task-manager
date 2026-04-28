import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { ActiveProjects } from './components/ActiveProjects';
import { RecentActivity } from './components/RecentActivity';
import { Layout } from '../components/Layout';

import './HomePage.css';

export function HomePage() {
    return (
        <Layout>
            <div className="content-header">
                <div>
                    <h1>Overview</h1>
                    <p className='overview-text'>Here's what's happening with your projects today.</p>
                </div>
                <button className="add-task-btn"><Plus size={20} />New project</button>
            </div>

            {/* cards */}
            <Cards />

            <div className="second-container">
                {/* Section des projets */}
                <ActiveProjects />

                {/* Section activity */}
                <RecentActivity />
            </div>
        </Layout>
    );
}