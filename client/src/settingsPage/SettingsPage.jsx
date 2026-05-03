import { useState } from 'react';
import { Layout } from "../components/Layout"
import { WorkspaceSettings } from "./components/WorkspaceSettings"
import { AccountSettings } from "./components/AccountSettings"
import { data } from "../../data/data.js"
import "./SettingsPage.css"

export function SettingsPage() {
    const loggedInUser = data.users[0];
    const workspace = data.workspaces[0];

    const memberRecord = workspace.members.find(m => m.userId === loggedInUser.id);
    const isAdmin = memberRecord && memberRecord.role === "OWNER";

    const members = [
        ...workspace.members.map(member => {
            const user = data.users.find(u => u.id === member.userId);
            return { ...member, user, active: true };
        }),
        { id: 'mock1', role: 'MEMBER', active: false, user: { id: 'mocku1', firstName: 'Alice', lastName: 'Smith', email: 'alice@enterprise.com' } }
    ];

    const [viewAdmin, setViewAdmin] = useState(isAdmin);

    return (
        <Layout>
            <div className="settings-page-wrapper">
                {/* Dev Toggle — remove when backend auth is connected */}
                <div className="dev-toggle-bar">
                    <strong>View:</strong>
                    <div className="toggle-container">
                        <button
                            className={`dev-toggle-btn ${viewAdmin ? 'active' : ''}`}
                            onClick={() => setViewAdmin(true)}
                        >
                            Workspace (Admin)
                        </button>
                        <button
                            className={`dev-toggle-btn ${!viewAdmin ? 'active' : ''}`}
                            onClick={() => setViewAdmin(false)}
                        >
                            Account (User)
                        </button>
                    </div>
                </div>

                {viewAdmin ? (
                    <WorkspaceSettings workspace={workspace} members={members} />
                ) : (
                    <AccountSettings user={loggedInUser} />
                )}
            </div>
        </Layout>
    )
}