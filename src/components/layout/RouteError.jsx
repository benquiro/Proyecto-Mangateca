import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { buttonClasses } from '../ui/buttonStyles.js'

/** Error inesperado en una ruta (p. ej. fallo al cargar el panel de administración). */
export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} · ${error.statusText}`
    : 'Ha ocurrido un error inesperado.'

  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <title>Error · Mangateca</title>
      <div>
        <img src="/favicon.svg" alt="" className="mx-auto size-16" />
        <h1 className="mt-6 text-2xl font-bold">Algo salió mal</h1>
        <p className="mt-2 text-gray-600">{message}</p>
        <Link to="/" reloadDocument className={buttonClasses({ className: 'mt-8' })}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
