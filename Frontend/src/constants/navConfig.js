/**
 * Navigation Configuration
 *
 * Defines the sidebar nav items for each authenticated role.
 * Keeping nav config outside the layout components makes it trivial
 * to add / reorder / badge items without touching layout files.
 *
 * Shape: see Sidebar.jsx NAV_ITEM comment for full spec.
 */

import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineClipboardDocument,
  HiOutlineDocumentText,
} from 'react-icons/hi2'
import {
  MdDashboard,
  MdInventory2,
  MdLocalPharmacy,
  MdMedication,
  MdAnalytics,
} from 'react-icons/md'
import { ROUTES } from './routes'

// ── Patient / User nav ────────────────────────────────────────────────────────
export const USER_NAV = [
  { type: 'item', label: 'Dashboard',         to: ROUTES.USER.DASHBOARD,         icon: MdDashboard },
  { type: 'group', label: 'Medicines' },
  { type: 'item', label: 'Search Medicines',  to: ROUTES.USER.SEARCH,            icon: HiOutlineMagnifyingGlass },
  { type: 'item', label: 'Nearby Pharmacies', to: ROUTES.USER.NEARBY_PHARMACIES, icon: HiOutlineMapPin },
  { type: 'group', label: 'Account' },
  { type: 'item', label: 'Notifications',     to: ROUTES.USER.NOTIFICATIONS,     icon: HiOutlineBell },
  { type: 'item', label: 'My Profile',        to: ROUTES.USER.PROFILE,           icon: HiOutlineUser },
]

// ── Pharmacy staff nav ────────────────────────────────────────────────────────
export const PHARMACY_NAV = [
  { type: 'item', label: 'Dashboard',         to: ROUTES.PHARMACY.DASHBOARD,     icon: MdDashboard },
  { type: 'group', label: 'Management' },
  { type: 'item', label: 'Inventory',         to: ROUTES.PHARMACY.INVENTORY,     icon: MdInventory2 },
  { type: 'item', label: 'Prescriptions',     to: ROUTES.PHARMACY.PRESCRIPTIONS, icon: HiOutlineClipboardDocument },
  { type: 'group', label: 'Account' },
  { type: 'item', label: 'Pharmacy Profile',  to: ROUTES.PHARMACY.PROFILE,       icon: MdLocalPharmacy },
]

// ── Admin nav ─────────────────────────────────────────────────────────────────
export const ADMIN_NAV = [
  { type: 'item',  label: 'Dashboard',       to: ROUTES.ADMIN.DASHBOARD,     icon: MdDashboard },
  { type: 'group', label: 'Management' },
  { type: 'item',  label: 'Users',           to: ROUTES.ADMIN.USERS,         icon: HiOutlineUsers },
  { type: 'item',  label: 'Pharmacies',      to: ROUTES.ADMIN.PHARMACIES,    icon: MdLocalPharmacy },
  { type: 'item',  label: 'Medicines',       to: ROUTES.ADMIN.MEDICINES,     icon: MdMedication },
  { type: 'item',  label: 'Generic Mapping', to: ROUTES.ADMIN.GENERIC_MAP,   icon: HiOutlineClipboardDocument },
  { type: 'group', label: 'Analytics' },
  { type: 'item',  label: 'Analytics',       to: ROUTES.ADMIN.ANALYTICS,     icon: MdAnalytics },
  { type: 'item',  label: 'Reports',         to: ROUTES.ADMIN.REPORTS,       icon: HiOutlineDocumentText },
  { type: 'group', label: 'Communication' },
  { type: 'item',  label: 'Notifications',   to: ROUTES.ADMIN.NOTIFICATIONS, icon: HiOutlineBell },
  { type: 'item',  label: 'Activity Logs',   to: ROUTES.ADMIN.ACTIVITY,      icon: HiOutlineChartBar },
  { type: 'group', label: 'System' },
  { type: 'item',  label: 'Roles',           to: ROUTES.ADMIN.ROLES,         icon: HiOutlineUsers },
  { type: 'item',  label: 'Settings',        to: ROUTES.ADMIN.SETTINGS,      icon: HiOutlineCog6Tooth },
]

// ── Public navbar links ────────────────────────────────────────────────────────
export const PUBLIC_NAV_LINKS = [
  { label: 'Home',               to: '/',                            icon: HiOutlineHome },
  { label: 'Search Medicines',   to: ROUTES.USER.SEARCH,            icon: HiOutlineMagnifyingGlass },
  { label: 'Nearby Pharmacies',  to: ROUTES.USER.NEARBY_PHARMACIES, icon: HiOutlineMapPin },
]
