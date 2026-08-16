/**
 * PharmacyCard Component
 *
 * Purpose : Displays a pharmacy's key information in a card for
 *           nearby pharmacy search results and map list panels.
 * Location : src/components/cards/PharmacyCard.jsx
 *
 * Features : distance, availability indicator, contact number,
 *            address, open/closed status, action slot
 *
 * Future usage : Module 4 (nearby pharmacies list, map sidebar),
 *   Module 5 (pharmacy detail), Module 6 (admin pharmacy list).
 *
 * Props :
 *   pharmacy — { id, name, address, distance, phone, isOpen,
 *               availability, rating? }
 *   onView   — view details handler
 *   onCall   — call handler
 *   actions  — custom action slot
 */

import { HiOutlineMapPin, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge from '../ui/Badge'

function PharmacyCard({ pharmacy = {}, onView, onCall, actions }) {
  const {
    name         = 'Pharmacy Name',
    address      = 'Address not available',
    distance,
    phone,
    isOpen       = true,
    availability = 'available',
  } = pharmacy

  return (
    <article
      className="card hover-lift cursor-pointer"
      onClick={onView}
      aria-label={`${name} — ${isOpen ? 'Open' : 'Closed'}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary-50 text-secondary-600 shrink-0">
            <MdLocalPharmacy size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug truncate">
              {name}
            </h3>
          </div>
        </div>
        <Badge variant={isOpen ? 'success' : 'danger'} dot size="sm">
          {isOpen ? 'Open' : 'Closed'}
        </Badge>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-2">
        <HiOutlineMapPin size={13} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="line-clamp-2">{address}</span>
      </div>

      {/* Distance + availability */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        {distance !== undefined && (
          <span className="flex items-center gap-1">
            <HiOutlineClock size={12} aria-hidden="true" />
            {typeof distance === 'number' ? `${distance} km away` : distance}
          </span>
        )}
        {availability && (
          <Badge variant="info" size="sm">{availability}</Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {actions ?? (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onView?.() }}
              className="flex-1 text-xs font-medium text-center py-1.5 rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              View Details
            </button>
            {phone && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onCall?.() }}
                aria-label={`Call ${name}`}
                className="flex items-center justify-center gap-1 flex-1 text-xs font-medium py-1.5 rounded-md bg-secondary-600 text-white hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
              >
                <HiOutlinePhone size={13} aria-hidden="true" />
                Call
              </button>
            )}
          </>
        )}
      </div>
    </article>
  )
}

export default PharmacyCard
