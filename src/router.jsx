import { createBrowserRouter, Navigate } from 'react-router'
import { GuestOnly, RequireAdmin, RequireAuth } from './components/auth/Guards.jsx'
import { PageLoader } from './components/layout/PageLoader.jsx'
import { RootLayout } from './components/layout/RootLayout.jsx'
import { RouteError } from './components/layout/RouteError.jsx'
import CartPage from './pages/CartPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

// El panel de administración se carga bajo demanda: los clientes no descargan su código.
const lazyPage = (load) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: PageLoader,
    children: [
      { index: true, Component: HomePage },
      { path: 'productos', element: <CatalogPage key="ALL" /> },
      { path: 'libros', element: <CatalogPage key="BOOK" type="BOOK" /> },
      { path: 'mangas', element: <CatalogPage key="MANGA" type="MANGA" /> },
      { path: 'comics', element: <CatalogPage key="COMIC" type="COMIC" /> },
      { path: 'carrito', Component: CartPage },
      {
        Component: RequireAuth,
        children: [{ path: 'favoritos', Component: FavoritesPage }],
      },
      {
        Component: GuestOnly,
        children: [
          { path: 'login', Component: LoginPage },
          { path: 'registro', Component: RegisterPage },
        ],
      },
      {
        path: 'admin',
        Component: RequireAdmin,
        children: [
          {
            lazy: lazyPage(() => import('./pages/admin/AdminLayout.jsx')),
            children: [
              { index: true, element: <Navigate to="productos" replace /> },
              { path: 'productos', lazy: lazyPage(() => import('./pages/admin/AdminProductsPage.jsx')) },
              { path: 'usuarios', lazy: lazyPage(() => import('./pages/admin/AdminUsersPage.jsx')) },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
