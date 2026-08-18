/**
 * Admin Service
 *
 * Real system-wide monitoring endpoints, Admin role only.
 * Matches the backend router at /api/v1/admin.
 *
 *  GET /admin/inventory — stock totals + low/out-of-stock items, across
 *                         every Kendra
 *  GET /admin/expiry    — batch expiry snapshot, bucketed into
 *                         expired / red (<=30d) / amber (<=60d)
 *  GET /admin/analytics — revenue summary, top-selling medicines, daily
 *                         sales trend, from real bill data
 *  GET /admin/bills     — system-wide sales history, most recent first
 */

import axiosClient from '../config/axiosClient'

const adminService = {
  getInventoryOverview: () => axiosClient.get('/admin/inventory'),
  getExpiryOverview: () => axiosClient.get('/admin/expiry'),
  getDemandAnalytics: (params) => axiosClient.get('/admin/analytics', { params }),
  getBills: (params) => axiosClient.get('/admin/bills', { params }),
}

export default adminService