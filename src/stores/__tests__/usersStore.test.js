import { beforeEach, describe, expect, it } from 'vitest'
import seedUsers from '../../../db/users.json'
import { useUsersStore } from '../usersStore.js'

describe('useUsersStore (usersStore.js)', () => {
  beforeEach(() => {
    // Restaurar usuarios iniciales
    useUsersStore.setState({
      users: seedUsers,
      lastId: seedUsers.reduce((max, u) => Math.max(max, u.id), 0),
    })
    window.sessionStorage.clear()
  })

  it('permite buscar usuario por username o email con findByCredentials', () => {
    const store = useUsersStore.getState()
    const byUser = store.findByCredentials('admin', 'Admin_Manga2026!')
    expect(byUser).not.toBeNull()
    expect(byUser?.username).toBe('admin')

    const byEmail = store.findByCredentials('cliente@mangateca.com', 'Cliente_Manga2026!')
    expect(byEmail).not.toBeNull()
    expect(byEmail?.username).toBe('cliente')
  })

  it('detecta conflictos de unicidad con getConflicts', () => {
    const store = useUsersStore.getState()
    const conflicts = store.getConflicts({ username: 'admin', email: 'cliente@mangateca.com' })
    expect(conflicts.username).toBe('Ese nombre de usuario ya está en uso.')
    expect(conflicts.email).toBe('Ese email ya está registrado.')
  })

  it('permite ignorar el propio usuario al editar usando excludeId', () => {
    const store = useUsersStore.getState()
    const adminUser = store.users.find((u) => u.username === 'admin')
    const conflicts = store.getConflicts(
      { username: 'admin', email: 'admin@mangateca.com' },
      adminUser?.id,
    )
    expect(conflicts).toEqual({})
  })

  it('permite agregar un nuevo usuario con addUser y genera un id autoincremental', () => {
    const store = useUsersStore.getState()
    const prevCount = store.users.length
    const newUser = store.addUser({
      username: 'nuevo_usuario',
      email: 'nuevo@mail.com',
      password: 'PassWord123!',
      role: 'client',
    })

    expect(newUser.id).toBeGreaterThan(0)
    expect(useUsersStore.getState().users.length).toBe(prevCount + 1)
  })

  it('impide que un administrador se degrade a sí mismo de rol', () => {
    const store = useUsersStore.getState()
    const adminUser = store.users.find((u) => u.role === 'admin')
    const error = store.updateUser(adminUser?.id, { role: 'client' }, adminUser?.id)
    expect(error).toBe('No puedes quitarte el rol de administrador a ti mismo.')
  })

  it('impide que un usuario elimine su propia cuenta', () => {
    const store = useUsersStore.getState()
    const clientUser = store.users.find((u) => u.username === 'cliente')
    const error = store.deleteUser(clientUser?.id, clientUser?.id)
    expect(error).toBe('No puedes eliminar tu propia cuenta.')
  })

  it('impide eliminar o degradar al único administrador del sistema', () => {
    const store = useUsersStore.getState()
    // Asegurar que hay solo 1 admin (el semilla)
    const adminUser = store.users.find((u) => u.role === 'admin')
    const otherUser = store.users.find((u) => u.id !== adminUser?.id)

    // Intento de degradar al único admin por un tercero
    const errorRole = store.updateUser(adminUser?.id, { role: 'client' }, otherUser?.id)
    expect(errorRole).toBe('Debe quedar al menos un administrador.')

    // Intento de eliminar al único admin por un tercero
    const errorDelete = store.deleteUser(adminUser?.id, otherUser?.id)
    expect(errorDelete).toBe('Debe quedar al menos un administrador.')
  })
})
