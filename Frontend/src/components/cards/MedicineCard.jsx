/**
 * MedicineCard Component
 *
 * Purpose : Displays a medicine's key information in a compact card
 *           for search results, recommendations, and favourites lists.
 * Location : src/components/cards/MedicineCard.jsx
 *
 * Features : availability badge, generic name, manufacturer, price,
 *            savings indicator, action buttons slot, click handler
 *
 * Future usage : Module 4 (search results, Janaushadhi recommendations,
 *   saved medicines list), Module 5 (pharmacy inventory view).
 *
 * Props :
 *   medicine — { id, name, genericName, manufacturer, price,
 *                mrp, availability, category, image? }
 *   onView   — callback when card is clicked / View Details pressed
 *   actions  — custom action buttons slot
 *   compact  — smaller layout for list views
 */

import { MdMedication } from 'react-icons/md'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import Badge from '../ui/Badge'

const AVAILABILITY_MAP = {
  available:     { variant: 'success', label: 'In Stock'    },
  unavailable:   { variant: 'danger',  label: 'Out of Stock' },
  limited:       { variant: 'warning', label: 'Limited Stock'},
}

function MedicineCard({ medicine = {}, onView, actions, compact = false }) {
  const {
    name         = 'Medicine Name',
    genericName  = 'Generic Name',
    manufacturer = 'Manufacturer',
    price,
    mrp,
    availability = 'available',
    category,
  } = medicine

  const avail   = AVAILABILITY_MAP[availability] ?? AVAILABILITY_MAP.available
  const savings = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : null

  return (
    <article
      className="card hover-lift cursor-pointer group"
      onClick={onView}
      aria-label={`${name} — ${avail.label}`}
    >
      <div className={`flex flex-col gap-3 ${compact ? 'p-0' : ''}`}>
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
            <MdMedication size={22} aria-hidden="true" />
          </div>

          {/* Name block */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug truncate">
              {name}
            </h3>
            <p className="text-xs text-slate-500 truncate">{genericName}</p>
          </div>

          {/* Availability badge */}
          <Badge variant={avail.variant} dot size="sm">
            {avail.label}
          </Badge>
        </div>

        {/* Manufacturer */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <HiOutlineBuildingOffice2 size={13} aria-hidden="true" />
          <span className="truncate">{manufacturer}</span>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <Badge variant="neutral" size="sm">{category}</Badge>
            </>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            {price !== undefined ? (
              <>
                <span className="text-base font-bold text-slate-900">
                  ₹{price}
                </span>
                {mrp && mrp !== price && (
                  <span className="text-xs text-slate-400 line-through">₹{mrp}</span>
                )}
                {savings > 0 && (
                  <Badge variant="success" size="sm">{savings}% off</Badge>
                )}
              </>
            ) : (
              <span className="text-sm text-slate-400">Price not available</span>
            )}
          </div>

          {/* Actions slot or default View button */}
          {actions ?? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onView?.() }}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-md hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default MedicineCard
