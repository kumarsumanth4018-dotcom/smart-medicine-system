/**
 * Component: NavigationPreview
 *
 * Description:
 *   Navigation card showing estimated distance, travel time, and
 *   placeholder buttons for Google Maps and in-app navigation.
 *
 * Backend readiness:
 *   - route → external Maps API (Google Maps / OpenRouteService)
 *   - delivery → POST /api/v1/pharmacies/:id/delivery-request
 *   All deferred to future module.
 */

import { HiOutlineMapPin, HiOutlineTruck, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'
import Badge from '../../../components/ui/Badge'

// =======================================================
// Navigation Preview
// =======================================================
function NavigationPreview({ pharmacy = {} }) {
  const {
    name      = 'Jan Aushadhi Kendra — Andheri West',
    distance  = '0.8 km',
    travelTime= '~10 min walk',
    address   = '12, Veera Desai Road, Andheri West, Mumbai',
  } = pharmacy

  function handleOpenMaps() {
    // TODO: open Google Maps with pharmacy coordinates
    // window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank')
  }

  function handleOpenNavigation() {
    // TODO: in-app navigation using React Leaflet Routing
  }

  return (
    <section aria-labelledby="navigation-heading">
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineMapPin size={18} className="text-secondary-600" aria-hidden="true" />
          <h2 id="navigation-heading" className="text-base font-bold text-slate-900">
            Navigation Preview
          </h2>
          <Badge variant="neutral" size="sm">Placeholder</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col items-center p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-center">
            <HiOutlineMapPin size={20} className="text-secondary-600 mb-1" aria-hidden="true" />
            <p className="text-[10px] text-secondary-500 uppercase tracking-wider">Distance</p>
            <p className="text-xl font-extrabold text-secondary-700">
              {/* TODO: from route calculation API */}
              {distance}
            </p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-primary-50 border border-primary-100 text-center">
            <HiOutlineTruck size={20} className="text-primary-600 mb-1" aria-hidden="true" />
            <p className="text-[10px] text-primary-500 uppercase tracking-wider">Travel Time</p>
            <p className="text-xl font-extrabold text-primary-700">
              {/* TODO: from route calculation API */}
              {travelTime}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          <span className="font-medium text-slate-700">Destination:</span> {address}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleOpenMaps}
            aria-label="Open pharmacy location in Google Maps"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlineArrowTopRightOnSquare size={15} aria-hidden="true" />
            Open in Google Maps
            <span className="text-[10px] text-secondary-300">(placeholder)</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNavigation}
            aria-label="Open in-app navigation"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-secondary-300 text-secondary-700 text-sm font-medium hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlineMapPin size={15} aria-hidden="true" />
            Navigate (In-App)
            {/* TODO: React Leaflet Routing Machine in Module 10+ */}
            <span className="text-[10px] text-slate-400">(coming soon)</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default NavigationPreview
