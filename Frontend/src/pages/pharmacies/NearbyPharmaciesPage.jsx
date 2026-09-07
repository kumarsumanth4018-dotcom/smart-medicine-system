/**
 * Nearby Pharmacies Page
 *
 * Browse mode:
 *   GET /kendras/nearby
 *
 * Medicine mode:
 *   GET /kendras/medicine/{pmbi_code}/nearby
 *   Results are ranked by the backend WSM algorithm.
 */

import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import PharmacySearchSummary from './sections/PharmacySearchSummary'
import InteractiveMapSection from './sections/InteractiveMapSection'
import NearbyPharmacyList from './sections/NearbyPharmacyList'
import PharmacyDetailsPanel from './sections/PharmacyDetailsPanel'
import ReservationSection from './sections/ReservationSection'
import NavigationPreview from './sections/NavigationPreview'
import PharmacyWorkflowTimeline from './sections/PharmacyWorkflowTimeline'
import PharmacyTips from './sections/PharmacyTips'
import HealthcareDisclaimer from '../medicine/sections/HealthcareDisclaimer'
import Divider from '../../components/ui/Divider'
import { useGeolocation } from '../../hooks/useGeolocation'
import kendraService, {
  DEFAULT_RANKING_WEIGHTS,
} from '../../services/kendraService'


const DEFAULT_RADIUS_KM = 50


function NearbyPharmaciesPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [searchParams] = useSearchParams()

  const pmbiCode =
    searchParams.get('medicine') ||
    searchParams.get('pmbi_code')

  const medicine = {
    name:
      searchParams.get('name') ??
      (pmbiCode
        ? `Medicine ${pmbiCode}`
        : 'All Jan Aushadhi Kendras'),
    genericName:
      searchParams.get('genericName') ?? '',
  }

  const { location, status: locationStatus } =
    useGeolocation()

  // The preferences screen will replace these defaults later.
  // Keeping this as an object makes that integration straightforward.
  const rankingWeights = DEFAULT_RANKING_WEIGHTS

  const kendrasQuery = useQuery({
    queryKey: [
      'kendras',
      pmbiCode ? 'medicine-ranked' : 'nearby',
      pmbiCode,
      location?.lat,
      location?.lng,
      DEFAULT_RADIUS_KM,
      rankingWeights.distance,
      rankingWeights.price,
      rankingWeights.quantity,
      rankingWeights.freshness,
      rankingWeights.trust,
    ],

    queryFn: async () => {
      if (pmbiCode) {
        const response =
          await kendraService.findMedicineNearby(
            pmbiCode,
            location.lat,
            location.lng,
            DEFAULT_RADIUS_KM,
            true,
            rankingWeights,
          )

        return response.data
      }

      const response = await kendraService.findNearby(
        location.lat,
        location.lng,
        DEFAULT_RADIUS_KM,
      )

      return response.data
    },

    enabled: Boolean(location?.lat && location?.lng),
  })

  const pharmacies = useMemo(() => {
    const rawResults = pmbiCode
      ? Array.isArray(kendrasQuery.data)
        ? kendrasQuery.data
        : []
      : kendrasQuery.data?.results ?? []

    return rawResults.map(kendra => {
      // Medicine-ranked endpoint and ordinary nearby endpoint
      // return slightly different property names.
      const id =
        kendra.kendra_id ?? kendra.id

      const name =
        kendra.kendra_name ?? kendra.name

      let availability = 'available'

      if (pmbiCode) {
        availability = {
          in_stock: 'available',
          low_stock: 'limited',
          out_of_stock: 'unavailable',
        }[kendra.status] ?? 'unavailable'
      }

      if (!pmbiCode) {
        const stockItem = (kendra.stock ?? []).find(
          item => item.pmbi_code === pmbiCode,
        )

        if (stockItem) {
          availability = {
            in_stock: 'available',
            low_stock: 'limited',
            out_of_stock: 'unavailable',
          }[stockItem.status] ?? 'unavailable'
        }
      }

      const distanceKm = Number(
        kendra.distance_km ?? 0,
      )

      return {
        id,
        name,
        address: kendra.address,
        latitude: kendra.latitude,
        longitude: kendra.longitude,
        distance: `${distanceKm.toFixed(2)} km`,
        distanceKm,
        travelTime:
          `~${Math.max(
            1,
            Math.round(distanceKm * 2),
          )} min drive`,
        phone: kendra.phone,
        hours: 'Contact for hours',
        isOpen: true,
        isJanAushadhi: true,
        availability,
        rating: kendra.rating ?? 0,
        ratingCount: 0,
        stock: kendra.stock ?? [],

        // WSM fields are present in medicine mode.
        rank: kendra.rank ?? null,
        wsmScore: kendra.wsm_score ?? null,
        price: kendra.price ?? null,
        totalQty: kendra.total_qty ?? null,
        nearestExpiry: kendra.nearest_expiry ?? null,
        daysToExpiry: kendra.days_to_expiry ?? null,
        verificationStatus:
          kendra.verification_status ?? null,
        scoreBreakdown:
          kendra.score_breakdown ?? null,
        weightsUsed:
          kendra.weights_used ?? null,
        batches: kendra.batches ?? [],
      }
    })
  }, [kendrasQuery.data, pmbiCode])

  const selectedPharmacy = useMemo(
    () =>
      pharmacies.find(
        pharmacy => pharmacy.id === selectedId,
      ),
    [pharmacies, selectedId],
  )

  function handleViewDetails(id) {
    setSelectedId(id)
  }

  function handleReserve(pharmacyId) {
    setSelectedId(pharmacyId)

    document
      .getElementById('reservation-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article
      aria-label="Nearby Pharmacies"
      className="flex flex-col gap-5"
    >
      <PharmacySearchSummary
        medicine={medicine}
        pharmacyCount={pharmacies.length}
      />

      {pmbiCode && pharmacies.length > 0 && (
        <div
          className="rounded-xl border border-primary-200
                     bg-primary-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-primary-800">
            Smart Kendra ranking applied
          </p>

          <p className="mt-1 text-xs text-primary-700">
            Results are ranked using distance, price,
            stock quantity, medicine freshness and batch trust.
          </p>
        </div>
      )}

      {locationStatus === 'fallback' && (
        <div
          className="rounded-xl bg-warning-50 px-4 py-2.5
                     text-xs text-warning-700"
        >
          Your exact location could not be accessed. Results
          are being calculated from the Mysuru fallback location.
        </div>
      )}

      <InteractiveMapSection
        selectedPharmacyId={selectedId}
        onSelectPharmacy={setSelectedId}
        pharmacies={pharmacies}
        center={
          location
            ? [location.lat, location.lng]
            : undefined
        }
      />

      <Divider className="my-0" />

      <div
        className="grid grid-cols-1 items-start gap-5
                   lg:grid-cols-[1fr_320px]"
      >
        <div className="flex flex-col gap-5">
          {kendrasQuery.isLoading ? (
            <p
              className="py-10 text-center text-sm
                         text-slate-400"
            >
              {pmbiCode
                ? 'Ranking Kendras using your preferences…'
                : 'Finding nearby Kendras…'}
            </p>
          ) : kendrasQuery.isError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-danger-600">
                Could not load nearby Kendras.
              </p>

              <button
                type="button"
                onClick={() => kendrasQuery.refetch()}
                className="mt-3 rounded-lg bg-primary-600
                           px-4 py-2 text-xs font-semibold
                           text-white hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <NearbyPharmacyList
              pharmacies={pharmacies}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onViewDetails={handleViewDetails}
              onReserve={handleReserve}
            />
          )}

          <div id="reservation-section">
            <ReservationSection
              pharmacyId={selectedId}
            />
          </div>

          <NavigationPreview
            pharmacy={selectedPharmacy}
          />
        </div>

        <div
          className="flex flex-col gap-5
                     lg:sticky lg:top-16"
        >
          <PharmacyDetailsPanel
            pharmacyId={selectedId}
          />

          <PharmacyWorkflowTimeline />
        </div>
      </div>

      <Divider className="my-0" />

      <PharmacyTips />
      <HealthcareDisclaimer />
    </article>
  )
}


export default NearbyPharmaciesPage
