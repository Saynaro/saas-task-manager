import { useState } from 'react';
import { Header } from './Header';
import { SideBar } from './SideBar';
import { TaskModal } from './TaskModal';
import { WorkspaceModal } from './WorkspaceModal';
import './Layout.css';

export function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openTaskModal = () => {
        setIsTaskModalOpen(true);
        if (isMenuOpen) setIsMenuOpen(false); // Close sidebar on mobile after clicking
    };

    const openWorkspaceModal = () => {
        setIsWorkspaceModalOpen(true);
    };

    return (
        <div className="home-layout">
            <SideBar 
                isOpen={isMenuOpen} 
                toggleMenu={toggleMenu} 
                openCreateModal={openTaskModal} 
            />

            <div className="first-container">
                <Header 
                    toggleMenu={toggleMenu} 
                    openWorkspaceModal={openWorkspaceModal} 
                />
                <main className="content">
                    {children}
                </main>
            </div>

            <TaskModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                mode="create" 
            />

            <WorkspaceModal 
                isOpen={isWorkspaceModalOpen} 
                onClose={() => setIsWorkspaceModalOpen(false)} 
            />
        </div>
    );
}
