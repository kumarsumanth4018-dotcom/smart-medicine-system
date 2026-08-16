/**
 * Spinner Component
 *
 * Purpose : Animated loading indicator for async operations.
 * Location : src/components/feedback/Spinner.jsx
 *
 * Sizes    : xs | sm | md | lg | xl
 * Colors   : primary | secondary | white | muted
 * Features : optional label for screen readers, optional center wrapper
 *
 * Future usage : Button loading state (already in Button.jsx),
 *   page-level data fetching (Module 4 dashboards, search results),
 *   form submit indicators.
 */

const SIZES = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

const COLORS = {
  primary:   'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white:     'border-white/30 border-t-white',
  muted:     'border-slate-200 border-t-slate-500',
}

/**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {'primary'|'secondary'|'white'|'muted'} [props.color='primary']
 * @param {string}  [props.label='Loading…']  — screen-reader text
 * @param {boolean} [props.center=false]       — wrap in full-width flex center
 * @param {string}  [props.className]
 */
function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Loading…',
  center = false,
  className = '',
}) {
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={[
        'rounded-full animate-spin shrink-0',
        SIZES[size] ?? SIZES.md,
        COLORS[color] ?? COLORS.primary,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="sr-only">{label}</span>
    </div>
  )

  if (center) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        {spinner}
      </div>
    )
  }
  return spinner
}

export default Spinner
