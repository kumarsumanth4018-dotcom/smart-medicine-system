/**
 * FormField Component
 *
 * Purpose : Wraps any form control (Input, Select, Textarea, etc.)
 *           with a consistent label, helper text, and error message.
 *           Eliminates repetition across form components.
 * Location : src/components/forms/FormField.jsx
 *
 * Used internally by Input, PasswordInput, Textarea, Select.
 * Can also be used standalone to wrap custom controls.
 *
 * Accessibility:
 *   - Associates <label> with control via `htmlFor` / `id`
 *   - Links error message via `aria-describedby`
 *   - Required indicator marked with aria-hidden so screen readers
 *     rely on `required` attr on the actual input.
 */

/**
 * @param {object}  props
 * @param {string}  [props.label]
 * @param {string}  [props.htmlFor]      — id of the input this label targets
 * @param {boolean} [props.required]
 * @param {string}  [props.helperText]
 * @param {string}  [props.error]
 * @param {string}  [props.className]
 * @param {React.ReactNode} props.children
 */
function FormField({
  label,
  htmlFor,
  required,
  helperText,
  error,
  className = '',
  children,
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight"
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-danger-500 font-bold"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Clone child with aria-describedby linking to error/helper */}
      {children}

      {helperText && !error && (
        <p
          id={helperId}
          className="text-xs text-[var(--color-text-muted)] leading-snug"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-danger-600 flex items-center gap-1 leading-snug"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
