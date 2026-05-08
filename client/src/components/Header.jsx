import './Header.css';
import { Menu, Plus, ChevronDown } from 'lucide-react';
import { data } from '../../data/data.js';

export function Header({ toggleMenu, openWorkspaceModal, currentUser }) {
    // For demo purposes, we'll take the role of the first member of the first workspace
    const userRole = currentUser?.role || 'USER';

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="burger-btn" onClick={toggleMenu}>
                    <Menu size={24} color="#4f566b" />
                </button>

                {/* TODO: Implement Workspace Selector */}
                {/* <div className="workspace-selector">
                    <select className="workspace-select">
                        {data.workspaces.map(ws => (
                            <option key={ws.id} value={ws.id}>{ws.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>

                <button 
                    className="add-workspace-btn" 
                    title="Add New Workspace"
                    onClick={openWorkspaceModal}
                >
                    <Plus size={18} />
                    <span>Workspace</span>
                </button> */}

                <div className="workspace">
                    <h3>{currentUser?.workspace?.name || 'Your Workspace'}</h3>
                </div>
            </div>
            <div className="header-right">
                <div className="header-actions">
                    <i className="far fa-bell"></i>
                    <i className="far fa-question-circle"></i>
                </div>

                <div className="user-info">
                    <span className="user-role-badge">{userRole}</span>
                    <div className="profile-badge">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png" alt="User" />
                    </div>
                </div>
            </div>
        </header>
    );
}