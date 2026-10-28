import { getPriority } from '../constants'

export function PriorityBadge({ priority }) {
  const config = getPriority(priority)

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}>
      {config.label}
    </span>
  )
}
