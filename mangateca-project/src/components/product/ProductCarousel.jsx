import { useEffect, useId, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/index.jsx'
import { ProductCard } from './ProductCard.jsx'

const EDGE_TOLERANCE_PX = 4

/** Indica si el carrusel está en el inicio o el final; conserva `prev` si nada cambió. */
function nextEdges(prev, track) {
  const atStart = track.scrollLeft <= EDGE_TOLERANCE_PX
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_TOLERANCE_PX
  return prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }
}

/** Carrusel con scroll-snap nativo: deslizable en táctil y con flechas en escritorio. */
export function ProductCarousel({ title, description, products }) {
  const headingId = useId()
  const trackId = useId()
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  // ResizeObserver notifica al observar y al cambiar el tamaño: calcula los extremos iniciales.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(() => setEdges((prev) => nextEdges(prev, track)))
    observer.observe(track)
    return () => observer.disconnect()
  }, [products.length])

  const scroll = (direction) => {
    const track = trackRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  if (products.length === 0) return null

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={edges.atStart}
            aria-controls={trackId}
            aria-label={`Anteriores en ${title}`}
            className="grid size-10 place-items-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={edges.atEnd}
            aria-controls={trackId}
            aria-label={`Siguientes en ${title}`}
            className="grid size-10 place-items-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
      </div>

      <ul
        id={trackId}
        ref={trackRef}
        onScroll={(event) => {
          const track = event.currentTarget
          setEdges((prev) => nextEdges(prev, track))
        }}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:scroll-px-0 sm:gap-6 sm:px-0"
      >
        {products.map((product) => (
          <li key={product.id} className="w-40 shrink-0 snap-start sm:w-44 lg:w-48">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
