import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { TaskCard } from '../components/TaskCard'
import { STATUSES } from '../constants'
import { useTasks } from '../hooks/useTasks'

export function Dashboard() {
  const { tasks, stats, addTask, loading, saving } = useTasks()
  const [title, setTitle] = useState('')
  const navigate = useNavigate()

  const upcoming = useMemo(
    () =>
      [...tasks]
        .filter((task) => task.status !== 'completada')
        .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
        .slice(0, 4),
    [tasks],
  )

  async function handleQuickAdd(event) {
    event.preventDefault()
    if (!title.trim()) return

    const created = await addTask({
      title: title.trim(),
      description: '',
      status: 'pendiente',
      priority: 'media',
      dueDate: '',
    })

    setTitle('')
    navigate(`/tareas/${created.id}`)
  }

  return (
    <div className="min-h-0 flex-1 space-y-6 overflow-auto">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} note="Guardadas en tasks.json" />
        {STATUSES.map((status) => (
          <StatCard
            key={status.id}
            label={status.label}
            value={stats[status.id]}
            note={status.hint}
            accent={status.accent}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Crear rápido</h2>
          <p className="mt-1 text-sm text-slate-500">
            Escribe un título y la tarea se guarda de inmediato en el archivo JSON del servidor.
          </p>
          <form onSubmit={handleQuickAdd} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nueva tarea para hoy..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Guardar
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm text-slate-400">Conceptos aplicados</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>Hooks: estado, efecto, contexto, memo y hooks propios.</li>
            <li>Router: inicio, tareas, detalle y tablero Kanban.</li>
            <li>Tailwind: layout, tablero y tarjetas.</li>
            <li>Persistencia: API Express escribe `server/data/tasks.json`.</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Próximas tareas</h2>
          <Link to="/tareas" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Cargando tareas...</p>
        ) : upcoming.length === 0 ? (
          <EmptyState
            title="Aún no hay tareas pendientes"
            description="Crea la primera desde el formulario rápido o entra al listado completo."
            action={
              <Link to="/tareas/nueva" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                Crear tarea
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, note, accent }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {accent ? <span className={`h-2.5 w-2.5 rounded-full ${accent}`} /> : null}
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
    </article>
  )
}
