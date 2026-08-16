/**
 * InfoCard Component
 *
 * Purpose : Reusable dashboard stat / information card.
 *           Shows a metric, label, optional trend indicator,
 *           and optional icon. Used across all dashboards.
 * Location : src/components/cards/InfoCard.jsx
 *
 * Variants : default | primary | success | warning | danger
 * Features : value, label, icon, trend (up/down/neutral), subtitle
 *
 * Future usage :
 *   Module 4 — User dashboard stats (searches, saved medicines)
 *   Module 5 — Pharmacy inventory count, prescription count
 *   Module 6 — Admin total users, total medicines, active pharmacies
 *
 * Props :
 *   label    — metric label
 *   value    — main stat value (string or number)
 *   icon     — React icon element
 *   trend    — { direction:'up'|'down'|'neutral', value:'12%', label? }
 *   subtitle — additional context text
 *   variant  — visual color variant
 *   onClick  — optional click handler (makes card interactive)
 */

import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'

const VARIANTS = {
  default: { bg: 'bg-white',         iconBg: 'bg-slate-100',      iconColor: 'text-slate-600' },
  primary: { bg: 'bg-primary-50',    iconBg: 'bg-primary-100',    iconColor: 'text-primary-700' },
  success: { bg: 'bg-success-50',    iconBg: 'bg-success-100',    iconColor: 'text-success-700' },
  warning: { bg: 'bg-warning-50',    iconBg: 'bg-warning-100',    iconColor: 'text-warning-700' },
  danger:  { bg: 'bg-danger-50',     iconBg: 'bg-danger-100',     iconColor: 'text-danger-700'  },
}

const TREND_STYLES = {
  up:      { color: 'text-success-600', Icon: HiOutlineTrendingUp   },
  down:    { color: 'text-danger-600',  Icon: HiOutlineTrendingDown  },
  neutral: { color: 'text-slate-400',   Icon: null                   },
}

function InfoCard({
  label    = 'Metric',
  value    = '—',
  icon,
  trend,
  subtitle,
  variant  = 'default',
  onClick,
  className = '',
}) {
  const v   = VARIANTS[variant] ?? VARIANTS.default
  const isClickable = typeof onClick === 'function'

  return (
    <article
      className={[
        'rounded-xl border border-slate-200 p-5 flex flex-col gap-4',
        v.bg,
        isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        'shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {/* Top row — icon + label */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${v.iconBg}`}>
            <span className={`${v.iconColor}`} aria-hidden="true">{icon}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Trend */}
      {trend && (() => {
        const t = TREND_STYLES[trend.direction] ?? TREND_STYLES.neutral
        return (
          <div className={`flex items-center gap-1 text-xs font-medium ${t.color}`}>
            {t.Icon && <t.Icon size={14} aria-hidden="true" />}
            <span>{trend.value}</span>
            {trend.label && <span className="text-slate-400 font-normal">{trend.label}</span>}
          </div>
        )
      })()}
    </article>
  )
}

export default InfoCard
