export function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
      {Icon && (
        <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon className="size-7" />
        </span>
      )}
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-600">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
