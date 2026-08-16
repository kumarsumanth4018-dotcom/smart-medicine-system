/**
 * PasswordInput Component
 *
 * Purpose : Password field with a show/hide toggle. Extends Input
 *           with a managed `type` state so no extra logic is needed
 *           in consuming forms.
 * Location : src/components/forms/PasswordInput.jsx
 *
 * Features : show/hide toggle button, all Input props inherited,
 *            accessible toggle label
 *
 * Future usage: Login, Register, Reset Password, Change Password.
 */

import { forwardRef, useId, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import FormField from './FormField'

const PasswordInput = forwardRef(function PasswordInput(
  {
    label = 'Password',
    placeholder = '••••••••',
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
  const [visible, setVisible] = useState(false)

  const inputClasses = [
    'input-base pr-10',
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
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={inputClasses}
          {...rest}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          tabIndex={0}
        >
          {visible
            ? <FiEyeOff size={16} aria-hidden="true" />
            : <FiEye size={16} aria-hidden="true" />
          }
        </button>
      </div>
    </FormField>
  )
})

export default PasswordInput
