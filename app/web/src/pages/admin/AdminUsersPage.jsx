import { useId, useState } from 'react'
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons/index.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useCurrentUser } from '../../hooks/useCurrentUser.js'
import { cn } from '../../lib/cn.js'
import { formatDate } from '../../lib/format.js'
import { toast } from '../../stores/toastStore.js'
import { ROLES, useUsersStore } from '../../stores/usersStore.js'
import { UserForm } from './UserForm.jsx'

export default function AdminUsersPage() {
  const users = useUsersStore((state) => state.users)
  const deleteUser = useUsersStore((state) => state.deleteUser)
  const { user: currentUser } = useCurrentUser()
  // null: cerrado · { user: null }: alta · { user }: edición
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const formTitleId = useId()

  const handleDelete = () => {
    const error = deleteUser(deleting.id, currentUser.id)
    if (error) toast(error, 'error')
    else toast(`Usuario «${deleting.username}» eliminado`, 'info')
    setDeleting(null)
  }

  return (
    <>
      <title>Usuarios · Administración · Mangateca</title>

      <div className="flex justify-end">
        <Button onClick={() => setEditing({ user: null })}>
          <PlusIcon className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Usuario</th>
              <th scope="col" className="px-4 py-3 font-medium">Email</th>
              <th scope="col" className="px-4 py-3 font-medium">Rol</th>
              <th scope="col" className="px-4 py-3 font-medium">Alta</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf = user.id === currentUser.id
              return (
                <tr key={user.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700 uppercase"
                      >
                        {user.username.charAt(0)}
                      </span>
                      <span className="font-medium text-gray-900">{user.username}</span>
                      {isSelf && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Tú</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        user.role === 'admin' ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-700',
                      )}
                    >
                      {ROLES[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing({ user })}
                        aria-label={`Editar ${user.username}`}
                        title="Editar"
                        className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(user)}
                        disabled={isSelf}
                        aria-label={`Eliminar ${user.username}`}
                        title={isSelf ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'}
                        className="grid size-9 place-items-center rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} labelledBy={formTitleId}>
        <UserForm
          key={editing?.user?.id ?? 'nuevo'}
          user={editing?.user ?? null}
          currentUserId={currentUser.id}
          titleId={formTitleId}
          onDone={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar usuario"
        message={`¿Seguro que quieres eliminar a «${deleting?.username}»? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  )
}
