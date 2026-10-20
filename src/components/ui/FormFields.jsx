import { useId } from 'react'
import { cn } from '../../lib/cn.js'

const controlClasses =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 aria-invalid:border-red-500'

function describedBy(id, error, hint) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

function Field({ id, label, error, hint, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function TextField({ label, error, hint, className, ...inputProps }) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClasses}
        {...inputProps}
      />
    </Field>
  )
}

export function TextAreaField({ label, error, hint, className, ...textareaProps }) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClasses, 'resize-y')}
        {...textareaProps}
      />
    </Field>
  )
}

export function SelectField({ label, error, hint, className, options, ...selectProps }) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClasses}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function FormError({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {children}
    </p>
  )
}
