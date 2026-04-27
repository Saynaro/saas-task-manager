import './Header.css';
import { Menu } from 'lucide-react';

export function Header({ toggleMenu }) {
    return (
        <header className="main-header">
            <div className="header-left">
                <button className="burger-btn" onClick={toggleMenu}>
                    <Menu size={24} color="#4f566b" />
                </button>
                <h3>SaaS Pro</h3>
            </div>
            <div className="header-right">
                <i className="far fa-bell"></i>
                <i className="far fa-question-circle"></i>
                <div className="profile-badge">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png" alt="User" />
                </div>
            </div>
        </header>
    );
}