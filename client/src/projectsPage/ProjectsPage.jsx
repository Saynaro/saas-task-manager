import { Header } from "../components/Header"
import { SideBar } from "../components/SideBar"
import "./ProjectsPage.css"

export function ProjectsPage({ isMenuOpen, toggleMenu }) {
    return (
        <>
            <div className="home-layout">
                <SideBar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

                <div className="first-container">
                    <Header />
                    <div className="content projects-page-content">
                        <h1>Projects Page</h1>
                        <p>Projects Page</p>
                    </div>
                </div>
            </div>
        </>
    )
}