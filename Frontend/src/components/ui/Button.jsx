/**
 * Button Component
 *
 * Purpose : Primary interactive element used across all pages.
 * Location : src/components/ui/Button.jsx
 *
 * Variants : primary | secondary | outline | ghost | danger
 * Sizes    : sm | md | lg
 * States   : default | loading | disabled
 * Features : optional left/right icon, full-width option,
 *            loading spinner, accessible aria attributes
 *
 * Future usage: Login, Register, Search, Forms, Dashboards,
 *               Admin panels, Pharmacy inventory actions.
 */

import { FiLoader } from 'react-icons/fi'

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md ' +
  'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 select-none whitespace-nowrap'

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 ' +
    'focus-visible:ring-primary-500 shadow-sm hover:shadow-md',
  secondary:
    'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 ' +
    'focus-visible:ring-secondary-500 shadow-sm hover:shadow-md',
  outline:
    'border border-primary-600 text-primary-600 bg-transparent ' +
    'hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  ghost:
    'text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100 ' +
    'focus-visible:ring-primary-500',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 ' +
    'focus-visible:ring-danger-500 shadow-sm hover:shadow-md',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-10',
  lg: 'text-base px-6 py-2.5 h-12',
}

const DISABLED = 'opacity-50 cursor-not-allowed pointer-events-none'

/**
 * @param {object}  props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading=false]  — shows spinner, disables interaction
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {React.ReactNode} [props.leftIcon]  — icon before label
 * @param {React.ReactNode} [props.rightIcon] — icon after label
 * @param {string}  [props.type='button']
 * @param {string}  [props.className]       — additional Tailwind classes
 * @param {React.ReactNode} props.children
 */
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading

  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    isDisabled ? DISABLED : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      {...rest}
    >
      {loading ? (
        <FiLoader className="animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}

export default Button
