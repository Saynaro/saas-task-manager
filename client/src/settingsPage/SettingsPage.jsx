import { Layout } from "../components/Layout"
import { WorkspaceSettings } from "./components/WorkspaceSettings"
import { AccountSettings } from "./components/AccountSettings"
import { SuperAdminSettings } from "./components/SuperAdminSettings"
import { data } from "../../data/data.js"
import "./SettingsPage.css"

export function SettingsPage({ currentUser }) {
    // Determine which settings to show based on Role
    const isSuperAdmin = currentUser?.role === 'ADMIN';
    const isOwner = currentUser?.role === 'OWNER';
    const isMember = currentUser?.role === 'MEMBER';

    // Temporary data integration - in real app from currentUser
    const loggedInUser = currentUser || data.users[0];
    const workspace = data.workspaces[0];

    const members = workspace.members.map(member => {
        const user = data.users.find(u => u.id === member.userId);
        return { ...member, user, active: true };
    });

    const renderContent = () => {
        if (isSuperAdmin) return <SuperAdminSettings />;
        if (isOwner) return <WorkspaceSettings workspace={workspace} members={members} />;
        return <AccountSettings user={loggedInUser} />;
    };

    return (
        <Layout currentUser={currentUser}>
            <div className="settings-page-wrapper">
                {renderContent()}
            </div>
        </Layout>
    );
}