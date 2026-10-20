import { Navigate, Outlet, useLocation } from 'react-router'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'

// Guards de ruta: reaccionan al store, así que cerrar sesión
// estando en una página protegida redirige al instante.

/** Solo usuarios con sesión (cliente o admin). */
export function RequireAuth() {
  const { isLoggedIn } = useCurrentUser()
  const location = useLocation()
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

/** Solo administradores. Un cliente vuelve a la portada. */
export function RequireAdmin() {
  const { isLoggedIn, isAdmin } = useCurrentUser()
  const location = useLocation()
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

/**
 * Login y registro solo para invitados. Al iniciar sesión, este guard
 * redirige a la página de origen: es el único punto que decide adónde volver.
 */
export function GuestOnly() {
  const { isLoggedIn } = useCurrentUser()
  const location = useLocation()
  if (isLoggedIn) {
    const from = location.state?.from
    const to = from ? { pathname: from.pathname, search: from.search, hash: from.hash } : '/'
    return <Navigate to={to} replace />
  }
  return <Outlet />
}
