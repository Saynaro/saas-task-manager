import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import socket from './utils/socket'
import { HomePage } from './homePage/HomePage'
import { LandingPage } from './landingPage/LandingPage'
import LegalPage from './landingPage/LegalPage'

import { TasksPage } from './tasksPage/TasksPage'
import { SettingsPage } from './settingsPage/SettingsPage'
import { ActivityPage } from './activityPage/ActivityPage'
import { TeamPage } from './teamPage/TeamPage'
import { RegisterPage } from './authPages/RegisterPage'
import { LoginPage } from './authPages/LoginPage'
import { OAuthCallbackPage } from './authPages/OauthCallbackPage'
import { ForgotPasswordPage } from './authPages/ForgotPasswordPage'
import { ResetPasswordPage } from './authPages/ResetPasswordPage'
import { VerifyEmailPage } from './authPages/VerifyEmailPage'

import { setAccessToken } from './utils/apiFetch'
import { apiFetch } from './utils/apiFetch'
import { Navigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PrivateRoute = ({ children, currentUser, isLoading }) => {
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontStyle: 'italic', color: '#64748b' }}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      sessionStorage.removeItem('shouldScrollToFooter');
    }
  }, [location.pathname]);

  const sessionRestored = useRef(false);

  useEffect(() => {
    if (sessionRestored.current) return;
    sessionRestored.current = true;

    const restoreSession = async () => {
      console.log("restoreSession started, target:", `${API_BASE_URL}/api/auth/refresh`);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });
        console.log("refresh response status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("accessToken received:", data.accessToken);
          setAccessToken(data.accessToken);

          const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
            credentials: "include",
            headers: { "Authorization": `Bearer ${data.accessToken}` }
          });
          console.log("me response status:", meRes.status);
          const meData = await meRes.json();
          console.log("user data:", meData);
          setCurrentUser(meData.data?.user || null);
        } else {
          console.log("refresh failed");
          setCurrentUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.log("restoreSession error:", err);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Connect socket and listen to workspace notifications globally
  useEffect(() => {
    if (!currentUser?.workspace?.id) return;

    socket.connect();
    socket.emit("join_workspace", currentUser.workspace.id);

    const handleWorkspaceActivity = (activity) => {
      // Don't show toast for current user's own actions
      if (activity.userId === currentUser.id) return;

      const userName = `${activity.user?.firstName || ''} ${activity.user?.lastName || ''}`.trim() || activity.user?.email || 'A member';

      let message;
      if (activity.action === "TASK_CREATED") {
        message = (
          <span>
            <strong>{userName}</strong> created checklist item <strong>"{activity.newValue}"</strong>
          </span>
        );
      } else if (activity.action === "TASK_COMPLETED") {
        message = (
          <span>
            <strong>{userName}</strong> completed checklist item <strong>"{activity.task?.title}"</strong>
          </span>
        );
      } else if (activity.action === "TASK_UNCOMPLETED") {
        message = (
          <span>
            <strong>{userName}</strong> uncompleted checklist item <strong>"{activity.task?.title}"</strong>
          </span>
        );
      } else if (activity.action === "COMMENT_ADDED") {
        const commentPreview = `"${activity.newValue.substring(0, 40)}${activity.newValue.length > 40 ? '...' : ''}"`;
        message = (
          <span>
            <strong>{userName}</strong> commented in <strong>"{activity.task?.title || 'a task'}"</strong>: <span>{commentPreview}</span>
          </span>
        );
      } else {
        message = (
          <span>
            <strong>{userName}</strong> performed an action
          </span>
        );
      }

      toast(message, {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e6c80cff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell-ring-icon lucide-bell-ring"
          >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M22 8c0-2.3-.8-4.3-2-6" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
          </svg>
        ),
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          color: '#1e293b',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          fontFamily: '"Outfit", "Inter", "Plus Jakarta Sans", "Segoe UI", sans-serif',
          fontSize: '14px',
          fontWeight: '400',
          padding: '12px 20px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
          maxWidth: '425px',
        },
      });
    };

    socket.on("workspace_activity", handleWorkspaceActivity);

    return () => {
      socket.emit("leave_workspace", currentUser.workspace.id);
      socket.off("workspace_activity", handleWorkspaceActivity);
      socket.disconnect();
    };
  }, [currentUser?.workspace?.id, currentUser?.id]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const fetchCurrentUser = async () => {
    if (!currentUser) setIsLoading(true);
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setCurrentUser(null);
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setCurrentUser(data.data.user);
      console.log("Current user fetched:", data.data.user);

    } catch (error) {
      console.error("Failed to fetch user:", error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontStyle: 'italic', color: '#64748b' }}>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage currentUser={currentUser} />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/dashboard" element={<PrivateRoute currentUser={currentUser} isLoading={isLoading}><HomePage currentUser={currentUser} refreshUser={fetchCurrentUser} /></PrivateRoute>} />
        <Route path='/tasks' element={<PrivateRoute currentUser={currentUser} isLoading={isLoading}><TasksPage currentUser={currentUser} refreshUser={fetchCurrentUser} /></PrivateRoute>} />
        <Route path='/settings' element={<PrivateRoute currentUser={currentUser} isLoading={isLoading}><SettingsPage currentUser={currentUser} refreshUser={fetchCurrentUser} /></PrivateRoute>} />
        <Route path='/activity' element={<PrivateRoute currentUser={currentUser} isLoading={isLoading}><ActivityPage currentUser={currentUser} refreshUser={fetchCurrentUser} /></PrivateRoute>} />
        <Route path='/team' element={<PrivateRoute currentUser={currentUser} isLoading={isLoading}><TeamPage currentUser={currentUser} refreshUser={fetchCurrentUser} /></PrivateRoute>} />
        <Route path='/register' element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/login' element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/oauth/callback' element={<OAuthCallbackPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/verify-email" element={<VerifyEmailPage refreshUser={fetchCurrentUser} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
