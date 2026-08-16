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

import { useState } from 'react'
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

// Placeholder medicine context
// TODO: read from URL search params or React context
const PLACEHOLDER_MEDICINE = {
  name:        'Crocin 500',
  genericName: 'Paracetamol IP 500mg',
}

function NearbyPharmaciesPage() {
  const [selectedId, setSelectedId] = useState(null)

  function handleViewDetails(id) {
    setSelectedId(id)
  }

  function handleReserve(pharmacyId) {
    setSelectedId(pharmacyId)
    // Scroll to reservation section
    document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article aria-label="Nearby Pharmacies" className="flex flex-col gap-5">

      {/* =======================================================
          Pharmacy Search Summary
         ======================================================= */}
      <PharmacySearchSummary medicine={PLACEHOLDER_MEDICINE} pharmacyCount={8} />

      {/* =======================================================
          Interactive Map
         ======================================================= */}
      <InteractiveMapSection
        selectedPharmacyId={selectedId}
        onSelectPharmacy={setSelectedId}
      />

      <Divider className="my-0" />

      {/* Two-column layout: list (left) + details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">

        {/* Left column: list + reservation + navigation */}
        <div className="flex flex-col gap-5">

          {/* =======================================================
              Nearby Pharmacies
             ======================================================= */}
          <NearbyPharmacyList
            selectedId={selectedId}
            onSelect={setSelectedId}
            onViewDetails={handleViewDetails}
            onReserve={handleReserve}
          />

          {/* =======================================================
              Reservation Placeholder
             ======================================================= */}
          <div id="reservation-section">
            <ReservationSection pharmacyId={selectedId} />
          </div>

          {/* =======================================================
              Navigation Preview
             ======================================================= */}
          <NavigationPreview />

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
