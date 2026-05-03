import { NavLink } from "react-router";
import { LayoutDashboard, Users, CheckCircle, History, Settings, Plus } from 'lucide-react';
import './SideBar.css';

const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckCircle },
    { name: 'Team Members', path: '/team', icon: Users },
    // { name: 'Activity', path: '/activity', icon: History },
];

export function SideBar({ isOpen, toggleMenu, openCreateModal }) {
    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Task Manager</h2>
                    <button className="close-menu" onClick={toggleMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="sidebar-action-container">
                    <button className="sidebar-create-btn" onClick={openCreateModal}>
                        <Plus size={18} />
                        <span>Create Project</span>
                    </button>
                </div>

                <ul>
                    {navLinks.map((link) => {
                        const IconComponent = link.icon;

                        return (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) => isActive ? 'active' : ''}
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
                        >
                            <Settings size={20} className="nav-icon" />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}