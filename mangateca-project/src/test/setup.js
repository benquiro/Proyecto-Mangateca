import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Polyfill básico para HTMLDialogElement en JSDOM
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = HTMLDialogElement.prototype.showModal || function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = HTMLDialogElement.prototype.close || function close() {
    this.open = false
  }
}

// Limpieza automática tras cada caso de prueba
afterEach(() => {
  cleanup()
})

// Aislamiento del almacenamiento de sesión entre tests
beforeEach(() => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear()
  }
})
