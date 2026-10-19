import { Link } from 'react-router'

/** Marco común de las páginas de login y registro. */
export function AuthCard({ title, description, children, footer }) {
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Link to="/" aria-label="Volver a la portada de Mangateca" className="inline-block">
            <img src="/favicon.svg" alt="" width="56" height="56" className="size-14" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
      </div>
    </div>
  )
}
