/**
 * Kendra Service
 *
 * Wraps the backend's Kendra endpoints: location search, stock detail,
 * restock, and FIFO billing.
 *
 *  GET  /kendras/nearby                      — find Kendras near a point
 *  GET  /kendras/medicine/:pmbi_code/nearby  — find Kendras stocking a medicine
 *  GET  /kendras/:id                         — full Kendra detail + stock/batches
 *  POST /kendras/:id/restock                 — add a new batch (Pharmacy/Admin)
 *  POST /kendras/:id/bill                    — generate a bill, FIFO deducts stock
 */

import axiosClient from '../config/axiosClient'

const kendraService = {
  findNearby: (lat, lng, radiusKm = 5) =>
    axiosClient.get('/kendras/nearby', { params: { lat, lng, radius_km: radiusKm } }),

  findMedicineNearby: (pmbiCode, lat, lng, radiusKm = 5, onlyInStock = true) =>
    axiosClient.get(`/kendras/medicine/${pmbiCode}/nearby`, {
      params: { lat, lng, radius_km: radiusKm, only_in_stock: onlyInStock },
    }),

  getById: (kendraId) => axiosClient.get(`/kendras/${kendraId}`),

  restock: (kendraId, data) => axiosClient.post(`/kendras/${kendraId}/restock`, data),

  generateBill: (kendraId, data) => axiosClient.post(`/kendras/${kendraId}/bill`, data),
}

export default kendraService