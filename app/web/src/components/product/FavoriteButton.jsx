import { useFavorite } from '../../hooks/useFavorites.js'
import { cn } from '../../lib/cn.js'
import { HeartIcon } from '../icons/index.jsx'
import { buttonClasses } from '../ui/buttonStyles.js'

/** `variant="icon"` para tarjetas; `variant="full"` con texto para el detalle. */
export function FavoriteButton({ productId, variant = 'icon', className }) {
  const { isFavorite, toggle } = useFavorite(productId)

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        className={buttonClasses({
          variant: 'secondary',
          className: cn(isFavorite && 'border-coral-500 text-coral-600', className),
        })}
      >
        <HeartIcon filled={isFavorite} className="size-5" />
        {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label="Favorito"
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      className={cn(
        'relative z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110',
        isFavorite ? 'text-coral-500' : 'text-gray-700 hover:text-coral-500',
        className,
      )}
    >
      <HeartIcon filled={isFavorite} className="size-5" />
    </button>
  )
}
