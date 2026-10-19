import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { BookIcon, CloseIcon, SearchIcon } from '../components/icons/index.jsx'
import { Container } from '../components/layout/Container.jsx'
import { ProductGrid } from '../components/product/ProductGrid.jsx'
import { buttonClasses } from '../components/ui/buttonStyles.js'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { categories, PRODUCT_TYPES } from '../data/catalog.js'
import { cn } from '../lib/cn.js'
import { matchProduct } from '../lib/search.js'
import { useProductsStore } from '../stores/productsStore.js'

const SORT_OPTIONS = {
  destacados: { label: 'Destacados', compare: (a, b) => a.id - b.id },
  'precio-asc': { label: 'Precio: menor a mayor', compare: (a, b) => a.price - b.price },
  'precio-desc': { label: 'Precio: mayor a menor', compare: (a, b) => b.price - a.price },
  titulo: { label: 'Título (A-Z)', compare: (a, b) => a.title.localeCompare(b.title, 'es') },
  recientes: {
    label: 'Publicación más reciente',
    compare: (a, b) => b.publicationDate.localeCompare(a.publicationDate),
  },
}

/** Catálogo completo o filtrado por tipo. Búsqueda, categoría y orden viven en la URL. */
export default function CatalogPage({ type }) {
  const products = useProductsStore((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchId = useId()
  const sortId = useId()

  const query = searchParams.get('q') ?? ''
  const categoryId = Number(searchParams.get('categoria')) || null
  const sortKey = Object.hasOwn(SORT_OPTIONS, searchParams.get('orden'))
    ? searchParams.get('orden')
    : 'destacados'

  const typeInfo = type ? PRODUCT_TYPES[type] : null
  const title = typeInfo ? typeInfo.plural : 'Todos los productos'

  const ofType = useMemo(
    () => (type ? products.filter((product) => product.type === type) : products),
    [products, type],
  )

  // Solo se ofrecen las categorías que tienen productos de este tipo.
  const availableCategories = useMemo(() => {
    const used = new Set(ofType.flatMap((product) => product.categoryIds))
    return categories
      .filter((category) => used.has(category.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [ofType])

  const visibleProducts = useMemo(
    () =>
      ofType
        .filter((product) => !categoryId || product.categoryIds.includes(categoryId))
        .filter((product) => matchProduct(product, query))
        .sort(SORT_OPTIONS[sortKey].compare),
    [ofType, categoryId, query, sortKey],
  )

  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  const hasFilters = Boolean(query || categoryId)

  return (
    <Container className="py-10">
      <title>{`${title} · Mangateca`}</title>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'}
          {query && <> para «{query}»</>}
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Filtrar por título, autor o ISBN
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Filtrar por título, autor o ISBN…"
            className="h-11 w-full rounded-full border border-gray-300 bg-white pr-4 pl-10 text-sm placeholder:text-gray-400 focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={sortId} className="text-sm whitespace-nowrap text-gray-600">
            Ordenar por
          </label>
          <select
            id={sortId}
            value={sortKey}
            onChange={(event) =>
              updateParam('orden', event.target.value === 'destacados' ? '' : event.target.value)
            }
            className="h-11 rounded-full border border-gray-300 bg-white px-4 text-sm focus:border-brand-500"
          >
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul
        aria-label="Filtrar por categoría"
        className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <li>
          <CategoryChip active={!categoryId} onClick={() => updateParam('categoria', '')}>
            Todas
          </CategoryChip>
        </li>
        {availableCategories.map((category) => (
          <li key={category.id}>
            <CategoryChip
              active={categoryId === category.id}
              onClick={() => updateParam('categoria', String(category.id))}
            >
              {category.name}
            </CategoryChip>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <EmptyState
            icon={BookIcon}
            title="No hay productos que coincidan"
            description="Prueba con otra búsqueda o quita los filtros."
          >
            {hasFilters && (
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className={buttonClasses({ variant: 'secondary' })}
              >
                <CloseIcon className="size-4" />
                Quitar filtros
              </button>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  )
}

function CategoryChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-brand-700 bg-brand-700 text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-700',
      )}
    >
      {children}
    </button>
  )
}
