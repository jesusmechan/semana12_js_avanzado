import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TaskProvider } from './context/TaskContext'
import { Dashboard } from './pages/Dashboard'
import { Kanban } from './pages/Kanban'
import { NotFound } from './pages/NotFound'
import { TaskEditor } from './pages/TaskEditor'
import { TaskList } from './pages/TaskList'

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tareas" element={<TaskList />} />
            <Route path="/tareas/nueva" element={<TaskEditor />} />
            <Route path="/tareas/:id" element={<TaskEditor />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/tablero" element={<Navigate to="/kanban" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  )
}
