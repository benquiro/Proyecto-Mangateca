import { buttonClasses } from './buttonStyles.js'

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}
