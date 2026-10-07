/**
 * Notification Service
 *
 * Real notification-center endpoints, plus the SRS "Customer Stock
 * Alert" subscribe action ("Notify Me" on an out-of-stock medicine).
 *
 *  GET    /users/me/notifications
 *  PATCH  /notifications/:id/read
 *  PATCH  /users/me/notifications/read-all
 *  DELETE /notifications/:id
 *  POST   /medicines/:pmbi_code/notify-me
 */

import axiosClient from '../config/axiosClient'

const notificationService = {
  getMyNotifications: () => axiosClient.get('/users/me/notifications'),

  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),

  markAllAsRead: () => axiosClient.patch('/users/me/notifications/read-all'),

  remove: (id) => axiosClient.delete(`/notifications/${id}`),

  subscribeToStockAlert: (pmbiCode) =>
    axiosClient.post(`/medicines/${pmbiCode}/notify-me`),
}

export default notificationService