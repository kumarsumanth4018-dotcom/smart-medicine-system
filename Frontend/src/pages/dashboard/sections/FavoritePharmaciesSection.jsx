/**
 * Component: FavoritePharmaciesSection
 *
 * Description:
 *   User's favorite pharmacies with availability and last-visit info.
 *
 * Backend readiness:
 *   - pharmacies → GET /api/v1/users/me/favorite-pharmacies
 */

import { Link } from 'react-router-dom'
import { HiOutlineMapPin, HiOutlineClock, HiOutlineArrowRight } from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'

// TODO: Replace with GET /api/v1/users/me/favorite-pharmacies
const FAVORITES = [
  { id: 'f1', name: 'Jan Aushadhi Kendra — Andheri', distance: '0.8 km', availability: 'available', lastVisit: '2 days ago',  isJanAushadhi: true },
  { id: 'f2', name: 'Jan Aushadhi Kendra — Versova', distance: '1.6 km', availability: 'available', lastVisit: '1 week ago',  isJanAushadhi: true },
  { id: 'f3', name: 'Apollo Pharmacy',               distance: '1.9 km', availability: 'limited',   lastVisit: '2 weeks ago', isJanAushadhi: false },
]

const AVAIL = {
  available:   { variant: 'success', label: 'In Stock'      },
  limited:     { variant: 'warning', label: 'Limited'       },
  unavailable: { variant: 'danger',  label: 'Out of Stock'  },
}

// ======================================================
// Favorite Pharmacies
// ======================================================
function FavoritePharmaciesSection() {
  return (
    <section aria-labelledby="favorite-pharmacies-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="favorite-pharmacies-heading" className="text-base font-bold text-slate-900">
          Favorite Pharmacies
        </h2>
        <Link to={ROUTES.USER.NEARBY_PHARMACIES} className="text-xs font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
          Find More
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="list">
        {FAVORITES.map((p) => {
          const avail = AVAIL[p.availability] ?? AVAIL.available
          return (
            <article key={p.id} role="listitem" className="flex flex-col gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-50 shrink-0">
                    <MdLocalPharmacy size={16} className="text-secondary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 truncate">{p.name}</h3>
                </div>
                {p.isJanAushadhi && <Badge variant="info" size="sm">JA</Badge>}
              </div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1"><HiOutlineMapPin size={11} aria-hidden="true" />{p.distance}</div>
                <div className="flex items-center gap-1"><HiOutlineClock size={11} aria-hidden="true" />Last visit: {p.lastVisit}</div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={avail.variant} dot size="sm">{avail.label}</Badge>
                <Link
                  to={ROUTES.USER.NEARBY_PHARMACIES}
                  aria-label={`View ${p.name}`}
                  className="flex items-center gap-1 text-[11px] font-medium text-secondary-600 hover:text-secondary-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500 rounded"
                >
                  View <HiOutlineArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FavoritePharmaciesSection
