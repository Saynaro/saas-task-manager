import { Routes, Route } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { HomePage } from './homePage/HomePage'
import { LandingPage } from './landingPage/LandingPage'

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
import { Navigate } from 'react-router'

const PrivateRoute = ({ children, currentUser, isLoading }) => {
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontStyle: 'italic', color: '#64748b' }}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionRestored = useRef(false);

  useEffect(() => {
    if (sessionRestored.current) return;
    sessionRestored.current = true;

    const restoreSession = async () => {
      console.log("restoreSession started");
      try {
        const res = await fetch("http://localhost:5001/api/auth/refresh", {
          method: "POST",
          credentials: "include"
        });
        console.log("refresh response status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("accessToken received:", data.accessToken);
          setAccessToken(data.accessToken);

          const meRes = await fetch("http://localhost:5001/api/auth/me", {
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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const fetchCurrentUser = async () => {
    if (!currentUser) setIsLoading(true);
    try {
      const response = await apiFetch("http://localhost:5001/api/auth/me", {
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
