/**
 * Component: AccountSettingsPreview
 *
 * Description:
 *   Compact account settings card linking to full settings.
 *   Reuses Avatar and Toggle for theme/notification toggles.
 *
 * Backend readiness:
 *   - profile → GET /api/v1/users/me
 *   - update  → PUT /api/v1/users/me
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUser, HiOutlineGlobeAlt,
  HiOutlineBell, HiOutlineLockClosed, HiOutlinePencil,
} from 'react-icons/hi2'
import Avatar  from '../../../components/ui/Avatar'
import Toggle  from '../../../components/forms/Toggle'
import Badge   from '../../../components/ui/Badge'
import { useAuth } from '../../../contexts/AuthContext'
import { ROUTES } from '../../../constants/routes'

function AccountSettingsPreview() {
  const { currentUser } = useAuth()
  const name  = currentUser?.name  ?? 'Demo User'
  const email = currentUser?.email ?? 'demo@example.com'
  const role  = currentUser?.role  ?? 'patient'

  const [notifEnabled, setNotifEnabled] = useState(true)

  return (
    <section aria-labelledby="account-settings-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 id="account-settings-heading" className="text-base font-bold text-slate-900">Account Settings</h2>
          <Link
            to={ROUTES.USER.PROFILE}
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            aria-label="Edit your profile"
          >
            <HiOutlinePencil size={13} aria-hidden="true" /> Edit Profile
          </Link>
        </div>

        {/* Profile row */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          <Avatar name={name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
            <Badge variant="primary" size="sm" className="mt-0.5">{role}</Badge>
          </div>
        </div>

        {/* Settings rows */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <div className="flex items-center gap-2 text-slate-600"><HiOutlineGlobeAlt size={14} aria-hidden="true" />Language</div>
            <span className="text-slate-400">English (IN) <span className="text-[10px]">placeholder</span></span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <div className="flex items-center gap-2 text-slate-600"><HiOutlineUser size={14} aria-hidden="true" />Theme</div>
            <span className="text-slate-400">Light <span className="text-[10px]">placeholder</span></span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <div className="flex items-center gap-2 text-slate-600"><HiOutlineBell size={14} aria-hidden="true" />Notifications</div>
            <Toggle size="sm" checked={notifEnabled} onChange={setNotifEnabled} aria-label="Toggle notifications" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-600"><HiOutlineLockClosed size={14} aria-hidden="true" />Privacy</div>
            <Link to={ROUTES.USER.PROFILE} className="text-[11px] text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded">Manage</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountSettingsPreview
