import { describe, expect, it } from 'vitest'
import {
  isValidEmail,
  isValidIsbn,
  isValidUrl,
  PASSWORD_MIN_LENGTH,
  validateProductFields,
  validateUserFields,
} from '../validation.js'

describe('Validaciones de negocio (validation.js)', () => {
  describe('isValidEmail', () => {
    it('acepta direcciones de correo estándar válidas', () => {
      expect(isValidEmail('usuario@dominio.com')).toBe(true)
      expect(isValidEmail('admin.test@sub.mangateca.org')).toBe(true)
      expect(isValidEmail('cliente+123@gmail.com')).toBe(true)
    })

    it('rechaza direcciones de correo inválidas o mal formadas', () => {
      expect(isValidEmail('sin-arroba.com')).toBe(false)
      expect(isValidEmail('usuario@')).toBe(false)
      expect(isValidEmail('@dominio.com')).toBe(false)
      expect(isValidEmail('usuario@dominio')).toBe(false)
      expect(isValidEmail('usuario con espacios@dominio.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidIsbn', () => {
    it('valida ISBN-13 con o sin guiones y espacios', () => {
      expect(isValidIsbn('978-3-16-148410-0')).toBe(true)
      expect(isValidIsbn('9783161484100')).toBe(true)
      expect(isValidIsbn('978 3 16 148410 0')).toBe(true)
    })

    it('valida ISBN-10 con o sin guiones, incluyendo X final', () => {
      expect(isValidIsbn('0-471-95869-7')).toBe(true)
      expect(isValidIsbn('0471958697')).toBe(true)
      expect(isValidIsbn('0-9752298-0-X')).toBe(true)
      expect(isValidIsbn('097522980x')).toBe(true)
    })

    it('rechaza ISBNs con longitud incorrecta o caracteres inválidos', () => {
      expect(isValidIsbn('12345')).toBe(false)
      expect(isValidIsbn('abcdefghijklm')).toBe(false)
      expect(isValidIsbn('97831614841000')).toBe(false) // 14 dígitos
      expect(isValidIsbn('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('acepta URLs con protocolos http y https', () => {
      expect(isValidUrl('http://mangateca.com/portada.jpg')).toBe(true)
      expect(isValidUrl('https://images.unsplash.com/photo-1')).toBe(true)
    })

    it('rechaza URLs sin protocolo válido o cadenas corruptas', () => {
      expect(isValidUrl('ftp://servidor.com/archivo')).toBe(false)
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
      expect(isValidUrl('no-es-una-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('validateUserFields', () => {
    it('retorna objeto vacío cuando los datos de usuario son válidos', () => {
      const valid = {
        username: 'juan_perez',
        email: 'juan@mangateca.com',
        password: 'Password123!',
      }
      expect(validateUserFields(valid)).toEqual({})
    })

    it('detecta errores de longitud o caracteres en el nombre de usuario', () => {
      const resultShort = validateUserFields({
        username: 'ab',
        email: 'test@mail.com',
        password: 'Password123!',
      })
      expect(resultShort.username).toBeDefined()

      const resultInvalidChars = validateUserFields({
        username: 'juan perez!',
        email: 'test@mail.com',
        password: 'Password123!',
      })
      expect(resultInvalidChars.username).toBeDefined()
    })

    it('detecta correo inválido', () => {
      const result = validateUserFields({
        username: 'juan_perez',
        email: 'correo-invalido',
        password: 'Password123!',
      })
      expect(result.email).toBe('Introduce un email válido.')
    })

    it('valida longitud mínima de contraseña (mínimo 8 caracteres)', () => {
      const result = validateUserFields({
        username: 'juan_perez',
        email: 'juan@mangateca.com',
        password: '12345',
      })
      expect(result.password).toContain(String(PASSWORD_MIN_LENGTH))
    })

    it('permite omitir contraseña cuando passwordRequired es false y no se ingresó contraseña', () => {
      const result = validateUserFields(
        { username: 'juan_perez', email: 'juan@mangateca.com', password: '' },
        { passwordRequired: false },
      )
      expect(result.password).toBeUndefined()
    })
  })

  describe('validateProductFields', () => {
    const validProduct = {
      title: 'Berserk Vol. 1',
      author: 'Kentaro Miura',
      description: 'Guts, el espadachín negro...',
      type: 'MANGA',
      isbn: '978-84-15291-88-6',
      publicationDate: '1989-10-01',
      price: 14.99,
      categoryIds: [1, 2],
      imageUrl: 'https://images.mangateca.com/berserk1.jpg',
    }

    it('retorna objeto vacío cuando todos los campos del producto son válidos', () => {
      expect(validateProductFields(validProduct)).toEqual({})
    })

    it('exige título, autor y descripción obligatorios', () => {
      const errors = validateProductFields({
        ...validProduct,
        title: '',
        author: '',
        description: '',
      })
      expect(errors.title).toBe('El título es obligatorio.')
      expect(errors.author).toBe('El autor es obligatorio.')
      expect(errors.description).toBe('La sinopsis es obligatoria.')
    })

    it('valida tipo de producto contra PRODUCT_TYPES', () => {
      const errors = validateProductFields({
        ...validProduct,
        type: 'INVALID_TYPE',
      })
      expect(errors.type).toBe('Selecciona un tipo.')
    })

    it('exige precio mayor a cero', () => {
      const errorsZero = validateProductFields({ ...validProduct, price: 0 })
      expect(errorsZero.price).toBe('El precio debe ser mayor que 0.')

      const errorsNegative = validateProductFields({ ...validProduct, price: -5 })
      expect(errorsNegative.price).toBe('El precio debe ser mayor que 0.')
    })

    it('exige al menos una categoría asignada', () => {
      const errors = validateProductFields({ ...validProduct, categoryIds: [] })
      expect(errors.categoryIds).toBe('Selecciona al menos una categoría.')
    })

    it('exige URL de imagen válida', () => {
      const errors = validateProductFields({ ...validProduct, imageUrl: 'ftp://bad.url' })
      expect(errors.imageUrl).toBe('Introduce una URL válida (http o https).')
    })
  })
})
