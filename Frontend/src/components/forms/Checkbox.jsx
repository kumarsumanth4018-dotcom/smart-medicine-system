/**
 * Checkbox Component
 *
 * Purpose : Single checkbox with label and error state, compatible
 *           with React Hook Form.
 * Location : src/components/forms/Checkbox.jsx
 *
 * Features : label on right, helper text, error state, disabled,
 *            indeterminate state support
 *
 * Future usage: "Remember me" on login, terms acceptance on
 *               register, admin bulk-select rows, filter options.
 */

import { forwardRef, useId, useEffect, useRef } from 'react'

const Checkbox = forwardRef(function Checkbox(
  {
    label,
    helperText,
    error,
    disabled,
    indeterminate = false,
    className = '',
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp || autoId
  const innerRef = useRef(null)

  // Support the indeterminate state (not a native HTML attr)
  useEffect(() => {
    const el = innerRef.current
    if (el) el.indeterminate = indeterminate
  }, [indeterminate])

  // Merge forwarded ref with inner ref
  function setRefs(el) {
    innerRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex items-center h-5 mt-0.5">
          <input
            ref={setRefs}
            id={id}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={[
              'w-4 h-4 rounded border cursor-pointer',
              'border-[var(--color-border-strong)]',
              'text-primary-600 bg-white',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error ? 'border-danger-500' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />
        </div>

        {label && (
          <label
            htmlFor={id}
            className={`text-sm leading-5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-[var(--color-text-primary)]`}
          >
            {label}
          </label>
        )}
      </div>

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-[var(--color-text-muted)] ml-6.5">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-600 ml-6.5">
          {error}
        </p>
      )}
    </div>
  )
})

export default Checkbox
