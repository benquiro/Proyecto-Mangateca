import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ProductCard } from '../ProductCard.jsx'

describe('Componente ProductCard', () => {
  const sampleProduct = {
    id: 1,
    title: 'One Piece Vol. 1',
    author: 'Eiichiro Oda',
    price: 9.99,
    type: 'MANGA',
    available: true,
    imageUrl: 'https://images.mangateca.com/onepiece1.jpg',
  }

  it('renderiza título, autor y precio formateado', () => {
    render(
      <MemoryRouter>
        <ProductCard product={sampleProduct} />
      </MemoryRouter>,
    )

    expect(screen.getByText('One Piece Vol. 1')).toBeInTheDocument()
    expect(screen.getByText('Eiichiro Oda')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('Manga')).toBeInTheDocument()
  })

  it('muestra el indicador de "Agotado" cuando available es false', () => {
    const unavailableProduct = { ...sampleProduct, available: false }
    render(
      <MemoryRouter>
        <ProductCard product={unavailableProduct} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })

  it('incluye los botones interactivos de carrito y favoritos', () => {
    render(
      <MemoryRouter>
        <ProductCard product={sampleProduct} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /agregar.*al carrito/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /favorito/i })).toBeInTheDocument()
  })
})
