/**
 * Inventory Service
 *
 * Used by the Pharmacy Dashboard / Inventory page. There is no standalone
 * /inventory API on the backend — stock lives inside each Kendra document
 * and is mutated only through /kendras/:id/restock (add a supplier batch)
 * and /kendras/:id/bill (sell stock, FIFO-deducted). This service wraps
 * pharmacyService so callers don't need to know the kendra_id: it looks
 * up "my Kendra" first via GET /kendras/mine.
 *
 * Requires the logged-in user to be a pharmacy owner (role=pharmacy) whose
 * account email matches a Kendra's owner_email in the database — see
 * Backend/app/services/kendra_service.py::get_kendra_by_owner.
 */

import pharmacyService from './pharmacyService'

let cachedKendraId = null

async function getMyKendraId() {
  if (cachedKendraId) return cachedKendraId
  const { data } = await pharmacyService.getMine()
  cachedKendraId = data.id
  return cachedKendraId
}

const inventoryService = {
  // Full stock list (with batches) for the logged-in pharmacy owner's Kendra.
  getAll: async () => {
    const kendraId = await getMyKendraId()
    const { data } = await pharmacyService.getById(kendraId)
    return { data: data.stock ?? [] }
  },

  // Restock / add batch — new stock arriving from the supplier.
  create: async (data) => {
    const kendraId = await getMyKendraId()
    return pharmacyService.restock(kendraId, data)
  },

  // Billing — sells stock, FIFO-deducted, updates status automatically.
  // `data` shape: { items: [{ pmbi_code, quantity }, ...] }
  bill: async (data) => {
    const kendraId = await getMyKendraId()
    return pharmacyService.bill(kendraId, data)
  },
}

export default inventoryService
