/**
 * Component: GenericRecommendationSection
 *
 * Description:
 *   Highlighted card showcasing the recommended PM Jan Aushadhi
 *   generic alternative for the current branded medicine.
 *
 * Responsibilities:
 *   - Display recommended generic with premium styling
 *   - Show composition match, quality assurance, savings badge
 *   - Recommendation + Jan Aushadhi badge
 *   - CTA to view or find this generic at nearby pharmacies
 *
 * Backend readiness:
 *   - generic → GET /api/v1/medicines/:id/generic-recommendation
 */

import { HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'
import { Link } from 'react-router-dom'

// =====================================================
// Generic Recommendation Section
// =====================================================
function GenericRecommendationSection({ generic = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/generic-recommendation
  const {
    id             = 'gen-001',
    name           = 'Paracetamol IP 500mg',
    equivalentName = 'Acetaminophen (Generic)',
    composition    = 'Paracetamol IP 500mg',
    price          = 18,
    brandPrice     = 120,
    manufacturer   = 'Jan Aushadhi (BPPI)',
    isCompositionMatch = true,
    isQualityAssured   = true,
  } = generic

  const savings    = brandPrice - price
  const savingsPct = Math.round((savings / brandPrice) * 100)

  return (
    <section aria-labelledby="generic-rec-heading">

      {/* =====================================================
          Generic Recommendation
         ===================================================== */}
      <div className="relative bg-gradient-to-br from-success-50 to-primary-50 rounded-2xl border-2 border-success-200 shadow-md p-6 overflow-hidden">

        {/* Background accent */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-32 h-32 bg-success-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"
        />

        {/* Header badges */}
        <div className="flex flex-wrap gap-2 mb-4 relative">
          <Badge variant="success" size="md" icon={<span aria-hidden="true">⭐</span>}>
            Recommended Alternative
          </Badge>
          <Badge variant="info" size="md" icon={<span aria-hidden="true">🏥</span>}>
            PM Jan Aushadhi
          </Badge>
          <Badge variant="success" size="md">{savingsPct}% Cheaper</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">

          {/* ── Left: medicine identity ──────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success-100 shrink-0">
                <MdMedication size={26} className="text-success-700" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="generic-rec-heading"
                  className="text-base font-bold text-slate-900"
                >
                  {name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{equivalentName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{composition}</p>
              </div>
            </div>

            {/* Quality indicators */}
            <div className="flex flex-col gap-1.5">
              {isCompositionMatch && (
                <div className="flex items-center gap-2 text-xs text-success-700">
                  <HiOutlineCheckCircle size={14} aria-hidden="true" />
                  <span>Same active composition as branded medicine</span>
                </div>
              )}
              {isQualityAssured && (
                <div className="flex items-center gap-2 text-xs text-primary-700">
                  <HiOutlineShieldCheck size={14} aria-hidden="true" />
                  <span>WHO-GMP quality assured</span>
                  {/* TODO: quality cert from API */}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HiOutlineCheckCircle size={14} aria-hidden="true" />
                <span>Manufactured by: {manufacturer}</span>
              </div>
            </div>
          </div>

          {/* ── Right: price + CTA ───────────────────────────── */}
          <div className="flex flex-col justify-between gap-4">
            {/* Savings highlight */}
            <div className="bg-white rounded-xl border border-success-200 p-4 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Jan Aushadhi Price
              </p>
              <p className="text-3xl font-extrabold text-success-700">₹{price}</p>
              <p className="text-xs text-slate-400 line-through mt-0.5">Brand: ₹{brandPrice}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <Badge variant="success" size="sm">
                  Save ₹{savings} ({savingsPct}% off)
                </Badge>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.USER.NEARBY_PHARMACIES}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-success-600 text-white text-sm font-semibold hover:bg-success-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500"
                aria-label={`Find ${name} at nearby pharmacies`}
              >
                Find at Nearby Pharmacy
                <HiOutlineArrowRight size={15} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-success-300 text-success-700 text-sm font-medium hover:bg-success-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500"
                onClick={() => {/* TODO: navigate to generic detail */}}
                aria-label={`View details for ${name}`}
              >
                View Generic Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenericRecommendationSection
