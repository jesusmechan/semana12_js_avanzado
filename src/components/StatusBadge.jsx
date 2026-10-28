import { getStatus } from '../constants'

export function StatusBadge({ status }) {
  const config = getStatus(status)

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
      <span className={`h-1.5 w-1.5 rounded-full ${config.accent}`} />
      {config.label}
    </span>
  )
}
