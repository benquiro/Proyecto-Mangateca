import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from '../EmptyState.jsx'

describe('Componente EmptyState (EmptyState.jsx)', () => {
  it('renderiza título, descripción y contenido hijo (children)', () => {
    render(
      <EmptyState
        title="Tu carrito está vacío"
        description="Explora nuestro catálogo para encontrar tus obras favoritas"
      >
        <button type="button">Ir a la tienda</button>
      </EmptyState>,
    )

    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
    expect(
      screen.getByText('Explora nuestro catálogo para encontrar tus obras favoritas'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ir a la tienda' })).toBeInTheDocument()
  })

  it('renderiza el icono si se proporciona', () => {
    const DummyIcon = () => <svg data-testid="dummy-icon" />
    render(<EmptyState icon={DummyIcon} title="Sin resultados" />)

    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument()
  })
})
