import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'

const links = [
  { to: '/', label: 'Inicio', icon: HomeIcon },
  { to: '/tareas', label: 'Tareas', icon: ListIcon },
  { to: '/kanban', label: 'Kanban', icon: BoardIcon },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const { stats, error, setError } = useTasks()

  return (
    <div className="flex h-dvh w-full bg-[radial-gradient(circle_at_top_left,#e0e7ff_0%,#eef2f7_38%,#f8fafc_100%)]">
      <div className="flex h-full w-full min-w-0">
        <aside className={`fixed inset-y-0 left-0 z-30 h-full w-72 transform bg-slate-950 text-white transition lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col px-5 py-6">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 font-bold">TB</div>
              <div>
                <p className="text-lg font-semibold">TaskBoard</p>
                <p className="text-xs text-slate-400">Semana 12 · JS Avanzado</p>
              </div>
            </div>

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon />
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-auto rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Resumen</p>
              <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
              <p className="text-sm text-slate-400">tareas persistidas en JSON</p>
            </div>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          />
        ) : null}

        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/60 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <MenuIcon />
            </button>
            <div>
              <p className="text-sm text-slate-500">Gestor de tareas con persistencia en archivo JSON</p>
              <h1 className="text-xl font-semibold text-slate-900">Organiza, mueve y guarda tu trabajo</h1>
            </div>
            <NavLink
              to="/tareas/nueva"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Nueva tarea
            </NavLink>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6 md:px-8">
            {error ? (
              <div className="mb-4 flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <p>{error}</p>
                <button type="button" onClick={() => setError('')} className="font-medium">
                  Cerrar
                </button>
              </div>
            ) : null}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" strokeLinejoin="round" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  )
}

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="10" rx="1" />
      <rect x="17" y="4" width="4" height="13" rx="1" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}
