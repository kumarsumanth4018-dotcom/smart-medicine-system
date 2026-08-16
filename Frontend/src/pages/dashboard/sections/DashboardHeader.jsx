/**
 * Component: DashboardHeader
 *
 * Description:
 *   Personal healthcare dashboard header showing the user's avatar,
 *   welcome message, current date, and health activity status.
 *
 * Backend readiness:
 *   - user → useAuth().currentUser
 *   - healthStatus → GET /api/v1/users/me/health-summary
 */

import { HiOutlineShieldCheck, HiOutlineCalendar } from 'react-icons/hi2'
import Avatar from '../../../components/ui/Avatar'
import Badge  from '../../../components/ui/Badge'
import { useAuth } from '../../../contexts/AuthContext'

function DashboardHeader() {
  const { currentUser } = useAuth()
  // TODO: replace with real user from useAuth + health summary from API
  const name = currentUser?.name ?? 'Demo User'
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <section aria-labelledby="dashboard-welcome">

      {/* ======================================================
          Dashboard Overview
         ====================================================== */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px] opacity-5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: avatar + greeting */}
          <div className="flex items-center gap-4">
            <Avatar name={name} size="xl" online={true} />
            <div>
              <p className="text-primary-200 text-sm">{greeting},</p>
              <h1 id="dashboard-welcome" className="text-2xl font-extrabold text-white leading-tight">
                {name}
              </h1>
              <div className="flex items-center gap-1.5 text-primary-200 text-xs mt-1">
                <HiOutlineCalendar size={12} aria-hidden="true" />
                {today}
              </div>
            </div>
          </div>

          {/* Right: health status */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
              <HiOutlineShieldCheck size={18} className="text-success-300" aria-hidden="true" />
              <div>
                <p className="text-[10px] text-primary-200 uppercase tracking-wider">Health Status</p>
                <p className="text-sm font-semibold text-white">
                  {/* TODO: healthStatus from GET /api/v1/users/me/health-summary */}
                  Active & Healthy
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>All medicines tracked</Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardHeader
