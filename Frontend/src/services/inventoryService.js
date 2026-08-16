/**
 * Inventory Service
 *
 * Handles medicine stock management API calls.
 * Used by the pharmacy dashboard inventory module.
 *
 * Endpoints:
 *  GET  /inventory             — pharmacy's stock list
 *  POST /inventory             — add new stock entry
 *  PUT  /inventory/:id         — update stock quantity / details
 *  DELETE /inventory/:id       — remove stock entry
 */

import axiosClient from '../config/axiosClient'

const inventoryService = {
  getAll: (params) => axiosClient.get('/inventory', { params }),

  create: (data) => axiosClient.post('/inventory', data),

  update: (id, data) => axiosClient.put(`/inventory/${id}`, data),

  remove: (id) => axiosClient.delete(`/inventory/${id}`),
}

export default inventoryService
