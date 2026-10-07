/**
 * User Preference Service
 *
 * Handles loading, saving and resetting the logged-in
 * user's Weighted Sum Model ranking preferences.
 */

import axiosClient from '../config/axiosClient'


// =====================================================
// Default WSM preferences
// =====================================================

export const DEFAULT_RANKING_PREFERENCES = {
  distance: 0.35,
  price: 0.25,
  quantity: 0.20,
  freshness: 0.10,
  trust: 0.10,
}


// =====================================================
// Validate ranking preferences
// =====================================================

export function validateRankingPreferences(preferences) {
  const requiredKeys = [
    'distance',
    'price',
    'quantity',
    'freshness',
    'trust',
  ]

  if (!preferences || typeof preferences !== 'object') {
    throw new Error(
      'Ranking preferences are required.',
    )
  }

  for (const key of requiredKeys) {
    const value = preferences[key]

    if (
      typeof value !== 'number'
      || Number.isNaN(value)
      || value < 0
      || value > 1
    ) {
      throw new Error(
        `${key} weight must be a number between 0 and 1.`,
      )
    }
  }

  const total = requiredKeys.reduce(
    (sum, key) => sum + preferences[key],
    0,
  )

  if (Math.abs(total - 1) > 0.001) {
    throw new Error(
      `Ranking weights must add up to 1. Current total: ${total.toFixed(2)}`,
    )
  }

  return {
    distance: preferences.distance,
    price: preferences.price,
    quantity: preferences.quantity,
    freshness: preferences.freshness,
    trust: preferences.trust,
  }
}


// =====================================================
// User Preference API
// =====================================================

const userPreferenceService = {
  /**
   * Load the logged-in user's ranking preferences.
   *
   * The backend returns default preferences when the
   * user has not saved custom preferences.
   */
  getRankingPreferences: () =>
    axiosClient.get(
      '/users/me/ranking-preferences',
    ),

  /**
   * Save or update the logged-in user's preferences.
   */
  saveRankingPreferences: (preferences) => {
    const validatedPreferences =
      validateRankingPreferences(preferences)

    return axiosClient.put(
      '/users/me/ranking-preferences',
      validatedPreferences,
    )
  },

  /**
   * Delete custom preferences and return defaults.
   */
  resetRankingPreferences: () =>
    axiosClient.delete(
      '/users/me/ranking-preferences',
    ),
}


export default userPreferenceService