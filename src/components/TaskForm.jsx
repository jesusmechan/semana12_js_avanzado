import { useEffect, useRef, useState } from 'react'
import { PRIORITIES, STATUSES } from '../constants'

const emptyForm = {
  title: '',
  description: '',
  status: 'pendiente',
  priority: 'media',
  dueDate: '',
}

export function TaskForm({ initialValues, onSubmit, submitLabel, saving }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  const [localError, setLocalError] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (initialValues) {
      setForm({ ...emptyForm, ...initialValues })
    }
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setLocalError('Escribe un título para la tarea.')
      titleRef.current?.focus()
      return
    }

    setLocalError('')
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {localError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{localError}</p> : null}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Título</span>
        <input
          ref={titleRef}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ej. Preparar la demo del Kanban"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Detalla el objetivo, criterios o notas de la tarea."
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Estado</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
          >
            {STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Prioridad</span>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Fecha límite</span>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-indigo-200 transition focus:bg-white focus:ring-4"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
