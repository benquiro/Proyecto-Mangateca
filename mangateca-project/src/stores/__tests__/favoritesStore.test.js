import { beforeEach, describe, expect, it } from 'vitest'
import { NO_FAVORITES, useFavoritesStore } from '../favoritesStore.js'

describe('useFavoritesStore (favoritesStore.js)', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ byUser: {} })
    window.sessionStorage.clear()
  })

  it('inicia con una referencia estable NO_FAVORITES para usuarios sin favoritos', () => {
    const store = useFavoritesStore.getState()
    expect(store.byUser[999] ?? NO_FAVORITES).toEqual([])
  })

  it('agrega un producto a favoritos al invocar toggle por primera vez', () => {
    const added = useFavoritesStore.getState().toggle(1, 101)
    expect(added).toBe(true)

    const userFavs = useFavoritesStore.getState().byUser[1]
    expect(userFavs).toContain(101)
  })

  it('remueve un producto de favoritos al invocar toggle por segunda vez', () => {
    useFavoritesStore.getState().toggle(1, 101)
    const removed = useFavoritesStore.getState().toggle(1, 101)
    expect(removed).toBe(false)

    const userFavs = useFavoritesStore.getState().byUser[1]
    expect(userFavs).not.toContain(101)
  })

  it('mantiene las listas de favoritos aisladas entre distintos usuarios', () => {
    useFavoritesStore.getState().toggle(1, 101)
    useFavoritesStore.getState().toggle(2, 202)

    expect(useFavoritesStore.getState().byUser[1]).toEqual([101])
    expect(useFavoritesStore.getState().byUser[2]).toEqual([202])
  })
})
