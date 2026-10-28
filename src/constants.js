export const STATUSES = [
  { id: 'pendiente', label: 'Pendiente', hint: 'Por empezar', accent: 'bg-slate-400', column: 'bg-slate-50' },
  { id: 'en_progreso', label: 'En progreso', hint: 'En ejecución', accent: 'bg-indigo-500', column: 'bg-indigo-50/70' },
  { id: 'revision', label: 'En revisión', hint: 'Por validar', accent: 'bg-violet-500', column: 'bg-violet-50/70' },
  { id: 'completada', label: 'Completada', hint: 'Listo', accent: 'bg-emerald-500', column: 'bg-emerald-50/70' },
]

export const PRIORITIES = [
  { id: 'baja', label: 'Baja', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  { id: 'media', label: 'Media', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { id: 'alta', label: 'Alta', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
]

export function getStatus(id) {
  return STATUSES.find((item) => item.id === id) ?? STATUSES[0]
}

export function getPriority(id) {
  return PRIORITIES.find((item) => item.id === id) ?? PRIORITIES[1]
}

export function formatDate(value) {
  if (!value) return 'Sin fecha'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
