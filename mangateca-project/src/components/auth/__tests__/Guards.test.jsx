import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { GuestOnly, RequireAdmin, RequireAuth } from '../Guards.jsx'
import { useAuthStore } from '../../../stores/authStore.js'
import { useUsersStore } from '../../../stores/usersStore.js'

describe('Guards de control de acceso y navegación (Guards.jsx)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    useUsersStore.setState({
      users: [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'cliente', role: 'client' },
      ],
    })
    window.sessionStorage.clear()
  })

  describe('RequireAuth', () => {
    const routes = [
      {
        path: '/favoritos',
        element: <RequireAuth />,
        children: [{ index: true, element: <div>Zona Favoritos</div> }],
      },
      {
        path: '/login',
        element: <div>Página de Login</div>,
      },
    ]

    it('redirige a /login cuando el usuario no está autenticado', () => {
      const router = createMemoryRouter(routes, { initialEntries: ['/favoritos'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Página de Login')).toBeInTheDocument()
      expect(screen.queryByText('Zona Favoritos')).not.toBeInTheDocument()
    })

    it('permite el acceso si el usuario está autenticado', () => {
      useAuthStore.setState({ currentUserId: 2 }) // cliente logueado
      const router = createMemoryRouter(routes, { initialEntries: ['/favoritos'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Zona Favoritos')).toBeInTheDocument()
    })
  })

  describe('RequireAdmin', () => {
    const routes = [
      {
        path: '/admin',
        element: <RequireAdmin />,
        children: [{ index: true, element: <div>Panel Admin</div> }],
      },
      {
        path: '/login',
        element: <div>Página de Login</div>,
      },
      {
        path: '/',
        element: <div>Portada Pública</div>,
      },
    ]

    it('redirige a /login cuando el usuario no tiene sesión iniciada', () => {
      const router = createMemoryRouter(routes, { initialEntries: ['/admin'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Página de Login')).toBeInTheDocument()
    })

    it('redirige a la portada / si el usuario está autenticado pero con rol client', () => {
      useAuthStore.setState({ currentUserId: 2 }) // cliente
      const router = createMemoryRouter(routes, { initialEntries: ['/admin'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Portada Pública')).toBeInTheDocument()
      expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument()
    })

    it('permite el acceso si el usuario tiene rol admin', () => {
      useAuthStore.setState({ currentUserId: 1 }) // admin
      const router = createMemoryRouter(routes, { initialEntries: ['/admin'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Panel Admin')).toBeInTheDocument()
    })
  })

  describe('GuestOnly', () => {
    const routes = [
      {
        path: '/login',
        element: <GuestOnly />,
        children: [{ index: true, element: <div>Formulario de Entrada</div> }],
      },
      {
        path: '/',
        element: <div>Portada Pública</div>,
      },
      {
        path: '/carrito',
        element: <div>Vista Carrito</div>,
      },
    ]

    it('permite el acceso al formulario de login para usuarios invitados', () => {
      const router = createMemoryRouter(routes, { initialEntries: ['/login'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Formulario de Entrada')).toBeInTheDocument()
    })

    it('redirige a la portada si el usuario ya tiene sesión iniciada y no tiene origen previo', () => {
      useAuthStore.setState({ currentUserId: 2 })
      const router = createMemoryRouter(routes, { initialEntries: ['/login'] })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Portada Pública')).toBeInTheDocument()
    })

    it('redirige a la página de origen especificada en location.state.from tras autenticarse', () => {
      useAuthStore.setState({ currentUserId: 2 })
      const router = createMemoryRouter(routes, {
        initialEntries: [{ pathname: '/login', state: { from: { pathname: '/carrito' } } }],
      })
      render(<RouterProvider router={router} />)

      expect(screen.getByText('Vista Carrito')).toBeInTheDocument()
    })
  })
})
