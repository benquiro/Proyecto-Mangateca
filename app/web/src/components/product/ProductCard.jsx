import { Link } from 'react-router'
import { PRODUCT_TYPES } from '../../data/catalog.js'
import { useProductModal } from '../../hooks/useProductModal.js'
import { formatPrice } from '../../lib/format.js'
import { AddToCartButton } from './AddToCartButton.jsx'
import { Cover } from './Cover.jsx'
import { FavoriteButton } from './FavoriteButton.jsx'

export function ProductCard({ product }) {
  const { productHref } = useProductModal()

  return (
    // El enlace del título se estira sobre toda la tarjeta (after:inset-0);
    // los botones quedan por encima con z-10.
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
        <Cover
          product={product}
          className="size-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-gray-700 backdrop-blur">
          {PRODUCT_TYPES[product.type]?.label}
        </span>
        <FavoriteButton productId={product.id} className="absolute top-2 right-2" />
        {!product.available && (
          <span className="absolute inset-x-0 bottom-0 bg-gray-900/70 py-1 text-center text-xs font-medium text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
          <Link
            to={productHref(product.id)}
            state={{ productModal: true }}
            preventScrollReset
            className="after:absolute after:inset-0 after:rounded-xl group-hover:text-brand-700"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-xs text-gray-500">{product.author}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  )
}
