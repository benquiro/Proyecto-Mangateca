import { createJSONStorage } from 'zustand/middleware'

/**
 * Almacenamiento compartido por todos los stores persistidos.
 * Usa sessionStorage: los datos viven mientras la pestaña esté abierta.
 * Para persistir entre sesiones, cambiar `sessionStorage` por `localStorage`.
 */
export const appStorage = createJSONStorage(() => sessionStorage)
