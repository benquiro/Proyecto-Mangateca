import { useState } from 'react'
import { cn } from '../../lib/cn.js'

/** Portada con carga diferida y un sustituto con el título si la imagen falla. */
export function Cover({ product, alt = '', className }) {
  const [failedSrc, setFailedSrc] = useState(null)

  if (!product.imageUrl || failedSrc === product.imageUrl) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        className={cn(
          'grid place-items-center bg-brand-50 p-2 text-center text-xs font-medium text-brand-800',
          className,
        )}
      >
        <span className="line-clamp-4">{product.title}</span>
      </div>
    )
  }

  return (
    <img
      src={product.imageUrl}
      alt={alt}
      loading="lazy"
      decoding="async"
      // El CDN de algunas portadas bloquea peticiones con referer de otros dominios.
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(product.imageUrl)}
      className={cn('bg-gray-100 object-cover', className)}
    />
  )
}
