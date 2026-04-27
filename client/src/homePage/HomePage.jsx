import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Cards } from './components/Cards';
import { ActiveProjects } from './components/ActiveProjects';
import { RecentActivity } from './components/RecentActivity';
import { SideBar } from '../components/SideBar';
import { Header } from '../components/Header';

import './HomePage.css';

export function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="home-layout">

            {/* sidebar */}
            <SideBar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            <div className="first-container">

                {/* header */}
                <Header toggleMenu={toggleMenu} />

                <main className="content">
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
                </main>
            </div>
        </div>
    );
}