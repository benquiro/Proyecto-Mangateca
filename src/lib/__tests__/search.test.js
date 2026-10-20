import { describe, expect, it } from 'vitest'
import { matchProduct, normalize, searchProducts } from '../search.js'

describe('Motor de búsqueda y normalización (search.js)', () => {
  describe('normalize', () => {
    it('elimina tildes, signos diacríticos y pasa a minúsculas', () => {
      expect(normalize('García')).toBe('garcia')
      expect(normalize('  CÓMIC y MANGA!  ')).toBe('comic y manga!')
      expect(normalize('ÁÉÍÓÚüñ')).toBe('aeiouun')
    })

    it('maneja valores vacíos, nulos o indefinidos', () => {
      expect(normalize('')).toBe('')
      expect(normalize(null)).toBe('')
      expect(normalize(undefined)).toBe('')
    })
  })

  describe('matchProduct', () => {
    const product = {
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      isbn: '978-0307474728',
    }

    it('devuelve true ante consultas vacías', () => {
      expect(matchProduct(product, '')).toBe(true)
      expect(matchProduct(product, '   ')).toBe(true)
    })

    it('encuentra coincidencias ignorando tildes y mayúsculas en título, autor o isbn', () => {
      expect(matchProduct(product, 'soledad')).toBe(true)
      expect(matchProduct(product, 'garcia')).toBe(true)
      expect(matchProduct(product, 'MARQUEZ')).toBe(true)
      expect(matchProduct(product, '0307474728')).toBe(true)
    })

    it('soporta búsquedas con múltiples términos (AND lógico)', () => {
      expect(matchProduct(product, 'cien garcia')).toBe(true)
      expect(matchProduct(product, 'soledad quijote')).toBe(false)
    })
  })

  describe('searchProducts', () => {
    const products = [
      { id: 1, title: 'Dragon Ball', author: 'Akira Toriyama', isbn: '111' },
      { id: 2, title: 'Ballroom e Youkoso', author: 'Tomo Takeuchi', isbn: '222' },
      { id: 3, title: 'Super Dragon', author: 'Autor X', isbn: '333' },
    ]

    it('retorna array vacío si la búsqueda está vacía', () => {
      expect(searchProducts(products, '')).toEqual([])
      expect(searchProducts(products, '   ')).toEqual([])
    })

    it('ordena primero los títulos que comienzan por la consulta', () => {
      const results = searchProducts(products, 'dragon')
      expect(results).toHaveLength(2)
      expect(results[0].title).toBe('Dragon Ball') // rank 0: empieza por Dragon
      expect(results[1].title).toBe('Super Dragon') // rank 1: contiene Dragon
    })

    it('respeta el parámetro limit de resultados devueltos', () => {
      const results = searchProducts(products, 'ball', 1)
      expect(results).toHaveLength(1)
    })
  })
})
