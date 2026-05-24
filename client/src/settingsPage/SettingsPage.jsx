import { useState, useEffect } from 'react';
import { Layout } from "../components/Layout"
import { WorkspaceSettings } from "./components/WorkspaceSettings"
import { AccountSettings } from "./components/AccountSettings"
import { SuperAdminSettings } from "./components/SuperAdminSettings"
import "./SettingsPage.css"
import { apiFetch } from '../utils/apiFetch';

export function SettingsPage({ currentUser, refreshUser }) {
    const [workspaceMembers, setWorkspaceMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isSuperAdmin = currentUser?.role === 'ADMIN';
    const isOwner = currentUser?.role === 'OWNER';
    
    const fetchMembers = async () => {
        if (!currentUser?.workspace?.id) return;
        setWorkspaceMembers([]);
        setIsLoading(true);
        try {
            const res = await apiFetch("http://localhost:5001/api/workspaces/members", {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setWorkspaceMembers(data);
            }
        } catch (err) {
            console.error("Error fetching workspace members:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [currentUser?.workspace?.id]); 

    const handleUpdate = async () => {
        if (refreshUser) await refreshUser();
        await fetchMembers();
    };

    const renderContent = () => {
        if (isSuperAdmin) return <SuperAdminSettings />;
        if (isOwner) return <WorkspaceSettings workspace={currentUser?.workspace} members={workspaceMembers} onUpdate={handleUpdate} />;
        return <AccountSettings user={currentUser} onUpdate={refreshUser} />;
    };

    return (
        <Layout currentUser={currentUser} refreshUser={refreshUser}>
            <div className="settings-page-wrapper">
                {isLoading && isOwner ? (
                    <div className="loading-state">Loading settings...</div>
                ) : (
                    renderContent()
                )}
            </div>
        </Layout>
    );
}