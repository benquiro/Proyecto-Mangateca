import { cn } from '../../lib/cn.js'
import { MAX_QUANTITY } from '../../stores/cartStore.js'
import { MinusIcon, PlusIcon } from '../icons/index.jsx'

export function QuantityStepper({ value, onChange, disabled = false, size = 'md', label = 'Cantidad' }) {
  const buttonSize = size === 'sm' ? 'size-8' : 'size-10'

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-gray-300 bg-white"
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={cn(
          buttonSize,
          'grid place-items-center rounded-full text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <MinusIcon className="size-4" />
      </button>
      <output aria-live="polite" className="w-7 text-center text-sm font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={disabled || value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        className={cn(
          buttonSize,
          'grid place-items-center rounded-full text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}
