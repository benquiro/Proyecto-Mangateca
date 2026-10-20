import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { NAV_LINKS } from '../../data/navigation.js'
import { useCart } from '../../hooks/useCart.js'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { useFavoriteProducts } from '../../hooks/useFavorites.js'
import { cn } from '../../lib/cn.js'
import { useAuthStore } from '../../stores/authStore.js'
import { ROLES } from '../../stores/usersStore.js'
import { toast } from '../../stores/toastStore.js'
import {
  CartIcon,
  CloseIcon,
  HeartIcon,
  LogoutIcon,
  MenuIcon,
  ShieldIcon,
  UserIcon,
} from '../icons/index.jsx'
import { Container } from './Container.jsx'

const iconButtonClasses =
  'relative grid size-10 place-items-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900'

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { count: cartCount } = useCart()
  const favoritesCount = useFavoriteProducts().length
  const { isLoggedIn } = useCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          aria-label={mobileNavOpen ? 'Cerrar menú' : 'Abrir menú'}
          className={cn(iconButtonClasses, '-ml-2 md:hidden')}
        >
          {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
          <img src="/favicon.svg" alt="" width="36" height="36" className="size-9" />
          <span className="text-xl font-bold tracking-tight">Mangateca</span>
        </Link>

        <nav aria-label="Principal" className="ml-8 hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <UserMenu />
          <IconLink
            to="/favoritos"
            label={isLoggedIn ? `Favoritos (${favoritesCount})` : 'Favoritos'}
            count={isLoggedIn ? favoritesCount : 0}
          >
            <HeartIcon />
          </IconLink>
          <IconLink to="/carrito" label={`Carrito (${cartCount} artículos)`} count={cartCount}>
            <CartIcon />
          </IconLink>
        </div>
      </Container>

      {mobileNavOpen && (
        <nav id="mobile-nav" aria-label="Principal" className="border-t border-gray-200 md:hidden">
          <Container className="py-3">
            <ul className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-3 py-2.5 font-medium',
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}

function IconLink({ to, label, count, children }) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      title={label}
      className={({ isActive }) => cn(iconButtonClasses, isActive && 'text-brand-700')}
    >
      {children}
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-700 px-1 text-[11px] font-semibold text-white tabular-nums ring-2 ring-white"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </NavLink>
  )
}

function UserMenu() {
  const { user, isAdmin } = useCurrentUser()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useDismiss(menuRef, () => setOpen(false), open)

  if (!user) {
    return (
      <Link to="/login" aria-label="Iniciar sesión" title="Iniciar sesión" className={iconButtonClasses}>
        <UserIcon />
      </Link>
    )
  }

  // Primero se sale a la portada y después se cierra la sesión: si se cerrara antes,
  // el guard de una página protegida (favoritos, admin) redirigiría a /login.
  // flushSync confirma la navegación al instante (por defecto va en una transición).
  const handleLogout = async () => {
    setOpen(false)
    await navigate('/', { flushSync: true })
    logout()
    toast('Sesión cerrada. ¡Hasta pronto!', 'info')
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Cuenta de ${user.username}`}
        title={user.username}
        className={cn(iconButtonClasses, open && 'bg-gray-100')}
      >
        <UserIcon />
        <span
          aria-hidden="true"
          className="absolute right-1 bottom-1 size-2.5 rounded-full bg-brand-500 ring-2 ring-white"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.username}</p>
            <p className="truncate text-xs text-gray-500">
              {ROLES[user.role]} · {user.email}
            </p>
          </div>
          <ul className="py-1 text-sm">
            <li>
              <Link
                to="/favoritos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                <HeartIcon className="size-5" />
                Mis favoritos
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  <ShieldIcon className="size-5" />
                  Panel de administración
                </Link>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
              >
                <LogoutIcon className="size-5" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
