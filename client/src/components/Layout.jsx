import { useState } from 'react';
import { Header } from './Header';
import { SideBar } from './SideBar';
import { TaskModal } from './TaskModal';
import { WorkspaceModal } from './WorkspaceModal';
import './Layout.css';

export function Layout({ children, currentUser, onSuccess }) {
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
                currentUser={currentUser}
            />

            <div className="first-container">
                <Header
                    toggleMenu={toggleMenu}
                    openWorkspaceModal={openWorkspaceModal}
                    currentUser={currentUser}
                />
                <main className="content">
                    {children}
                </main>
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                mode="create"
                onSuccess={onSuccess}
                currentUser={currentUser}
            />

            <WorkspaceModal
                isOpen={isWorkspaceModalOpen}
                onClose={() => setIsWorkspaceModalOpen(false)}
                currentUser={currentUser}
            />
        </div>
    );
}
