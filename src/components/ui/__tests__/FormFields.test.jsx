import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormError, SelectField, TextAreaField, TextField } from '../FormFields.jsx'

describe('Componentes FormFields (FormFields.jsx)', () => {
  describe('TextField', () => {
    it('asocia correctamente la etiqueta (label) con el input', () => {
      render(<TextField label="Correo electrónico" name="email" />)
      const input = screen.getByLabelText('Correo electrónico')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'email')
    })

    it('aplica aria-invalid y vincula aria-describedby cuando hay error', () => {
      render(
        <TextField
          label="Nombre de usuario"
          name="username"
          error="Este campo es obligatorio"
        />,
      )
      const input = screen.getByLabelText('Nombre de usuario')
      const errorMessage = screen.getByText('Este campo es obligatorio')

      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
    })

    it('muestra el texto de ayuda (hint) cuando no hay error', () => {
      render(
        <TextField
          label="Contraseña"
          hint="Mínimo 8 caracteres"
        />,
      )
      expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument()
    })
  })

  describe('SelectField', () => {
    it('renderiza opciones y etiqueta adecuadamente', () => {
      const options = [
        { value: 'MANGA', label: 'Manga japonés' },
        { value: 'COMIC', label: 'Cómic americano' },
      ]
      render(<SelectField label="Tipo de producto" options={options} />)

      const select = screen.getByLabelText('Tipo de producto')
      expect(select).toBeInTheDocument()
      expect(screen.getByText('Manga japonés')).toBeInTheDocument()
      expect(screen.getByText('Cómic americano')).toBeInTheDocument()
    })
  })

  describe('FormError', () => {
    it('renderiza una alerta accesible cuando tiene contenido', () => {
      render(<FormError>Error general del servidor</FormError>)
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent('Error general del servidor')
    })

    it('no renderiza nada si children está vacío o es null', () => {
      const { container } = render(<FormError>{null}</FormError>)
      expect(container.firstChild).toBeNull()
    })
  })
})
