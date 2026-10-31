import { Link } from 'react-router'
import { HeartIcon } from '../components/icons/index.jsx'
import { Container } from '../components/layout/Container.jsx'
import { ProductGrid } from '../components/product/ProductGrid.jsx'
import { buttonClasses } from '../components/ui/buttonStyles.js'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useFavoriteProducts } from '../hooks/useFavorites.js'

export default function FavoritesPage() {
  const favorites = useFavoriteProducts()

  return (
    <Container className="py-10">
      <title>Mis favoritos · Mangateca</title>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Mis favoritos</h1>
        <p className="mt-1 text-sm text-gray-600">
          {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
        </p>
      </header>

      <div className="mt-8">
        {favorites.length > 0 ? (
          <ProductGrid products={favorites} />
        ) : (
          <EmptyState
            icon={HeartIcon}
            title="Aún no tienes favoritos"
            description="Pulsa el corazón de cualquier libro, manga o cómic para guardarlo aquí."
          >
            <Link to="/productos" className={buttonClasses()}>
              Explorar productos
            </Link>
          </EmptyState>
        )}
      </div>
    </Container>
  )
}
