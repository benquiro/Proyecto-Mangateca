/** Minúsculas y sin tildes: "García" → "garcia". */
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/** Cada palabra de la búsqueda debe aparecer en el título, autor o ISBN. */
export function matchProduct(product, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = normalize(`${product.title} ${product.author} ${product.isbn}`)
  return terms.every((term) => haystack.includes(term))
}

function rank(product, normalizedQuery) {
  const title = normalize(product.title)
  if (title.startsWith(normalizedQuery)) return 0
  if (title.includes(normalizedQuery)) return 1
  return 2
}

/** Filtra y ordena: primero títulos que empiezan por la búsqueda, luego los que la contienen. */
export function searchProducts(products, query, limit = Infinity) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []
  return products
    .filter((product) => matchProduct(product, query))
    .sort((a, b) => rank(a, normalizedQuery) - rank(b, normalizedQuery))
    .slice(0, limit)
}
