import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { NO_FAVORITES, useFavoritesStore } from '../stores/favoritesStore.js'
import { useProductsStore } from '../stores/productsStore.js'
import { toast } from '../stores/toastStore.js'
import { useCurrentUser } from './useCurrentUser.js'

/** Estado de favorito de un producto. Un invitado es enviado a iniciar sesión. */
export function useFavorite(productId) {
  const { user } = useCurrentUser()
  const isFavorite = useFavoritesStore((state) =>
    user ? (state.byUser[user.id] ?? NO_FAVORITES).includes(productId) : false,
  )
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const navigate = useNavigate()
  const location = useLocation()

  const toggle = () => {
    if (!user) {
      toast('Inicia sesión o regístrate para guardar favoritos.', 'info')
      navigate('/login', { state: { from: location } })
      return
    }
    const added = toggleFavorite(user.id, productId)
    toast(added ? 'Añadido a favoritos' : 'Eliminado de favoritos', added ? 'success' : 'info')
  }

  return { isFavorite, toggle }
}

/** Productos favoritos del usuario actual, ignorando los que el admin haya eliminado. */
export function useFavoriteProducts() {
  const { user } = useCurrentUser()
  const ids = useFavoritesStore((state) => (user ? state.byUser[user.id] : null) ?? NO_FAVORITES)
  const products = useProductsStore((state) => state.products)

  return useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]))
    return ids.map((id) => byId.get(id)).filter(Boolean)
  }, [ids, products])
}
