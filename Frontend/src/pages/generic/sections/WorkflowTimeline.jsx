/**
 * Component: WorkflowTimeline
 *
 * Description:
 *   Visual timeline showing the complete healthcare journey workflow.
 *   Helps users understand the next steps after viewing generic recommendations.
 *
 * Responsibilities:
 *   - Display 6-step workflow timeline
 *   - Mark completed steps, current step, and upcoming steps
 *   - Each step has icon, label, description, and status indicator
 */

import { Link } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass, HiOutlineMapPin,
  HiOutlineMap, HiOutlineBookmark,
  HiOutlineBell, HiOutlineCheckCircle,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import { ROUTES } from '../../../constants/routes'

const STEPS = [
  {
    id: 'recommendation',
    icon: MdMedication,
    label: 'Medicine Recommendation',
    description: 'View generic alternatives and compare savings',
    status: 'current',   // completed | current | upcoming
    linkTo: null,
  },
  {
    id: 'pharmacy',
    icon: HiOutlineMapPin,
    label: 'Nearby Pharmacy',
    description: 'Locate the nearest Jan Aushadhi Kendra',
    status: 'upcoming',
    linkTo: ROUTES.USER.NEARBY_PHARMACIES,
  },
  {
    id: 'map',
    icon: HiOutlineMap,
    label: 'Interactive Map',
    description: 'Navigate to the pharmacy using the live map',
    status: 'upcoming',
    linkTo: ROUTES.USER.NEARBY_PHARMACIES,  // Module 9
  },
  {
    id: 'reserve',
    icon: HiOutlineMagnifyingGlass,
    label: 'Reserve Medicine',
    description: 'Reserve stock at your chosen pharmacy',
    status: 'upcoming',
    linkTo: null,  // Module 9+
  },
  {
    id: 'save',
    icon: HiOutlineBookmark,
    label: 'Save Medicine',
    description: 'Save to your personal medicine list',
    status: 'upcoming',
    linkTo: null,
  },
  {
    id: 'notifications',
    icon: HiOutlineBell,
    label: 'Enable Notifications',
    description: 'Get alerts for stock availability and refills',
    status: 'upcoming',
    linkTo: null,
  },
]

const STATUS_STYLES = {
  completed: {
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600',
    labelColor: 'text-success-700',
    connector: 'bg-success-300',
    dot: 'bg-success-500',
  },
  current: {
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    labelColor: 'text-primary-700',
    connector: 'bg-slate-200',
    dot: 'bg-primary-500 ring-2 ring-primary-200',
  },
  upcoming: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-400',
    labelColor: 'text-slate-500',
    connector: 'bg-slate-200',
    dot: 'bg-slate-300',
  },
}

// ======================================================
// Workflow Timeline
// ======================================================
function WorkflowTimeline() {
  return (
    <section aria-labelledby="workflow-timeline-heading">

      {/* ======================================================
          Continue Workflow
         ====================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 id="workflow-timeline-heading" className="text-base font-bold text-slate-900 mb-5">
          Your Healthcare Journey
        </h2>

        {/* Vertical timeline */}
        <ol className="relative" aria-label="Healthcare workflow steps">
          {STEPS.map((step, index) => {
            const s = STATUS_STYLES[step.status]
            const Icon = step.icon
            const isLast = index === STEPS.length - 1

            return (
              <li key={step.id} className="flex gap-4 pb-5 last:pb-0">
                {/* Connector column */}
                <div className="flex flex-col items-center shrink-0 w-8">
                  {/* Icon circle */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${s.iconBg}`}>
                    {step.status === 'completed'
                      ? <HiOutlineCheckCircle size={16} className={s.iconColor} aria-hidden="true" />
                      : <Icon size={16} className={s.iconColor} aria-hidden="true" />
                    }
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div className={`w-0.5 flex-1 mt-1 ${s.connector}`} aria-hidden="true" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${s.labelColor}`}>
                      {step.label}
                    </span>
                    {step.status === 'current' && (
                      <span className="text-[10px] font-bold text-white bg-primary-600 rounded-full px-2 py-0.5">
                        Current
                      </span>
                    )}
                    {step.status === 'upcoming' && step.linkTo && (
                      <Link
                        to={step.linkTo}
                        className="text-[10px] font-medium text-secondary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 rounded"
                        aria-label={`Go to ${step.label}`}
                      >
                        Start →
                      </Link>
                    )}
                    {step.status === 'upcoming' && !step.linkTo && (
                      <span className="text-[10px] text-slate-400 italic">Coming soon</span>
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

export default WorkflowTimeline
