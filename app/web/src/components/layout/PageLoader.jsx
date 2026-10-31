export function PageLoader() {
  return (
    <div role="status" className="grid min-h-[50vh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-3 border-brand-100 border-t-brand-500" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
