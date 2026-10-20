import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

const PRODUCT_PARAM = 'producto'

/**
 * El detalle de producto se abre con ?producto=:id sobre la página actual.
 * El enlace se puede compartir y el botón Atrás del navegador cierra el modal.
 */
export function useProductModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const productId = Number(searchParams.get(PRODUCT_PARAM)) || null

  /** URL de la página actual con el modal abierto (conserva los demás filtros). */
  const productHref = useCallback(
    (id) => {
      const next = new URLSearchParams(searchParams)
      next.set(PRODUCT_PARAM, String(id))
      return { pathname: location.pathname, search: `?${next}` }
    },
    [location.pathname, searchParams],
  )

  const openProduct = useCallback(
    (id) => navigate(productHref(id), { state: { productModal: true }, preventScrollReset: true }),
    [navigate, productHref],
  )

  const closeProduct = useCallback(() => {
    // Si lo abrimos nosotros, volver atrás deja el historial limpio.
    // Si se llegó por un enlace directo, se quita el parámetro sin salir de la página.
    if (location.state?.productModal) {
      navigate(-1)
      return
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(PRODUCT_PARAM)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }, [location.state, navigate, setSearchParams])

  return { productId, productHref, openProduct, closeProduct }
}
