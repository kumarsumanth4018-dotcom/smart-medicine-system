/**
 * Input Component
 *
 * Purpose : Reusable text / email / number input that integrates with
 *           React Hook Form via the `ref` forwarding pattern.
 * Location : src/components/forms/Input.jsx
 *
 * Types    : text | email | number | tel | url | search | date
 * Features : left/right icon slots, label, helper text, error state,
 *            disabled state, required indicator
 *
 * Future usage: Medicine search field, login email, register fields,
 *               inventory quantity inputs, admin filters.
 *
 * React Hook Form usage:
 *   const { register, formState: { errors } } = useForm()
 *   <Input label="Email" error={errors.email?.message}
 *          {...register('email')} />
 */

import { forwardRef, useId } from 'react'
import FormField from './FormField'

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    placeholder,
    helperText,
    error,
    required,
    disabled,
    leftIcon,
    rightIcon,
    className = '',
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp || autoId

  const inputClasses = [
    'input-base',
    error ? 'input-error' : '',
    leftIcon ? 'pl-9' : '',
    rightIcon ? 'pr-9' : '',
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
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={inputClasses}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
    </FormField>
  )
})

export default Input
