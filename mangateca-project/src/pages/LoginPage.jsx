import { useActionState } from 'react'
import { Link, useLocation } from 'react-router'
import { AuthCard } from '../components/auth/AuthCard.jsx'
import { Button } from '../components/ui/Button.jsx'
import { FormError, TextField } from '../components/ui/FormFields.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { toast } from '../stores/toastStore.js'

const initialState = { error: null, identifier: '' }

// Tras un login correcto, el guard GuestOnly redirige a la página de origen.
function loginAction(_prevState, formData) {
  const identifier = String(formData.get('identifier') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!identifier || !password) {
    return { error: 'Introduce tu usuario o email y tu contraseña.', identifier }
  }
  const user = useAuthStore.getState().login(identifier, password)
  if (!user) {
    return { error: 'Usuario o contraseña incorrectos.', identifier }
  }
  toast(`¡Hola, ${user.username}!`)
  return initialState
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const location = useLocation()
  const redirected = Boolean(location.state?.from)

  return (
    <AuthCard
      title="Iniciar sesión"
      description={
        redirected
          ? 'Inicia sesión o crea una cuenta para continuar.'
          : 'Bienvenido de nuevo a Mangateca.'
      }
      footer={
        <>
          ¿No tienes cuenta?{' '}
          {/* Se conserva la página de origen para volver tras el registro. */}
          <Link to="/registro" state={location.state} className="font-semibold text-brand-700 hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <title>Iniciar sesión · Mangateca</title>
      <form action={formAction} noValidate className="space-y-5">
        <FormError>{state.error}</FormError>
        <TextField
          label="Usuario o email"
          name="identifier"
          autoComplete="username"
          defaultValue={state.identifier}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          Entrar
        </Button>
      </form>

      <details className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-700">Cuentas de prueba</summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="font-medium">Admin</dt>
          <dd>
            <code>admin</code> / <code>Admin_Manga2026!</code>
          </dd>
          <dt className="font-medium">Cliente</dt>
          <dd>
            <code>cliente</code> / <code>Cliente_Manga2026!</code>
          </dd>
        </dl>
      </details>
    </AuthCard>
  )
}
