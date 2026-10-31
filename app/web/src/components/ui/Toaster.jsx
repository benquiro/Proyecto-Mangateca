import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn.js'
import { useToastStore } from '../../stores/toastStore.js'
import { CheckIcon, CloseIcon, InfoIcon } from '../icons/index.jsx'

const variantStyles = {
  success: { icon: CheckIcon, className: 'bg-brand-50 text-brand-700' },
  info: { icon: InfoIcon, className: 'bg-gray-100 text-gray-700' },
  error: { icon: InfoIcon, className: 'bg-red-50 text-red-600' },
}

/**
 * Las notificaciones viven en un popover para entrar en la "top layer":
 * así se ven por encima de un <dialog> modal abierto (p. ej. al agregar al carrito desde el detalle).
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)
  const popoverRef = useRef(null)

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover.showPopover) return
    if (popover.matches(':popover-open')) popover.hidePopover()
    // Volver a mostrarlo lo coloca encima de cualquier modal abierto después.
    if (toasts.length > 0) popover.showPopover()
  }, [toasts])

  return (
    <div
      ref={popoverRef}
      popover="manual"
      role="status"
      aria-live="polite"
      className="top-auto right-4 bottom-4 left-auto m-0 w-[min(24rem,calc(100%-2rem))] overflow-visible border-0 bg-transparent p-0"
    >
      <ul className="flex flex-col gap-2">
        {toasts.map((toast) => {
          const { icon: Icon, className } = variantStyles[toast.variant] ?? variantStyles.info
          return (
            <li
              key={toast.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 pr-2 text-sm shadow-lg"
            >
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', className)}>
                <Icon className="size-4" strokeWidth={2.25} />
              </span>
              <p className="flex-1 text-gray-800">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
                className="grid size-8 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseIcon className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
