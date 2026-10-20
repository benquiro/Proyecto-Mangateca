import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appStorage } from '../lib/storage.js'

export const MAX_QUANTITY = 10

const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity) || 1))

export const useCartStore = create(
  persist(
    (set) => ({
      /** [{ productId, quantity }] */
      items: [],

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: clamp(item.quantity + quantity) }
                  : item,
              ),
            }
          }
          return { items: [...state.items, { productId, quantity: clamp(quantity) }] }
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: clamp(quantity) } : item,
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'mangateca-cart',
      version: 1,
      storage: appStorage,
      partialize: ({ items }) => ({ items }),
    },
  ),
)
