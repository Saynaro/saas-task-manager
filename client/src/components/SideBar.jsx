import { useState } from 'react';
import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Users, CheckCircle, Settings, Plus, LogOut, Activity } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import './SideBar.css';
import { apiFetch } from '../utils/apiFetch';
import { API_BASE_URL } from '../utils/config';

const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckCircle },
    { name: 'Activity Log', path: '/activity', icon: Activity },
    { name: 'Team Members', path: '/team', icon: Users },
];

export function SideBar({ isOpen, toggleMenu, openCreateModal, currentUser }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();

    // Filter nav links based on role
    const filteredNavLinks = navLinks.filter(link => {
        if (currentUser?.role === 'ADMIN') {
            return link.name === 'Dashboard'; // Only Dashboard for System Admins
        }
        return true;
    });

    const handleNavClick = (e, path) => {
        if (isOpen) {
            e.preventDefault();
            toggleMenu();
            setTimeout(() => {
                navigate(path);
            }, 300);
        }
    };

    const handleLogoutClick = () => {
        if (isOpen) {
            toggleMenu();
            setTimeout(() => {
                setIsConfirmOpen(true);
            }, 300);
        } else {
            setIsConfirmOpen(true);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            window.location.href = '/login';
        }
    };

    return (
        <>
            <div 
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
                onTouchMove={(e) => e.preventDefault()}
            ></div>

            <div 
                className={`sidebar ${isOpen ? 'open' : ''}`}
                onTouchMove={(e) => e.preventDefault()}
            >
                <div className="sidebar-main">
                    <div className="sidebar-header">
                        <h2>Task Manager</h2>
                        <button className="close-menu" onClick={toggleMenu}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="sidebar-action-container">
                        {(currentUser?.role === 'OWNER' || (currentUser?.role !== 'MEMBER' && currentUser?.workspace)) && (
                            <button className="sidebar-create-btn" onClick={openCreateModal}>
                                <Plus size={18} />
                                <span>Create Project</span>
                            </button>
                        )}
                    </div>

                    <ul>
                        {filteredNavLinks.map((link) => {
                            const IconComponent = link.icon;

                            return (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                    >
                                        <IconComponent size={20} className="nav-icon" />
                                        <span>{link.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}

                        <li className="sidebar-divider"></li>

                        <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={(e) => handleNavClick(e, '/settings')}
                            >
                                <Settings size={20} className="nav-icon" />
                                <span>Settings</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <button className="nav-logout-btn" onClick={handleLogoutClick}>
                        <LogOut size={20} className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Log out of account"
                message="Are you sure you want to log out? You will need to log back in to access your dashboard."
                confirmText="Logout"
                confirmVariant="logout"
            />
        </>
    );
}