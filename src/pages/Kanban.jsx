import { useCallback, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { TaskCard } from '../components/TaskCard'
import { STATUSES } from '../constants'
import { useTasks } from '../hooks/useTasks'

export function Kanban() {
  const { tasks, moveTask, loading } = useTasks()
  const [draggingId, setDraggingId] = useState('')

  const handleDrop = useCallback(
    async (event, status) => {
      event.preventDefault()
      const taskId = event.dataTransfer.getData('text/plain') || draggingId
      if (!taskId) return
      await moveTask(taskId, status)
      setDraggingId('')
    },
    [draggingId, moveTask],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Tablero Kanban</h2>
        <p className="text-sm text-slate-500">
          Arrastra una tarjeta a otra columna. El nuevo estado se guarda en <code>server/data/tasks.json</code>.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando tablero...</p>
      ) : tasks.length === 0 ? (
        <EmptyState title="El tablero está vacío" description="Crea una tarea para comenzar a organizar el flujo." />
      ) : (
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-3">
          {STATUSES.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id)

            return (
              <section
                key={column.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, column.id)}
                className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 p-3 ${column.column}`}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
                    <h3 className="font-semibold text-slate-800">{column.label}</h3>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">
                    {columnTasks.length}
                  </span>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div key={task.id} onDragStart={() => setDraggingId(task.id)}>
                      <TaskCard task={task} draggable compact />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
