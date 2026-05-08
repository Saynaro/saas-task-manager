import { Layout } from "../components/Layout"
import { MemberCards } from "./components/MemberCards"
import { Plus } from 'lucide-react'
import { data } from "../../data/data.js"
import "./TeamPage.css"

export function TeamPage({ currentUser }) {
    // Flatten all nested tasks across all workspaces and projects
    const allTasks = data.workspaces.flatMap(ws => 
        ws.projects.flatMap(p => p.tasks)
    );

    // Map the users and calculate their tasks counts
    const members = data.users.map(user => {
        const userTasks = allTasks.filter(t => t.assigneeId === user.id);
        const pending = userTasks.filter(t => t.status === 'TODO').length;
        const inProgress = userTasks.filter(t => t.status === 'IN_PROGRESS').length;
        const completed = userTasks.filter(t => t.status === 'DONE').length;

        return {
            ...user,
            pending,
            inProgress,
            completed
        };
    });

    return (
        <Layout currentUser={currentUser}>
            <div className="teampage-content">
                <div className="teampage-header">
                    <h2>Team Members</h2>
                    {currentUser?.role === 'OWNER' && (
                        <button className="add-members-page-btn">
                            <Plus size={16} /> Add Members
                        </button>
                    )}
                </div>

                <MemberCards members={members} />
            </div>
        </Layout>
    );
}
