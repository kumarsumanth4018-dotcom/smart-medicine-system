import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

import Badge from '../../../components/ui/Badge'


function formatCoordinate(value) {
  const coordinate = Number(value)

  if (!Number.isFinite(coordinate)) {
    return null
  }

  return coordinate.toFixed(5)
}


function PharmacySearchSummary({
  medicine = {},
  pharmacyCount = 0,
  location = null,
  radiusKm = 5,
  isRanked = false,
}) {
  const {
    name = 'All Jan Aushadhi Kendras',
    genericName = '',
  } = medicine

  const latitude = formatCoordinate(location?.lat)
  const longitude = formatCoordinate(location?.lng)
  const hasLocation = latitude && longitude

  return (
    <section aria-labelledby="pharmacy-summary-heading">
      <h1 id="pharmacy-summary-heading" className="sr-only">
        Kendra search summary
      </h1>

      <div
        className="rounded-2xl border border-slate-100
                   bg-white p-5 shadow-sm"
      >
        <div
          className="grid grid-cols-1 items-center gap-4
                     sm:grid-cols-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center
                         justify-center rounded-xl bg-slate-100"
            >
              <MdMedication
                size={20}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase
                           tracking-wider text-slate-400"
              >
                {isRanked
                  ? 'Selected Medicine'
                  : 'Search Mode'}
              </p>

              <p className="truncate text-sm font-bold text-slate-900">
                {name}
              </p>

              {genericName && (
                <p className="truncate text-[11px] text-slate-500">
                  {genericName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center
                         justify-center rounded-xl bg-secondary-50"
            >
              <HiOutlineMapPin
                size={20}
                className="text-secondary-600"
                aria-hidden="true"
              />
            </div>

            <div>
              <p
                className="text-[10px] font-semibold uppercase
                           tracking-wider text-slate-400"
              >
                Search Location
              </p>

              <p className="text-sm font-bold text-slate-900">
                {hasLocation
                  ? `${latitude}, ${longitude}`
                  : 'Getting your location…'}
              </p>

              <p className="text-[11px] text-slate-400">
                {hasLocation
                  ? 'Latitude and longitude'
                  : 'Location permission may be required'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center
                         justify-center rounded-xl bg-primary-50"
            >
              <HiOutlineBuildingStorefront
                size={20}
                className="text-primary-600"
                aria-hidden="true"
              />
            </div>

            <div>
              <p
                className="text-[10px] font-semibold uppercase
                           tracking-wider text-slate-400"
              >
                {isRanked
                  ? 'Ranked Kendras'
                  : 'Nearby Kendras'}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {pharmacyCount} found
                </p>

                {isRanked && pharmacyCount > 0 && (
                  <Badge variant="success" dot size="sm">
                    In stock
                  </Badge>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Within {radiusKm} km radius
                {isRanked ? ' · WSM ranked' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default PharmacySearchSummary
