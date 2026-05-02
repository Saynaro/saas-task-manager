import { useState } from 'react';
import { Header } from './Header';
import { SideBar } from './SideBar';
import './Layout.css';

import { TaskModal } from './TaskModal';

export function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openTaskModal = () => {
        setIsTaskModalOpen(true);
        if (isMenuOpen) setIsMenuOpen(false); // Close sidebar on mobile after clicking
    };

    return (
        <div className="home-layout">
            <SideBar 
                isOpen={isMenuOpen} 
                toggleMenu={toggleMenu} 
                openCreateModal={openTaskModal} 
            />

            <div className="first-container">
                <Header toggleMenu={toggleMenu} />
                <main className="content">
                    {children}
                </main>
            </div>

            <TaskModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                mode="create" 
            />
        </div>
    );
}
