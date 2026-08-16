/**
 * Component: NotificationCenter
 *
 * Description:
 *   Dashboard notification panel reusing existing NotificationCard.
 *   Supports mark-as-read, delete, and view-all.
 *
 * Backend readiness:
 *   - notifications → GET /api/v1/users/me/notifications
 *   - markRead      → PATCH /api/v1/notifications/:id/read
 *   - delete        → DELETE /api/v1/notifications/:id
 */

import { useState } from 'react'
import { HiOutlineBell, HiOutlineTrash } from 'react-icons/hi2'
import NotificationCard from '../../../components/cards/NotificationCard'
import Badge from '../../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

// TODO: Replace with GET /api/v1/users/me/notifications
const INIT_NOTIFICATIONS = [
  { id: 'n1', title: 'Medicine Available',            description: 'Paracetamol IP 500mg is back in stock at Jan Aushadhi Kendra Andheri.', time: '10 min ago',  type: 'success', isRead: false },
  { id: 'n2', title: 'Generic Recommendation Updated', description: 'A new Jan Aushadhi alternative is available for Azithromycin 500mg.',   time: '1 hour ago',  type: 'info',    isRead: false },
  { id: 'n3', title: 'Nearby Pharmacy Stock Updated',  description: 'Metformin 500mg stock is limited at your favorite pharmacy.',           time: '3 hours ago', type: 'warning', isRead: false },
  { id: 'n4', title: 'Medicine Reminder',              description: 'Time to refill your Cetirizine prescription.',                          time: '1 day ago',   type: 'alert',   isRead: true  },
  { id: 'n5', title: 'System Notification',            description: 'Your profile was updated successfully.',                                 time: '2 days ago',  type: 'info',    isRead: true  },
]

// ======================================================
// Notifications
// ======================================================
function NotificationCenter() {
  const [items, setItems] = useState(INIT_NOTIFICATIONS)
  const unread = items.filter((n) => !n.isRead).length

  function handleRead(id) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
    // TODO: PATCH /api/v1/notifications/:id/read
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((n) => n.id !== id))
    // TODO: DELETE /api/v1/notifications/:id
  }

  return (
    <section aria-labelledby="notification-center-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="notification-center-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HiOutlineBell size={16} className="text-slate-400" aria-hidden="true" />
          Notification Center
          {unread > 0 && <Badge variant="danger" size="sm">{unread} new</Badge>}
        </h2>
        <Link to={ROUTES.USER.NOTIFICATIONS} className="text-xs font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
          View All
        </Link>
      </div>

      <div className="space-y-2" aria-live="polite" aria-label="Notifications">
        {items.slice(0, 4).map((n) => (
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
              <HiOutlineTrash size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NotificationCenter
