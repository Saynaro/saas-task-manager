import { Routes, Route } from 'react-router'
import { HomePage } from './homePage/HomePage'
import { ProjectsPage } from './projectsPage/ProjectsPage'
import { TaskDonutChart } from './homePage/Schema'

function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/projects' element={<ProjectsPage />}></Route>
        {/* <Route path="/task-donut-chart" element={<TaskDonutChart />} /> */}
      </Routes>
    </>

  )
}

export default App
