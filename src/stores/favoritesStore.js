import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appStorage } from '../lib/storage.js'

// Referencia estable para usuarios sin favoritos: evita renders en bucle en los selectores.
export const NO_FAVORITES = Object.freeze([])

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      /** { [userId]: productId[] } */
      byUser: {},

      /** Devuelve true si el producto quedó en favoritos. */
      toggle: (userId, productId) => {
        const current = get().byUser[userId] ?? NO_FAVORITES
        const isFavorite = current.includes(productId)
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: isFavorite
              ? current.filter((id) => id !== productId)
              : [...current, productId],
          },
        }))
        return !isFavorite
      },
    }),
    {
      name: 'mangateca-favorites',
      version: 1,
      storage: appStorage,
      partialize: ({ byUser }) => ({ byUser }),
    },
  ),
)
