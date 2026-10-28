import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { TaskCard } from '../components/TaskCard'
import { PRIORITIES, STATUSES } from '../constants'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { useTasks } from '../hooks/useTasks'

export function TaskList() {
  const { tasks, loading } = useTasks()
  const { query, setQuery, status, setStatus, priority, setPriority, filtered, resetFilters } =
    useTaskFilters(tasks)

  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-auto">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tareas</h2>
          <p className="text-sm text-slate-500">Filtra, busca y edita. Cada cambio se refleja en el JSON.</p>
        </div>
        <Link
          to="/tareas/nueva"
          className="inline-flex w-fit rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Nueva tarea
        </Link>
      </div>

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título o descripción"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 focus:bg-white focus:ring-4 md:col-span-2"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
        >
          <option value="todas">Todos los estados</option>
          {STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
        >
          <option value="todas">Todas las prioridades</option>
          {PRIORITIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando tareas...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hay coincidencias"
          description="Prueba otro filtro o crea una tarea nueva."
          action={
            <button type="button" onClick={resetFilters} className="text-sm font-medium text-indigo-600">
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
