/**
 * ConfirmDialog Component
 *
 * Purpose : Accessible confirmation overlay for destructive or
 *           irreversible actions (delete, deactivate, logout).
 *           Wraps Modal with opinionated confirm/cancel layout.
 * Location : src/components/dialogs/ConfirmDialog.jsx
 *
 * Variants : danger | warning | info
 * Features : title, description, confirm/cancel labels, loading
 *            state on confirm button, keyboard-accessible
 *
 * Future usage :
 *   Module 5 — Delete inventory item, deactivate pharmacy
 *   Module 6 — Delete user, remove medicine from DB
 *   Module 4 — Remove saved medicine
 */

import { HiOutlineExclamationTriangle, HiOutlineInformationCircle, HiOutlineShieldExclamation } from 'react-icons/hi2'
import { FiLoader } from 'react-icons/fi'
import Modal from './Modal'

const VARIANTS = {
  danger: {
    icon: HiOutlineExclamationTriangle,
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-600',
    confirmClass: 'bg-danger-600 hover:bg-danger-700 focus-visible:ring-danger-500',
  },
  warning: {
    icon: HiOutlineShieldExclamation,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    confirmClass: 'bg-warning-600 hover:bg-warning-700 focus-visible:ring-warning-500',
  },
  info: {
    icon: HiOutlineInformationCircle,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    confirmClass: 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500',
  },
}

/**
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {string}   [props.title='Are you sure?']
 * @param {string}   [props.description]
 * @param {'danger'|'warning'|'info'} [props.variant='danger']
 * @param {string}   [props.confirmLabel='Confirm']
 * @param {string}   [props.cancelLabel='Cancel']
 * @param {boolean}  [props.loading=false]
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  variant = 'danger',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.danger
  const Icon = v.icon

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={!loading}
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${v.iconBg}`}>
          <Icon className={`w-6 h-6 ${v.iconColor}`} aria-hidden="true" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              'flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              v.confirmClass,
            ].join(' ')}
          >
            {loading && <FiLoader className="animate-spin w-4 h-4" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
