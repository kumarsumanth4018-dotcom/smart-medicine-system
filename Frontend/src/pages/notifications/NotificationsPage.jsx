/**
 * Component: NotificationsPage
 *
 * Description:
 *   Full-page notification centre for the authenticated user.
 *   Connects the notification flow from dashboard → notification centre.
 *
 * Responsibilities:
 *   - Display all notifications grouped by type
 *   - Mark individual / all as read
 *   - Delete notifications
 *   - Navigate to the relevant page on notification click
 *
 * Route: /notifications  (ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   - TODO: GET    /api/v1/users/me/notifications
 *   - TODO: PATCH  /api/v1/notifications/:id/read
 *   - TODO: DELETE /api/v1/notifications/:id
 *   - TODO: PATCH  /api/v1/users/me/notifications/read-all
 */

import { useState } from 'react'
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2'
import NotificationCard from '../../components/cards/NotificationCard'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/feedback/EmptyState'

// TODO: Replace with GET /api/v1/users/me/notifications
const INIT = [
  { id: 'n1', title: 'Medicine Available',             description: 'Paracetamol IP 500mg is back in stock at Jan Aushadhi Kendra Andheri.',  time: '10 min ago',  type: 'success', isRead: false },
  { id: 'n2', title: 'Generic Recommendation Updated', description: 'A new Jan Aushadhi alternative is available for Azithromycin 500mg.',     time: '1 hour ago',  type: 'info',    isRead: false },
  { id: 'n3', title: 'Nearby Pharmacy Stock Updated',  description: 'Metformin 500mg stock is limited at your favorite pharmacy.',             time: '3 hours ago', type: 'warning', isRead: false },
  { id: 'n4', title: 'Medicine Reminder',              description: 'Time to refill your Cetirizine prescription.',                            time: '1 day ago',   type: 'alert',   isRead: true  },
  { id: 'n5', title: 'System Notification',            description: 'Your profile was updated successfully.',                                   time: '2 days ago',  type: 'info',    isRead: true  },
  { id: 'n6', title: 'Generic Savings Alert',          description: 'You saved ₹102 on your last purchase using Jan Aushadhi generic.',        time: '3 days ago',  type: 'success', isRead: true  },
]

function NotificationsPage() {
  const [items, setItems] = useState(INIT)
  const unread = items.filter(n => !n.isRead).length

  function handleRead(id) {
    setItems(p => p.map(n => n.id === id ? {...n, isRead: true} : n))
    // TODO: PATCH /api/v1/notifications/:id/read
  }

  function handleDelete(id) {
    setItems(p => p.filter(n => n.id !== id))
    // TODO: DELETE /api/v1/notifications/:id
  }

  function handleReadAll() {
    setItems(p => p.map(n => ({...n, isRead: true})))
    // TODO: PATCH /api/v1/users/me/notifications/read-all
  }

  return (
    <article aria-label="Notification Centre" className="max-w-2xl mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiOutlineBell size={22} className="text-warning-500" aria-hidden="true" />
            Notifications
            {unread > 0 && <Badge variant="danger" size="sm">{unread} new</Badge>}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {/* TODO: count from API */}
            {items.length} notifications · {unread} unread
          </p>
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<HiOutlineCheckCircle size={14} />} onClick={handleReadAll}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification list */}
      {items.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          description="No notifications at the moment. We'll let you know when something important happens."
          size="md"
        />
      ) : (
        <div
          className="space-y-2"
          aria-live="polite"
          aria-label="Notification list"
        >
          {items.map(n => (
            <div key={n.id} className="relative group">
              <NotificationCard
                notification={n}
                onRead={() => handleRead(n.id)}
                onClick={() => handleRead(n.id)}
              />
              <button
                type="button"
                onClick={() => handleDelete(n.id)}
                aria-label={`Delete notification: ${n.title}`}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md text-slate-300 hover:text-danger-500 hover:bg-danger-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400"
              >
                <HiOutlineXMark size={12} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Future: Notification Preferences */}
      <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
        <p className="text-xs text-slate-400">
          {/* TODO: notification preferences from GET /api/v1/users/me/notification-settings */}
          Notification preferences · Medicine reminders · Availability alerts — coming soon
        </p>
      </div>
    </article>
  )
}

export default NotificationsPage
