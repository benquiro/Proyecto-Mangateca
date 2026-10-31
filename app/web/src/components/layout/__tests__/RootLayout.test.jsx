import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RootLayout } from '../RootLayout.jsx'

describe('Componente RootLayout (RootLayout.jsx)', () => {
  const routesConfig = [
    {
      path: '/',
      Component: RootLayout,
      children: [
        {
          index: true,
          Component: () => <div>Página de Inicio</div>,
        },
        {
          path: 'productos',
          Component: () => <div>Página de Productos</div>,
        },
        {
          path: 'login',
          handle: { hideFooter: true },
          Component: () => <div>Página de Login</div>,
        },
        {
          path: 'registro',
          handle: { hideFooter: true },
          Component: () => <div>Página de Registro</div>,
        },
        {
          path: 'admin',
          handle: { hideFooter: true },
          children: [
            {
              path: 'productos',
              Component: () => <div>Admin Productos</div>,
            },
          ],
        },
        {
          path: '*',
          handle: { hideFooter: true },
          Component: () => <div>Página 404</div>,
        },
      ],
    },
  ]

  it('muestra el footer genérico en la portada /', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Página de Inicio')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Explorar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument()
  })

  it('muestra el footer genérico en páginas de catálogo /productos', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/productos'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Página de Productos')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('NO muestra el footer genérico en la página de login /login', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/login'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Explorar' })).not.toBeInTheDocument()
  })

  it('NO muestra el footer genérico en la página de registro /registro', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/registro'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Página de Registro')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Explorar' })).not.toBeInTheDocument()
  })

  it('NO muestra el footer genérico en rutas administrativas /admin/productos', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/admin/productos'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Admin Productos')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('NO muestra el footer genérico en páginas no encontradas (404)', () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/ruta-inexistente'] })
    render(<RouterProvider router={router} />)

    expect(screen.getByText('Página 404')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})
