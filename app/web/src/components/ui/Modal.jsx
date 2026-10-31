import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn.js'

/**
 * Modal sobre <dialog> nativo: atrapa el foco, se cierra con Esc y al hacer clic en el fondo.
 * Es controlado: `open` decide si se muestra y `onClose` pide cerrarlo.
 */
export function Modal({ open, onClose, labelledBy, className, children }) {
  const dialogRef = useRef(null)
  const pointerDownOnBackdrop = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Se cierra solo si el clic empezó y terminó en el fondo (evita cerrar al seleccionar texto).
  const handlePointerDown = (event) => {
    pointerDownOnBackdrop.current = event.target === event.currentTarget
  }
  const handleClick = (event) => {
    if (pointerDownOnBackdrop.current && event.target === event.currentTarget) onClose()
  }
  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm',
        className ?? 'max-w-lg',
      )}
    >
      {open && children}
    </dialog>
  )
}
