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
 * Backend: wired to real endpoints via notificationService.js —
 *   GET    /api/v1/users/me/notifications
 *   PATCH  /api/v1/notifications/:id/read
 *   DELETE /api/v1/notifications/:id
 *   PATCH  /api/v1/users/me/notifications/read-all
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2'
import NotificationCard from '../../components/cards/NotificationCard'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/feedback/EmptyState'
import notificationService from '../../services/notificationService'
import { formatTimeAgo } from '../../utils/formatters'

function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
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
  const readAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: invalidate,
  })

  function handleRead(id) {
    readMutation.mutate(id)
  }

  function handleDelete(id) {
    deleteMutation.mutate(id)
  }

  function handleReadAll() {
    readAllMutation.mutate()
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
      {isLoading ? (
        <p className="text-center py-10 text-sm text-slate-400">Loading notifications…</p>
      ) : isError ? (
        <p className="text-center py-10 text-sm text-danger-600">Couldn't load notifications. Try refreshing.</p>
      ) : items.length === 0 ? (
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
          Notification preferences · Medicine reminders · Availability alerts — coming soon
        </p>
      </div>
    </article>
  )
}

export default NotificationsPage