/**
 * Icon Registry
 *
 * Maps semantic icon names to their React Icons components.
 * All modules must import icons from here instead of directly
 * from react-icons — this ensures visual consistency and makes
 * icon swaps a single-file change.
 *
 * Icon set: react-icons/md  (Material Design — healthcare-friendly)
 *           react-icons/fi  (Feather — clean outlines for UI actions)
 *           react-icons/hi2 (Heroicons v2 — modern SaaS look)
 *
 * Usage:
 *   import { AppIcons } from '../styles/icons'
 *   <AppIcons.Medicine className="text-primary-600" size={20} />
 */

// Medicine & Health
import { MdMedication, MdLocalHospital, MdHealthAndSafety, MdBloodtype, MdVaccines } from 'react-icons/md'

// Navigation & UI
import { HiOutlineHome, HiOutlineSearch, HiOutlineBell, HiOutlineUser, HiOutlineCog6Tooth, HiOutlineClipboardDocument, HiOutlineMapPin, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'

// Actions
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiUpload, FiFilter, FiRefreshCw, FiCheck, FiX, FiAlertTriangle, FiInfo, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiChevronRight, FiChevronLeft } from 'react-icons/fi'

// Layout & Dashboard
import { MdInventory2, MdAnalytics, MdDashboard, MdPeople, MdLocalPharmacy, MdNotifications, MdBarChart } from 'react-icons/md'

export const AppIcons = {
  // ── Healthcare ────────────────────────────────────────────
  Medicine:      MdMedication,
  Hospital:      MdLocalHospital,
  Health:        MdHealthAndSafety,
  BloodType:     MdBloodtype,
  Vaccine:       MdVaccines,
  Pharmacy:      MdLocalPharmacy,

  // ── Navigation ───────────────────────────────────────────
  Home:          HiOutlineHome,
  Search:        HiOutlineSearch,
  Notification:  HiOutlineBell,
  User:          HiOutlineUser,
  Settings:      HiOutlineCog6Tooth,
  Location:      HiOutlineMapPin,
  Logout:        HiOutlineArrowRightOnRectangle,
  Prescription:  HiOutlineClipboardDocument,

  // ── Dashboard ────────────────────────────────────────────
  Dashboard:     MdDashboard,
  Analytics:     MdAnalytics,
  Chart:         MdBarChart,
  Inventory:     MdInventory2,
  People:        MdPeople,
  Notifications: MdNotifications,

  // ── Actions ──────────────────────────────────────────────
  Add:           FiPlus,
  Edit:          FiEdit2,
  Delete:        FiTrash2,
  Download:      FiDownload,
  Upload:        FiUpload,
  Filter:        FiFilter,
  Refresh:       FiRefreshCw,
  Check:         FiCheck,
  Close:         FiX,
  Warning:       FiAlertTriangle,
  Info:          FiInfo,
  Show:          FiEye,
  Hide:          FiEyeOff,

  // ── Chevrons ─────────────────────────────────────────────
  ChevronDown:  FiChevronDown,
  ChevronUp:    FiChevronUp,
  ChevronRight: FiChevronRight,
  ChevronLeft:  FiChevronLeft,
}

/** Default icon size used across the application */
export const ICON_SIZE = {
  xs:  12,
  sm:  16,
  md:  20,
  lg:  24,
  xl:  32,
}
