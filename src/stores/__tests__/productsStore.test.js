import { beforeEach, describe, expect, it } from 'vitest'
import seedProducts from '../../../db/products.json'
import { useProductsStore } from '../productsStore.js'

describe('useProductsStore (productsStore.js)', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: seedProducts,
      lastId: seedProducts.reduce((max, p) => Math.max(max, p.id), 0),
    })
    window.sessionStorage.clear()
  })

  it('permite añadir un nuevo producto con id autoincremental', () => {
    const store = useProductsStore.getState()
    const prevCount = store.products.length
    const initialLastId = store.lastId

    const newProd = store.addProduct({
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      price: 12.5,
      type: 'MANGA',
    })

    expect(newProd.id).toBe(initialLastId + 1)
    expect(useProductsStore.getState().products.length).toBe(prevCount + 1)
    expect(useProductsStore.getState().lastId).toBe(newProd.id)
  })

  it('permite actualizar un producto existente', () => {
    const store = useProductsStore.getState()
    const target = store.products[0]

    store.updateProduct(target.id, { price: 99.99, title: 'Título Modificado' })

    const updated = useProductsStore.getState().products.find((p) => p.id === target.id)
    expect(updated?.price).toBe(99.99)
    expect(updated?.title).toBe('Título Modificado')
  })

  it('permite eliminar un producto del catálogo', () => {
    const store = useProductsStore.getState()
    const target = store.products[0]
    const prevCount = store.products.length

    store.deleteProduct(target.id)

    expect(useProductsStore.getState().products.length).toBe(prevCount - 1)
    expect(useProductsStore.getState().products.some((p) => p.id === target.id)).toBe(false)
  })
})
