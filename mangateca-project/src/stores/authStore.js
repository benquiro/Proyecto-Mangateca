import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appStorage } from '../lib/storage.js'
import { useCartStore } from './cartStore.js'
import { useUsersStore } from './usersStore.js'

/**
 * Solo se guarda el id del usuario en sesión (nunca la contraseña).
 * El usuario completo se obtiene de usersStore con `useCurrentUser`,
 * así un cambio de rol hecho por el admin se refleja al instante.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      currentUserId: null,

      /** Devuelve el usuario si las credenciales son correctas; null si no. */
      login: (identifier, password) => {
        const user = useUsersStore.getState().findByCredentials(identifier.trim(), password)
        if (!user) return null
        set({ currentUserId: user.id })
        return user
      },

      /** Crea un cliente e inicia sesión. Devuelve { errors } si el usuario o email ya existen. */
      register: ({ username, email, password }) => {
        const users = useUsersStore.getState()
        const errors = users.getConflicts({ username, email })
        if (Object.keys(errors).length > 0) return { errors }
        const user = users.addUser({ username, email, password, role: 'client' })
        set({ currentUserId: user.id })
        return { user }
      },

      logout: () => {
        set({ currentUserId: null })
        useCartStore.getState().clear()
      },
    }),
    {
      name: 'mangateca-auth',
      version: 1,
      storage: appStorage,
      partialize: ({ currentUserId }) => ({ currentUserId }),
    },
  ),
)
