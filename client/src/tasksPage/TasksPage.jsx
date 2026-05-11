import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Layout } from "../components/Layout"
import { TasksHeader } from "./components/TasksHeader"
import { TaskCards } from "./components/TaskCards"
import { TaskModal } from "../components/TaskModal"
import { MemberTaskModal } from "../components/MemberTaskModal"
import "./TasksPage.css"

export function TasksPage({ currentUser, refreshUser }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');


    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser?.workspace?.id) {
                setLoading(false);
                return;
            }
            setProjects([]); // Clear old data
            setMembers([]); // Clear old data
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5001/api/projects", {
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            }
        };
        fetchProjects();
    }, [currentUser?.workspace?.id]);

    const handleProjectUpdate = (updatedProject) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const handleProjectDelete = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectClick = (project) => {
        setSelectedTask(project);
        setIsModalOpen(true);
    };


    const filteredProjects = projects.filter(p => {
        if (projectId && p.id !== projectId) return false;
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return p.status === 'TODO';
        if (activeFilter === 'IN_PROGRESS') return p.status === 'IN_PROGRESS';
        if (activeFilter === 'COMPLETED') return p.status === 'DONE';
        return true;
    });


    const handleProjectCreated = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
    };

    return (
        <Layout onSuccess={handleProjectCreated} currentUser={currentUser} refreshUser={refreshUser}>
            <div className="tasks-page-content">
                <TasksHeader tasks={projects} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                <TaskCards tasks={filteredProjects} onTaskClick={handleProjectClick} />

                {currentUser?.role === 'MEMBER' ? (
                    <MemberTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        task={selectedTask}
                        onSuccess={handleProjectUpdate}
                    />
                ) : (
                    <TaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        task={selectedTask}
                        mode="update"
                        onSuccess={handleProjectUpdate}
                        onDelete={handleProjectDelete}
                        currentUser={currentUser}
                    />
                )}
            </div>
        </Layout>
    );
}