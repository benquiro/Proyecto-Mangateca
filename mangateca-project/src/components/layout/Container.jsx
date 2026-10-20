import { cn } from '../../lib/cn.js'

export function Container({ className, children }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}
