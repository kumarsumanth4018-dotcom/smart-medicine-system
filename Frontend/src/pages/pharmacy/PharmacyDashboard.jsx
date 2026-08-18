/**
 * Component: PharmacyDashboard
 *
 * Description:
 *   Professional dashboard for pharmacy staff.
 *
 * Responsibilities:
 *   • Inventory Management
 *   • Medicine Management
 *   • Stock Monitoring
 *   • Expiry Monitoring
 *   • Dashboard Analytics
 *   • Notification Center
 *
 * Route: /pharmacy/dashboard  (ProtectedRoute → PharmacyLayout)
 *
 * Backend readiness:
 *   All data is local placeholder. Wire up with TanStack Query against
 *   kendraService (see InventoryPage.jsx / BillingPage.jsx for the pattern):
 *     useQuery(['kendra', currentUser.assignedKendraId], () => kendraService.getById(id))
 */

import { useState } from 'react'
import { Link }     from 'react-router-dom'
import {
  HiOutlineArchiveBox, HiOutlineCheckCircle, HiOutlineExclamationTriangle,
  HiOutlineClock, HiOutlineBell, HiOutlineShoppingCart,
  HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlinePlus,
  HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineChartBar,
  HiOutlineQrCode, HiOutlineBeaker, HiOutlineCpuChip,
  HiOutlineTrash, HiOutlineXMark,
} from 'react-icons/hi2'
import { MdMedication, MdLocalPharmacy } from 'react-icons/md'
import InfoCard         from '../../components/cards/InfoCard'
import Badge            from '../../components/ui/Badge'
import NotificationCard from '../../components/cards/NotificationCard'
import { ROUTES }       from '../../constants/routes'
import { INVENTORY, STATUS_CONFIG } from './data/inventoryData'

// ── Summary stats derived from placeholder data ────────────────────────────
const STATS = {
  total:     INVENTORY.length,
  available: INVENTORY.filter(i => i.status === 'available').length,
  low:       INVENTORY.filter(i => i.status === 'low' || i.status === 'critical').length,
  out:       INVENTORY.filter(i => i.status === 'out').length,
  expiring:  INVENTORY.filter(i => i.status === 'expiring').length,
}

// ── Notifications placeholder ──────────────────────────────────────────────
const INIT_NOTIFICATIONS = [
  { id: 'n1', title: 'Low Stock Alert',         description: 'Cetirizine 10mg has only 15 units remaining. Please reorder.', time: '30 min ago', type: 'warning', isRead: false },
  { id: 'n2', title: 'Expiry Alert',            description: 'Pantoprazole 40mg (BAT-2025-007) expires in 4 days.',          time: '1 hour ago', type: 'alert',   isRead: false },
  { id: 'n3', title: 'Inventory Update',        description: 'Paracetamol IP 500mg stock updated to 480 units.',            time: '3 hours ago',type: 'success', isRead: true  },
  { id: 'n4', title: 'System Notification',     description: 'Your pharmacy profile was last updated 30 days ago.',         time: '1 day ago',  type: 'info',    isRead: true  },
]

// ── Category distribution for analytics placeholder ────────────────────────
const CATEGORY_DIST = [
  { label: 'Analgesic',     count: 2,  pct: 70 },
  { label: 'Antibiotic',    count: 2,  pct: 55 },
  { label: 'Antidiabetic',  count: 1,  pct: 85 },
  { label: 'Supplement',    count: 1,  pct: 90 },
  { label: 'NSAID',         count: 1,  pct: 78 },
  { label: 'Other',         count: 3,  pct: 40 },
]

// ── Expiry alert groups ────────────────────────────────────────────────────
const EXPIRY_GROUPS = [
  { label: 'Expiring Today',    color: 'bg-danger-100 border-danger-300 text-danger-800',   items: [] },
  { label: 'This Week',         color: 'bg-orange-100 border-orange-300 text-orange-800',   items: INVENTORY.filter(i => i.status === 'expiring') },
  { label: 'This Month',        color: 'bg-warning-100 border-warning-300 text-warning-800',items: INVENTORY.filter(i => i.expiry.startsWith('2025-07') || i.expiry.startsWith('2025-08')) },
  { label: 'Expired',           color: 'bg-slate-100 border-slate-300 text-slate-600',      items: [] },
]

// ─────────────────────────────────────────────────────────────────────────────
function PharmacyDashboard() {
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS)
  const unread = notifications.filter(n => !n.isRead).length

  function handleMarkRead(id) { setNotifications(p => p.map(n => n.id === id ? {...n, isRead: true} : n)) }
  function handleDeleteNotif(id) { setNotifications(p => p.filter(n => n.id !== id)) }

  return (
    <article aria-label="Pharmacy Dashboard" className="flex flex-col gap-6">

      {/* ======================================================
          Dashboard Header
         ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <MdLocalPharmacy size={26} className="text-secondary-600" aria-hidden="true" />
            Pharmacy Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {/* TODO: pharmacy name from GET /api/v1/pharmacy/profile */}
            Jan Aushadhi Kendra — Andheri West
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${ROUTES.PHARMACY.INVENTORY}/add`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlinePlus size={16} aria-hidden="true" />
            Add Medicine
          </Link>
          <button
            type="button"
            aria-label="Export inventory"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <HiOutlineArrowDownTray size={15} aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      {/* ======================================================
          Dashboard Summary — Quick Statistics
         ====================================================== */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Inventory statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <InfoCard label="Total Medicines"   value={STATS.total}     variant="default"  icon={<HiOutlineArchiveBox size={18} />}         className="col-span-2" />
          <InfoCard label="Available"         value={STATS.available} variant="success"  icon={<HiOutlineCheckCircle size={18} />}        className="col-span-2" />
          <InfoCard label="Low / Critical"    value={STATS.low}       variant="warning"  icon={<HiOutlineExclamationTriangle size={18} />} className="col-span-2" />
          <InfoCard label="Out of Stock"      value={STATS.out}       variant="danger"   icon={<MdMedication size={18} />}                className="col-span-1" />
          <InfoCard label="Expiring Soon"     value={STATS.expiring}  variant="warning"  icon={<HiOutlineClock size={18} />}              className="col-span-1" />
        </div>
        {/* Sales placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {[
            { label: "Today's Orders",   value: '000', icon: <HiOutlineShoppingCart size={18} />,  subtitle: 'TODO: GET /api/v1/pharmacy/orders/today'   },
            { label: 'Weekly Sales',     value: '₹000', icon: <HiOutlineCurrencyRupee size={18} />, subtitle: 'TODO: GET /api/v1/pharmacy/sales/week'     },
            { label: 'Monthly Sales',    value: '₹000', icon: <HiOutlineChartBar size={18} />,      subtitle: 'TODO: GET /api/v1/pharmacy/sales/month'    },
          ].map(s => (
            <InfoCard key={s.label} label={s.label} value={s.value} icon={s.icon} subtitle={s.subtitle} variant="default" />
          ))}
        </div>
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* ── Left column ───────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* ======================================================
              Inventory Overview — Low Stock Alerts
             ====================================================== */}
          <section aria-labelledby="stock-alerts-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="stock-alerts-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiOutlineExclamationTriangle size={16} className="text-warning-500" aria-hidden="true" />
                Stock Alerts
              </h2>
              <Link to={ROUTES.PHARMACY.INVENTORY} className="text-xs font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                View Inventory
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {INVENTORY.filter(i => ['low','critical','out'].includes(i.status)).map(item => {
                const cfg = STATUS_CONFIG[item.status]
                return (
                  <div key={item.id} role="listitem" className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-white shrink-0 shadow-sm`}>
                      <MdMedication size={18} className={cfg.text} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${cfg.text} truncate`}>{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.manufacturer}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-extrabold ${cfg.text}`}>{item.qty}</p>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ======================================================
              Expiry Monitoring
             ====================================================== */}
          <section aria-labelledby="expiry-heading">
            <h2 id="expiry-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HiOutlineCalendar size={16} className="text-danger-500" aria-hidden="true" />
              Expiry Monitoring
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EXPIRY_GROUPS.map(g => (
                <div key={g.label} className={`flex flex-col gap-2 p-4 rounded-xl border text-center ${g.color}`}>
                  <p className="text-2xl font-extrabold">{g.items.length}</p>
                  <p className="text-xs font-semibold">{g.label}</p>
                  {g.items.slice(0,2).map(i => (
                    <p key={i.id} className="text-[10px] font-medium truncate">{i.name}</p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================
              Inventory Overview — Recent table
             ====================================================== */}
          <section aria-labelledby="inventory-preview-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="inventory-preview-heading" className="text-base font-bold text-slate-900">
                Inventory Overview
              </h2>
              <Link to={ROUTES.PHARMACY.INVENTORY} className="text-xs font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                Full Inventory →
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-base" role="grid" aria-label="Inventory overview">
                  <thead>
                    <tr>
                      <th scope="col">Medicine</th>
                      <th scope="col" className="hidden sm:table-cell">Batch</th>
                      <th scope="col" className="hidden md:table-cell">Expiry</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVENTORY.slice(0,6).map(item => {
                      const cfg = STATUS_CONFIG[item.status]
                      return (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <p className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">{item.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{item.manufacturer}</p>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell text-xs text-slate-500">{item.batch}</td>
                          <td className="hidden md:table-cell text-xs text-slate-500">{item.expiry}</td>
                          <td className="text-xs font-bold text-slate-900">{item.qty}</td>
                          <td><Badge variant={cfg.variant} size="sm">{cfg.label}</Badge></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ======================================================
              Analytics
             ====================================================== */}
          <section aria-labelledby="analytics-heading">
            <h2 id="analytics-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HiOutlineChartBar size={16} className="text-accent-600" aria-hidden="true" />
              Inventory Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category distribution */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-slate-800 mb-3">Category Overview</p>
                <div className="space-y-2.5">
                  {CATEGORY_DIST.map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{c.label}</span>
                        <span className="font-semibold">{c.count} items</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${c.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3">TODO: GET /api/v1/pharmacy/analytics/categories</p>
              </div>

              {/* Stock health + trend placeholder */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-800">Inventory Health</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5 text-xs">
                    {[
                      { label: 'Available', val: STATS.available, total: STATS.total, color: 'bg-success-500' },
                      { label: 'Low/Critical', val: STATS.low, total: STATS.total, color: 'bg-warning-500' },
                      { label: 'Out of Stock', val: STATS.out, total: STATS.total, color: 'bg-danger-500' },
                    ].map(r => (
                      <div key={r.label}>
                        <div className="flex justify-between mb-0.5 text-slate-600">
                          <span>{r.label}</span><span>{r.val}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden" role="meter" aria-label={`${r.label}: ${r.val} of ${r.total}`} aria-valuenow={r.val} aria-valuemax={r.total}>
                          <div className={`h-full ${r.color} rounded-full`} style={{ width: `${Math.round((r.val/r.total)*100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-auto">TODO: GET /api/v1/pharmacy/analytics/health</p>
              </div>
            </div>

            {/* Future placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { label: 'Monthly Inventory Trend', icon: HiOutlineChartBar },
                { label: 'Stock Movement',          icon: HiOutlineArrowUpTray },
                { label: 'Demand Forecast (AI)',    icon: HiOutlineCpuChip },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                  <Icon size={24} className="text-slate-300" aria-hidden="true" />
                  <p className="text-xs font-medium text-slate-400">{label}</p>
                  <Badge variant="neutral" size="sm">Coming Soon</Badge>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right column: notifications + future ──────────── */}
        <div className="lg:sticky lg:top-16 flex flex-col gap-5">

          {/* ======================================================
              Notification Center
             ====================================================== */}
          <section aria-labelledby="pharmacy-notifications-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="pharmacy-notifications-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiOutlineBell size={16} className="text-slate-400" aria-hidden="true" />
                Notifications
                {unread > 0 && <Badge variant="danger" size="sm">{unread}</Badge>}
              </h2>
            </div>
            <div className="space-y-2" aria-live="polite">
              {notifications.map(n => (
                <div key={n.id} className="relative group">
                  <NotificationCard notification={n} onRead={() => handleMarkRead(n.id)} onClick={() => handleMarkRead(n.id)} />
                  <button
                    type="button"
                    onClick={() => handleDeleteNotif(n.id)}
                    aria-label={`Delete: ${n.title}`}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md text-slate-300 hover:text-danger-500 hover:bg-danger-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400"
                  >
                    <HiOutlineXMark size={12} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Future features */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-700 mb-3">Future Features</p>
            <div className="space-y-2">
              {[
                { label: 'Barcode Scanner',    icon: HiOutlineQrCode },
                { label: 'OCR Medicine Entry', icon: HiOutlineBeaker },
                { label: 'AI Stock Prediction',icon: HiOutlineCpuChip },
                { label: 'Supplier Management',icon: HiOutlineShoppingCart },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400 py-1.5 border-b border-slate-50 last:border-0">
                  <Icon size={13} aria-hidden="true" />
                  <span>{label}</span>
                  <Badge variant="neutral" size="sm" className="ml-auto">Soon</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </article>
  )
}

export default PharmacyDashboard