import { useState } from 'react';
import { useLocation } from 'react-router';
import { Layout } from "../components/Layout"
import { TasksHeader } from "./components/TasksHeader"
import { TaskCards } from "./components/TaskCards"
import { data } from "../../data/data.js"
import "./TasksPage.css"

export function TasksPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    
    const [activeFilter, setActiveFilter] = useState('ALL');

    // Flatten tasks
    let tasks = data.workspaces.flatMap(ws =>
        ws.projects.flatMap(project =>
            project.tasks.map(task => ({
                ...task,
                projectName: project.name,
                projectId: project.id,
                assignee: task.assigneeId ? data.users.find(u => u.id === task.assigneeId) : null
            }))
        )
    );

    // Filter tasks if a projectId was provided via URL
    if (projectId) {
        tasks = tasks.filter(task => task.projectId === projectId);
    }

    const filteredTasks = tasks.filter(t => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return t.status === 'TODO';
        if (activeFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
        if (activeFilter === 'COMPLETED') return t.status === 'DONE';
        return true;
    });

    return (
        <Layout>
            <div className="tasks-page-content">
                <TasksHeader tasks={tasks} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                <TaskCards tasks={filteredTasks} />
            </div>
        </Layout>
    );
}