import { beforeEach, describe, expect, it } from 'vitest'
import { MAX_QUANTITY, useCartStore } from '../cartStore.js'

describe('useCartStore (cartStore.js)', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
    window.sessionStorage.clear()
  })

  it('inicia con una lista de items vacía', () => {
    expect(useCartStore.getState().items).toEqual([])
  })

  it('permite añadir un nuevo producto con cantidad por defecto (1)', () => {
    useCartStore.getState().addItem(1)
    expect(useCartStore.getState().items).toEqual([{ productId: 1, quantity: 1 }])
  })

  it('permite añadir un producto con cantidad personalizada', () => {
    useCartStore.getState().addItem(5, 3)
    expect(useCartStore.getState().items).toEqual([{ productId: 5, quantity: 3 }])
  })

  it('incrementa la cantidad al añadir un producto ya existente', () => {
    useCartStore.getState().addItem(2, 2)
    useCartStore.getState().addItem(2, 3)
    expect(useCartStore.getState().items).toEqual([{ productId: 2, quantity: 5 }])
  })

  it('restringe la cantidad máxima acumulada a MAX_QUANTITY (10)', () => {
    useCartStore.getState().addItem(3, 8)
    useCartStore.getState().addItem(3, 5) // 8 + 5 = 13 -> límite 10
    expect(useCartStore.getState().items).toEqual([{ productId: 3, quantity: MAX_QUANTITY }])
  })

  it('permite modificar la cantidad de un ítem existente mediante setQuantity', () => {
    useCartStore.getState().addItem(4, 2)
    useCartStore.getState().setQuantity(4, 7)
    expect(useCartStore.getState().items).toEqual([{ productId: 4, quantity: 7 }])

    // Límite superior
    useCartStore.getState().setQuantity(4, 99)
    expect(useCartStore.getState().items).toEqual([{ productId: 4, quantity: MAX_QUANTITY }])

    // Límite inferior (mínimo 1)
    useCartStore.getState().setQuantity(4, 0)
    expect(useCartStore.getState().items).toEqual([{ productId: 4, quantity: 1 }])
  })

  it('elimina un ítem específico con removeItem', () => {
    useCartStore.getState().addItem(10, 2)
    useCartStore.getState().addItem(20, 1)

    useCartStore.getState().removeItem(10)
    expect(useCartStore.getState().items).toEqual([{ productId: 20, quantity: 1 }])
  })

  it('vacía todos los elementos con clear', () => {
    useCartStore.getState().addItem(1, 2)
    useCartStore.getState().addItem(2, 4)
    expect(useCartStore.getState().items.length).toBe(2)

    useCartStore.getState().clear()
    expect(useCartStore.getState().items).toEqual([])
  })
})
