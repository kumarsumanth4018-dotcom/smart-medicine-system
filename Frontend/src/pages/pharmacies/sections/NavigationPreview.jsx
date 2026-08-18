/**
 * Component: NavigationPreview
 *
 * Description:
 *   Navigation card showing distance, travel time, and a real
 *   "Open in Google Maps" link for the selected pharmacy.
 *
 * Backend readiness:
 *   - "Open in Google Maps" uses the browser's own maps.google.com deep
 *     link with the Kendra's real lat/lng (falls back to a text address
 *     search if coordinates aren't available) - no backend needed.
 *   - distance/travelTime are still the haversine-based estimate from
 *     GET /kendras/nearby, not a real routing API.
 *   - In-app turn-by-turn navigation (React Leaflet Routing) is still
 *     a future module - that button stays a placeholder.
 */

import { HiOutlineMapPin, HiOutlineTruck, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'

// =======================================================
// Navigation Preview
// =======================================================
function NavigationPreview({ pharmacy = {} }) {
  const {
    distance   = '-',
    travelTime = '-',
    address    = 'Select a pharmacy from the list to preview navigation',
    latitude,
    longitude,
  } = pharmacy

  const hasSelection = Boolean(pharmacy?.name)

  function handleOpenMaps() {
    const url = (latitude != null && longitude != null)
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleOpenNavigation() {
    // TODO: in-app navigation using React Leaflet Routing Machine
  }

  return (
    <section aria-labelledby="navigation-heading">
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineMapPin size={18} className="text-secondary-600" aria-hidden="true" />
          <h2 id="navigation-heading" className="text-base font-bold text-slate-900">
            Navigation Preview
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col items-center p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-center">
            <HiOutlineMapPin size={20} className="text-secondary-600 mb-1" aria-hidden="true" />
            <p className="text-[10px] text-secondary-500 uppercase tracking-wider">Distance</p>
            <p className="text-xl font-extrabold text-secondary-700">
              {distance}
            </p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-primary-50 border border-primary-100 text-center">
            <HiOutlineTruck size={20} className="text-primary-600 mb-1" aria-hidden="true" />
            <p className="text-[10px] text-primary-500 uppercase tracking-wider">Travel Time</p>
            <p className="text-xl font-extrabold text-primary-700">
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
            disabled={!hasSelection}
            aria-label="Open pharmacy location in Google Maps"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-secondary-600 text-white text-sm font-semibold hover:bg-secondary-700 transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <HiOutlineArrowTopRightOnSquare size={15} aria-hidden="true" />
            Open in Google Maps
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