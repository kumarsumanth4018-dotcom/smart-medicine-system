/**
 * NotificationCard Component
 *
 * Purpose : Displays a single notification item in the
 *           notifications panel or dropdown list.
 * Location : src/components/cards/NotificationCard.jsx
 *
 * Types    : info | success | warning | alert
 * Features : read/unread visual state, relative timestamp,
 *            type icon, mark-as-read action, click handler
 *
 * Future usage : Module 4 (notification centre, nav dropdown).
 *
 * Props :
 *   notification — { id, title, description, time, type, isRead }
 *   onRead       — mark-as-read handler
 *   onClick      — card click handler
 */

import { HiOutlineInformationCircle, HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineBellAlert } from 'react-icons/hi2'

const TYPE_CONFIG = {
  info:    { icon: HiOutlineInformationCircle, iconClass: 'text-primary-500',   bg: 'bg-primary-50'   },
  success: { icon: HiOutlineCheckCircle,       iconClass: 'text-success-500',   bg: 'bg-success-50'   },
  warning: { icon: HiOutlineExclamationTriangle, iconClass: 'text-warning-500', bg: 'bg-warning-50'   },
  alert:   { icon: HiOutlineBellAlert,         iconClass: 'text-danger-500',    bg: 'bg-danger-50'    },
}

function NotificationCard({ notification = {}, onRead, onClick }) {
  const {
    title       = 'Notification',
    description = '',
    time        = '',
    type        = 'info',
    isRead      = false,
  } = notification

  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info
  const Icon   = config.icon

  return (
    <article
      role="article"
      aria-label={`${isRead ? '' : 'Unread: '}${title}`}
      className={[
        'flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer',
        isRead
          ? 'bg-white border-slate-100 hover:bg-slate-50'
          : 'bg-primary-50/40 border-primary-100 hover:bg-primary-50',
      ].join(' ')}
      onClick={onClick}
    >
      {/* Type icon */}
      <div className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${config.bg}`}>
        <Icon className={`w-5 h-5 ${config.iconClass}`} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${isRead ? 'font-normal text-slate-700' : 'font-semibold text-slate-900'}`}>
            {title}
          </p>
          {!isRead && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-1" aria-label="Unread" />
          )}
        </div>

        {description && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-400">{time}</span>
          {!isRead && onRead && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRead() }}
              className="text-[10px] font-medium text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default NotificationCard
