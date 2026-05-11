import { Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { HomePage } from './homePage/HomePage'

import { TasksPage } from './tasksPage/TasksPage'
import { SettingsPage } from './settingsPage/SettingsPage'
import { ActivityPage } from './activityPage/ActivityPage'
import { TeamPage } from './teamPage/TeamPage'
import { RegisterPage } from './authPages/RegisterPage'
import { LoginPage } from './authPages/LoginPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    if (!currentUser) setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/auth/me", {
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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontStyle: 'italic', color: '#64748b' }}>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} refreshUser={fetchCurrentUser} />} />
        <Route path='/tasks' element={<TasksPage currentUser={currentUser} refreshUser={fetchCurrentUser} />} />
        <Route path='/settings' element={<SettingsPage currentUser={currentUser} refreshUser={fetchCurrentUser} />} />
        <Route path='/activity' element={<ActivityPage currentUser={currentUser} refreshUser={fetchCurrentUser} />} />
        <Route path='/team' element={<TeamPage currentUser={currentUser} refreshUser={fetchCurrentUser} />} />
        <Route path='/register' element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/login' element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
