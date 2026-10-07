/**
 * Component: NotificationCenter
 *
 * Description:
 *   Dashboard notification panel reusing existing NotificationCard.
 *   Supports mark-as-read, delete, and view-all.
 *
 * Backend: wired to real endpoints via notificationService.js.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiOutlineBell, HiOutlineTrash } from 'react-icons/hi2'
import NotificationCard from '../../../components/cards/NotificationCard'
import Badge from '../../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import notificationService from '../../../services/notificationService'
import { formatTimeAgo } from '../../../utils/formatters'

// ======================================================
// Notifications
// ======================================================
function NotificationCenter() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await notificationService.getMyNotifications()).data,
  })

  const items = (data?.results ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatTimeAgo(n.createdAt),
    type: n.type,
    isRead: n.isRead,
  }))
  const unread = data?.unread ?? 0

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] })

  const readMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: invalidate,
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.remove(id),
    onSuccess: invalidate,
  })

  function handleRead(id) {
    readMutation.mutate(id)
  }

  function handleDelete(id) {
    deleteMutation.mutate(id)
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

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
      ) : (
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
      )}
    </section>
  )
}

export default NotificationCenter