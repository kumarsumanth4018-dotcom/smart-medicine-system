/**
 * ErrorState Component
 *
 * Purpose : Informative error display with retry/action support.
 *           Used when API calls fail, pages crash, or permissions
 *           are denied.
 * Location : src/components/feedback/ErrorState.jsx
 *
 * Variants : general | network | notFound | unauthorized
 * Features : configurable icon, title, description, retry action,
 *            error code display
 *
 * Future usage : Search failures (Module 4), inventory load errors
 *   (Module 5), admin access errors (Module 6).
 */

import { HiOutlineExclamationTriangle, HiOutlineWifi, HiOutlineLockClosed, HiOutlineQuestionMarkCircle } from 'react-icons/hi2'

const PRESETS = {
  general: {
    icon: HiOutlineExclamationTriangle,
    iconClass: 'text-danger-400',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: HiOutlineWifi,
    iconClass: 'text-warning-400',
    title: 'Connection problem',
    description: 'Unable to reach the server. Check your internet connection.',
  },
  notFound: {
    icon: HiOutlineQuestionMarkCircle,
    iconClass: 'text-slate-400',
    title: 'Not found',
    description: 'The requested resource could not be found.',
  },
  unauthorized: {
    icon: HiOutlineLockClosed,
    iconClass: 'text-danger-400',
    title: 'Access denied',
    description: 'You do not have permission to view this content.',
  },
}

/**
 * @param {'general'|'network'|'notFound'|'unauthorized'} [props.variant='general']
 * @param {string}  [props.title]           — overrides preset title
 * @param {string}  [props.description]     — overrides preset description
 * @param {React.ReactNode} [props.icon]    — overrides preset icon
 * @param {Function} [props.onRetry]        — if provided renders a Retry button
 * @param {React.ReactNode} [props.action]  — custom action slot
 * @param {string}  [props.errorCode]       — e.g. '500' or 'ERR_NETWORK'
 * @param {string}  [props.className]
 */
function ErrorState({
  variant = 'general',
  title,
  description,
  icon,
  onRetry,
  action,
  errorCode,
  className = '',
}) {
  const preset = PRESETS[variant] ?? PRESETS.general
  const PresetIcon = preset.icon

  return (
    <div
      role="alert"
      className={[
        'flex flex-col items-center justify-center text-center gap-3 py-12',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
        {icon ?? (
          <PresetIcon
            className={`w-8 h-8 ${preset.iconClass}`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Text */}
      <div className="space-y-1 max-w-xs">
        <p className="text-base font-semibold text-slate-800">
          {title ?? preset.title}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description ?? preset.description}
        </p>
        {errorCode && (
          <p className="text-xs text-slate-400 font-mono mt-1">
            Error: {errorCode}
          </p>
        )}
      </div>

      {/* Actions */}
      {(onRetry || action) && (
        <div className="flex items-center gap-3 mt-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Try again
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}

export default ErrorState
