/**
 * Component: NearbyPharmacyWorkflow
 *
 * Description:
 *   Preview card for the nearest pharmacy stocking the recommended
 *   generic medicine, with navigation to the upcoming Pharmacy
 *   & Interactive Map workflow (Module 9).
 *
 * Responsibilities:
 *   - Nearest pharmacy name, distance, availability, hours, travel time
 *   - "View on Map" and "Find More Pharmacies" CTA buttons
 *   - Both buttons navigate to /pharmacies/nearby (Module 9 placeholder)
 *
 * Backend readiness:
 *   - pharmacy → GET /api/v1/medicines/:id/nearby-pharmacy?limit=1
 */

import { Link } from 'react-router-dom'
import {
  HiOutlineMapPin, HiOutlineClock,
  HiOutlinePhone, HiOutlineArrowRight,
  HiOutlineTruck,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'

// ======================================================
// Nearby Pharmacy Workflow
// ======================================================
function NearbyPharmacyWorkflow({ pharmacy = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/nearby-pharmacy?limit=1
  const {
    name         = 'Jan Aushadhi Kendra — Andheri West',
    address      = '12, Veera Desai Road, Andheri West, Mumbai 400053',
    distance     = '0.8 km',
    phone        = '+91 98765 43210',
    hours        = '8:00 AM – 9:00 PM',
    travelTime   = '~10 minutes by walk',
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
    <section aria-labelledby="pharmacy-workflow-heading">

      {/* ======================================================
          Nearby Pharmacy Preview
         ====================================================== */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MdLocalPharmacy size={18} className="text-secondary-600" aria-hidden="true" />
            <h2 id="pharmacy-workflow-heading" className="text-base font-bold text-slate-900">
              Nearest Pharmacy
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOpen ? 'success' : 'danger'} dot size="sm">
              {isOpen ? 'Open Now' : 'Closed'}
            </Badge>
            <Badge variant={stock.variant} size="sm">{stock.label}</Badge>
          </div>
        </div>

        {/* Pharmacy info card */}
        <div className="rounded-xl bg-secondary-50 border border-secondary-100 p-4 space-y-2.5 mb-4">
          <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
          <div className="flex items-start gap-1.5 text-xs text-slate-500">
            <HiOutlineMapPin size={12} className="mt-0.5 shrink-0 text-secondary-500" aria-hidden="true" />
            {address}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <HiOutlineMapPin size={11} aria-hidden="true" />
              {/* TODO: distance from geolocation API */}
              {distance}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineTruck size={11} aria-hidden="true" />
              {/* TODO: travel time from maps API */}
              {travelTime}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineClock size={11} aria-hidden="true" />
              {hours}
            </span>
            <a
              href={`tel:${phone.replace(/\s/g,'')}`}
              className="flex items-center gap-1 hover:text-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500 rounded"
              aria-label={`Call ${name}`}
            >
              <HiOutlinePhone size={11} aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={ROUTES.USER.NEARBY_PHARMACIES}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            aria-label="View pharmacy on interactive map"
          >
            <HiOutlineMapPin size={15} aria-hidden="true" />
            View on Map
          </Link>
          <Link
            to={ROUTES.USER.NEARBY_PHARMACIES}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl border border-secondary-300 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
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

export default NearbyPharmacyWorkflow
