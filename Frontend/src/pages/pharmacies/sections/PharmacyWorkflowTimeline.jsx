/**
 * Component: PharmacyWorkflowTimeline
 *
 * Description:
 *   Visual workflow timeline showing the 6-step pharmacy journey
 *   from locating a pharmacy to receiving a notification.
 */

import { HiOutlineMapPin, HiOutlineMap, HiOutlineCheckBadge, HiOutlineCalendarDays, HiOutlineShoppingBag, HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi2'

const STEPS = [
  { id: 'find',    icon: HiOutlineMapPin,       label: 'Nearby Pharmacy',   description: 'Locate Jan Aushadhi Kendra near you',         status: 'current'  },
  { id: 'map',     icon: HiOutlineMap,           label: 'Map',               description: 'View pharmacy on interactive map',             status: 'upcoming' },
  { id: 'select',  icon: HiOutlineCheckBadge,    label: 'Select Pharmacy',   description: 'Choose the most convenient option',           status: 'upcoming' },
  { id: 'reserve', icon: HiOutlineCalendarDays,  label: 'Reserve Medicine',  description: 'Pre-book stock at your chosen pharmacy',       status: 'upcoming' },
  { id: 'pickup',  icon: HiOutlineShoppingBag,   label: 'Pickup',            description: 'Visit pharmacy and collect your medicine',     status: 'upcoming' },
  { id: 'notify',  icon: HiOutlineBell,          label: 'Notification',      description: 'Get reminders for refills and stock updates',  status: 'upcoming' },
]

const STATUS_STYLES = {
  completed: { dot: 'bg-success-500', iconBg: 'bg-success-100', iconColor: 'text-success-600', label: 'text-success-700', line: 'bg-success-300' },
  current:   { dot: 'bg-primary-500 ring-2 ring-primary-200', iconBg: 'bg-primary-100', iconColor: 'text-primary-700', label: 'text-primary-700', line: 'bg-slate-200' },
  upcoming:  { dot: 'bg-slate-300', iconBg: 'bg-slate-100', iconColor: 'text-slate-400', label: 'text-slate-500', line: 'bg-slate-200' },
}

function PharmacyWorkflowTimeline() {
  return (
    <section aria-labelledby="pharmacy-timeline-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 id="pharmacy-timeline-heading" className="text-base font-bold text-slate-900 mb-5">
          Pharmacy Journey
        </h2>

        <ol className="relative" aria-label="Pharmacy workflow steps">
          {STEPS.map((step, index) => {
            const s = STATUS_STYLES[step.status]
            const Icon = step.icon
            const isLast = index === STEPS.length - 1
            return (
              <li key={step.id} className="flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center shrink-0 w-8">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${s.iconBg}`}>
                    {step.status === 'completed'
                      ? <HiOutlineCheckCircle size={16} className={s.iconColor} aria-hidden="true" />
                      : <Icon size={16} className={s.iconColor} aria-hidden="true" />
                    }
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 mt-1 ${s.line}`} aria-hidden="true" />}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${s.label}`}>{step.label}</span>
                    {step.status === 'current' && (
                      <span className="text-[10px] font-bold text-white bg-primary-600 rounded-full px-2 py-0.5">Current</span>
                    )}
                    {step.status === 'upcoming' && (
                      <span className="text-[10px] text-slate-400 italic">Upcoming</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default PharmacyWorkflowTimeline
