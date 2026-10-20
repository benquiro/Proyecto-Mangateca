import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCurrentUser } from '../useCurrentUser.js'
import { useAuthStore } from '../../stores/authStore.js'
import { useUsersStore } from '../../stores/usersStore.js'

describe('useCurrentUser (useCurrentUser.js)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    window.sessionStorage.clear()
  })

  it('devuelve valores por defecto para usuario no autenticado (anónimo)', () => {
    const { result } = renderHook(() => useCurrentUser())
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.isAdmin).toBe(false)
  })

  it('identifica correctamente a un usuario con rol de cliente', () => {
    useUsersStore.setState({
      users: [{ id: 10, username: 'cliente_test', role: 'client' }],
    })
    useAuthStore.setState({ currentUserId: 10 })

    const { result } = renderHook(() => useCurrentUser())
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.user?.username).toBe('cliente_test')
  })

  it('identifica correctamente a un usuario con rol de administrador', () => {
    useUsersStore.setState({
      users: [{ id: 99, username: 'admin_test', role: 'admin' }],
    })
    useAuthStore.setState({ currentUserId: 99 })

    const { result } = renderHook(() => useCurrentUser())
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.user?.role).toBe('admin')
  })
})
