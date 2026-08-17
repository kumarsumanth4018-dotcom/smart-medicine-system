/**
 * Pharmacy Service
 *
 * Talks to the backend's /kendras/* routes (a "Kendra" IS the pharmacy /
 * Jan Aushadhi outlet in this system — there is no separate /pharmacies
 * API). Renamed the endpoints below to match Backend/app/routers/kendra_router.py
 * exactly; the old /pharmacies/* paths did not exist on the backend.
 *
 * Endpoints (actual backend shape):
 *  GET  /kendras/nearby?lat=...&lng=...&radius_km=...          — public
 *  GET  /kendras/medicine/:pmbi_code/nearby?lat=...&lng=...    — public, sorted by distance
 *  GET  /kendras/:id                                            — public, full detail incl. stock/batches
 *  GET  /kendras/mine                                            — pharmacy owner / admin, "my Kendra"
 *  POST /kendras/:id/restock                                    — pharmacy owner / admin
 *  POST /kendras/:id/bill                                       — pharmacy owner / admin
 */

import axiosClient from '../config/axiosClient'

const pharmacyService = {
  getNearby: (params) => axiosClient.get('/kendras/nearby', { params }),

  getMedicineNearby: (pmbiCode, params) =>
    axiosClient.get(`/kendras/medicine/${pmbiCode}/nearby`, { params }),

  getById: (id) => axiosClient.get(`/kendras/${id}`),

  // The Kendra managed by the currently logged-in pharmacy owner.
  getMine: () => axiosClient.get('/kendras/mine'),

  restock: (kendraId, data) => axiosClient.post(`/kendras/${kendraId}/restock`, data),

  bill: (kendraId, data) => axiosClient.post(`/kendras/${kendraId}/bill`, data),
}

/**
 * Maps a raw backend Kendra record to the shape expected by
 * PharmacyCard / NearbyPharmacyList (name, distance, etc.)
 *
 * Backend shape:
 *   { id, name, address, phone, rating, owner_email, latitude, longitude,
 *     distance_km, stock: [{ pmbi_code, total_qty, status, batches }] }
 */
export function mapKendraToCard(k) {
  return {
    id: k.id,
    name: k.name,
    address: k.address,
    phone: k.phone,
    rating: k.rating,
    latitude: k.latitude,
    longitude: k.longitude,
    distanceKm: k.distance_km,
    stock: k.stock ?? [],
  }
}

export default pharmacyService
