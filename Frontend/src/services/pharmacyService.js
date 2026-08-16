/**
 * Pharmacy Service
 *
 * Handles all pharmacy-related API calls including location-based
 * nearby pharmacy queries (used with React Leaflet map view).
 *
 * Endpoints:
 *  GET  /pharmacies/nearby         — find pharmacies near a coordinate
 *  GET  /pharmacies/search         — search pharmacies by name
 *  GET  /pharmacies/:id            — pharmacy detail
 *  GET  /pharmacies/:id/inventory  — medicines in stock at a pharmacy
 *  POST /pharmacies                — register pharmacy (admin)
 *  PUT  /pharmacies/:id            — update pharmacy profile
 */

import axiosClient from '../config/axiosClient'

const pharmacyService = {
  getNearby: (params) => axiosClient.get('/pharmacies/nearby', { params }),

  search: (params) => axiosClient.get('/pharmacies/search', { params }),

  getById: (id) => axiosClient.get(`/pharmacies/${id}`),

  getInventory: (id, params) =>
    axiosClient.get(`/pharmacies/${id}/inventory`, { params }),

  create: (data) => axiosClient.post('/pharmacies', data),

  update: (id, data) => axiosClient.put(`/pharmacies/${id}`, data),
}

export default pharmacyService
