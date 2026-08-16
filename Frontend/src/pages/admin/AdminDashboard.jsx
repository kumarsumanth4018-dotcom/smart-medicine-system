/**
 * Component: AdminDashboard — Enterprise Control Center
 *
 * Sections (tab-based layout):
 *   Overview       — Platform stats, quick actions, alerts, management modules
 *   Activity       — Real-time activity monitor with search/filter
 *   Approvals      — Pending pharmacy, mapping, and medicine approvals
 *   System Health  — Service status cards and server uptime
 *   Audit Trail    — Full audit log with search/filter/export
 *   Monitoring     — Live session, today's metrics
 *   Security       — Failed logins, suspicious activity, alerts
 *   Reports        — Report generation UI with export options
 *   Notifications  — Admin notification center
 *   Emergency      — Maintenance, broadcast, emergency controls
 *   AI             — AI/ML engine monitoring placeholders
 *   Backup         — Backup & recovery UI
 *
 * Route: /admin/dashboard  (ProtectedRoute → AdminLayout)
 * All data is placeholder — TODO comments mark every API integration point.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUsers, HiOutlineBell, HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineDocumentText,
  HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineArrowPath,
  HiOutlineUser, HiOutlineWrenchScrewdriver, HiOutlineCpuChip,
  HiOutlineCloudArrowDown, HiOutlineLockClosed, HiOutlineClipboardDocument,
  HiOutlineServerStack, HiOutlineSignal, HiOutlineFunnel,
  HiOutlineArrowDownTray, HiOutlinePrinter, HiOutlineEye, HiOutlineXMark,
  HiOutlineArchiveBox, HiOutlineSpeakerWave, HiOutlineBolt,
  HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil, HiOutlineCog6Tooth,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'
import { MdMedication, MdLocalPharmacy, MdAnalytics, MdInventory2 } from 'react-icons/md'
import InfoCard  from '../../components/cards/InfoCard'
import Badge     from '../../components/ui/Badge'
import Button    from '../../components/ui/Button'
import Input     from '../../components/forms/Input'
import Select    from '../../components/forms/Select'
import Toggle    from '../../components/forms/Toggle'
import { ROUTES } from '../../constants/routes'
import {
  ACTIVITY_LOGS, USERS, PHARMACIES, MEDICINES_CATALOG, GENERIC_MAPPINGS,
  AUDIT_TRAIL, PENDING_PHARMACY_REGS, PENDING_GENERIC_MAPPINGS,
  PENDING_MEDICINE_APPROVALS, SECURITY_LOGS, SYSTEM_SERVICES,
  REPORT_TYPES, AI_SERVICES, BACKUP_HISTORY, ADMIN_NOTIFICATIONS,
} from './data/adminData'

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview',       icon: HiOutlineChartBar },
  { id: 'activity',      label: 'Activity',        icon: HiOutlineSignal },
  { id: 'approvals',     label: 'Approvals',       icon: HiOutlineCheckCircle },
  { id: 'health',        label: 'System Health',   icon: HiOutlineServerStack },
  { id: 'audit',         label: 'Audit Trail',     icon: HiOutlineClipboardDocument },
  { id: 'monitoring',    label: 'Monitoring',      icon: HiOutlineBolt },
  { id: 'security',      label: 'Security',        icon: HiOutlineLockClosed },
  { id: 'reports',       label: 'Reports',         icon: HiOutlineDocumentText },
  { id: 'notifications', label: 'Notifications',   icon: HiOutlineBell },
  { id: 'emergency',     label: 'Emergency',       icon: HiOutlineExclamationTriangle },
  { id: 'ai',            label: 'AI Monitor',      icon: HiOutlineCpuChip },
  { id: 'backup',        label: 'Backup',          icon: HiOutlineCloudArrowDown },
]

const PLATFORM_STATS = [
  { label: 'Total Users',          value: USERS.length,            variant: 'primary',   icon: <HiOutlineUsers size={18} />,          route: ROUTES.ADMIN.USERS,       subtitle: 'TODO: GET /api/v1/admin/stats' },
  { label: 'Pharmacies',           value: PHARMACIES.length,       variant: 'secondary', icon: <MdLocalPharmacy size={18} />,         route: ROUTES.ADMIN.PHARMACIES,  subtitle: `${PHARMACIES.filter(p=>p.verified).length} verified` },
  { label: 'Medicines',            value: MEDICINES_CATALOG.length,variant: 'success',   icon: <MdMedication size={18} />,            route: ROUTES.ADMIN.MEDICINES,   subtitle: `${MEDICINES_CATALOG.filter(m=>m.status==='active').length} active` },
  { label: 'Generic Mappings',     value: GENERIC_MAPPINGS.length, variant: 'info',      icon: <HiOutlineArrowPath size={18} />,      route: ROUTES.ADMIN.GENERIC_MAP, subtitle: `${GENERIC_MAPPINGS.filter(g=>g.status==='approved').length} approved` },
  { label: 'Daily Searches',       value: '—',                     variant: 'default',   icon: <HiOutlineMagnifyingGlass size={18} />,route: null,                     subtitle: 'TODO: /api/v1/admin/analytics' },
  { label: 'Notifications',        value: '—',                     variant: 'warning',   icon: <HiOutlineBell size={18} />,           route: ROUTES.ADMIN.NOTIFICATIONS,subtitle: 'TODO: /api/v1/admin/notifications' },
  { label: 'Platform Health',      value: '99%',                   variant: 'success',   icon: <HiOutlineShieldCheck size={18} />,    route: null,                     subtitle: 'All systems operational' },
  { label: 'Active Sessions',      value: '—',                     variant: 'default',   icon: <HiOutlineUsers size={18} />,          route: null,                     subtitle: 'TODO: /api/v1/admin/sessions' },
]

const QUICK_ACTIONS = [
  { label: 'Add User',          icon: HiOutlinePlusCircle,   to: ROUTES.ADMIN.USERS,        color: 'bg-primary-100 text-primary-700'    },
  { label: 'Approve Pharmacy',  icon: MdLocalPharmacy,       to: ROUTES.ADMIN.PHARMACIES,   color: 'bg-secondary-100 text-secondary-700' },
  { label: 'Add Medicine',      icon: MdMedication,          to: ROUTES.ADMIN.MEDICINES,    color: 'bg-success-100 text-success-700'    },
  { label: 'Broadcast Notif.', icon: HiOutlineSpeakerWave,  to: ROUTES.ADMIN.NOTIFICATIONS,color: 'bg-warning-100 text-warning-700'    },
  { label: 'Generate Report',   icon: HiOutlineDocumentText, to: ROUTES.ADMIN.REPORTS,      color: 'bg-accent-100 text-accent-700'      },
  { label: 'Audit Logs',        icon: HiOutlineClipboardDocument,to: ROUTES.ADMIN.ACTIVITY,  color: 'bg-slate-100 text-slate-600'        },
  { label: 'Platform Settings', icon: HiOutlineCog6Tooth,    to: ROUTES.ADMIN.SETTINGS,     color: 'bg-info-100 text-info-700'          },
  { label: 'Role Management',   icon: HiOutlineUsers,        to: ROUTES.ADMIN.ROLES,        color: 'bg-danger-100 text-danger-700'      },
]

const ACT_ICON = {
  user:     { Icon: HiOutlineUser,           bg: 'bg-primary-100',   color: 'text-primary-600'   },
  pharmacy: { Icon: MdLocalPharmacy,         bg: 'bg-secondary-100', color: 'text-secondary-600' },
  medicine: { Icon: MdMedication,            bg: 'bg-success-100',   color: 'text-success-600'   },
  mapping:  { Icon: HiOutlineArrowPath,      bg: 'bg-accent-100',    color: 'text-accent-600'    },
  notif:    { Icon: HiOutlineBell,           bg: 'bg-warning-100',   color: 'text-warning-600'   },
  admin:    { Icon: HiOutlineShieldCheck,    bg: 'bg-slate-100',     color: 'text-slate-600'     },
}

const STATUS_BADGE = {
  success:     { variant: 'success',   label: 'Success'    },
  pending:     { variant: 'warning',   label: 'Pending'    },
  danger:      { variant: 'danger',    label: 'Action'     },
  warning:     { variant: 'warning',   label: 'Warning'    },
}

const HEALTH_DOT = {
  operational: 'bg-success-500',
  degraded:    'bg-warning-500',
  down:        'bg-danger-500',
  coming_soon: 'bg-slate-300',
}
const HEALTH_BADGE = {
  operational: { variant: 'success',   label: 'Operational' },
  degraded:    { variant: 'warning',   label: 'Degraded'    },
  down:        { variant: 'danger',    label: 'Down'        },
  coming_soon: { variant: 'neutral',   label: 'Coming Soon' },
}

const AI_DOT = {
  active:      'bg-success-500',
  coming_soon: 'bg-slate-300',
}
const AI_BADGE = {
  active:      { variant: 'success', label: 'Active'      },
  coming_soon: { variant: 'neutral', label: 'Coming Soon' },
}

const NOTIF_TYPE_BADGE = {
  critical: { variant: 'danger',    label: 'Critical'   },
  security: { variant: 'danger',    label: 'Security'   },
  platform: { variant: 'warning',   label: 'Platform'   },
  register: { variant: 'info',      label: 'Registration'},
  medicine: { variant: 'success',   label: 'Medicine'   },
  inventory: { variant: 'warning',  label: 'Inventory'  },
}

const SEC_BADGE = {
  warning: { variant: 'warning', label: 'Warning' },
  danger:  { variant: 'danger',  label: 'High'    },
  success: { variant: 'success', label: 'Resolved'},
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          {Icon && <Icon size={16} className="text-primary-600" aria-hidden="true" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function ActionRow({ onApprove, onReject, onView }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {onView    && <button type="button" onClick={onView}    aria-label="View"    className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"><HiOutlineEye size={12}/> View</button>}
      {onApprove && <button type="button" onClick={onApprove} aria-label="Approve" className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-success-100 text-success-700 hover:bg-success-200 transition-colors"><HiOutlineCheckCircle size={12}/> Approve</button>}
      {onReject  && <button type="button" onClick={onReject}  aria-label="Reject"  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-danger-100 text-danger-700 hover:bg-danger-200 transition-colors"><HiOutlineXMark size={12}/> Reject</button>}
    </div>
  )
}

function SearchFilterBar({ searchValue, onSearch, filterLabel = 'Filter', placeholder = 'Search…' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex-1">
        <Input
          leftIcon={<HiOutlineMagnifyingGlass size={15} />}
          placeholder={placeholder}
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
        <HiOutlineFunnel size={14} aria-hidden="true" /> {filterLabel}
      </button>
    </div>
  )
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

// 1. Overview
function OverviewTab({ pendingPharmacies, pendingMappings }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Platform stats */}
      <section aria-labelledby="ps-heading">
        <h2 id="ps-heading" className="sr-only">Platform Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {PLATFORM_STATS.map(s => (
            <InfoCard key={s.label} label={s.label} value={s.value} variant={s.variant} icon={s.icon} subtitle={s.subtitle} className="col-span-2 lg:col-span-1" />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="qa-heading">
        <h2 id="qa-heading" className="text-base font-bold text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
            <Link key={label} to={to} aria-label={label}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 col-span-1"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color} group-hover:scale-105 transition-transform`}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-slate-700 group-hover:text-primary-700 transition-colors leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-5">
          {/* Alerts */}
          <SectionCard title="System Alerts" icon={HiOutlineExclamationTriangle}>
            <div className="space-y-2">
              {pendingPharmacies > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-warning-50 border border-warning-200">
                  <span className="flex items-center gap-2 text-xs text-warning-800"><HiOutlineExclamationTriangle size={13}/>{pendingPharmacies} pharmacies awaiting verification</span>
                  <Link to={ROUTES.ADMIN.PHARMACIES} className="text-xs font-semibold text-warning-700 hover:underline">Review →</Link>
                </div>
              )}
              {pendingMappings > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-info-50 border border-info-100">
                  <span className="flex items-center gap-2 text-xs text-info-700"><HiOutlineArrowPath size={13}/>{pendingMappings} generic mappings pending</span>
                  <Link to={ROUTES.ADMIN.GENERIC_MAP} className="text-xs font-semibold text-info-700 hover:underline">Review →</Link>
                </div>
              )}
              <div className="flex items-center justify-between p-3 rounded-xl bg-success-50 border border-success-200">
                <span className="flex items-center gap-2 text-xs text-success-700"><HiOutlineCheckCircle size={13}/>All core services operational</span>
                <Badge variant="success" size="sm">Healthy</Badge>
              </div>
            </div>
          </SectionCard>

          {/* Management modules */}
          <SectionCard title="Management Modules" icon={HiOutlineChartBar}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title:'User Management',  desc:`${USERS.length} total users`,                    to:ROUTES.ADMIN.USERS,        icon:HiOutlineUsers,   count:USERS.length },
                { title:'Pharmacy Network', desc:`${PHARMACIES.filter(p=>p.verified).length} verified`, to:ROUTES.ADMIN.PHARMACIES, icon:MdLocalPharmacy, count:PHARMACIES.length },
                { title:'Medicine Catalog', desc:`${MEDICINES_CATALOG.length} medicines`,            to:ROUTES.ADMIN.MEDICINES,   icon:MdMedication,    count:MEDICINES_CATALOG.length },
                { title:'Generic Mapping',  desc:`${GENERIC_MAPPINGS.length} brand-generic pairs`,  to:ROUTES.ADMIN.GENERIC_MAP, icon:HiOutlineArrowPath,count:GENERIC_MAPPINGS.length },
              ].map(({ title, desc, to, icon: Icon, count }) => (
                <Link key={title} to={to}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 shrink-0">
                    <Icon size={22} className="text-primary-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 truncate">{desc}</p>
                  </div>
                  <span className="text-2xl font-extrabold text-primary-700 shrink-0">{count}</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Recent activity */}
        <SectionCard title="Recent Activity" icon={HiOutlineSignal} action={<Link to={ROUTES.ADMIN.ACTIVITY} className="text-xs font-medium text-primary-600 hover:underline">View all →</Link>}>
          <ol className="relative" aria-label="Recent activity">
            {ACTIVITY_LOGS.slice(0, 8).map((log, i) => {
              const cfg = ACT_ICON[log.icon] ?? ACT_ICON.admin
              const Icon = cfg.Icon
              return (
                <li key={log.id} className="flex gap-3 pb-3 last:pb-0">
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${cfg.bg}`}>
                      <Icon size={13} className={cfg.color} aria-hidden="true" />
                    </div>
                    {i < 7 && <div className="w-0.5 flex-1 mt-1 bg-slate-100" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs font-semibold text-slate-800">{log.label}</p>
                    <p className="text-[11px] text-slate-500 truncate">{log.detail}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] text-slate-400">{log.time}</p>
                      <Badge variant={STATUS_BADGE[log.status]?.variant ?? 'neutral'} size="sm">{STATUS_BADGE[log.status]?.label ?? log.status}</Badge>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </SectionCard>
      </div>
    </div>
  )
}

// 2. Activity Monitor
function ActivityTab() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filtered = ACTIVITY_LOGS.filter(log => {
    const matchSearch = log.label.toLowerCase().includes(search.toLowerCase()) ||
                        log.detail.toLowerCase().includes(search.toLowerCase()) ||
                        log.user.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || log.icon === filter
    return matchSearch && matchFilter
  })
  return (
    <SectionCard title="Platform Activity Monitor" icon={HiOutlineSignal}>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1">
          <Input leftIcon={<HiOutlineMagnifyingGlass size={15}/>} placeholder="Search activities, users, modules…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select
          options={[{value:'all',label:'All Types'},{value:'user',label:'Users'},{value:'pharmacy',label:'Pharmacies'},{value:'medicine',label:'Medicines'},{value:'mapping',label:'Mapping'},{value:'notif',label:'Notifications'},{value:'admin',label:'Admin'}]}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th>Activity</th>
              <th>User</th>
              <th>Module</th>
              <th>Time</th>
              <th>IP Address</th>
              <th>Device</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} className="text-center text-xs text-slate-400 py-6">No activities found.</td></tr>
              : filtered.map(log => {
                  const cfg = ACT_ICON[log.icon] ?? ACT_ICON.admin
                  const Icon = cfg.Icon
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-7 h-7 rounded-full ${cfg.bg} shrink-0`}>
                            <Icon size={12} className={cfg.color} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{log.label}</p>
                            <p className="text-[11px] text-slate-500 max-w-[180px] truncate">{log.detail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-slate-700">{log.user}</td>
                      <td><Badge variant="neutral" size="sm">{log.module}</Badge></td>
                      <td className="text-[11px] text-slate-400 whitespace-nowrap">{log.time}</td>
                      <td className="text-[11px] text-slate-500 font-mono">{log.ip}</td>
                      <td className="text-[11px] text-slate-500">{log.device}</td>
                      <td><Badge variant={STATUS_BADGE[log.status]?.variant ?? 'neutral'} size="sm" dot>{STATUS_BADGE[log.status]?.label ?? log.status}</Badge></td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

// 3. Pending Approvals
function ApprovalsTab() {
  return (
    <div className="flex flex-col gap-5">
      {/* Pending Pharmacy Registrations */}
      <SectionCard title="Pending Pharmacy Registrations" icon={MdLocalPharmacy}>
        {PENDING_PHARMACY_REGS.length === 0
          ? <p className="text-xs text-slate-400 text-center py-4">No pending pharmacy registrations.</p>
          : PENDING_PHARMACY_REGS.map(ph => (
            <div key={ph.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 mb-3 last:mb-0">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-slate-900">{ph.name}</p>
                <p className="text-xs text-slate-500">{ph.owner} · {ph.location}</p>
                <p className="text-[11px] text-slate-400">License: {ph.license} · Submitted: {ph.submitted}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ph.docs.map(d => <Badge key={d} variant="info" size="sm">{d}</Badge>)}
                </div>
              </div>
              <ActionRow onApprove={() => {}} onReject={() => {}} onView={() => {}} />
            </div>
          ))}
      </SectionCard>

      {/* Pending Generic Mappings */}
      <SectionCard title="Pending Generic Mappings" icon={HiOutlineArrowPath}>
        {PENDING_GENERIC_MAPPINGS.length === 0
          ? <p className="text-xs text-slate-400 text-center py-4">No pending mappings.</p>
          : PENDING_GENERIC_MAPPINGS.map(m => (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 mb-3 last:mb-0">
              <div>
                <p className="text-sm font-bold text-slate-900">{m.brandName} → {m.genericName}</p>
                <p className="text-xs text-slate-500">Submitted by: {m.submittedBy} · {m.submittedOn}</p>
                <p className="text-[11px] text-slate-400">Confidence: {m.confidence}</p>
              </div>
              <ActionRow onApprove={() => {}} onReject={() => {}} onView={() => {}} />
            </div>
          ))}
      </SectionCard>

      {/* Pending Medicine Approvals */}
      <SectionCard title="Medicine Approval Workflow" icon={MdMedication}>
        <div className="overflow-x-auto">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th>Medicine Name</th><th>Composition</th><th>Category</th>
                <th>Submitted By</th><th>Submission Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_MEDICINE_APPROVALS.map(m => (
                <tr key={m.id}>
                  <td className="font-semibold text-slate-900">{m.name}</td>
                  <td className="text-slate-600">{m.composition}</td>
                  <td><Badge variant="neutral" size="sm">{m.category}</Badge></td>
                  <td className="text-slate-600">{m.submittedBy}</td>
                  <td className="text-slate-500">{m.submittedOn}</td>
                  <td><Badge variant="warning" size="sm" dot>Pending Review</Badge></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <ActionRow onApprove={() => {}} onReject={() => {}} onView={() => {}} />
                      <button type="button" aria-label="Edit" className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-info-100 text-info-700 hover:bg-info-200 transition-colors"><HiOutlinePencil size={12}/> Edit</button>
                      <button type="button" aria-label="Delete" className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-danger-100 text-danger-700 hover:bg-danger-200 transition-colors"><HiOutlineTrash size={12}/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Pharmacy Verification Workflow */}
      <SectionCard title="Pharmacy Verification — Document Review" icon={HiOutlineShieldCheck}>
        {PENDING_PHARMACY_REGS.map(ph => (
          <div key={ph.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 mb-3 last:mb-0">
            <p className="text-sm font-bold text-slate-900 mb-2">{ph.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {['Drug License', 'GST Certificate', 'Identity Proof'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100">
                  <span className="text-xs font-medium text-slate-700">{doc}</span>
                  <Badge variant={ph.docs.includes(doc) ? 'success' : 'warning'} size="sm">
                    {ph.docs.includes(doc) ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-success-100 text-success-700 hover:bg-success-200 transition-colors">✓ Approve</button>
              <button type="button" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-danger-100 text-danger-700 hover:bg-danger-200 transition-colors">✕ Reject</button>
              <button type="button" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-warning-100 text-warning-700 hover:bg-warning-200 transition-colors">↩ Request Re-submission</button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

// 4. System Health
function HealthTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Service Status" icon={HiOutlineServerStack}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SYSTEM_SERVICES.map(svc => {
            const bConf = HEALTH_BADGE[svc.status] ?? { variant: 'neutral', label: svc.status }
            return (
              <div key={svc.id} className="flex flex-col gap-2 p-4 rounded-xl border border-slate-100 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{svc.name}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[svc.status] ?? 'bg-slate-300'} shrink-0`} aria-hidden="true" />
                </div>
                <Badge variant={bConf.variant} size="sm" dot>{bConf.label}</Badge>
                <p className="text-[11px] text-slate-500">{svc.note}</p>
                <p className="text-xs font-semibold text-slate-700">Uptime: {svc.uptime}</p>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Platform monitoring widgets */}
      <SectionCard title="Platform Monitoring" icon={HiOutlineBolt}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Active Sessions',      value: '—', note: 'TODO: /api/v1/admin/sessions' },
            { label: 'Users Online',          value: '—', note: 'TODO: /api/v1/admin/online/users' },
            { label: 'Pharmacies Online',     value: '—', note: 'TODO: /api/v1/admin/online/pharmacies' },
            { label: "Today's Searches",      value: '—', note: 'TODO: /api/v1/admin/analytics/today' },
            { label: "Today's Recommendations",value:'—', note: 'TODO: /api/v1/admin/analytics/today' },
            { label: "Today's Notifications", value: '—', note: 'TODO: /api/v1/admin/notifications/today' },
            { label: "Today's Registrations", value: '—', note: 'TODO: /api/v1/admin/users/today' },
          ].map(m => (
            <div key={m.label} className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-1">
              <span className="text-2xl font-extrabold text-primary-700">{m.value}</span>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight">{m.label}</span>
              <span className="text-[10px] text-slate-400 leading-tight">{m.note}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// 5. Audit Trail
function AuditTab() {
  const [search, setSearch] = useState('')
  const filtered = AUDIT_TRAIL.filter(a =>
    a.admin.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.module.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <SectionCard title="Audit Trail" icon={HiOutlineClipboardDocument}
      action={
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <HiOutlineArrowDownTray size={13}/> Export
          </button>
          <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <HiOutlinePrinter size={13}/> Print
          </button>
        </div>
      }
    >
      <SearchFilterBar searchValue={search} onSearch={setSearch} placeholder="Search administrator, action, module…" />
      <div className="overflow-x-auto">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th>Date</th><th>Time</th><th>Administrator</th><th>Action</th>
              <th>Module</th><th>IP Address</th><th>Device</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} className="text-center text-xs text-slate-400 py-6">No audit records found.</td></tr>
              : filtered.map(a => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap">{a.date}</td>
                  <td className="whitespace-nowrap text-slate-500">{a.time}</td>
                  <td className="font-semibold">{a.admin}</td>
                  <td>{a.action}</td>
                  <td><Badge variant="neutral" size="sm">{a.module}</Badge></td>
                  <td className="font-mono text-[11px]">{a.ip}</td>
                  <td className="text-[11px] text-slate-500">{a.device}</td>
                  <td><Badge variant={STATUS_BADGE[a.status]?.variant ?? 'neutral'} size="sm" dot>{STATUS_BADGE[a.status]?.label ?? a.status}</Badge></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

// 6. Monitoring
function MonitoringTab() {
  return (
    <SectionCard title="Platform Monitoring — Live Metrics" icon={HiOutlineBolt}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Active Sessions',       value: '—', sub: 'TODO: GET /api/v1/admin/sessions/active', color:'text-primary-700' },
          { label: 'Users Online',                value: '—', sub: 'TODO: GET /api/v1/admin/online',          color:'text-secondary-700' },
          { label: 'Pharmacies Online',           value: '—', sub: 'TODO: GET /api/v1/admin/pharmacies/online',color:'text-success-700' },
          { label: "Today's Searches",            value: '—', sub: 'TODO: GET /api/v1/admin/analytics/today', color:'text-info-700' },
          { label: "Today's Recommendations",     value: '—', sub: 'TODO: GET /api/v1/admin/analytics/today', color:'text-accent-700' },
          { label: "Today's Notifications",       value: '—', sub: 'TODO: GET /api/v1/admin/notifications/today',color:'text-warning-700' },
          { label: "Today's New Registrations",   value: '—', sub: 'TODO: GET /api/v1/admin/users/today',    color:'text-primary-700' },
          { label: 'Server Uptime',               value: '99.98%', sub: 'Last 30 days',                       color:'text-success-700' },
        ].map(m => (
          <div key={m.label} className="flex flex-col gap-1 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <span className={`text-3xl font-extrabold ${m.color}`}>{m.value}</span>
            <span className="text-xs font-semibold text-slate-800 leading-tight">{m.label}</span>
            <span className="text-[11px] text-slate-400">{m.sub}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// 7. Security
function SecurityTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Security Monitor" icon={HiOutlineLockClosed}>
        <div className="overflow-x-auto">
          <table className="table-base w-full">
            <thead>
              <tr><th>Event</th><th>User</th><th>IP Address</th><th>Time</th><th>Detail</th><th>Severity</th></tr>
            </thead>
            <tbody>
              {SECURITY_LOGS.map(s => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.event}</td>
                  <td className="text-slate-600">{s.user}</td>
                  <td className="font-mono text-[11px]">{s.ip}</td>
                  <td className="whitespace-nowrap text-slate-500 text-[11px]">{s.time}</td>
                  <td className="text-slate-500">{s.detail}</td>
                  <td><Badge variant={SEC_BADGE[s.severity]?.variant ?? 'neutral'} size="sm" dot>{SEC_BADGE[s.severity]?.label ?? s.severity}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Failed Login Attempts (24h)', value: '3',  variant: 'warning', icon: HiOutlineLockClosed },
          { label: 'Account Lock Events (24h)',   value: '1',  variant: 'danger',  icon: HiOutlineExclamationTriangle },
          { label: 'Security Alerts Resolved',    value: '1',  variant: 'success', icon: HiOutlineCheckCircle },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${s.variant === 'warning' ? 'bg-warning-100' : s.variant === 'danger' ? 'bg-danger-100' : 'bg-success-100'}`}>
              <s.icon size={20} className={s.variant === 'warning' ? 'text-warning-600' : s.variant === 'danger' ? 'text-danger-600' : 'text-success-600'} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 leading-snug">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 8. Reports
function ReportsTab() {
  return (
    <SectionCard title="Advanced Report Generation" icon={HiOutlineDocumentText}>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { icon: HiOutlineArrowDownTray, label: 'Export PDF',   color: 'bg-danger-100 text-danger-700'   },
          { icon: HiOutlineArrowDownTray, label: 'Export Excel', color: 'bg-success-100 text-success-700' },
          { icon: HiOutlineArrowDownTray, label: 'Export CSV',   color: 'bg-info-100 text-info-700'       },
          { icon: HiOutlinePrinter,       label: 'Print',        color: 'bg-slate-100 text-slate-700'     },
        ].map(b => (
          <button key={b.label} type="button"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg ${b.color} hover:opacity-80 transition-opacity`}
          >
            <b.icon size={13} aria-hidden="true" /> {b.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="group flex flex-col gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50">
                <HiOutlineDocumentText size={20} className="text-primary-700" aria-hidden="true" />
              </div>
              <Badge variant="neutral" size="sm">{r.category === 'time' ? 'Periodic' : 'Entity'}</Badge>
            </div>
            <p className="text-sm font-bold text-slate-900">{r.label}</p>
            <p className="text-xs text-slate-500">{r.period}</p>
            <button type="button" className="mt-auto w-full py-1.5 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
              Generate
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// 9. Notifications
function NotificationsTab() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? ADMIN_NOTIFICATIONS : ADMIN_NOTIFICATIONS.filter(n => n.type === filter)
  return (
    <SectionCard title="Administrator Notification Center" icon={HiOutlineBell}
      action={
        <button type="button" className="text-xs font-semibold text-primary-600 hover:underline">Mark All Read</button>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {['all','critical','security','platform','register','medicine','inventory'].map(t => (
          <button key={t} type="button" onClick={() => setFilter(t)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${filter === t ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600 hover:border-primary-400'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(n => {
          const bc = NOTIF_TYPE_BADGE[n.type] ?? { variant: 'neutral', label: n.type }
          return (
            <div key={n.id} className={`flex items-start justify-between gap-3 p-4 rounded-xl border ${n.read ? 'bg-white border-slate-100' : 'bg-primary-50 border-primary-200'}`}>
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" aria-label="Unread" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-slate-900">{n.title}</p>
                    <Badge variant={bc.variant} size="sm">{bc.label}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" aria-label="Mark read"  title="Mark read"  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"><HiOutlineCheckCircle size={14}/></button>
                <button type="button" aria-label="Archive"    title="Archive"    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"><HiOutlineArchiveBox   size={14}/></button>
                <button type="button" aria-label="Delete"     title="Delete"     className="p-1.5 rounded-md hover:bg-danger-50 text-danger-500 transition-colors"><HiOutlineTrash        size={14}/></button>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// 10. Emergency Controls
function EmergencyTab() {
  const [maint,   setMaint]   = useState(false)
  const [disaReg, setDisaReg] = useState(false)
  const [disaPh,  setDisaPh]  = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {maint && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 border border-danger-300">
          <HiOutlineExclamationTriangle size={18} className="text-danger-600 shrink-0" aria-hidden="true" />
          <p className="text-xs font-bold text-danger-800">⚠ Maintenance Mode is ACTIVE — the platform is inaccessible to users. (Placeholder only)</p>
        </div>
      )}
      <SectionCard title="Emergency Controls" icon={HiOutlineExclamationTriangle}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Maintenance Mode',              desc: 'Take platform offline for maintenance',              value: maint,   onChange: setMaint,   color: 'text-danger-600'  },
            { label: 'Disable User Registrations',    desc: 'Block new user sign-ups (placeholder)',              value: disaReg, onChange: setDisaReg, color: 'text-warning-600' },
            { label: 'Disable Pharmacy Registration', desc: 'Block pharmacy registration submissions (placeholder)', value: disaPh, onChange: setDisaPh, color: 'text-warning-600' },
          ].map(c => (
            <div key={c.label} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div>
                <p className={`text-xs font-bold ${c.color}`}>{c.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{c.desc}</p>
              </div>
              <Toggle checked={c.value} onChange={c.onChange} size="sm" aria-label={c.label} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Emergency Broadcast" icon={HiOutlineSpeakerWave}>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-700">Emergency Announcement (Placeholder)</label>
          <textarea
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={4}
            placeholder="Enter emergency announcement message to broadcast to all users…"
            aria-label="Emergency announcement message"
          />
          <div className="flex gap-2">
            <button type="button" className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger-600 text-white hover:bg-danger-700 transition-colors">
              🔴 Broadcast Emergency Alert
            </button>
            <button type="button" className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Preview
            </button>
          </div>
          <p className="text-[11px] text-slate-400">TODO: POST /api/v1/admin/broadcast/emergency — broadcasts to all registered users.</p>
        </div>
      </SectionCard>

      <SectionCard title="Notification Broadcast" icon={HiOutlineBell}>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Target Audience</label>
              <Select options={[{value:'all',label:'All Users'},{value:'patients',label:'Patients'},{value:'doctors',label:'Doctors'},{value:'pharmacists',label:'Pharmacists'}]} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Notification Type</label>
              <Select options={[{value:'info',label:'Information'},{value:'alert',label:'Alert'},{value:'update',label:'Update'},{value:'promo',label:'Promotion'}]} />
            </div>
          </div>
          <Input placeholder="Notification title…" label="Title" />
          <textarea
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
            placeholder="Notification message body…"
            aria-label="Notification message"
          />
          <button type="button" className="w-fit px-4 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            Send Notification
          </button>
          <p className="text-[11px] text-slate-400">TODO: POST /api/v1/admin/broadcast/notification</p>
        </div>
      </SectionCard>
    </div>
  )
}

// 11. AI Monitor
function AITab() {
  return (
    <SectionCard title="AI & Machine Learning Monitor" icon={HiOutlineCpuChip}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_SERVICES.map(ai => {
          const bc = AI_BADGE[ai.status] ?? { variant: 'neutral', label: ai.status }
          return (
            <div key={ai.id} className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{ai.name}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${AI_DOT[ai.status] ?? 'bg-slate-300'}`} aria-hidden="true" />
              </div>
              <Badge variant={bc.variant} size="sm" dot>{bc.label}</Badge>
              <p className="text-[11px] text-slate-500">{ai.note}</p>
              {ai.accuracy !== 'N/A' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-600">Model Accuracy</span>
                  <span className="text-xs font-bold text-success-700">{ai.accuracy}</span>
                </div>
              )}
              {ai.accuracy === 'N/A' && (
                <Badge variant="neutral" size="sm">Planned — Next Phase</Badge>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-4">TODO: GET /api/v1/admin/ai/status — live model health from ML backend.</p>
    </SectionCard>
  )
}

// 12. Backup & Recovery
function BackupTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Backup & Recovery" icon={HiOutlineCloudArrowDown}>
        <div className="flex flex-wrap gap-2 mb-5">
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            <HiOutlineCloudArrowDown size={14}/> Create Backup
          </button>
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <HiOutlineArrowPath size={14}/> Restore Backup
          </button>
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <HiOutlineCalendarDays size={14}/> Schedule Backup
          </button>
        </div>
        <h3 className="text-xs font-bold text-slate-700 mb-3">Backup History</h3>
        <div className="overflow-x-auto">
          <table className="table-base w-full">
            <thead>
              <tr><th>Label</th><th>Date & Time</th><th>Size</th><th>Type</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {BACKUP_HISTORY.map(b => (
                <tr key={b.id}>
                  <td className="font-semibold">{b.label}</td>
                  <td className="text-slate-500 text-[11px] whitespace-nowrap">{b.date}</td>
                  <td className="text-slate-500">{b.size}</td>
                  <td><Badge variant="neutral" size="sm">{b.type}</Badge></td>
                  <td><Badge variant={b.status === 'success' ? 'success' : 'danger'} size="sm" dot>{b.status === 'success' ? 'Success' : 'Failed'}</Badge></td>
                  <td>
                    <button type="button" className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-info-100 text-info-700 hover:bg-info-200 transition-colors">
                      <HiOutlineArrowDownTray size={12}/> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">TODO: GET /api/v1/admin/backup/history · POST /api/v1/admin/backup/create</p>
      </SectionCard>
    </div>
  )
}

// ─── Global Search ────────────────────────────────────────────────────────────
const SEARCH_CATEGORIES = [
  { label: 'Users',          data: USERS,              keyFn: u => `${u.name} ${u.email} ${u.role}` },
  { label: 'Pharmacies',     data: PHARMACIES,         keyFn: p => `${p.name} ${p.owner} ${p.location}` },
  { label: 'Medicines',      data: MEDICINES_CATALOG,  keyFn: m => `${m.name} ${m.genericName} ${m.composition}` },
  { label: 'Generic Mapping',data: GENERIC_MAPPINGS,   keyFn: g => `${g.brandName} ${g.genericName}` },
]

function GlobalSearch({ value, onChange }) {
  const results = value.trim().length < 2 ? [] : SEARCH_CATEGORIES.flatMap(cat =>
    cat.data
      .filter(item => cat.keyFn(item).toLowerCase().includes(value.toLowerCase()))
      .map(item => ({ category: cat.label, label: cat.keyFn(item).split(' ')[0], detail: cat.keyFn(item) }))
  ).slice(0, 12)

  return (
    <div className="relative flex-1 max-w-sm">
      <Input
        leftIcon={<HiOutlineMagnifyingGlass size={16}/>}
        placeholder="Search users, pharmacies, medicines, reports…"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Global search"
      />
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2.5 hover:bg-primary-50 cursor-pointer transition-colors">
              <Badge variant="neutral" size="sm">{r.category}</Badge>
              <p className="text-xs text-slate-800 truncate">{r.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const [activeTab,    setActiveTab]    = useState('overview')
  const [globalSearch, setGlobalSearch] = useState('')

  const pendingPharmacies = PHARMACIES.filter(p => p.status === 'pending').length
  const pendingMappings   = GENERIC_MAPPINGS.filter(g => g.status === 'pending').length
  const unreadNotifs      = ADMIN_NOTIFICATIONS.filter(n => !n.read).length

  const PANEL = {
    overview:      <OverviewTab     pendingPharmacies={pendingPharmacies} pendingMappings={pendingMappings} />,
    activity:      <ActivityTab />,
    approvals:     <ApprovalsTab />,
    health:        <HealthTab />,
    audit:         <AuditTab />,
    monitoring:    <MonitoringTab />,
    security:      <SecurityTab />,
    reports:       <ReportsTab />,
    notifications: <NotificationsTab />,
    emergency:     <EmergencyTab />,
    ai:            <AITab />,
    backup:        <BackupTab />,
  }

  return (
    <article aria-label="Admin Enterprise Dashboard" className="flex flex-col gap-5">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Enterprise Control Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Smart Medicine System — Administrator Portal · v1.0.0</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <GlobalSearch value={globalSearch} onChange={setGlobalSearch} />
          {pendingPharmacies > 0 && (
            <button type="button" onClick={() => setActiveTab('approvals')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-warning-50 border border-warning-200 text-warning-700 text-xs font-semibold hover:bg-warning-100 transition-colors"
            >
              <HiOutlineExclamationTriangle size={13}/> {pendingPharmacies} pending
            </button>
          )}
          {unreadNotifs > 0 && (
            <button type="button" onClick={() => setActiveTab('notifications')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-100 transition-colors"
            >
              <HiOutlineBell size={13}/> {unreadNotifs} alerts
            </button>
          )}
        </div>
      </div>

      {/* ── Tab navigation ──────────────────────────────────────── */}
      <nav aria-label="Dashboard sections" className="-mb-1">
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  activeTab === tab.id
                    ? 'bg-white border-primary-600 text-primary-700 shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50',
                ].join(' ')}
              >
                <Icon size={13} aria-hidden="true" />
                {tab.label}
                {tab.id === 'approvals' && (pendingPharmacies + pendingMappings) > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-warning-500 text-white text-[9px] font-bold">
                    {pendingPharmacies + pendingMappings}
                  </span>
                )}
                {tab.id === 'notifications' && unreadNotifs > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div className="h-0.5 bg-slate-100 -mt-0.5" />
      </nav>

      {/* ── Tab content ─────────────────────────────────────────── */}
      <div role="tabpanel" aria-label={TABS.find(t => t.id === activeTab)?.label}>
        {PANEL[activeTab]}
      </div>

    </article>
  )
}

export default AdminDashboard
