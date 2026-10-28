import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-medium text-indigo-600">404</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Página no encontrada</h2>
      <p className="mt-2 text-sm text-slate-500">La ruta no existe en el router de la aplicación.</p>
      <Link to="/" className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Ir al inicio
      </Link>
    </div>
  )
}
