/**
 * Component: NearbyPharmacyPreview
 *
 * Description:
 *   Compact preview of the nearest pharmacy that stocks this medicine.
 *   Links to the full nearby pharmacies map view.
 *
 * Responsibilities:
 *   - Display nearest pharmacy name, distance, hours, stock status
 *   - View on Map and Find More buttons
 *
 * Backend readiness:
 *   - pharmacy → GET /api/v1/medicines/:id/nearby-pharmacies?limit=1
 */

import { HiOutlineMapPin, HiOutlineClock, HiOutlinePhone, HiOutlineArrowRight } from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

// =====================================================
// Nearby Pharmacy Preview
// =====================================================
function NearbyPharmacyPreview({ pharmacy = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/nearby-pharmacies?limit=1
  const {
    name         = 'Jan Aushadhi Kendra - Andheri',
    address      = '12, Veera Desai Road, Andheri West, Mumbai',
    distance     = '0.8 km',
    phone        = '+91 98765 43210',
    hours        = '8:00 AM – 9:00 PM',
    isOpen       = true,
    stockStatus  = 'available',
  } = pharmacy

  const stockConfig = {
    available:   { variant: 'success', label: 'In Stock'      },
    unavailable: { variant: 'danger',  label: 'Out of Stock'  },
    limited:     { variant: 'warning', label: 'Limited Stock' },
  }
  const stock = stockConfig[stockStatus] ?? stockConfig.available

  return (
    <section aria-labelledby="nearby-pharmacy-heading">

      {/* =====================================================
          Nearby Pharmacy Preview
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MdLocalPharmacy size={18} className="text-secondary-600" aria-hidden="true" />
            <h2
              id="nearby-pharmacy-heading"
              className="text-base font-bold text-slate-900"
            >
              Nearest Pharmacy
            </h2>
          </div>
          <Badge variant={isOpen ? 'success' : 'danger'} dot size="sm">
            {isOpen ? 'Open Now' : 'Closed'}
          </Badge>
        </div>

        {/* Pharmacy card */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{name}</h3>
              <div className="flex items-start gap-1 text-xs text-slate-500 mt-1">
                <HiOutlineMapPin size={12} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span>{address}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-sm font-bold text-primary-700">{distance}</span>
              <Badge variant={stock.variant} size="sm">{stock.label}</Badge>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <HiOutlineClock size={11} aria-hidden="true" />
              {/* TODO: hours from API */}
              {hours}
            </span>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1 hover:text-primary-600 transition-colors"
              aria-label={`Call ${name}`}
            >
              <HiOutlinePhone size={11} aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            to={ROUTES.USER.NEARBY_PHARMACIES}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            aria-label="View pharmacy location on map"
          >
            <HiOutlineMapPin size={15} aria-hidden="true" />
            View on Map
          </Link>
          <Link
            to={ROUTES.USER.NEARBY_PHARMACIES}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl border border-secondary-300 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            aria-label="Find more pharmacies stocking this medicine"
          >
            Find More Pharmacies
            <HiOutlineArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NearbyPharmacyPreview
