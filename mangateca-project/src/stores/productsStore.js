import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seedProducts from '../../db/products.json'
import { appStorage } from '../lib/storage.js'

const maxId = (items) => items.reduce((max, item) => Math.max(max, item.id), 0)

export const useProductsStore = create(
  persist(
    (set, get) => ({
      products: seedProducts,
      // Contador monotónico: un id eliminado nunca se reutiliza,
      // así un carrito o favorito antiguo no apunta a un producto nuevo.
      lastId: maxId(seedProducts),

      addProduct: (data) => {
        const product = { ...data, id: get().lastId + 1 }
        set((state) => ({ products: [...state.products, product], lastId: product.id }))
        return product
      },

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...data, id } : product,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((product) => product.id !== id) })),
    }),
    {
      name: 'mangateca-products',
      version: 1,
      storage: appStorage,
      partialize: ({ products, lastId }) => ({ products, lastId }),
    },
  ),
)
