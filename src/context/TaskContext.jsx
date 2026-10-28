import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as tasksApi from '../api/tasksApi'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await tasksApi.fetchTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const addTask = useCallback(async (payload) => {
    setSaving(true)
    setError('')

    try {
      const created = await tasksApi.createTask(payload)
      setTasks((current) => [created, ...current.filter((task) => task.id !== created.id)])
      return created
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const editTask = useCallback(async (id, payload) => {
    setSaving(true)
    setError('')

    try {
      const updated = await tasksApi.updateTask(id, payload)
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const moveTask = useCallback(async (id, status) => {
    const previous = tasks
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    )

    try {
      const updated = await tasksApi.patchTask(id, { status })
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
      return updated
    } catch (err) {
      setTasks(previous)
      setError(err.message)
      throw err
    }
  }, [tasks])

  const deleteTask = useCallback(async (id) => {
    setSaving(true)
    setError('')

    try {
      await tasksApi.removeTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const getTaskById = useCallback(
    (id) => tasks.find((task) => task.id === id),
    [tasks],
  )

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pendiente: tasks.filter((task) => task.status === 'pendiente').length,
      en_progreso: tasks.filter((task) => task.status === 'en_progreso').length,
      revision: tasks.filter((task) => task.status === 'revision').length,
      completada: tasks.filter((task) => task.status === 'completada').length,
    }),
    [tasks],
  )

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      saving,
      stats,
      loadTasks,
      addTask,
      editTask,
      moveTask,
      deleteTask,
      getTaskById,
      setError,
    }),
    [tasks, loading, error, saving, stats, loadTasks, addTask, editTask, moveTask, deleteTask, getTaskById],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTaskContext debe usarse dentro de TaskProvider')
  }

  return context
}
