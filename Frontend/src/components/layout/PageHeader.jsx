/**
 * PageHeader Component
 *
 * Purpose : Consistent top-of-page heading block used at the start of
 *           every application page. Ensures visual rhythm and hierarchy.
 *
 * Location : src/components/layout/PageHeader.jsx
 *
 * Features :
 *   - Title (h1) + optional subtitle
 *   - Optional breadcrumb slot (above title)
 *   - Optional action slot (right-aligned — for Add/Export buttons)
 *   - Optional back link
 *   - Responsive layout (stacks on mobile, side-by-side on desktop)
 *
 * Future modules :
 *   Module 4 : User Dashboard, Search Results, Medicine Detail
 *   Module 5 : Pharmacy Dashboard, Inventory
 *   Module 6 : Admin Dashboard, User Management
 *
 * @param {object}  props
 * @param {string}  props.title                  — page title (required)
 * @param {string}  [props.subtitle]
 * @param {React.ReactNode} [props.breadcrumb]   — Breadcrumb component
 * @param {React.ReactNode} [props.actions]      — right-side action buttons
 * @param {string}  [props.className]
 */
function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  className = '',
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumb && (
        <div className="mb-2">{breadcrumb}</div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left — title & subtitle */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right — action slot */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
