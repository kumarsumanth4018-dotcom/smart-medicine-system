/**
 * Component: RecommendedGenericCard
 *
 * Description:
 *   Premium highlighted card for the top-recommended PM Jan Aushadhi
 *   generic alternative. This is the hero element of the page.
 *
 * Responsibilities:
 *   - Display generic name, equivalent brand, composition match
 *   - PM Jan Aushadhi badge, quality match, recommendation badge
 *   - Savings highlight and CTA buttons
 *
 * Backend readiness:
 *   - generic → GET /api/v1/medicines/:id/generic-recommendation
 */

import { HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineStar } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

// =====================================================
// Recommended Generic Card
// =====================================================
function RecommendedGenericCard({ generic = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/generic-recommendation
  const {
    name               = 'Paracetamol IP 500mg',
    equivalentBrand    = 'Equivalent to Crocin 500',
    composition        = 'Paracetamol IP 500mg',
    manufacturer       = 'Jan Aushadhi (BPPI)',
    qualityMatch       = '98%',
    price              = 18,
    brandPrice         = 120,
    isCompositionMatch = true,
    isQualityAssured   = true,
    isJanAushadhi      = true,
  } = generic

  const savings    = brandPrice - price
  const savingsPct = Math.round((savings / brandPrice) * 100)

  return (
    <section aria-labelledby="recommended-generic-heading">

      {/* =====================================================
          Recommended Generic Medicine
         ===================================================== */}
      <div className="relative bg-gradient-to-br from-success-50 via-white to-primary-50 rounded-2xl border-2 border-success-300 shadow-lg p-6 overflow-hidden">
        {/* Decorative background circle */}
        <div aria-hidden="true" className="absolute -top-8 -right-8 w-32 h-32 bg-success-100 rounded-full opacity-40" />

        {/* Recommendation ribbon */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success-600 text-white text-[10px] font-bold shadow-md">
            <HiOutlineStar size={11} aria-hidden="true" />
            Best Match
          </div>
        </div>

        {/* Header badges */}
        <div className="flex flex-wrap gap-2 mb-5 relative">
          <Badge variant="success" size="md">⭐ Recommended Alternative</Badge>
          {isJanAushadhi && <Badge variant="info" size="md">🏥 PM Jan Aushadhi</Badge>}
          <Badge variant="success" size="md">{savingsPct}% Cheaper</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          {/* Left: identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-13 h-13 w-12 h-12 rounded-xl bg-success-100 shrink-0">
                <MdMedication size={26} className="text-success-700" aria-hidden="true" />
              </div>
              <div>
                <h2 id="recommended-generic-heading" className="text-base font-extrabold text-slate-900">
                  {name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{equivalentBrand}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{composition}</p>
              </div>
            </div>

            {/* Quality indicators */}
            <div className="flex flex-col gap-2 bg-white/70 rounded-xl p-3 border border-success-100">
              {isCompositionMatch && (
                <div className="flex items-center gap-2 text-xs text-success-700 font-medium">
                  <HiOutlineCheckCircle size={14} aria-hidden="true" />
                  Same active composition as branded medicine
                </div>
              )}
              {isQualityAssured && (
                <div className="flex items-center gap-2 text-xs text-primary-700">
                  <HiOutlineShieldCheck size={14} aria-hidden="true" />
                  WHO-GMP quality assured
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HiOutlineCheckCircle size={14} aria-hidden="true" />
                Manufactured by: {manufacturer}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HiOutlineCheckCircle size={14} aria-hidden="true" />
                {/* TODO: quality match score from ML model via API */}
                Estimated quality match: <span className="font-semibold text-success-700">{qualityMatch}</span>
              </div>
            </div>
          </div>

          {/* Right: price + CTA */}
          <div className="flex flex-col gap-4 justify-between">
            <div className="bg-white rounded-xl border border-success-200 p-4 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Jan Aushadhi Price
              </p>
              <p className="text-4xl font-extrabold text-success-700">₹{price}</p>
              <p className="text-xs text-slate-400 line-through mt-0.5">Brand: ₹{brandPrice}</p>
              <div className="mt-2 flex justify-center">
                <Badge variant="success" size="sm">Save ₹{savings} ({savingsPct}% off)</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.USER.NEARBY_PHARMACIES}
                aria-label={`Find ${name} at nearby pharmacies`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-success-600 text-white text-sm font-semibold hover:bg-success-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500"
              >
                Find at Nearby Pharmacy
                <HiOutlineArrowRight size={15} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-success-300 text-success-700 text-sm font-medium hover:bg-success-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500"
                onClick={() => {/* TODO: navigate to generic medicine detail page */}}
                aria-label={`View full details for ${name}`}
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

export default RecommendedGenericCard
