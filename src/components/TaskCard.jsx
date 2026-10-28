import { Link } from 'react-router-dom'
import { formatDate } from '../constants'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

export function TaskCard({ task, draggable = false, compact = false }) {
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      className={`group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <Link to={`/tareas/${task.id}`} className="font-semibold text-slate-800 group-hover:text-indigo-700">
          {task.title}
        </Link>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && !compact ? (
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <StatusBadge status={task.status} />
        <span>{formatDate(task.dueDate)}</span>
      </div>
    </article>
  )
}
