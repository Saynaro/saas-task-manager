import { Routes, Route } from 'react-router'
import { HomePage } from './homePage/HomePage'

import { TasksPage } from './tasksPage/TasksPage'
import { SettingsPage } from './settingsPage/SettingsPage'
import { ActivityPage } from './activityPage/ActivityPage'
import { TeamPage } from './teamPage/TeamPage'

import { TaskDonutChart } from './homePage/Schema'

function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path='/tasks' element={<TasksPage />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/activity' element={<ActivityPage />}></Route>
        <Route path='/team' element={<TeamPage />}></Route>
        {/* <Route path="/task-donut-chart" element={<TaskDonutChart />} /> */}
      </Routes>
    </>

  )
}

export default App
