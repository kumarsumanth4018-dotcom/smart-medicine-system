/**
 * EmptyState Component
 *
 * Purpose : Informative placeholder shown when a list/table/page
 *           has no data to display. Guides users toward an action.
 * Location : src/components/feedback/EmptyState.jsx
 *
 * Features : configurable icon, title, description, action button,
 *            size variants, and preset convenience exports
 *
 * Future usage :
 *   Module 4 — No search results, empty notifications, empty history
 *   Module 5 — Empty inventory
 *   Module 6 — No users found, no reports
 */

import { HiOutlineInboxStack } from 'react-icons/hi2'

const SIZES = {
  sm: { wrapper: 'py-8',  icon: 'w-10 h-10', title: 'text-sm', desc: 'text-xs' },
  md: { wrapper: 'py-12', icon: 'w-14 h-14', title: 'text-base', desc: 'text-sm' },
  lg: { wrapper: 'py-16', icon: 'w-20 h-20', title: 'text-xl',  desc: 'text-sm' },
}

/**
 * @param {React.ReactNode} [props.icon]
 * @param {string}  props.title
 * @param {string}  [props.description]
 * @param {React.ReactNode} [props.action]   — CTA button/link
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string}  [props.className]
 */
function EmptyState({
  icon,
  title = 'Nothing here yet',
  description,
  action,
  size = 'md',
  className = '',
}) {
  const s = SIZES[size] ?? SIZES.md
  const Icon = icon ?? (
    <HiOutlineInboxStack
      className={`${s.icon} text-slate-300`}
      aria-hidden="true"
    />
  )

  return (
    <div
      role="status"
      className={[
        'flex flex-col items-center justify-center text-center gap-3',
        s.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-center">
        {typeof icon === 'undefined' ? Icon : (
          <span className={`${s.icon} text-slate-300 flex items-center justify-center`}>
            {icon}
          </span>
        )}
      </div>

      <div className="space-y-1 max-w-xs">
        <p className={`${s.title} font-semibold text-slate-700`}>{title}</p>
        {description && (
          <p className={`${s.desc} text-slate-400 leading-relaxed`}>
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
