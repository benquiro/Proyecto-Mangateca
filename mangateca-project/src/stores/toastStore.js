import { create } from 'zustand'

const TOAST_DURATION_MS = 3500
let nextToastId = 0

export const useToastStore = create((set) => ({
  /** [{ id, message, variant: 'success' | 'info' | 'error' }] */
  toasts: [],

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

/** Muestra una notificación breve. Se puede llamar desde cualquier handler. */
export function toast(message, variant = 'success') {
  const id = ++nextToastId
  useToastStore.setState((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
  setTimeout(() => useToastStore.getState().dismiss(id), TOAST_DURATION_MS)
}
