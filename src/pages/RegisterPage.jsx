import { useActionState } from 'react'
import { Link, useLocation } from 'react-router'
import { AuthCard } from '../components/auth/AuthCard.jsx'
import { Button } from '../components/ui/Button.jsx'
import { TextField } from '../components/ui/FormFields.jsx'
import { PASSWORD_MIN_LENGTH, validateUserFields } from '../lib/validation.js'
import { useAuthStore } from '../stores/authStore.js'
import { toast } from '../stores/toastStore.js'

const initialState = { errors: {}, values: { username: '', email: '' } }

// Tras registrarse se inicia sesión y el guard GuestOnly redirige a la página de origen.
function registerAction(_prevState, formData) {
  const values = {
    username: String(formData.get('username') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
  }
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const errors = validateUserFields({ ...values, password })
  if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.'
  if (Object.keys(errors).length > 0) return { errors, values }

  const result = useAuthStore.getState().register({ ...values, password })
  if (result.errors) return { errors: result.errors, values }

  toast(`¡Bienvenido a Mangateca, ${result.user.username}!`)
  return initialState
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const location = useLocation()
  const { errors, values } = state

  return (
    <AuthCard
      title="Crear cuenta"
      description="Regístrate para guardar tus favoritos."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-brand-700 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <title>Crear cuenta · Mangateca</title>
      <form action={formAction} noValidate className="space-y-5">
        <TextField
          label="Nombre de usuario"
          name="username"
          autoComplete="username"
          defaultValue={values.username}
          error={errors.username}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          error={errors.email}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}
          error={errors.password}
          required
        />
        <TextField
          label="Repite la contraseña"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
        />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          Crear cuenta
        </Button>
      </form>
    </AuthCard>
  )
}
