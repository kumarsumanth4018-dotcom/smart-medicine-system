/**
 * Medicine Service
 *
 * Handles all medicine search and recommendation API calls.
 * This is the core service for the Janaushadhi recommendation feature.
 *
 * Endpoints (actual backend shape):
 *  GET    /medicines/search      — search by brand/generic name, composition, or PMBI code
 *  GET    /medicines/:id         — medicine detail (brand + Jan Aushadhi info + savings, pre-baked)
 *  GET    /medicines/code/:pmbi_code — lookup by PMBI code
 *  GET    /medicines             — list all (admin / pharmacy)
 *  POST   /medicines             — create medicine (admin)
 *  PUT    /medicines/:id         — update medicine (admin)
 *  DELETE /medicines/:id         — delete medicine (admin)
 *
 * NOTE: unlike earlier drafts of this service, the backend does NOT have a
 * separate /medicines/alternatives/:id endpoint. Each medicine record
 * already combines brand + Jan Aushadhi generic pricing in one document
 * (jan_aushadhi_mrp, branded_avg_mrp, saving_pct), so there is nothing
 * separate to fetch.
 */

import axiosClient from '../config/axiosClient'

const medicineService = {
  search: (params) => axiosClient.get('/medicines/search', { params }),

  getById: (id) => axiosClient.get(`/medicines/${id}`),

  getByCode: (pmbiCode) => axiosClient.get(`/medicines/code/${pmbiCode}`),

  getAll: (params) => axiosClient.get('/medicines', { params }),

  create: (data) => axiosClient.post('/medicines', data),

  update: (id, data) => axiosClient.put(`/medicines/${id}`, data),

  remove: (id) => axiosClient.delete(`/medicines/${id}`),
}

/**
 * Maps a raw backend medicine record to the shape expected by
 * SearchResultCard / ResultsGrid (name, genericName, price, mrp, etc.)
 *
 * Backend shape:
 *   { id, pmbi_code, generic_name, brand_name, composition, category,
 *     jan_aushadhi_mrp, branded_avg_mrp, saving_pct, pack_size, manufacturer }
 *
 * Every record already represents a brand-name product alongside its
 * Jan Aushadhi generic price and pre-computed savings — so `price` is
 * always the Jan Aushadhi price and `mrp` is always the branded average,
 * letting the existing card UI compute/display savings with no changes.
 */
export function mapMedicineToCard(m) {
  // Pull a dosage/strength token like "500mg" out of the composition or
  // generic name, e.g. "Paracetamol 500mg" -> "500mg". Backend doesn't
  // store this as a separate field, so we derive it for display only.
  const strengthMatch = (m.composition || m.generic_name || '').match(
    /\d+(\.\d+)?\s?(mg|g|ml|mcg|iu)/i,
  )

  return {
    id: m.id,
    pmbiCode: m.pmbi_code,
    name: m.brand_name,
    genericName: m.generic_name,
    composition: m.composition,
    manufacturer: m.manufacturer,
    strength: strengthMatch ? strengthMatch[0] : '',
    type: '',
    category: m.category,
    price: m.jan_aushadhi_mrp,
    mrp: m.branded_avg_mrp,
    availability: 'available', // stock is per-Kendra, not known at search time
    isGeneric: true,
    isJanAushadhi: true,
    isAffordable: m.saving_pct >= 50,
  }
}

export default medicineService