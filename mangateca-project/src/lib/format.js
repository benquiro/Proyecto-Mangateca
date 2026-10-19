const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatPrice(value) {
  return priceFormatter.format(value ?? 0)
}

/** Formatea fechas ISO (YYYY-MM-DD o completas) como "5 de junio de 1967". */
export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}
