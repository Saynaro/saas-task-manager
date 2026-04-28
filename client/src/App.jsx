import { Routes, Route } from 'react-router'
import { HomePage } from './homePage/HomePage'
import { ProjectsPage } from './projectsPage/ProjectsPage'
import { TasksPage } from './tasksPage/TasksPage'
import { SettingsPage } from './settingsPage/SettingsPage'
import { ActivityPage } from './activityPage/ActivityPage'
import { KanbanPage } from './kanbanPage/KanbanPage'

import { TaskDonutChart } from './homePage/Schema'

function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/projects' element={<ProjectsPage />}></Route>
        <Route path='/tasks' element={<TasksPage />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/activity' element={<ActivityPage />}></Route>
        <Route path='/kanban' element={<KanbanPage />}></Route>
        {/* <Route path="/task-donut-chart" element={<TaskDonutChart />} /> */}
      </Routes>
    </>

  )
}

export default App
