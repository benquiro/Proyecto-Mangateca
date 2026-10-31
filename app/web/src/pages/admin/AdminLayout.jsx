import { NavLink, Outlet } from 'react-router'
import { ShieldIcon } from '../../components/icons/index.jsx'
import { Container } from '../../components/layout/Container.jsx'
import { cn } from '../../lib/cn.js'
import { useProductsStore } from '../../stores/productsStore.js'
import { useUsersStore } from '../../stores/usersStore.js'

export default function AdminLayout() {
  const productCount = useProductsStore((state) => state.products.length)
  const userCount = useUsersStore((state) => state.users.length)

  const tabs = [
    { to: 'productos', label: 'Productos', count: productCount },
    { to: 'usuarios', label: 'Usuarios', count: userCount },
  ]

  return (
    <Container className="py-10">
      <title>Administración · Mangateca</title>
      <header>
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
          <ShieldIcon className="size-4" />
          Panel de administración
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Gestión de la tienda</h1>
      </header>

      <nav aria-label="Secciones de administración" className="mt-6 border-b border-gray-200">
        <ul className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-brand-700 text-brand-700'
                      : 'border-transparent text-gray-500 hover:text-gray-800',
                  )
                }
              >
                {tab.label}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 tabular-nums">
                  {tab.count}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </Container>
  )
}
