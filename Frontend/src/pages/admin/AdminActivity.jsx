/**
 * Component: AdminActivity
 *
 * Description: Platform activity log with timeline cards.
 * Backend readiness: TODO: GET /api/v1/admin/activity-logs
 */

import { HiOutlineUser, HiOutlineBell, HiOutlineShieldCheck, HiOutlineArrowPath } from 'react-icons/hi2'
import { MdLocalPharmacy, MdMedication } from 'react-icons/md'
import { ACTIVITY_LOGS } from './data/adminData'

const ICON_MAP = {
  user: { Icon: HiOutlineUser,         bg: 'bg-primary-100',   color: 'text-primary-700'   },
  pharmacy: { Icon: MdLocalPharmacy,   bg: 'bg-secondary-100', color: 'text-secondary-700' },
  medicine: { Icon: MdMedication,      bg: 'bg-success-100',   color: 'text-success-700'   },
  mapping:  { Icon: HiOutlineArrowPath,bg: 'bg-accent-100',    color: 'text-accent-700'    },
  notif:    { Icon: HiOutlineBell,     bg: 'bg-warning-100',   color: 'text-warning-700'   },
  admin:    { Icon: HiOutlineShieldCheck,bg:'bg-slate-100',    color: 'text-slate-600'     },
}

function AdminActivity() {
  return (
    <article aria-label="Activity Logs" className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Activity Logs</h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET /api/v1/admin/activity-logs</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <ol className="relative" aria-label="Platform activity timeline">
          {ACTIVITY_LOGS.map((log, i) => {
            const cfg = ICON_MAP[log.icon] ?? ICON_MAP.admin
            const Icon = cfg.Icon
            return (
              <li key={log.id} className="flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center shrink-0 w-9">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} aria-hidden="true" />
                  </div>
                  {i < ACTIVITY_LOGS.length - 1 && <div className="w-0.5 flex-1 mt-1 bg-slate-100" aria-hidden="true" />}
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <p className="text-sm font-semibold text-slate-800">{log.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.detail}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </article>
  )
}

export default AdminActivity
