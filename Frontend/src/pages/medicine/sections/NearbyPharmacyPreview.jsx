import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlinePhone,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'

import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'
import kendraService from '../../../services/kendraService'


const SEARCH_RADIUS_KM = 50
function NearbyPharmacyPreview({ pmbiCode }) {
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(
        'Location is not supported by this browser.',
      )
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLocationError('')
        setIsLocating(false)
      },

      (error) => {
        let message = 'Unable to get your location.'

        if (error.code === error.PERMISSION_DENIED) {
          message =
            'Location permission was denied. Allow location access to find nearby Kendras.'
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Your current location is unavailable.'
        }

        if (error.code === error.TIMEOUT) {
          message = 'Getting your location took too long.'
        }

        setLocationError(message)
        setIsLocating(false)
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [])

  const {
    data: availabilityResponse,
    isLoading: isLoadingKendras,
    isError: isKendraError,
    refetch,
  } = useQuery({
    queryKey: [
      'medicine-nearby-kendras',
      pmbiCode,
      location?.latitude,
      location?.longitude,
    ],

    queryFn: async () => {
      const { data } = await kendraService.findMedicineNearby(
  pmbiCode,
  location.latitude,
  location.longitude,
  SEARCH_RADIUS_KM,
  true,
)

      return data
    },

    enabled: Boolean(
      pmbiCode &&
      location?.latitude &&
      location?.longitude,
    ),
  })

  const pharmacies = Array.isArray(availabilityResponse)
    ? availabilityResponse
    : []

  const nearestPharmacy = pharmacies[0]

  const stockConfig = {
    in_stock: {
      variant: 'success',
      label: 'In Stock',
    },

    low_stock: {
      variant: 'warning',
      label: 'Low Stock',
    },

    out_of_stock: {
      variant: 'danger',
      label: 'Out of Stock',
    },
  }

  if (isLocating || isLoadingKendras) {
    return (
      <section aria-labelledby="nearby-pharmacy-heading">
        <div
          className="rounded-2xl border border-slate-100
                     bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MdLocalPharmacy
              size={18}
              className="text-secondary-600"
            />

            <h2
              id="nearby-pharmacy-heading"
              className="text-base font-bold text-slate-900"
            >
              Nearest Kendra
            </h2>
          </div>

          <div
            className="mt-5 flex items-center justify-center
                       rounded-xl bg-slate-50 p-8"
          >We searched within 5 kilometres
            <div className="text-center">
              <div
                className="mx-auto h-8 w-8 animate-spin
                           rounded-full border-4
                           border-secondary-200
                           border-t-secondary-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Finding nearby Kendras...
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (locationError) {
    return (
      <section aria-labelledby="nearby-pharmacy-heading">
        <div
          className="rounded-2xl border border-amber-200
                     bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <HiOutlineMapPin
              size={18}
              className="text-amber-600"
            />

            <h2
              id="nearby-pharmacy-heading"
              className="text-base font-bold text-slate-900"
            >
              Location Required
            </h2>
          </div>

          <div
            className="mt-4 rounded-xl border border-amber-200
                       bg-amber-50 p-4"
          >
            <p className="text-sm text-amber-800">
              {locationError}
            </p>

            <p className="mt-2 text-xs text-amber-700">
              Click the location icon in your browser address bar,
              choose Allow, and refresh the page.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (isKendraError) {
    return (
      <section aria-labelledby="nearby-pharmacy-heading">
        <div
          className="rounded-2xl border border-red-200
                     bg-white p-6 shadow-sm"
        >
          <h2
            id="nearby-pharmacy-heading"
            className="text-base font-bold text-slate-900"
          >
            Nearby Kendras
          </h2>

          <div
            className="mt-4 rounded-xl bg-red-50 p-4
                       text-center"
          >
            <p className="text-sm text-red-700">
              Unable to load nearby Kendra availability.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2
                         text-xs font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!nearestPharmacy) {
    return (
      <section aria-labelledby="nearby-pharmacy-heading">
        <div
          className="rounded-2xl border border-slate-100
                     bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MdLocalPharmacy
              size={18}
              className="text-secondary-600"
            />

            <h2
              id="nearby-pharmacy-heading"
              className="text-base font-bold text-slate-900"
            >
              Nearby Availability
            </h2>
          </div>

          <div
            className="mt-4 rounded-xl border border-slate-200
                       bg-slate-50 p-6 text-center"
          >
            <p className="text-sm font-semibold text-slate-700">
              No nearby Kendra currently has this medicine.
            </p>

            <p className="mt-1 text-xs text-slate-500">
  We searched within {SEARCH_RADIUS_KM} kilometres of your location.
</p>
          </div>
        </div>
      </section>
    )
  }

  const stock =
    stockConfig[nearestPharmacy.status] ||
    stockConfig.in_stock

  const distance = Number(
    nearestPharmacy.distance_km,
  ).toFixed(2)

  const mapUrl =
    `https://www.google.com/maps/search/?api=1&query=` +
    `${nearestPharmacy.latitude},${nearestPharmacy.longitude}`
  
  const nearestBatch =
  nearestPharmacy.batches?.[0] || null

const formattedExpiry = nearestBatch?.expiry_date
  ? new Date(nearestBatch.expiry_date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    )
  : 'Not available'

  const nearbyPageUrl =
    `${ROUTES.USER.NEARBY_PHARMACIES}` +
    `?medicine=${encodeURIComponent(pmbiCode)}` +
    `&lat=${location.latitude}` +
    `&lng=${location.longitude}`
  
  

  return (
    <section aria-labelledby="nearby-pharmacy-heading">
      <div
        className="rounded-2xl border border-slate-100
                   bg-white p-6 shadow-sm"
      >
        <div
          className="mb-4 flex items-center
                     justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <MdLocalPharmacy
              size={18}
              className="text-secondary-600"
            />

            <h2
              id="nearby-pharmacy-heading"
              className="text-base font-bold text-slate-900"
            >
              Nearest Kendra
            </h2>
          </div>

          <Badge variant={stock.variant} dot size="sm">
            {stock.label}
          </Badge>
        </div>

        <div
          className="space-y-3 rounded-xl border
                     border-slate-200 bg-slate-50 p-4"
        >
          <div
            className="flex items-start
                       justify-between gap-3"
          >
            <div className="min-w-0">
              <h3
                className="truncate text-sm
                           font-semibold text-slate-900"
              >
                {nearestPharmacy.kendra_name}
              </h3>

              <div
                className="mt-1 flex items-start gap-1
                           text-xs text-slate-500"
              >
                <HiOutlineMapPin
                  size={12}
                  className="mt-0.5 shrink-0"
                />

                <span>{nearestPharmacy.address}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-primary-700">
                {distance} km
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Quantity: {nearestPharmacy.total_qty}
              </p>
            </div>
          </div>

          {nearestPharmacy.phone && (
            <a
              href={`tel:${nearestPharmacy.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1 text-xs
                         text-slate-500 hover:text-primary-600"
            >
              <HiOutlinePhone size={12} />
              {nearestPharmacy.phone}
            </a>
          )}
          {nearestBatch && (
  <div
    className="grid grid-cols-1 gap-2 border-t
               border-slate-200 pt-3 text-xs
               sm:grid-cols-2"
  >
    <div>
      <p className="text-slate-400">
        Batch Number
      </p>

      <p className="mt-0.5 font-medium text-slate-700">
        {nearestBatch.batch_number}
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Batch Quantity
      </p>

      <p className="mt-0.5 font-medium text-slate-700">
        {nearestBatch.quantity}
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Manufacturer
      </p>

      <p className="mt-0.5 font-medium text-slate-700">
        {nearestBatch.manufacturer}
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Expiry Date
      </p>

      <p className="mt-0.5 font-medium text-slate-700">
        {formattedExpiry}
      </p>
    </div>
  </div>
)}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center
                       gap-2 rounded-xl bg-secondary-600
                       px-4 py-2.5 text-sm font-semibold
                       text-white hover:bg-secondary-700"
          >
            <HiOutlineMapPin size={15} />
            View on Map
          </a>

          <Link
            to={nearbyPageUrl}
            className="flex flex-1 items-center justify-center
                       gap-2 rounded-xl border
                       border-secondary-300 px-4 py-2.5
                       text-sm font-medium text-secondary-700
                       hover:bg-secondary-50"
          >
            Find More Kendras
            <HiOutlineArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NearbyPharmacyPreview