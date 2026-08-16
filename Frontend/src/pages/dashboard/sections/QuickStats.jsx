/**
 * Component: QuickStats
 *
 * Description:
 *   Five quick-statistic cards for the user dashboard overview.
 *   Reuses the existing InfoCard component.
 *
 * Backend readiness:
 *   - stats → GET /api/v1/users/me/stats
 */

import {
  HiOutlineBookmark, HiOutlineMagnifyingGlass,
  HiOutlineSparkles, HiOutlineMapPin, HiOutlineBell,
} from 'react-icons/hi2'
import InfoCard from '../../../components/cards/InfoCard'
import { ROUTES } from '../../../constants/routes'
import { useNavigate } from 'react-router-dom'

// TODO: Replace with GET /api/v1/users/me/stats
const STATS = [
  { label: 'Medicines Saved',          value: '12',  variant: 'primary',   icon: <HiOutlineBookmark size={18} />,        subtitle: 'Personal list',                route: ROUTES.USER.SEARCH },
  { label: 'Searches Performed',       value: '38',  variant: 'default',   icon: <HiOutlineMagnifyingGlass size={18} />, subtitle: 'Lifetime total',               route: ROUTES.USER.SEARCH },
  { label: 'Generic Recommendations',  value: '9',   variant: 'success',   icon: <HiOutlineSparkles size={18} />,        subtitle: 'Jan Aushadhi alternatives',    route: null },
  { label: 'Pharmacies Visited',       value: '5',   variant: 'warning',   icon: <HiOutlineMapPin size={18} />,          subtitle: 'Nearby visits',                route: ROUTES.USER.NEARBY_PHARMACIES },
  { label: 'Notifications',            value: '3',   variant: 'danger',    icon: <HiOutlineBell size={18} />,            subtitle: '3 unread',                     route: ROUTES.USER.NOTIFICATIONS },
]

function QuickStats() {
  const navigate = useNavigate()

  return (
    <section aria-labelledby="quick-stats-heading">
      <h2 id="quick-stats-heading" className="sr-only">Dashboard statistics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATS.map((s) => (
          <InfoCard
            key={s.label}
            label={s.label}
            value={s.value}
            variant={s.variant}
            icon={s.icon}
            subtitle={s.subtitle}
            onClick={s.route ? () => navigate(s.route) : undefined}
          />
        ))}
      </div>
    </section>
  )
}

export default QuickStats
