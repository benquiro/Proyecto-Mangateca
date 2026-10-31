import { useAuthStore } from '../stores/authStore.js'
import { useUsersStore } from '../stores/usersStore.js'

/** Usuario en sesión resuelto desde usersStore (si el admin lo borra, la sesión deja de ser válida). */
export function useCurrentUser() {
  const currentUserId = useAuthStore((state) => state.currentUserId)
  const user = useUsersStore(
    (state) => state.users.find((candidate) => candidate.id === currentUserId) ?? null,
  )

  return {
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === 'admin',
  }
}
