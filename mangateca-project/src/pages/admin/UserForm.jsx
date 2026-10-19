import { useActionState } from 'react'
import { CloseIcon } from '../../components/icons/index.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { FormError, SelectField, TextField } from '../../components/ui/FormFields.jsx'
import { PASSWORD_MIN_LENGTH, validateUserFields } from '../../lib/validation.js'
import { toast } from '../../stores/toastStore.js'
import { ROLES, useUsersStore } from '../../stores/usersStore.js'

const EMPTY_USER = { username: '', email: '', role: 'client' }

const ROLE_OPTIONS = Object.entries(ROLES).map(([value, label]) => ({ value, label }))

/** Alta/edición de usuarios. Al editar, la contraseña vacía conserva la actual. */
export function UserForm({ user, currentUserId, titleId, onDone }) {
  const addUser = useUsersStore((state) => state.addUser)
  const updateUser = useUsersStore((state) => state.updateUser)
  const getConflicts = useUsersStore((state) => state.getConflicts)
  const isSelf = user?.id === currentUserId

  const [state, formAction, isPending] = useActionState(
    (_prevState, formData) => {
      const values = {
        username: String(formData.get('username') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        role: formData.get('role') === 'admin' ? 'admin' : 'client',
      }
      const password = String(formData.get('password') ?? '')

      const errors = {
        ...getConflicts(values, user?.id ?? null),
        ...validateUserFields({ ...values, password }, { passwordRequired: !user }),
      }
      if (Object.keys(errors).length > 0) return { values, errors, formError: null }

      if (user) {
        const formError = updateUser(user.id, password ? { ...values, password } : values, currentUserId)
        if (formError) return { values, errors: {}, formError }
        toast(`Usuario «${values.username}» actualizado`)
      } else {
        addUser({ ...values, password })
        toast(`Usuario «${values.username}» creado`)
      }
      onDone()
      return { values, errors: {}, formError: null }
    },
    { values: user ?? EMPTY_USER, errors: {}, formError: null },
  )
  const { values, errors, formError } = state

  return (
    <form action={formAction} noValidate>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {user ? 'Editar usuario' : 'Nuevo usuario'}
        </h2>
        <button
          type="button"
          onClick={onDone}
          aria-label="Cerrar"
          className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-6">
        <FormError>{formError}</FormError>
        <TextField
          label="Nombre de usuario"
          name="username"
          autoComplete="off"
          defaultValue={values.username}
          error={errors.username}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="off"
          defaultValue={values.email}
          error={errors.email}
        />
        <TextField
          label={user ? 'Nueva contraseña' : 'Contraseña'}
          name="password"
          type="password"
          autoComplete="new-password"
          error={errors.password}
          hint={
            user
              ? 'Déjala en blanco para mantener la actual.'
              : `Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`
          }
        />
        {isSelf ? (
          <>
            {/* Un admin no puede quitarse su propio rol: el select se bloquea y se envía el actual. */}
            <input type="hidden" name="role" value={values.role} />
            <SelectField
              label="Rol"
              defaultValue={values.role}
              options={ROLE_OPTIONS}
              disabled
              hint="No puedes cambiar tu propio rol."
            />
          </>
        ) : (
          <SelectField label="Rol" name="role" defaultValue={values.role} options={ROLE_OPTIONS} />
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {user ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  )
}
