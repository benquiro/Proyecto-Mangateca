import { Link } from 'react-router'
import { Container } from '../components/layout/Container.jsx'
import { buttonClasses } from '../components/ui/buttonStyles.js'

export default function NotFoundPage() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-16 text-center">
      <title>Página no encontrada · Mangateca</title>
      <div>
        <p className="text-6xl font-bold text-brand-500">404</p>
        <h1 className="mt-4 text-2xl font-bold">No encontramos esta página</h1>
        <p className="mt-2 text-gray-600">Puede que el enlace esté roto o que la página ya no exista.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={buttonClasses()}>
            Ir al inicio
          </Link>
          <Link to="/productos" className={buttonClasses({ variant: 'secondary' })}>
            Ver productos
          </Link>
        </div>
      </div>
    </Container>
  )
}
