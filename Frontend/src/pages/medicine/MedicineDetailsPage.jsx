/**
 * Component: MedicineDetailsPage
 *
 * Description:
 *   Displays detailed information about a selected medicine,
 *   its generic alternatives, price comparison,
 *   nearby pharmacy availability and medicine information.
 *
 * Responsibilities:
 *   - Read medicine ID from URL param (:id)
 *   - Compose all medicine detail sections in specification order
 *   - Two-column layout: main content (left) + action panel (right)
 *   - Breadcrumb navigation back to search
 *
 * Section order (Module 7B Part 2 specification):
 *   1. MedicineOverviewSection     — hero card with all identity fields
 *   2. PriceComparisonSection      — brand vs generic price comparison
 *   3. GenericRecommendationSection — recommended Jan Aushadhi alternative
 *   4. NearbyPharmacyPreview        — nearest stocking pharmacy
 *   5. MedicineInfoTabs             — 7-tab information panel
 *   6. SimilarMedicinesSection      — related medicines grid
 *   7. HealthcareDisclaimer         — medical disclaimer
 *   ActionPanel                     — sticky right column (desktop)
 *
 * Route: /medicine/:id (inside ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   - Replace PLACEHOLDER_MEDICINE with TanStack Query:
 *     const { data } = useQuery({
 *       queryKey: ['medicine', id],
 *       queryFn:  () => medicineService.getById(id),
 *     })
 *
 * Dependencies:
 *   - UserLayout (via React Router nesting — automatic)
 *   - All section components (./sections/*)
 *   - Breadcrumb (components/common)
 *   - ROUTES (constants/routes)
 */

import { useParams, Link } from 'react-router-dom'
import MedicineOverviewSection      from './sections/MedicineOverviewSection'
import PriceComparisonSection       from './sections/PriceComparisonSection'
import GenericRecommendationSection from './sections/GenericRecommendationSection'
import NearbyPharmacyPreview        from './sections/NearbyPharmacyPreview'
import MedicineInfoTabs             from './sections/MedicineInfoTabs'
import ActionPanel                  from './sections/ActionPanel'
import SimilarMedicinesSection      from './sections/SimilarMedicinesSection'
import HealthcareDisclaimer         from './sections/HealthcareDisclaimer'
import { ROUTES }                   from '../../constants/routes'
import { HiOutlineArrowLeft }       from 'react-icons/hi2'

// =====================================================
// Placeholder medicine data
// TODO: Replace with useQuery(() => medicineService.getById(id))
// =====================================================
const PLACEHOLDER_MEDICINE = {
  id:             'paracetamol-500',
  name:           'Paracetamol 500mg',
  genericName:    'Acetaminophen IP',
  composition:    'Paracetamol IP 500mg',
  strength:       '500mg',
  type:           'Tablet',
  category:       'Analgesic / Antipyretic',
  manufacturer:   'Jan Aushadhi (BPPI)',
  prescriptionReqd: false,
  availability:   'available',
  isJanAushadhi:  true,
  isGeneric:      true,
  isAffordable:   true,
  nearbyPharmacyCount: 5,
  price:          18,
  mrp:            120,
  description:    'Paracetamol is a widely used analgesic and antipyretic for relief of mild to moderate pain and fever reduction.',
  lastUpdated:    'July 2025',
}

const PLACEHOLDER_PRICES = {
  brandName:    'Crocin 500 (Branded)',
  brandPrice:   120,
  genericName:  'Paracetamol IP 500mg (Jan Aushadhi)',
  genericPrice: 18,
}

const PLACEHOLDER_GENERIC = {
  id:               'gen-paracetamol-500',
  name:             'Paracetamol IP 500mg',
  equivalentName:   'Acetaminophen (Generic)',
  composition:      'Paracetamol IP 500mg',
  price:            18,
  brandPrice:       120,
  manufacturer:     'Jan Aushadhi (BPPI)',
  isCompositionMatch: true,
  isQualityAssured:   true,
}

// =====================================================
// Medicine Details Page
// =====================================================
function MedicineDetailsPage() {
  const { id } = useParams()

  // TODO: fetch real medicine data
  // const { data: medicine, isLoading, isError } = useQuery({
  //   queryKey: ['medicine', id],
  //   queryFn:  () => medicineService.getById(id),
  // })
  const medicine = PLACEHOLDER_MEDICINE

  return (
    <article aria-label={`Medicine details: ${medicine.name}`}>

      {/* =====================================================
          Breadcrumb navigation
         ===================================================== */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 text-xs text-slate-400">
        <Link
          to={ROUTES.USER.SEARCH}
          className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          Search
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`${ROUTES.USER.SEARCH_RESULTS}?q=${medicine.name}`}
          className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          Results
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-600 font-medium truncate">{medicine.name}</span>
      </nav>

      {/* =====================================================
          Two-column layout: main content + action panel
         ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">

        {/* ── Main content column ──────────────────────────── */}
        <div className="flex flex-col gap-6 min-w-0">

          {/* =====================================================
              Medicine Overview
             ===================================================== */}
          <MedicineOverviewSection medicine={medicine} />

          {/* =====================================================
              Price Comparison
             ===================================================== */}
          <PriceComparisonSection prices={PLACEHOLDER_PRICES} />

          {/* =====================================================
              Generic Recommendation
             ===================================================== */}
          <GenericRecommendationSection generic={PLACEHOLDER_GENERIC} />

          {/* =====================================================
              Nearby Pharmacy Preview
             ===================================================== */}
          <NearbyPharmacyPreview />

          {/* =====================================================
              Medicine Information Tabs
             ===================================================== */}
          <MedicineInfoTabs />

          {/* =====================================================
              Similar Medicines
             ===================================================== */}
          <SimilarMedicinesSection />

          {/* =====================================================
              Healthcare Disclaimer
             ===================================================== */}
          <HealthcareDisclaimer />
        </div>

        {/* ── Action panel column (sticky on desktop) ──────── */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <ActionPanel medicine={medicine} />
        </div>
      </div>

    </article>
  )
}

export default MedicineDetailsPage
