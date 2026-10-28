import { useMemo, useState } from 'react'

export function useTaskFilters(tasks) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('todas')
  const [priority, setPriority] = useState('todas')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesQuery =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      const matchesStatus = status === 'todas' || task.status === status
      const matchesPriority = priority === 'todas' || task.priority === priority

      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [tasks, query, status, priority])

  function resetFilters() {
    setQuery('')
    setStatus('todas')
    setPriority('todas')
  }

  return {
    query,
    setQuery,
    status,
    setStatus,
    priority,
    setPriority,
    filtered,
    resetFilters,
  }
}
