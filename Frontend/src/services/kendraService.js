/**
 * Kendra Service
 *
 * Handles:
 * - Nearby Kendra location search
 * - Medicine-specific WSM-ranked Kendra search
 * - Kendra details
 * - Stock restocking
 * - FIFO billing
 */

import axiosClient from '../config/axiosClient'


// =====================================================
// Default WSM ranking preferences
// =====================================================

export const DEFAULT_RANKING_WEIGHTS = {
  distance: 0.35,
  price: 0.25,
  quantity: 0.20,
  freshness: 0.10,
  trust: 0.10,
}


// =====================================================
// Validate frontend weights before sending request
// =====================================================

function validateWeights(weights) {
  const values = Object.values(weights)

  const allValid = values.every(
    value =>
      typeof value === 'number' &&
      value >= 0 &&
      value <= 1,
  )

  if (!allValid) {
    throw new Error(
      'Every ranking weight must be between 0 and 1.',
    )
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  )

  if (Math.abs(total - 1) > 0.001) {
    throw new Error(
      `Ranking weights must add up to 1. Current total: ${total.toFixed(2)}`,
    )
  }

  return weights
}


// =====================================================
// Kendra API service
// =====================================================

const kendraService = {
  /**
   * Find all active Kendras near the user.
   * Results are ordered by distance.
   */
  findNearby: (
    lat,
    lng,
    radiusKm = 5,
  ) =>
    axiosClient.get('/kendras/nearby', {
      params: {
        lat,
        lng,
        radius_km: radiusKm,
      },
    }),

  /**
   * Find Kendras stocking one medicine.
   *
   * Results are ranked using the Weighted Sum Model.
   */
  findMedicineNearby: (
    pmbiCode,
    lat,
    lng,
    radiusKm = 5,
    onlyInStock = true,
    weights = DEFAULT_RANKING_WEIGHTS,
  ) => {
    const validWeights = validateWeights(weights)

    return axiosClient.get(
      `/kendras/medicine/${encodeURIComponent(pmbiCode)}/nearby`,
      {
        params: {
          lat,
          lng,
          radius_km: radiusKm,
          only_in_stock: onlyInStock,

          distance_weight:
            validWeights.distance,

          price_weight:
            validWeights.price,

          quantity_weight:
            validWeights.quantity,

          freshness_weight:
            validWeights.freshness,

          trust_weight:
            validWeights.trust,
        },
      },
    )
  },

  /**
   * Get complete Kendra information.
   */
  getById: kendraId =>
    axiosClient.get(
      `/kendras/${encodeURIComponent(kendraId)}`,
    ),

  /**
   * Add a new stock batch.
   */
  restock: (
    kendraId,
    data,
  ) =>
    axiosClient.post(
      `/kendras/${encodeURIComponent(kendraId)}/restock`,
      data,
    ),

  /**
   * Generate a bill and deduct stock.
   */
  generateBill: (
    kendraId,
    data,
  ) =>
    axiosClient.post(
      `/kendras/${encodeURIComponent(kendraId)}/bill`,
      data,
    ),
}


export default kendraService