import { useDeferredValue, useId, useMemo, useState } from 'react'
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/icons/index.jsx'
import { Cover } from '../../components/product/Cover.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { PRODUCT_TYPES } from '../../data/catalog.js'
import { formatPrice } from '../../lib/format.js'
import { matchProduct } from '../../lib/search.js'
import { useProductsStore } from '../../stores/productsStore.js'
import { toast } from '../../stores/toastStore.js'
import { ProductForm } from './ProductForm.jsx'

export default function AdminProductsPage() {
  const products = useProductsStore((state) => state.products)
  const deleteProduct = useProductsStore((state) => state.deleteProduct)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  // null: cerrado · { product: null }: alta · { product }: edición
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const searchId = useId()
  const formTitleId = useId()

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => matchProduct(product, deferredQuery))
        .sort((a, b) => b.id - a.id),
    [products, deferredQuery],
  )

  const handleDelete = () => {
    deleteProduct(deleting.id)
    toast(`«${deleting.title}» eliminado`, 'info')
    setDeleting(null)
  }

  return (
    <>
      <title>Productos · Administración · Mangateca</title>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <label htmlFor={searchId} className="sr-only">
            Buscar productos
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, autor o ISBN…"
            className="h-11 w-full rounded-full border border-gray-300 bg-white pr-4 pl-10 text-sm placeholder:text-gray-400 focus:border-brand-500"
          />
        </div>
        <Button onClick={() => setEditing({ product: null })}>
          <PlusIcon className="size-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Producto</th>
              <th scope="col" className="px-4 py-3 font-medium">Tipo</th>
              <th scope="col" className="px-4 py-3 font-medium">ISBN</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Precio</th>
              <th scope="col" className="px-4 py-3 font-medium">Estado</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Cover product={product} className="h-14 w-10 shrink-0 rounded ring-1 ring-gray-200" />
                    <div className="min-w-0">
                      <p className="max-w-xs truncate font-medium text-gray-900">{product.title}</p>
                      <p className="max-w-xs truncate text-xs text-gray-500">{product.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{PRODUCT_TYPES[product.type]?.label}</td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{product.isbn}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  {product.available ? (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                      Agotado
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing({ product })}
                      aria-label={`Editar ${product.title}`}
                      title="Editar"
                      className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(product)}
                      aria-label={`Eliminar ${product.title}`}
                      title="Eliminar"
                      className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleProducts.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-gray-500">No hay productos que coincidan.</p>
        )}
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        labelledBy={formTitleId}
        className="max-w-2xl"
      >
        <ProductForm
          key={editing?.product?.id ?? 'nuevo'}
          product={editing?.product ?? null}
          titleId={formTitleId}
          onDone={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar «${deleting?.title}»? También desaparecerá de carritos y favoritos. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  )
}
