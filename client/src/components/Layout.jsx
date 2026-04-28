import { useState } from 'react';
import { Header } from './Header';
import { SideBar } from './SideBar';
import './Layout.css';

export function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="home-layout">
            <SideBar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            <div className="first-container">
                <Header toggleMenu={toggleMenu} />
                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
}
