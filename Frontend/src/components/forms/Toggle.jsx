/**
 * Toggle (Switch) Component
 *
 * Purpose : Binary on/off control for settings, preferences, and
 *           feature flags. More visually prominent than a checkbox
 *           for important single-option decisions.
 * Location : src/components/forms/Toggle.jsx
 *
 * Sizes    : sm | md
 * Features : label, helper text, error state, disabled state,
 *            full keyboard accessibility (Space bar toggles)
 *
 * Future usage: Pharmacy availability toggle, notification settings,
 *               admin feature flags, dark mode switch.
 */

import { useId } from 'react'

const TRACK = {
  sm: 'w-8 h-4',
  md: 'w-11 h-6',
}

const THUMB = {
  sm: 'w-3 h-3 translate-x-0.5',
  md: 'w-5 h-5 translate-x-0.5',
}

const THUMB_ACTIVE = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
}

/**
 * @param {object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  props.checked          — controlled value
 * @param {Function} props.onChange
 * @param {boolean}  [props.disabled]
 * @param {'sm'|'md'} [props.size='md']
 * @param {string}   [props.className]
 */
function Toggle({
  label,
  helperText,
  error,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}) {
  const id = useId()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-3">
        {/* The accessible toggle using a <button role="switch"> */}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange?.(!checked)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              if (!disabled) onChange?.(!checked)
            }
          }}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={[
            'relative inline-flex items-center rounded-full transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            TRACK[size] ?? TRACK.md,
            checked
              ? 'bg-primary-600'
              : 'bg-[var(--color-border-strong)]',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span
            className={[
              'inline-block rounded-full bg-white shadow-sm transition-transform duration-200',
              THUMB[size] ?? THUMB.md,
              checked ? THUMB_ACTIVE[size] ?? THUMB_ACTIVE.md : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </button>

        {label && (
          <label
            htmlFor={id}
            onClick={() => !disabled && onChange?.(!checked)}
            className={`text-sm text-[var(--color-text-primary)] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </label>
        )}
      </div>

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-[var(--color-text-muted)] ml-14">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-600 ml-14">
          {error}
        </p>
      )}
    </div>
  )
}

export default Toggle
