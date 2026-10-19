import { useState } from 'react'
import { Link } from 'react-router'
import { CartIcon, TrashIcon } from '../components/icons/index.jsx'
import { Container } from '../components/layout/Container.jsx'
import { Cover } from '../components/product/Cover.jsx'
import { Button } from '../components/ui/Button.jsx'
import { buttonClasses } from '../components/ui/buttonStyles.js'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { QuantityStepper } from '../components/ui/QuantityStepper.jsx'
import { PRODUCT_TYPES } from '../data/catalog.js'
import { useCart } from '../hooks/useCart.js'
import { useProductModal } from '../hooks/useProductModal.js'
import { formatPrice } from '../lib/format.js'
import { useCartStore } from '../stores/cartStore.js'
import { toast } from '../stores/toastStore.js'

export default function CartPage() {
  const { lines, count, total } = useCart()
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)
  const { productHref } = useProductModal()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    clear()
    setCheckoutOpen(false)
    toast('¡Gracias por tu compra! (simulada: no se ha realizado ningún cargo)')
  }

  return (
    <Container className="py-10">
      <title>Carrito · Mangateca</title>
      <h1 className="text-3xl font-bold tracking-tight">Carrito de compras</h1>

      {lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={CartIcon}
            title="Tu carrito está vacío"
            description="Agrega libros, mangas o cómics y aparecerán aquí."
          >
            <Link to="/productos" className={buttonClasses()}>
              Ver productos
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <section aria-label="Productos en el carrito">
            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    to={productHref(product.id)}
                    state={{ productModal: true }}
                    preventScrollReset
                    className="shrink-0"
                    aria-label={`Ver detalle de ${product.title}`}
                  >
                    <Cover
                      product={product}
                      className="h-32 w-22 rounded-lg ring-1 ring-gray-200 sm:h-36 sm:w-24"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">
                          {PRODUCT_TYPES[product.type]?.label}
                        </p>
                        <h2 className="font-semibold">{product.title}</h2>
                        <p className="truncate text-sm text-gray-600">{product.author}</p>
                        {!product.available && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            Actualmente agotado
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 font-semibold">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div className="flex items-center gap-3">
                        <QuantityStepper
                          size="sm"
                          value={quantity}
                          onChange={(value) => setQuantity(product.id, value)}
                          label={`Cantidad de ${product.title}`}
                        />
                        <span className="text-xs text-gray-500">
                          {formatPrice(product.price)} c/u
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(product.id)
                          toast(`«${product.title}» eliminado del carrito`, 'info')
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="size-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside
            aria-label="Resumen del pedido"
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-24"
          >
            <h2 className="text-lg font-semibold">Resumen</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">
                  Subtotal ({count} {count === 1 ? 'artículo' : 'artículos'})
                </dt>
                <dd className="font-medium">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Envío</dt>
                <dd className="font-medium text-brand-700">Gratis</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Button size="lg" className="mt-6 w-full" onClick={() => setCheckoutOpen(true)}>
              Finalizar compra
            </Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Compra simulada: no se realizará ningún cargo.
            </p>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={checkoutOpen}
        title="Confirmar compra"
        message={`Vas a comprar ${count} ${count === 1 ? 'artículo' : 'artículos'} por ${formatPrice(total)}. Es una compra simulada: no se realizará ningún cargo.`}
        confirmLabel="Confirmar compra"
        onConfirm={handleCheckout}
        onCancel={() => setCheckoutOpen(false)}
      />
    </Container>
  )
}
