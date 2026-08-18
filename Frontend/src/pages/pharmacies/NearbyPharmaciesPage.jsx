/**
 * Component: NearbyPharmacyWorkflow
 *
 * Description:
 *   Displays nearby pharmacies, medicine availability,
 *   interactive map, pharmacy details,
 *   navigation preview and reservation workflow.
 *
 * Responsibilities:
 *   - Manage selected pharmacy state shared across map + list + details panel
 *   - Compose all 9 sections in specification order
 *   - Two-column layout: list+map (left) + details panel (right) on desktop
 *
 * Route: /pharmacies/nearby (ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   - pharmacies → GET /api/v1/pharmacies/nearby?lat=...&lng=...&medicine=...
 *   - pharmacy detail → GET /api/v1/pharmacies/:id
 *   - availability    → GET /api/v1/pharmacies/:id/inventory?medicine=...
 *   All API integrations deferred to Module 10.
 */

import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PharmacySearchSummary    from './sections/PharmacySearchSummary'
import InteractiveMapSection    from './sections/InteractiveMapSection'
import NearbyPharmacyList       from './sections/NearbyPharmacyList'
import PharmacyDetailsPanel     from './sections/PharmacyDetailsPanel'
import ReservationSection       from './sections/ReservationSection'
import NavigationPreview        from './sections/NavigationPreview'
import PharmacyWorkflowTimeline from './sections/PharmacyWorkflowTimeline'
import PharmacyTips             from './sections/PharmacyTips'
import HealthcareDisclaimer     from '../medicine/sections/HealthcareDisclaimer'
import Divider                  from '../../components/ui/Divider'
import { useGeolocation } from '../../hooks/useGeolocation'
import kendraService from '../../services/kendraService'

const DEFAULT_RADIUS_KM = 10

function NearbyPharmaciesPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [searchParams] = useSearchParams()

  // Optional: page can be reached with ?pmbi_code=PAR500&name=...&genericName=...
  // (e.g. from "Nearby Pharmacy Preview" on a medicine's detail page).
  // Without it, this page just browses all nearby Kendras.
  const pmbiCode    = searchParams.get('pmbi_code')
  const medicine     = {
    name:        searchParams.get('name') ?? 'All Jan Aushadhi Kendras',
    genericName: searchParams.get('genericName') ?? '',
  }

  const { location, status: locationStatus } = useGeolocation()

  const kendrasQuery = useQuery({
    queryKey: ['kendras', 'nearby', location?.lat, location?.lng],
    queryFn: async () => (
      await kendraService.findNearby(location.lat, location.lng, DEFAULT_RADIUS_KM)
    ).data,
    enabled: !!location,
  })

  // Map backend Kendra shape -> what NearbyPharmacyList / PharmacyDetailsPanel expect
  const pharmacies = useMemo(() => {
    const results = kendrasQuery.data?.results ?? []
    return results.map((k) => {
      const stockItem = pmbiCode
        ? (k.stock ?? []).find((s) => s.pmbi_code === pmbiCode)
        : null

      const availability = !pmbiCode
        ? 'available' // no specific medicine selected — browse mode, nothing to flag
        : stockItem
          ? { in_stock: 'available', low_stock: 'limited', out_of_stock: 'unavailable' }[stockItem.status]
          : 'unavailable' // this Kendra doesn't carry the medicine at all

      return {
        id: k.id,
        name: k.name,
        address: k.address,
        latitude: k.latitude,
        longitude: k.longitude,
        distance: `${k.distance_km} km`,
        travelTime: `~${Math.max(1, Math.round(k.distance_km * 2))} min drive`,
        phone: k.phone,
        hours: 'Contact for hours',
        isOpen: true,
        isJanAushadhi: true,
        availability,
        rating: k.rating ?? 0,
        ratingCount: 0,
        stock: k.stock ?? [],
      }
    })
  }, [kendrasQuery.data, pmbiCode])

  const selectedPharmacy = useMemo(
    () => pharmacies.find((p) => p.id === selectedId),
    [pharmacies, selectedId],
  )

  function handleViewDetails(id) {
    setSelectedId(id)
  }

  function handleReserve(pharmacyId) {
    setSelectedId(pharmacyId)
    document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article aria-label="Nearby Pharmacies" className="flex flex-col gap-5">

      {/* =======================================================
          Pharmacy Search Summary
         ======================================================= */}
      <PharmacySearchSummary medicine={medicine} pharmacyCount={pharmacies.length} />

      {locationStatus === 'fallback' && (
        <div className="px-4 py-2.5 rounded-xl bg-warning-50 text-warning-700 text-xs">
          Couldn't access your exact location — showing results near Mysuru instead. You can allow location access in your browser to see pharmacies near you.
        </div>
      )}

      {/* =======================================================
          Interactive Map
         ======================================================= */}
      <InteractiveMapSection
        selectedPharmacyId={selectedId}
        onSelectPharmacy={setSelectedId}
        pharmacies={pharmacies}
        center={location ? [location.lat, location.lng] : undefined}
      />

      <Divider className="my-0" />

      {/* Two-column layout: list (left) + details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">

        {/* Left column: list + reservation + navigation */}
        <div className="flex flex-col gap-5">

          {/* =======================================================
              Nearby Pharmacies
             ======================================================= */}
          {kendrasQuery.isLoading ? (
            <p className="text-center py-10 text-sm text-slate-400">Finding nearby Kendras…</p>
          ) : kendrasQuery.isError ? (
            <p className="text-center py-10 text-sm text-danger-600">Couldn't load nearby pharmacies. Try again.</p>
          ) : (
            <NearbyPharmacyList
              pharmacies={pharmacies}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onViewDetails={handleViewDetails}
              onReserve={handleReserve}
            />
          )}

          {/* =======================================================
              Reservation Placeholder
             ======================================================= */}
          <div id="reservation-section">
            <ReservationSection pharmacyId={selectedId} />
          </div>

          {/* =======================================================
              Navigation Preview
             ======================================================= */}
          <NavigationPreview pharmacy={selectedPharmacy} />

        </div>

        {/* Right column: pharmacy details + workflow + tips */}
        <div className="lg:sticky lg:top-16 flex flex-col gap-5">

          {/* =======================================================
              Pharmacy Details
             ======================================================= */}
          <PharmacyDetailsPanel pharmacyId={selectedId} />

          {/* =======================================================
              Workflow Timeline
             ======================================================= */}
          <PharmacyWorkflowTimeline />

        </div>
      </div>

      <Divider className="my-0" />

      {/* =======================================================
          Smart Pharmacy Tips
         ======================================================= */}
      <PharmacyTips />

      {/* =======================================================
          Healthcare Disclaimer (reused from medicine details)
         ======================================================= */}
      <HealthcareDisclaimer />

    </article>
  )
}

export default NearbyPharmaciesPage