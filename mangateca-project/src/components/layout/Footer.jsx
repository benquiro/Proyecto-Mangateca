import { Link } from 'react-router'
import { NAV_LINKS } from '../../data/navigation.js'
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  YoutubeIcon,
} from '../icons/index.jsx'
import { Container } from './Container.jsx'

const ACCOUNT_LINKS = [
  { to: '/login', label: 'Iniciar sesión' },
  { to: '/registro', label: 'Crear cuenta' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/carrito', label: 'Carrito' },
]

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com', label: 'Instagram', icon: InstagramIcon },
  { href: 'https://www.facebook.com', label: 'Facebook', icon: FacebookIcon },
  { href: 'https://www.youtube.com', label: 'YouTube', icon: YoutubeIcon },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-gray-600 transition-colors hover:text-brand-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/favicon.svg" alt="" width="36" height="36" className="size-9" />
            <span className="text-xl font-bold tracking-tight">Mangateca</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-gray-600">
            Libros, mangas y cómics para todo tipo de lectores. Encuentra tu próxima historia.
          </p>
          <ul className="mt-6 flex gap-2">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Explorar" links={NAV_LINKS} />
        <FooterColumn title="Mi cuenta" links={ACCOUNT_LINKS} />

        <div>
          <h2 className="text-sm font-semibold text-gray-900">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <a href="mailto:contacto@mangateca.com" className="hover:text-brand-700">
                contacto@mangateca.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <a href="tel:+56223456789" className="hover:text-brand-700">
                +56 2 2345 6789
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <span>Av. Providencia 1234, Santiago</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">Lunes a viernes, de 9:00 a 18:00.</p>
        </div>
      </Container>

      <div className="border-t border-gray-200">
        <Container className="flex flex-col gap-2 py-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Mangateca. Todos los derechos reservados.</p>
          <p>Tienda de demostración: no se realizan compras reales.</p>
        </Container>
      </div>
    </footer>
  )
}
