/**
 * Component: GenericRecommendationWorkflow
 *
 * Description:
 *   Displays intelligent medicine recommendations,
 *   compares branded medicines with PM Jan Aushadhi medicines,
 *   calculates estimated savings,
 *   and guides the user to nearby pharmacies.
 *
 * Responsibilities:
 *   - Read medicine ID from URL param (:id)
 *   - Compose all recommendation + workflow sections in order
 *   - Act as a pure layout orchestrator with zero business logic
 *
 * Complete section order (Module 8 Part 1 + Part 2):
 *   Part 1 — Core Recommendation:
 *     1. RecommendationHeader        — hero with illustration
 *     2. SelectedMedicineSummary     — branded medicine context
 *     3. RecommendedGenericCard      — #1 recommended generic
 *     4. PriceComparisonSection      — brand vs generic price
 *     5. SavingsBreakdown            — monthly/yearly savings
 *     6. CompositionComparison       — composition table
 *     7. RecommendationConfidence    — confidence score
 *     8. JanAushadhiInfo             — PMJAP education
 *
 *   Part 2 — Workflow Continuation:
 *     9.  AlternativeGenericsSection  — all ranked alternatives
 *    10.  RecommendationExplanation   — why this was recommended
 *    11.  SavingsDashboard            — premium savings dashboard
 *    12.  NearbyPharmacyWorkflow      — pharmacy preview + CTAs
 *    13.  WorkflowTimeline            — healthcare journey steps
 *    14.  HealthcareTips              — smart healthcare tips
 *    15.  FutureAIPlaceholders        — upcoming AI features
 *    16.  HealthcareDisclaimer        — medical disclaimer (reused)
 *
 * Route: /medicine/:id/generic  (ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   All PLACEHOLDER_* constants are replaced by TanStack Query calls:
 *     useQuery(['medicine', id], () => medicineService.getById(id))
 *     useQuery(['generic-rec', id], () => medicineService.getAlternatives(id))
 *   API integrations deferred to Module 9.
 */

import { useParams }              from 'react-router-dom'

// ── Part 1 sections ──────────────────────────────────────────────────────────
import RecommendationHeader     from './sections/RecommendationHeader'
import SelectedMedicineSummary  from './sections/SelectedMedicineSummary'
import RecommendedGenericCard   from './sections/RecommendedGenericCard'
import PriceComparisonSection   from './sections/PriceComparisonSection'
import SavingsBreakdown         from './sections/SavingsBreakdown'
import CompositionComparison    from './sections/CompositionComparison'
import RecommendationConfidence from './sections/RecommendationConfidence'
import JanAushadhiInfo          from './sections/JanAushadhiInfo'

// ── Part 2 sections ──────────────────────────────────────────────────────────
import AlternativeGenericsSection from './sections/AlternativeGenericsSection'
import RecommendationExplanation  from './sections/RecommendationExplanation'
import SavingsDashboard           from './sections/SavingsDashboard'
import NearbyPharmacyWorkflow     from './sections/NearbyPharmacyWorkflow'
import WorkflowTimeline           from './sections/WorkflowTimeline'
import HealthcareTips             from './sections/HealthcareTips'
import FutureAIPlaceholders       from './sections/FutureAIPlaceholders'

// ── Shared ───────────────────────────────────────────────────────────────────
import HealthcareDisclaimer     from '../medicine/sections/HealthcareDisclaimer'
import Divider                  from '../../components/ui/Divider'

// ── Placeholder data ─────────────────────────────────────────────────────────
// TODO: Replace each with a TanStack Query call in Module 9
const PLACEHOLDER_MEDICINE = {
  name:            'Crocin 500',
  brandName:       'GlaxoSmithKline',
  manufacturer:    'GlaxoSmithKline (GSK)',
  composition:     'Paracetamol IP 500mg',
  strength:        '500mg',
  category:        'Analgesic / Antipyretic',
  prescriptionReqd: false,
  availability:    'available',
}
const PLACEHOLDER_GENERIC = {
  name:               'Paracetamol IP 500mg',
  equivalentBrand:    'Equivalent to Crocin 500',
  composition:        'Paracetamol IP 500mg',
  manufacturer:       'Jan Aushadhi (BPPI)',
  qualityMatch:       '98%',
  price:              18,
  brandPrice:         120,
  isCompositionMatch: true,
  isQualityAssured:   true,
  isJanAushadhi:      true,
}
const PLACEHOLDER_PRICES = {
  brandName:   'Crocin 500 (Branded)',
  brandPrice:  120,
  genericName: 'Paracetamol IP 500mg (Jan Aushadhi)',
  genericPrice: 18,
}
const PLACEHOLDER_SAVINGS_BREAKDOWN = { perUnit:102, monthly:306, yearly:3672, savingsPct:85, brandPrice:120, genericPrice:18 }
const PLACEHOLDER_SAVINGS_DASHBOARD = { today:102, monthly:306, yearly:3672, pct:85 }

// =====================================================
// Generic Recommendation Page
// =====================================================
function GenericRecommendationPage() {
  const { id } = useParams()

  return (
    <article aria-label="Generic Medicine Recommendation Workflow" className="flex flex-col gap-5">

      {/* ======================================================
          Recommendation Header
         ====================================================== */}
      <RecommendationHeader medicineName={PLACEHOLDER_MEDICINE.name} medicineId={id} />

      {/* ======================================================
          Selected Medicine
         ====================================================== */}
      <SelectedMedicineSummary medicine={PLACEHOLDER_MEDICINE} />

      <Divider className="my-0" />

      {/* ======================================================
          Recommended Generic Medicine
         ====================================================== */}
      <RecommendedGenericCard generic={PLACEHOLDER_GENERIC} />

      {/* ======================================================
          Price Comparison
         ====================================================== */}
      <PriceComparisonSection prices={PLACEHOLDER_PRICES} />

      {/* ======================================================
          Savings Analysis
         ====================================================== */}
      <SavingsBreakdown savings={PLACEHOLDER_SAVINGS_BREAKDOWN} />

      <Divider className="my-0" />

      {/* ======================================================
          Composition Comparison
         ====================================================== */}
      <CompositionComparison />

      {/* ======================================================
          Recommendation Confidence
         ====================================================== */}
      <RecommendationConfidence />

      {/* ======================================================
          PM Jan Aushadhi Information
         ====================================================== */}
      <JanAushadhiInfo />

      <Divider className="my-0" />

      {/* ======================================================
          Alternative Generic Medicines (Part 2)
         ====================================================== */}
      <AlternativeGenericsSection />

      {/* ======================================================
          Recommendation Explanation
         ====================================================== */}
      <RecommendationExplanation />

      {/* ======================================================
          Savings Dashboard
         ====================================================== */}
      <SavingsDashboard savings={PLACEHOLDER_SAVINGS_DASHBOARD} />

      <Divider className="my-0" />

      {/* ======================================================
          Nearby Pharmacy Preview
         ====================================================== */}
      <NearbyPharmacyWorkflow />

      {/* ======================================================
          Workflow Timeline
         ====================================================== */}
      <WorkflowTimeline />

      {/* ======================================================
          Smart Healthcare Tips
         ====================================================== */}
      <HealthcareTips />

      {/* ======================================================
          Future AI Placeholders
         ====================================================== */}
      <FutureAIPlaceholders />

      {/* ======================================================
          Healthcare Disclaimer (reused from medicine details)
         ====================================================== */}
      <HealthcareDisclaimer />

    </article>
  )
}

export default GenericRecommendationPage
