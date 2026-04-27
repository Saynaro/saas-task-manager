import { NavLink } from "react-router";
import { LayoutDashboard, Briefcase, CheckCircle, Columns, History, Settings } from 'lucide-react';
import './SideBar.css';

const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckCircle },
    { name: 'Kanban', path: '/kanban', icon: Columns },
    { name: 'Activity', path: '/activity', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
];

export function SideBar({ isOpen, toggleMenu }) {
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
                </ul>
            </div>
        </>
    );
}