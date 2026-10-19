import { useId, useState } from 'react'
import { getCategoryName, PRODUCT_TYPES } from '../../data/catalog.js'
import { useProductModal } from '../../hooks/useProductModal.js'
import { formatDate, formatPrice } from '../../lib/format.js'
import { useProductsStore } from '../../stores/productsStore.js'
import { CloseIcon } from '../icons/index.jsx'
import { Modal } from '../ui/Modal.jsx'
import { QuantityStepper } from '../ui/QuantityStepper.jsx'
import { AddToCartButton } from './AddToCartButton.jsx'
import { Cover } from './Cover.jsx'
import { FavoriteButton } from './FavoriteButton.jsx'

/** Se monta una sola vez en el layout raíz y se abre con ?producto=:id desde cualquier página. */
export function ProductDetailModal() {
  const { productId, closeProduct } = useProductModal()
  const product = useProductsStore((state) =>
    productId ? state.products.find((candidate) => candidate.id === productId) : undefined,
  )
  const titleId = useId()

  return (
    <Modal open={Boolean(product)} onClose={closeProduct} labelledBy={titleId} className="max-w-4xl">
      {product && (
        <ProductDetail key={product.id} product={product} titleId={titleId} onClose={closeProduct} />
      )}
    </Modal>
  )
}

function ProductDetail({ product, titleId, onClose }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <article className="relative grid gap-6 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 sm:p-8">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar detalle"
        className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      >
        <CloseIcon className="size-5" />
      </button>

      <div className="mx-auto aspect-[2/3] w-full max-w-64 overflow-hidden rounded-xl bg-gray-100 shadow-md ring-1 ring-gray-200 sm:max-w-none">
        <Cover product={product} alt={`Portada de ${product.title}`} className="size-full" />
      </div>

      <div className="flex min-w-0 flex-col">
        <ul className="flex flex-wrap gap-2 pr-10" aria-label="Categorías">
          <li className="rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-medium text-white">
            {PRODUCT_TYPES[product.type]?.label}
          </li>
          {product.categoryIds.map((categoryId) => (
            <li
              key={categoryId}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800"
            >
              {getCategoryName(categoryId)}
            </li>
          ))}
        </ul>

        <h2 id={titleId} className="mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
          {product.title}
        </h2>
        <p className="mt-1 text-gray-600">{product.author}</p>
        <p className="mt-4 text-3xl font-semibold text-brand-700">{formatPrice(product.price)}</p>

        <section className="mt-6">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Sinopsis</h3>
          <p className="mt-2 leading-relaxed text-gray-700">{product.description}</p>
        </section>

        <section className="mt-6">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Detalles</h3>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            <dt className="text-gray-500">ISBN</dt>
            <dd className="font-medium tabular-nums">{product.isbn}</dd>
            <dt className="text-gray-500">Publicación</dt>
            <dd className="font-medium">{formatDate(product.publicationDate)}</dd>
            <dt className="text-gray-500">Disponibilidad</dt>
            <dd>
              {product.available ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-brand-700">
                  <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />
                  Disponible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium text-red-600">
                  <span className="size-2 rounded-full bg-red-500" aria-hidden="true" />
                  Agotado
                </span>
              )}
            </dd>
          </dl>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-auto sm:pt-8">
          <QuantityStepper value={quantity} onChange={setQuantity} disabled={!product.available} />
          <AddToCartButton product={product} quantity={quantity} />
          <FavoriteButton productId={product.id} variant="full" />
        </div>
      </div>
    </article>
  )
}
