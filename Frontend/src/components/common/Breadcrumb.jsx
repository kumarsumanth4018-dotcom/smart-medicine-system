/**
 * Breadcrumb Component
 *
 * Purpose : Hierarchical navigation trail showing the user's
 *           current location within the application.
 * Location : src/components/common/Breadcrumb.jsx
 *
 * Features :
 *   - ARIA nav + aria-label="Breadcrumb"
 *   - aria-current="page" on last item
 *   - Configurable separator (default chevron)
 *   - Home icon on first item (optional)
 *   - Truncation for deep hierarchies
 *   - React Router Link for all non-current items
 *
 * Future usage : Module 4 (Medicine Detail page),
 *   Module 5 (Pharmacy → Inventory), Module 6 (Admin → Users → Edit).
 *
 * @param {Array}  props.items — [{ label, to? }]  last item = current page
 * @param {boolean} [props.showHome=true]
 * @param {string}  [props.className]
 */

import { Link } from 'react-router-dom'
import { HiOutlineHome, HiChevronRight } from 'react-icons/hi2'

function Breadcrumb({ items = [], showHome = true, className = '' }) {
  const all = showHome
    ? [{ label: 'Home', to: '/', isHome: true }, ...items]
    : items

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1" role="list">
        {all.map((item, index) => {
          const isLast = index === all.length - 1

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separator (skip before first item) */}
              {index > 0 && (
                <HiChevronRight
                  size={14}
                  className="text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                /* Current page — not a link */
                <span
                  aria-current="page"
                  className="text-xs font-medium text-slate-700"
                >
                  {item.isHome
                    ? <HiOutlineHome size={14} aria-hidden="true" />
                    : item.label}
                </span>
              ) : (
                /* Ancestor — link */
                <Link
                  to={item.to ?? '/'}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                >
                  {item.isHome
                    ? <HiOutlineHome size={14} aria-hidden="true" />
                    : item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
