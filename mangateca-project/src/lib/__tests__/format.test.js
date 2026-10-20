import { describe, expect, it } from 'vitest'
import { formatDate, formatPrice } from '../format.js'

describe('Utilidades de formato (format.js)', () => {
  describe('formatPrice', () => {
    it('formatea precios monetarios en formato USD ($XX.XX)', () => {
      expect(formatPrice(19.99)).toBe('$19.99')
      expect(formatPrice(100)).toBe('$100.00')
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('maneja valores nulos o indefinidos mostrando $0.00', () => {
      expect(formatPrice(null)).toBe('$0.00')
      expect(formatPrice(undefined)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('formatea fechas ISO en formato legible en español', () => {
      const formatted = formatDate('1989-10-01')
      expect(formatted).toMatch(/1 de octubre de 1989/)
    })

    it('retorna guion largo ante fechas inválidas, vacías o nulas', () => {
      expect(formatDate('')).toBe('—')
      expect(formatDate(null)).toBe('—')
      expect(formatDate(undefined)).toBe('—')
      expect(formatDate('fecha-invalida')).toBe('—')
    })
  })
})
