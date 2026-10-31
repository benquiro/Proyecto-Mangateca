import categoriesSeed from '../../db/categories.json'

export const PRODUCT_TYPES = {
  BOOK: { label: 'Libro', plural: 'Libros', path: '/libros' },
  MANGA: { label: 'Manga', plural: 'Mangas', path: '/mangas' },
  COMIC: { label: 'Cómic', plural: 'Cómics', path: '/comics' },
}

export const categories = categoriesSeed

const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

export function getCategoryName(id) {
  return categoryNames.get(id) ?? 'Sin categoría'
}
