import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCart } from '../useCart.js'
import { useCartStore } from '../../stores/cartStore.js'
import { useProductsStore } from '../../stores/productsStore.js'

describe('useCart (useCart.js)', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
    window.sessionStorage.clear()
  })

  it('retorna totales en cero y líneas vacías cuando no hay items', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.lines).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('calcula las líneas, count total y monto total exacto a pagar', () => {
    const sampleProducts = [
      { id: 101, title: 'Manga A', price: 10 },
      { id: 102, title: 'Libro B', price: 25 },
    ]
    useProductsStore.setState({ products: sampleProducts })

    useCartStore.getState().addItem(101, 2) // 2 * 10 = 20
    useCartStore.getState().addItem(102, 3) // 3 * 25 = 75

    const { result } = renderHook(() => useCart())

    expect(result.current.lines).toHaveLength(2)
    expect(result.current.count).toBe(5)
    expect(result.current.total).toBe(95)
    expect(result.current.lines[0].product.title).toBe('Manga A')
  })

  it('omite líneas de productos que fueron eliminados del catálogo por un admin', () => {
    const sampleProducts = [{ id: 201, title: 'Manga Existente', price: 15 }]
    useProductsStore.setState({ products: sampleProducts })

    useCartStore.getState().addItem(201, 1)
    useCartStore.getState().addItem(999, 2) // ID 999 no existe en el catálogo

    const { result } = renderHook(() => useCart())

    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0].productId).toBe(201)
    expect(result.current.count).toBe(1)
    expect(result.current.total).toBe(15)
  })
})
