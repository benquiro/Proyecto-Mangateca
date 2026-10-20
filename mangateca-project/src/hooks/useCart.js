import { useMemo } from 'react'
import { useCartStore } from '../stores/cartStore.js'
import { useProductsStore } from '../stores/productsStore.js'

/** Líneas del carrito con su producto, total de unidades y total a pagar. */
export function useCart() {
  const items = useCartStore((state) => state.items)
  const products = useProductsStore((state) => state.products)

  return useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]))
    // Un producto eliminado por el admin desaparece del carrito.
    const lines = items
      .map((item) => ({ ...item, product: byId.get(item.productId) }))
      .filter((line) => line.product)
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    const total = lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0)
    return { lines, count, total }
  }, [items, products])
}
