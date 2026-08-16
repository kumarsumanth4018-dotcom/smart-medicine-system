/**
 * IconButton Component
 *
 * Purpose : A square/circular button that holds a single icon.
 *           Used for toolbar actions, close buttons, settings
 *           toggles, and inline row actions in tables.
 * Location : src/components/ui/IconButton.jsx
 *
 * Variants : primary | secondary | outline | ghost | danger
 * Sizes    : sm | md | lg
 * States   : default | loading | disabled
 *
 * Accessibility: always requires an `aria-label` prop so screen
 * readers can describe the action the icon represents.
 */

import { FiLoader } from 'react-icons/fi'

const BASE =
  'inline-flex items-center justify-center rounded-md transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'select-none shrink-0'

const VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-sm',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500 shadow-sm',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500',
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-slate-400',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500 shadow-sm',
}

const SIZES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
}

const DISABLED = 'opacity-50 cursor-not-allowed pointer-events-none'

/**
 * @param {object} props
 * @param {React.ReactNode} props.icon         — required icon element
 * @param {string}  props['aria-label']        — required for accessibility
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='ghost']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.rounded=false]      — pill/circle shape
 * @param {string}  [props.className]
 */
function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  rounded = false,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading

  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.ghost,
    SIZES[size] ?? SIZES.md,
    rounded ? 'rounded-full' : 'rounded-md',
    isDisabled ? DISABLED : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      {...rest}
    >
      {loading
        ? <FiLoader className="animate-spin" aria-hidden="true" />
        : <span aria-hidden="true">{icon}</span>
      }
    </button>
  )
}

export default IconButton
