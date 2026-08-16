/**
 * Component: FutureAIPlaceholders
 *
 * Description:
 *   Preview cards for future AI-powered features planned for the
 *   recommendation engine. All are UI placeholders only.
 *   No AI logic is implemented.
 *
 * Responsibilities:
 *   - 6 feature preview cards with "Coming Soon" badges
 *   - Educational description of each planned capability
 *   - Consistent design language with the rest of the platform
 */

import {
  HiOutlineCpuChip, HiOutlineBeaker,
  HiOutlineCurrencyRupee, HiOutlineChartBar,
  HiOutlineUser, HiOutlineBell,
} from 'react-icons/hi2'
import Badge from '../../../components/ui/Badge'

const AI_FEATURES = [
  {
    id: 'ai-engine',
    icon: HiOutlineCpuChip,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    title: 'AI Recommendation Engine',
    description: 'Intelligent NLP-based medicine matching using composition analysis and therapeutic classification.',
  },
  {
    id: 'composition-analysis',
    icon: HiOutlineBeaker,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-700',
    title: 'Composition Analysis',
    description: 'Automated active ingredient extraction and bioequivalence scoring using machine learning.',
  },
  {
    id: 'price-prediction',
    icon: HiOutlineCurrencyRupee,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-700',
    title: 'Price Prediction',
    description: 'Dynamic price forecasting model to predict seasonal medicine price trends and availability.',
  },
  {
    id: 'availability-prediction',
    icon: HiOutlineChartBar,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-700',
    title: 'Availability Prediction',
    description: 'Predictive stock availability based on pharmacy purchase patterns and Jan Aushadhi supply data.',
  },
  {
    id: 'personalized',
    icon: HiOutlineUser,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
    title: 'Personalized Recommendations',
    description: 'Tailored medicine suggestions based on user medical history, saved medicines, and search patterns.',
  },
  {
    id: 'reminder',
    icon: HiOutlineBell,
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-700',
    title: 'Medicine Reminder Integration',
    description: 'Smart refill reminders based on prescription duration and nearby pharmacy stock availability.',
  },
]

function AIFeatureCard({ feature }) {
  const Icon = feature.icon
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full relative">
      {/* Coming soon badge */}
      <div className="absolute top-3 right-3">
        <Badge variant="neutral" size="sm">Coming Soon</Badge>
      </div>

      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${feature.iconBg}`}>
        <Icon size={20} className={feature.iconColor} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1 pr-20">{feature.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
      </div>
    </div>
  )
}

// ======================================================
// Future AI Placeholders
// ======================================================
function FutureAIPlaceholders() {
  return (
    <section aria-labelledby="future-ai-heading">

      {/* ======================================================
          Future AI Features
         ====================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineCpuChip size={18} className="text-primary-600" aria-hidden="true" />
          <h2 id="future-ai-heading" className="text-base font-bold text-slate-900">
            Future AI Capabilities
          </h2>
          <Badge variant="accent" size="sm">Roadmap</Badge>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          The following intelligent features are planned for future modules and will be powered
          by a FastAPI machine learning backend.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Future AI features">
          {AI_FEATURES.map((f) => (
            <div key={f.id} role="listitem">
              <AIFeatureCard feature={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FutureAIPlaceholders
