/**
 * RadioGroup Component
 *
 * Purpose : Group of radio buttons for mutually exclusive option
 *           selection. Fully accessible with proper role/aria.
 * Location : src/components/forms/RadioGroup.jsx
 *
 * Layout   : 'vertical' | 'horizontal'
 * Features : group label, individual option descriptions,
 *            error state, disabled per-option or entire group
 *
 * Future usage: User role selection on register (Patient / Doctor),
 *               gender selection, medicine type filter, report period.
 */

import { useId } from 'react'

/**
 * @param {object}   props
 * @param {string}   [props.label]          — group label
 * @param {string}   props.name             — radio group name (required)
 * @param {Array}    props.options           — [{ value, label, description?, disabled? }]
 * @param {string}   [props.value]          — controlled selected value
 * @param {Function} [props.onChange]
 * @param {'vertical'|'horizontal'} [props.layout='vertical']
 * @param {string}   [props.error]
 * @param {boolean}  [props.disabled]       — disables all options
 * @param {string}   [props.className]
 */
function RadioGroup({
  label,
  name,
  options = [],
  value,
  onChange,
  layout = 'vertical',
  error,
  disabled = false,
  className = '',
}) {
  const groupId = useId()
  const errorId = `${groupId}-error`

  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className}`}
      aria-describedby={error ? errorId : undefined}
    >
      {label && (
        <legend className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
          {label}
        </legend>
      )}

      <div
        className={
          layout === 'horizontal'
            ? 'flex flex-wrap gap-x-6 gap-y-2'
            : 'flex flex-col gap-2'
        }
      >
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`
          const isDisabled = disabled || opt.disabled

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={`flex items-start gap-2.5 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id={optId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={onChange}
                  disabled={isDisabled}
                  className={[
                    'w-4 h-4 border cursor-pointer',
                    'border-[var(--color-border-strong)]',
                    'text-primary-600',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                    'disabled:cursor-not-allowed',
                    error ? 'border-danger-500' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>
              <div>
                <span className="text-sm text-[var(--color-text-primary)]">
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {opt.description}
                  </p>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger-600 mt-1.5">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default RadioGroup
