import { cn } from '../../lib/cn.js'
import { MAX_QUANTITY, useCartStore } from '../../stores/cartStore.js'
import { toast } from '../../stores/toastStore.js'
import { CartAddIcon } from '../icons/index.jsx'
import { buttonClasses } from '../ui/buttonStyles.js'

/** `compact` muestra solo el icono (tarjetas). Disponible para invitados y usuarios. */
export function AddToCartButton({ product, quantity = 1, compact = false, className }) {
  const addItem = useCartStore((state) => state.addItem)
  const soldOut = !product.available

  const handleClick = () => {
    const inCart =
      useCartStore.getState().items.find((item) => item.productId === product.id)?.quantity ?? 0
    if (inCart >= MAX_QUANTITY) {
      toast(`Máximo ${MAX_QUANTITY} unidades por producto.`, 'info')
      return
    }
    addItem(product.id, quantity)
    toast(`«${product.title}» agregado al carrito`)
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={soldOut}
        aria-label={soldOut ? `${product.title} agotado` : `Agregar ${product.title} al carrito`}
        title={soldOut ? 'Agotado' : 'Agregar al carrito'}
        className={cn(
          'relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400',
          className,
        )}
      >
        <CartAddIcon className="size-5" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className={buttonClasses({ className })}
    >
      <CartAddIcon className="size-5" />
      {soldOut ? 'Agotado' : 'Agregar al carrito'}
    </button>
  )
}
