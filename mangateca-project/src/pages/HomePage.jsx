import { useMemo } from 'react'
import { Link } from 'react-router'
import { Container } from '../components/layout/Container.jsx'
import { ProductCarousel } from '../components/product/ProductCarousel.jsx'
import { SearchBar } from '../components/search/SearchBar.jsx'
import { PRODUCT_TYPES } from '../data/catalog.js'
import { BESTSELLER_IDS, NEW_RELEASES_LIMIT, RECOMMENDED_IDS } from '../data/featured.js'
import { useProductsStore } from '../stores/productsStore.js'

export default function HomePage() {
  const products = useProductsStore((state) => state.products)

  const { newReleases, bestsellers, recommended } = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]))
    const pick = (ids) => ids.map((id) => byId.get(id)).filter(Boolean)
    return {
      // Los ids más altos son los últimos añadidos, incluidos los que crea el admin.
      newReleases: [...products].sort((a, b) => b.id - a.id).slice(0, NEW_RELEASES_LIMIT),
      bestsellers: pick(BESTSELLER_IDS),
      recommended: pick(RECOMMENDED_IDS),
    }
  }, [products])

  return (
    <>
      <title>Mangateca · Libros, mangas y cómics</title>

      <section className="border-b border-gray-100 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-14 text-center sm:py-20">
          <p className="text-sm font-semibold tracking-wider text-brand-700 uppercase">
            Libros · Mangas · Cómics
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Tu próxima historia <span className="text-brand-700">te está esperando</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Explora clásicos, sagas y novedades. Busca por título, autor o ISBN.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar />
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {Object.values(PRODUCT_TYPES).map((type) => (
              <li key={type.path}>
                <Link
                  to={type.path}
                  className="inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  {type.plural}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="space-y-14 py-12 sm:space-y-16 sm:py-16">
        <ProductCarousel
          title="Novedades"
          description="Lo último que ha llegado a nuestras estanterías."
          products={newReleases}
        />
        <ProductCarousel
          title="Más vendidos"
          description="Los favoritos de nuestros lectores."
          products={bestsellers}
        />
        <ProductCarousel
          title="Recomendados"
          description="Obras imprescindibles elegidas por el equipo de Mangateca."
          products={recommended}
        />
      </Container>
    </>
  )
}
