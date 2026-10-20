import { PRODUCT_TYPES } from '../data/catalog.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-zA-Z0-9._-]{3,20}$/

export const PASSWORD_MIN_LENGTH = 8

export function isValidEmail(value) {
  return EMAIL_RE.test(value)
}

/** Quita guiones/espacios y comprueba que tenga 10 o 13 dígitos (el ISBN-10 puede terminar en X). */
export function isValidIsbn(value) {
  const clean = String(value).replace(/[-\s]/g, '')
  return /^\d{13}$/.test(clean) || /^\d{9}[\dXx]$/.test(clean)
}

export function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Devuelve un objeto { campo: mensaje } vacío si todo es válido. */
export function validateUserFields({ username, email, password }, { passwordRequired = true } = {}) {
  const errors = {}
  if (!USERNAME_RE.test(username)) {
    errors.username = 'Entre 3 y 20 caracteres: letras, números, punto, guion o guion bajo.'
  }
  if (!isValidEmail(email)) {
    errors.email = 'Introduce un email válido.'
  }
  if (passwordRequired || password) {
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    }
  }
  return errors
}

export function validateProductFields(product) {
  const errors = {}
  if (!product.title) errors.title = 'El título es obligatorio.'
  if (!product.author) errors.author = 'El autor es obligatorio.'
  if (!product.description) errors.description = 'La sinopsis es obligatoria.'
  if (!(product.type in PRODUCT_TYPES)) errors.type = 'Selecciona un tipo.'
  if (!isValidIsbn(product.isbn)) errors.isbn = 'El ISBN debe tener 10 o 13 dígitos.'
  if (!product.publicationDate) errors.publicationDate = 'Indica la fecha de publicación.'
  if (!(product.price > 0)) errors.price = 'El precio debe ser mayor que 0.'
  if (product.categoryIds.length === 0) errors.categoryIds = 'Selecciona al menos una categoría.'
  if (!isValidUrl(product.imageUrl)) errors.imageUrl = 'Introduce una URL válida (http o https).'
  return errors
}
