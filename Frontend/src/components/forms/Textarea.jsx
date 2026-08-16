/**
 * Textarea Component
 *
 * Purpose : Multi-line text input for notes, descriptions, and
 *           prescription remarks.
 * Location : src/components/forms/Textarea.jsx
 *
 * Features : configurable rows, character counter (optional),
 *            resize control, all FormField wrappers
 *
 * Future usage: Prescription notes, pharmacy product descriptions,
 *               admin feedback, report summaries.
 */

import { forwardRef, useId } from 'react'
import FormField from './FormField'

const Textarea = forwardRef(function Textarea(
  {
    label,
    placeholder,
    helperText,
    error,
    required,
    disabled,
    rows = 4,
    maxLength,
    resize = 'vertical', // 'none' | 'vertical' | 'horizontal' | 'both'
    showCount = false,
    value,
    className = '',
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp || autoId

  const resizeClass = {
    none:       'resize-none',
    vertical:   'resize-y',
    horizontal: 'resize-x',
    both:       'resize',
  }[resize] ?? 'resize-y'

  const textareaClasses = [
    'input-base',
    resizeClass,
    error ? 'input-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const currentLength = typeof value === 'string' ? value.length : 0

  return (
    <FormField
      label={label}
      htmlFor={id}
      required={required}
      helperText={helperText}
      error={error}
    >
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={textareaClasses}
          {...rest}
        />
        {showCount && maxLength && (
          <span className="absolute bottom-2 right-3 text-[10px] text-[var(--color-text-muted)] pointer-events-none">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </FormField>
  )
})

export default Textarea
