/**
 * Component: HealthcareTimeline
 *
 * Description:
 *   Chronological activity timeline of the user's healthcare actions.
 *
 * Backend readiness:
 *   - timeline → GET /api/v1/users/me/activity
 */

import {
  HiOutlineMagnifyingGlass, HiOutlineSparkles,
  HiOutlineMapPin, HiOutlineBookmark,
  HiOutlineBell, HiOutlineCheckCircle,
} from 'react-icons/hi2'

// TODO: Replace with GET /api/v1/users/me/activity
const TIMELINE = [
  { id: 't1', icon: HiOutlineMagnifyingGlass, color: 'bg-primary-100 text-primary-600',   label: 'Medicine Searched',    detail: 'Paracetamol 500mg',          time: '10 min ago'  },
  { id: 't2', icon: HiOutlineSparkles,        color: 'bg-success-100 text-success-600',   label: 'Generic Viewed',       detail: 'Paracetamol IP 500mg (JA)',   time: '12 min ago'  },
  { id: 't3', icon: HiOutlineMapPin,          color: 'bg-secondary-100 text-secondary-600',label: 'Pharmacy Visited',    detail: 'Jan Aushadhi Kendra Andheri', time: '2 days ago'  },
  { id: 't4', icon: HiOutlineBookmark,        color: 'bg-warning-100 text-warning-600',   label: 'Medicine Saved',       detail: 'Azithromycin 500mg',          time: '3 days ago'  },
  { id: 't5', icon: HiOutlineBell,            color: 'bg-info-100 text-info-600',         label: 'Notification Received',detail: 'Stock update for Metformin',  time: '5 days ago'  },
  { id: 't6', icon: HiOutlineCheckCircle,     color: 'bg-accent-100 text-accent-600',     label: 'Account Created',      detail: 'Welcome to Smart Medicine!',  time: '2 weeks ago' },
]

function HealthcareTimeline() {
  return (
    <section aria-labelledby="timeline-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 id="timeline-heading" className="text-base font-bold text-slate-900 mb-5">
          Healthcare Activity Timeline
        </h2>
        <ol aria-label="Activity timeline" className="relative">
          {TIMELINE.map((item, i) => {
            const Icon = item.icon
            const isLast = i === TIMELINE.length - 1
            return (
              <li key={item.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center shrink-0 w-8">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.color}`}>
                    <Icon size={14} aria-hidden="true" />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 mt-1 bg-slate-100" aria-hidden="true" />}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default HealthcareTimeline
