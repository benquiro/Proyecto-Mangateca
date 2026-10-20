import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seedUsers from '../../db/users.json'
import { appStorage } from '../lib/storage.js'

const maxId = (items) => items.reduce((max, item) => Math.max(max, item.id), 0)
const sameText = (a, b) => a.toLowerCase() === b.toLowerCase()
const countAdmins = (users) => users.filter((user) => user.role === 'admin').length

export const ROLES = {
  client: 'Cliente',
  admin: 'Administrador',
}

export const useUsersStore = create(
  persist(
    (set, get) => ({
      users: seedUsers,
      lastId: maxId(seedUsers),

      /** Acepta nombre de usuario o email, sin distinguir mayúsculas. */
      findByCredentials: (identifier, password) =>
        get().users.find(
          (user) =>
            (sameText(user.username, identifier) || sameText(user.email, identifier)) &&
            user.password === password,
        ) ?? null,

      /** Errores de unicidad. `excludeId` permite editar un usuario sin chocar consigo mismo. */
      getConflicts: ({ username, email }, excludeId = null) => {
        const others = get().users.filter((user) => user.id !== excludeId)
        const errors = {}
        if (others.some((user) => sameText(user.username, username))) {
          errors.username = 'Ese nombre de usuario ya está en uso.'
        }
        if (others.some((user) => sameText(user.email, email))) {
          errors.email = 'Ese email ya está registrado.'
        }
        return errors
      },

      addUser: ({ username, email, password, role = 'client' }) => {
        const user = {
          id: get().lastId + 1,
          username,
          email,
          password,
          role,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ users: [...state.users, user], lastId: user.id }))
        return user
      },

      /** Devuelve un mensaje de error si la operación no está permitida; null si se aplicó. */
      updateUser: (id, data, actingUserId) => {
        const { users } = get()
        const target = users.find((user) => user.id === id)
        if (!target) return 'El usuario no existe.'
        const losesAdmin = target.role === 'admin' && data.role && data.role !== 'admin'
        if (losesAdmin && id === actingUserId) {
          return 'No puedes quitarte el rol de administrador a ti mismo.'
        }
        if (losesAdmin && countAdmins(users) === 1) {
          return 'Debe quedar al menos un administrador.'
        }
        set({ users: users.map((user) => (user.id === id ? { ...user, ...data, id } : user)) })
        return null
      },

      /** Devuelve un mensaje de error si la operación no está permitida; null si se aplicó. */
      deleteUser: (id, actingUserId) => {
        const { users } = get()
        const target = users.find((user) => user.id === id)
        if (!target) return 'El usuario no existe.'
        if (id === actingUserId) return 'No puedes eliminar tu propia cuenta.'
        if (target.role === 'admin' && countAdmins(users) === 1) {
          return 'Debe quedar al menos un administrador.'
        }
        set({ users: users.filter((user) => user.id !== id) })
        return null
      },
    }),
    {
      name: 'mangateca-users',
      version: 1,
      storage: appStorage,
      partialize: ({ users, lastId }) => ({ users, lastId }),
    },
  ),
)
