/**
 * SectionHeader Component
 *
 * Purpose : Consistent heading for sub-sections within a page or card.
 *           Used to visually separate logical content groups.
 *
 * Location : src/components/layout/SectionHeader.jsx
 *
 * Features :
 *   - Title (h2 by default, configurable) + optional description
 *   - Optional leading icon
 *   - Optional right-side action slot
 *   - Optional coloured left-border accent
 *   - Size variants: sm | md | lg
 *
 * Future modules :
 *   Module 4 : Dashboard sections, search result groups
 *   Module 5 : Inventory sections, pharmacy profile sections
 *   Module 6 : Admin report sections
 *
 * @param {object}  props
 * @param {string}  props.title
 * @param {string}  [props.description]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} [props.actions]
 * @param {'h2'|'h3'|'h4'} [props.as='h2']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.divider=false]   — show bottom border
 * @param {boolean} [props.accent=false]    — show left-side colour accent
 * @param {string}  [props.className]
 */

const TITLE_SIZES = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg font-bold',
}

const DESC_SIZES = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
}

function SectionHeader({
  title,
  description,
  icon,
  actions,
  as: Tag = 'h2',
  size = 'md',
  divider = false,
  accent = false,
  className = '',
}) {
  return (
    <div
      className={[
        'flex items-start justify-between gap-4',
        divider ? 'pb-3 mb-4 border-b border-slate-200' : 'mb-4',
        accent ? 'pl-3 border-l-4 border-primary-500' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left — icon + text */}
      <div className="flex items-start gap-2 min-w-0">
        {icon && (
          <span className="text-primary-600 shrink-0 mt-0.5" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <Tag
            className={[
              TITLE_SIZES[size] ?? TITLE_SIZES.md,
              'text-slate-800 leading-snug',
            ].join(' ')}
          >
            {title}
          </Tag>
          {description && (
            <p
              className={[
                DESC_SIZES[size] ?? DESC_SIZES.md,
                'text-slate-500 mt-0.5',
              ].join(' ')}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right — actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}

export default SectionHeader
