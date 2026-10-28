import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { formatDate } from '../constants'
import { useTasks } from '../hooks/useTasks'

export function TaskEditor() {
  const { id } = useParams()
  const isCreate = !id
  const navigate = useNavigate()
  const { getTaskById, addTask, editTask, deleteTask, saving, loading } = useTasks()

  const task = useMemo(() => (id ? getTaskById(id) : null), [id, getTaskById])

  async function handleSubmit(payload) {
    if (isCreate) {
      const created = await addTask(payload)
      navigate(`/tareas/${created.id}`)
      return
    }

    await editTask(id, payload)
  }

  async function handleDelete() {
    const confirmed = window.confirm('¿Eliminar esta tarea? El cambio se escribirá en el archivo JSON.')
    if (!confirmed) return

    await deleteTask(id)
    navigate('/tareas')
  }

  if (!isCreate && loading && !task) {
    return <p className="text-sm text-slate-500">Buscando tarea...</p>
  }

  if (!isCreate && !task) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">Tarea no encontrada</h2>
        <p className="mt-2 text-sm text-slate-500">Es posible que haya sido eliminada del archivo JSON.</p>
        <Link to="/tareas" className="mt-4 inline-block text-sm font-medium text-indigo-600">
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-0 w-full max-w-3xl flex-1 space-y-5 overflow-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {isCreate ? 'Nueva tarea' : task.dueDate ? `Fecha límite: ${formatDate(task.dueDate)}` : 'Sin fecha límite'}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {isCreate ? 'Registrar tarea' : 'Editar tarea'}
          </h2>
        </div>
        {!isCreate ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            Eliminar
          </button>
        ) : null}
      </div>

      <TaskForm
        initialValues={task}
        onSubmit={handleSubmit}
        submitLabel={isCreate ? 'Crear y persistir' : 'Guardar cambios'}
        saving={saving}
      />
    </div>
  )
}
