/**
 * Badge Component
 *
 * Purpose : Small status or category label displayed inline with
 *           medicine names, user roles, inventory status, etc.
 * Location : src/components/ui/Badge.jsx
 *
 * Variants : primary | secondary | success | warning | danger |
 *            info | accent | neutral
 * Sizes    : sm | md
 * Features : optional leading dot indicator, optional icon
 *
 * Future usage: Medicine availability (In Stock / Out of Stock),
 *               user role tags, order status, prescription status.
 */

const VARIANTS = {
  primary:   'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success:   'bg-success-100 text-success-700',
  warning:   'bg-warning-100 text-warning-700',
  danger:    'bg-danger-100 text-danger-700',
  info:      'bg-info-100 text-info-700',
  accent:    'bg-accent-100 text-accent-700',
  neutral:   'bg-slate-100 text-slate-600',
}

const DOT_COLORS = {
  primary:   'bg-primary-500',
  secondary: 'bg-secondary-500',
  success:   'bg-success-500',
  warning:   'bg-warning-500',
  danger:    'bg-danger-500',
  info:      'bg-info-500',
  accent:    'bg-accent-500',
  neutral:   'bg-slate-400',
}

const SIZES = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
}

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'info'|'accent'|'neutral'} [props.variant='neutral']
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.dot=false]          — shows a leading pulse dot
 * @param {React.ReactNode} [props.icon]        — optional leading icon
 * @param {string}  [props.className]
 * @param {React.ReactNode} props.children
 */
function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className = '',
  children,
}) {
  const classes = [
    'inline-flex items-center gap-1.5 font-medium rounded-full leading-none',
    VARIANTS[variant] ?? VARIANTS.neutral,
    SIZES[size] ?? SIZES.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLORS[variant]}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}

export default Badge
