import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../authStore.js'
import { useCartStore } from '../cartStore.js'
import { useUsersStore } from '../usersStore.js'

describe('useAuthStore (authStore.js)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    useCartStore.getState().clear()
    window.sessionStorage.clear()
  })

  it('inicia sin usuario autenticado (currentUserId = null)', () => {
    expect(useAuthStore.getState().currentUserId).toBeNull()
  })

  it('inicia sesión correctamente con nombre de usuario válido', () => {
    // Cuenta admin semilla
    const user = useAuthStore.getState().login('admin', 'Admin_Manga2026!')
    expect(user).toBeDefined()
    expect(user?.username).toBe('admin')
    expect(useAuthStore.getState().currentUserId).toBe(user?.id)
  })

  it('inicia sesión correctamente con email e insensibilidad a mayúsculas/minúsculas', () => {
    const user = useAuthStore.getState().login('ADMIN@MANGATECA.COM', 'Admin_Manga2026!')
    expect(user).toBeDefined()
    expect(user?.role).toBe('admin')
    expect(useAuthStore.getState().currentUserId).toBe(user?.id)
  })

  it('rechaza login con credenciales erróneas y mantiene currentUserId en null', () => {
    const user = useAuthStore.getState().login('admin', 'PasswordEquivocada')
    expect(user).toBeNull()
    expect(useAuthStore.getState().currentUserId).toBeNull()
  })

  it('el cierre de sesión (logout) restablece currentUserId y vacía el carrito', () => {
    // Iniciar sesión y agregar producto
    useAuthStore.getState().login('cliente', 'Cliente_Manga2026!')
    useCartStore.getState().addItem(1, 2)
    expect(useCartStore.getState().items).toHaveLength(1)

    // Logout
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().currentUserId).toBeNull()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('permite registrar un nuevo cliente si no hay conflictos de username o email', () => {
    const unique = Date.now()
    const result = useAuthStore.getState().register({
      username: `user_${unique}`,
      email: `user_${unique}@test.com`,
      password: 'MiPassword123!',
    })
    expect(result.errors).toBeUndefined()
    expect(result.user).toBeDefined()
    expect(result.user?.role).toBe('client')
    expect(useAuthStore.getState().currentUserId).toBe(result.user?.id)
  })

  it('rechaza el registro si el nombre de usuario o email ya existen', () => {
    const result = useAuthStore.getState().register({
      username: 'admin', // Ya existe
      email: 'admin@mangateca.com', // Ya existe
      password: 'Password123!',
    })
    expect(result.errors).toBeDefined()
    expect(result.errors?.username).toBe('Ese nombre de usuario ya está en uso.')
    expect(result.errors?.email).toBe('Ese email ya está registrado.')
  })
})
