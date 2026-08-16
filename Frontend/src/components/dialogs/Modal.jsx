/**
 * Modal Component
 *
 * Purpose : Accessible dialog overlay for forms, detail views,
 *           and confirmation prompts.
 * Location : src/components/dialogs/Modal.jsx
 *
 * Features :
 *   - Focus trap (Tab / Shift+Tab cycle inside modal)
 *   - Escape key closes
 *   - Backdrop click closes (configurable)
 *   - Scroll lock on body while open
 *   - aria-modal, role="dialog", aria-labelledby, aria-describedby
 *   - Size variants: sm | md | lg | xl | full
 *
 * Future usage : Module 4 (medicine detail overlay, add-to-list),
 *   Module 5 (add inventory item), Module 6 (edit user).
 */

import { useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineXMark } from 'react-icons/hi2'

const SIZES = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-full mx-4',
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

/**
 * @param {boolean}  props.isOpen
 * @param {Function} props.onClose
 * @param {string}   [props.title]
 * @param {string}   [props.description]
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md']
 * @param {boolean}  [props.closeOnBackdrop=true]
 * @param {boolean}  [props.showCloseButton=true]
 * @param {React.ReactNode} [props.footer]
 * @param {string}   [props.className]
 * @param {React.ReactNode} props.children
 */
function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  footer,
  className = '',
  children,
}) {
  const titleId = useId()
  const descId  = useId()
  const panelRef = useRef(null)
  const previousFocus = useRef(null)

  // Save previously-focused element and restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement
      // Focus first focusable element inside modal
      requestAnimationFrame(() => {
        const el = panelRef.current?.querySelector(FOCUSABLE)
        el?.focus()
      })
    } else {
      previousFocus.current?.focus()
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)]
        if (!focusable.length) return
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus() }
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          'relative z-10 w-full bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]',
          SIZES[size] ?? SIZES.md,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100">
            <div>
              {title && (
                <h2 id={titleId} className="text-base font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-sm text-slate-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <HiOutlineXMark size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
