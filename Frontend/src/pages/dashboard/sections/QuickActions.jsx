/**
 * Component: QuickActions
 *
 * Description:
 *   Six shortcut action cards for the most common healthcare tasks.
 *   Each navigates to the corresponding page.
 *
 * Backend readiness: navigation only — no API calls needed.
 */

import { Link } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass, HiOutlineBookmark,
  HiOutlineMapPin, HiOutlineBell,
  HiOutlineUser, HiOutlineCog6Tooth,
  HiOutlineArrowRight,
} from 'react-icons/hi2'
import { ROUTES } from '../../../constants/routes'

const ACTIONS = [
  { icon: HiOutlineMagnifyingGlass, label: 'Search Medicine',       desc: 'Find medicines by name',         to: ROUTES.USER.SEARCH,              color: 'bg-primary-100 text-primary-700'   },
  { icon: HiOutlineBookmark,        label: 'Saved Medicines',        desc: 'View your medicine list',        to: ROUTES.USER.SEARCH,              color: 'bg-success-100 text-success-700'   },
  { icon: HiOutlineMapPin,          label: 'Find Nearby Pharmacy',   desc: 'Locate Jan Aushadhi Kendra',     to: ROUTES.USER.NEARBY_PHARMACIES,   color: 'bg-secondary-100 text-secondary-700'},
  { icon: HiOutlineBell,            label: 'Notifications',          desc: 'View health alerts',             to: ROUTES.USER.NOTIFICATIONS,       color: 'bg-warning-100 text-warning-700'   },
  { icon: HiOutlineUser,            label: 'Profile',                desc: 'Manage your account',            to: ROUTES.USER.PROFILE,             color: 'bg-accent-100 text-accent-700'     },
  { icon: HiOutlineCog6Tooth,       label: 'Settings',               desc: 'App preferences',                to: ROUTES.USER.PROFILE,             color: 'bg-slate-100 text-slate-600'       },
]

function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="text-base font-bold text-slate-900 mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              to={action.to}
              aria-label={action.label}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 text-center"
            >
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${action.color} group-hover:scale-105 transition-transform duration-200`}>
                <Icon size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-primary-700 transition-colors leading-snug">{action.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default QuickActions
