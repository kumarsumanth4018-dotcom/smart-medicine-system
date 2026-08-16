/**
 * Divider Component
 *
 * Purpose : A horizontal (or vertical) separator used to visually
 *           divide sections within a page or card.
 * Location : src/components/ui/Divider.jsx
 *
 * Features : optional label text centered on the line
 *            (e.g. "or", "and", section headings)
 *
 * Future usage: Auth forms ("or continue with"), card sections,
 *               settings pages, form groups.
 */

/**
 * @param {object}  props
 * @param {string}  [props.label]        — optional centred text label
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']
 * @param {string}  [props.className]
 */
function Divider({ label, orientation = 'horizontal', className = '' }) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`self-stretch w-px bg-border-default ${className}`}
      />
    )
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-3 my-6 ${className}`}
      >
        <div className="flex-1 h-px bg-[var(--color-border-default)]" />
        <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--color-border-default)]" />
      </div>
    )
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`h-px border-0 bg-[var(--color-border-default)] my-6 ${className}`}
    />
  )
}

export default Divider
