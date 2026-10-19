import { useEffect, useEffectEvent } from 'react'

/** Llama a `onDismiss` al pulsar fuera de `ref` o con Escape, mientras `active` sea true. */
export function useDismiss(ref, onDismiss, active) {
  const dismiss = useEffectEvent(onDismiss)

  useEffect(() => {
    if (!active) return

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) dismiss()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') dismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, active])
}
