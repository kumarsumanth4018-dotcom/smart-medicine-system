/**
 * Select Component
 *
 * Purpose : Native <select> styled to match the design system.
 *           Used for role selection, medicine category filtering,
 *           inventory status, and admin dropdowns.
 * Location : src/components/forms/Select.jsx
 *
 * Features : placeholder option, custom chevron icon, all
 *            FormField wrappers, disabled state
 *
 * Future usage: User role selector, medicine category, pharmacy
 *               district filter, admin report period picker.
 */

import { forwardRef, useId } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import FormField from './FormField'

const Select = forwardRef(function Select(
  {
    label,
    placeholder,
    options = [],  // [{ value, label, disabled? }]
    helperText,
    error,
    required,
    disabled,
    className = '',
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp || autoId

  const selectClasses = [
    'input-base appearance-none pr-9 cursor-pointer',
    error ? 'input-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <FormField
      label={label}
      htmlFor={id}
      required={required}
      helperText={helperText}
      error={error}
    >
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={selectClasses}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </FormField>
  )
})

export default Select
