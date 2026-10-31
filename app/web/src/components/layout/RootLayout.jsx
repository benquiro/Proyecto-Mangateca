import { Outlet, ScrollRestoration, useMatches } from 'react-router'
import { ProductDetailModal } from '../product/ProductDetailModal.jsx'
import { Toaster } from '../ui/Toaster.jsx'
import { Footer } from './Footer.jsx'
import { Header } from './Header.jsx'

export function RootLayout() {
  const matches = useMatches()
  const hideFooter = matches.some((match) => match.handle?.hideFooter)

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-medium shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <ProductDetailModal />
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}
