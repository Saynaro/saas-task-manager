import { useState, useEffect } from 'react';
import { Layout } from "../components/Layout";
import { apiFetch } from '../utils/apiFetch';
import socket from '../utils/socket';
import { MessageSquare, CheckSquare, PlusSquare, AlertCircle, Calendar } from 'lucide-react';
import "./ActivityPage.css";

export function ActivityPage({ currentUser }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch activities based on page
    useEffect(() => {
        const fetchActivities = async () => {
            if (!currentUser?.workspace?.id) return;
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            try {
                const res = await apiFetch(`http://localhost:5001/api/workspaces/activity?page=${page}&limit=10`, {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    if (page === 1) {
                        setActivities(data.data || []);
                    } else {
                        setActivities(prev => [...prev, ...(data.data || [])]);
                    }
                    setHasMore(data.hasMore || false);
                }
            } catch (err) {
                console.error("Failed to fetch activities:", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchActivities();
    }, [currentUser?.workspace?.id, page]);

    // Separate socket listener to avoid double subscriptions
    useEffect(() => {
        if (!currentUser?.workspace?.id) return;

        socket.connect();
        socket.emit("join_workspace", currentUser?.workspace?.id);

        const handleNewActivity = (activity) => {
            setActivities((prev) => [activity, ...prev]);
        };

        socket.on("workspace_activity", handleNewActivity);

        return () => {
            socket.emit("leave_workspace", currentUser?.workspace?.id);
            socket.off("workspace_activity", handleNewActivity);
        };
    }, [currentUser?.workspace?.id]);

    const getActivityIcon = (action) => {
        switch (action) {
            case 'TASK_CREATED':
                return <PlusSquare size={16} className="activity-icon-svg create" />;
            case 'TASK_COMPLETED':
                return <CheckSquare size={16} className="activity-icon-svg complete" />;
            case 'TASK_UNCOMPLETED':
                return <AlertCircle size={16} className="activity-icon-svg uncomplete" />;
            case 'COMMENT_ADDED':
                return <MessageSquare size={16} className="activity-icon-svg comment" />;
            default:
                return <Calendar size={16} className="activity-icon-svg default" />;
        }
    };

    const formatActivityMessage = (activity) => {
        const userName = `${activity.user?.firstName || ''} ${activity.user?.lastName || ''}`.trim() || activity.user?.email || 'Someone';

        switch (activity.action) {
            case 'TASK_CREATED':
                return (
                    <span>
                        <strong>{userName}</strong> created checklist item <span className="highlight-text">"{activity.newValue}"</span>
                    </span>
                );
            case 'TASK_COMPLETED':
                return (
                    <span>
                        <strong>{userName}</strong> completed checklist item <span className="highlight-text">"{activity.task?.title}"</span>
                    </span>
                );
            case 'TASK_UNCOMPLETED':
                return (
                    <span>
                        <strong>{userName}</strong> marked checklist item <span className="highlight-text">"{activity.task?.title}"</span> as <strong>incomplete</strong>
                    </span>
                );
            case 'COMMENT_ADDED':
                return (
                    <span>
                        <strong>{userName}</strong> commented on <span className="highlight-text">"{activity.task?.title}"</span>: <span className="comment-preview">"{activity.newValue}"</span>
                    </span>
                );
            default:
                return <span><strong>{userName}</strong> performed an action</span>;
        }
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <Layout currentUser={currentUser}>
            <div className="activity-page-container">
                <div className="activity-page-header">
                    <h1>Activity Feed</h1>
                    <p className="activity-subtitle">Keep track of all actions across the workspace projects in real-time</p>
                </div>

                {loading ? (
                    <div className="activity-loading">
                        <div className="activity-spinner"></div>
                        <span>Loading activity logs...</span>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="activity-empty">
                        <Calendar size={48} className="empty-icon" />
                        <h3>No activities yet</h3>
                        <p>When members create checklist items, complete tasks, or comment, they will appear here.</p>
                    </div>
                ) : (
                    <div className="activity-timeline">
                        {activities.map((activity, index) => (
                            <div key={activity.id || index} className="activity-item-wrapper">
                                <div className="activity-timeline-node">
                                    <img
                                        src={activity.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${activity.user?.firstName || ''} ${activity.user?.lastName || ''}`)}&background=random`}
                                        alt={activity.user?.firstName || 'User'}
                                        className="activity-user-avatar"
                                    />
                                    <div className={`activity-icon-badge ${activity.action.toLowerCase().replace('_', '-')}`}>
                                        {getActivityIcon(activity.action)}
                                    </div>
                                </div>
                                <div className="activity-item-card">
                                    <div className="activity-body">
                                        <div className="activity-message">
                                            {formatActivityMessage(activity)}
                                        </div>
                                        <div className="activity-meta">
                                            {activity.task?.project?.name && (
                                                <span className="activity-project-tag">
                                                    {activity.task.project.name}
                                                </span>
                                            )}
                                            <span className="activity-time-stamp">
                                                {formatRelativeTime(activity.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="activity-show-more-container">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={loadingMore}
                            className="activity-show-more-btn"
                        >
                            {loadingMore ? 'Loading...' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}