import { useState } from 'react';
import { Layout } from "../components/Layout"
import { WorkspaceSettings } from "./components/WorkspaceSettings"
import { AccountSettings } from "./components/AccountSettings"
import { data } from "../../data/data.js"
import "./SettingsPage.css"

export function SettingsPage() {
    // For demo purposes: find a user to login. By default u1.
    const loggedInUser = data.users[0];
    const workspace = data.workspaces[0];
    
    // Determine if logged in user is Owner or Admin of the workspace
    const memberRecord = workspace.members.find(m => m.userId === loggedInUser.id);
    const isAdmin = memberRecord && memberRecord.role === "OWNER";

    // Build rich membership list for WorkspaceSettings
    const members = [
        ...workspace.members.map(member => {
            const user = data.users.find(u => u.id === member.userId);
            return { ...member, user, active: true };
        }),
        // Add a mock invited member for demo purposes 
        { id: 'mock1', role: 'MEMBER', active: false, user: { id: 'mocku1', firstName: 'Alice', lastName: 'Smith', email: 'alice@enterprise.com' } }
    ];

    // Simple dev toggle to safely trigger both screens without logging in/out
    const [viewAdmin, setViewAdmin] = useState(isAdmin);

    return (
        <Layout>
            <div className="settings-page-wrapper">
                {/* 
                  Dev Toggle Panel to help you preview both designs safely. 
                  Remove this bar when you connect the real backend! 
                */}
                <div style={{ marginBottom: '30px', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
                    <strong>Developer UI Toggle:</strong>
                    <button style={{ padding: '6px 12px', background: viewAdmin ? '#2563eb' : 'white', color: viewAdmin ? 'white' : 'black', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setViewAdmin(true)}>Workspace View (Admin)</button>
                    <button style={{ padding: '6px 12px', background: !viewAdmin ? '#2563eb' : 'white', color: !viewAdmin ? 'white' : 'black', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setViewAdmin(false)}>Account View (User)</button>
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