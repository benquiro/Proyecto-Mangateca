import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import LoginPage from '../LoginPage.jsx'
import { useAuthStore } from '../../stores/authStore.js'
import { useUsersStore } from '../../stores/usersStore.js'

describe('Página LoginPage (LoginPage.jsx)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    useUsersStore.setState({
      users: [
        { id: 1, username: 'admin', email: 'admin@mangateca.com', password: 'Admin_Manga2026!', role: 'admin' },
        { id: 2, username: 'cliente', email: 'cliente@mangateca.com', password: 'Cliente_Manga2026!', role: 'client' },
      ],
    })
    window.sessionStorage.clear()
  })

  it('renderiza el formulario con sus campos requeridos y botón de entrar', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Usuario o email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByText('Cuentas de prueba')).not.toBeInTheDocument()
  })

  it('muestra mensaje de error si se intenta enviar el formulario con campos vacíos', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const submitBtn = screen.getByRole('button', { name: 'Entrar' })
    await user.click(submitBtn)

    expect(await screen.findByText('Introduce tu usuario o email y tu contraseña.')).toBeInTheDocument()
  })

  it('muestra mensaje de error si las credenciales son incorrectas', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const userInput = screen.getByLabelText('Usuario o email')
    const passInput = screen.getByLabelText('Contraseña')
    const submitBtn = screen.getByRole('button', { name: 'Entrar' })

    await user.type(userInput, 'usuario_inexistente')
    await user.type(passInput, 'clave_erronea')
    await user.click(submitBtn)

    expect(await screen.findByText('Usuario o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('autentica correctamente al usuario ante credenciales válidas', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const userInput = screen.getByLabelText('Usuario o email')
    const passInput = screen.getByLabelText('Contraseña')
    const submitBtn = screen.getByRole('button', { name: 'Entrar' })

    await user.type(userInput, 'cliente')
    await user.type(passInput, 'Cliente_Manga2026!')
    await user.click(submitBtn)

    // Verifica que el store de autenticación se actualizó
    expect(useAuthStore.getState().currentUserId).toBe(2)
  })
})
