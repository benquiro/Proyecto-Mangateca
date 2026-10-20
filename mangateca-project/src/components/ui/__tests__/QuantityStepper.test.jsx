import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuantityStepper } from '../QuantityStepper.jsx'
import { MAX_QUANTITY } from '../../../stores/cartStore.js'

describe('Componente QuantityStepper', () => {
  it('renderiza con el valor provisto en un output accesible', () => {
    render(<QuantityStepper value={3} onChange={vi.fn()} />)
    expect(screen.getByRole('group', { name: 'Cantidad' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('llama a onChange con (value + 1) al presionar el botón de aumento', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<QuantityStepper value={2} onChange={handleChange} />)

    const plusBtn = screen.getByRole('button', { name: 'Aumentar cantidad' })
    await user.click(plusBtn)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('llama a onChange con (value - 1) al presionar el botón de disminución', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<QuantityStepper value={5} onChange={handleChange} />)

    const minusBtn = screen.getByRole('button', { name: 'Disminuir cantidad' })
    await user.click(minusBtn)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('deshabilita el botón de disminución cuando el valor es 1', () => {
    render(<QuantityStepper value={1} onChange={vi.fn()} />)
    const minusBtn = screen.getByRole('button', { name: 'Disminuir cantidad' })
    expect(minusBtn).toBeDisabled()
  })

  it('deshabilita el botón de aumento cuando el valor alcanza MAX_QUANTITY', () => {
    render(<QuantityStepper value={MAX_QUANTITY} onChange={vi.fn()} />)
    const plusBtn = screen.getByRole('button', { name: 'Aumentar cantidad' })
    expect(plusBtn).toBeDisabled()
  })

  it('deshabilita ambos botones cuando la prop disabled es true', () => {
    render(<QuantityStepper value={3} onChange={vi.fn()} disabled={true} />)
    expect(screen.getByRole('button', { name: 'Disminuir cantidad' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' })).toBeDisabled()
  })
})
