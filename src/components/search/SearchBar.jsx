import { useDeferredValue, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PRODUCT_TYPES } from '../../data/catalog.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { useProductModal } from '../../hooks/useProductModal.js'
import { cn } from '../../lib/cn.js'
import { formatPrice } from '../../lib/format.js'
import { searchProducts } from '../../lib/search.js'
import { useProductsStore } from '../../stores/productsStore.js'
import { SearchIcon } from '../icons/index.jsx'
import { Cover } from '../product/Cover.jsx'

const MAX_RESULTS = 6

/**
 * Búsqueda en tiempo real con panel de resultados (patrón combobox ARIA).
 * ↑/↓ recorren los resultados, Enter abre el detalle y Esc cierra el panel.
 */
export function SearchBar() {
  const products = useProductsStore((state) => state.products)
  const { openProduct } = useProductModal()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  // Mantiene la escritura fluida aunque filtrar tarde un poco más.
  const deferredQuery = useDeferredValue(query)

  const matches = useMemo(() => searchProducts(products, deferredQuery), [products, deferredQuery])
  const results = matches.slice(0, MAX_RESULTS)
  const active = activeIndex < results.length ? activeIndex : -1

  const containerRef = useRef(null)
  const inputId = useId()
  const listboxId = useId()
  const optionId = (index) => `${listboxId}-option-${index}`

  const trimmedQuery = query.trim()
  const showPanel = isOpen && trimmedQuery.length > 0
  const catalogHref = `/productos?q=${encodeURIComponent(trimmedQuery)}`

  useDismiss(containerRef, () => setIsOpen(false), showPanel)

  const selectProduct = (product) => {
    setIsOpen(false)
    openProduct(product.id)
  }

  const handleChange = (event) => {
    setQuery(event.target.value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex(Math.min(active + 1, results.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(Math.max(active - 1, -1))
        break
      case 'Escape':
        // Con el panel abierto solo se cierra; si ya está cerrado, se limpia la búsqueda.
        event.preventDefault()
        if (showPanel) setIsOpen(false)
        else setQuery('')
        break
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (showPanel && active >= 0) {
      selectProduct(results[active])
    } else if (trimmedQuery) {
      setIsOpen(false)
      navigate(catalogHref)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Buscar productos
        </label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-gray-400" />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Busca por título, autor o ISBN…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="h-14 w-full rounded-full border border-gray-200 bg-white pr-5 pl-13 text-base shadow-sm transition-shadow placeholder:text-gray-400 hover:shadow-md focus:border-brand-500 focus:shadow-md focus:outline-hidden focus:ring-4 focus:ring-brand-100"
        />
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-xl">
          <ul id={listboxId} role="listbox" aria-label="Resultados de búsqueda" className="max-h-[60vh] overflow-y-auto py-1">
            {results.map((product, index) => (
              <li
                key={product.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => selectProduct(product)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 px-4 py-2.5',
                  index === active && 'bg-brand-50',
                )}
              >
                <Cover product={product} className="h-16 w-11 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{product.title}</p>
                  <p className="truncate text-xs text-gray-500">
                    {product.author} · {PRODUCT_TYPES[product.type]?.label}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-brand-700">
                  {formatPrice(product.price)}
                </span>
              </li>
            ))}
          </ul>

          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
              No se encontraron productos para «{trimmedQuery}».
            </p>
          ) : (
            <Link
              to={catalogHref}
              onClick={() => setIsOpen(false)}
              className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-brand-700 hover:bg-gray-50"
            >
              {matches.length > results.length
                ? `Ver los ${matches.length} resultados`
                : 'Ver resultados en el catálogo'}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
