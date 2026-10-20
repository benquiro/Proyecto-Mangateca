import { cn } from '../../lib/cn.js'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

/** Clases de botón reutilizables también en <Link>. */
export function buttonClasses({ variant = 'primary', size = 'md', className } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
