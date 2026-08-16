/**
 * Component: SavingsBreakdown
 *
 * Description:
 *   Visual breakdown of estimated monthly and yearly savings if
 *   the user switches to the generic alternative consistently.
 *
 * Responsibilities:
 *   - Monthly savings card
 *   - Yearly savings card
 *   - Percentage saved progress bar
 *
 * Backend readiness:
 *   - savings → calculated by GET /api/v1/medicines/:id/savings-estimate
 *   All values are placeholders only. No calculation logic.
 */

import { HiOutlineCurrencyRupee } from 'react-icons/hi2'

// =====================================================
// Savings Breakdown
// =====================================================
function SavingsBreakdown({ savings = {} }) {
  // TODO: replace with data from GET /api/v1/medicines/:id/savings-estimate
  const {
    perUnit       = 102,
    monthly       = 306,   // assuming 3 tablets/day
    yearly        = 3672,
    savingsPct    = 85,
    brandPrice    = 120,
    genericPrice  = 18,
  } = savings

  return (
    <section aria-labelledby="savings-breakdown-heading">

      {/* =====================================================
          Savings Breakdown
         ===================================================== */}
      <div className="bg-gradient-to-r from-success-600 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
        <h2 id="savings-breakdown-heading" className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <HiOutlineCurrencyRupee size={18} aria-hidden="true" />
          Estimated Savings Breakdown
        </h2>
        <p className="text-xs text-success-100 mb-5">
          {/* TODO: calculated from prescription frequency via API */}
          Based on a typical prescription of 3 tablets/day. Actual savings depend on dosage.
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
            <p className="text-[10px] font-semibold text-success-100 uppercase tracking-wider mb-1">Per Tablet</p>
            <p className="text-2xl font-extrabold text-white">₹{perUnit}</p>
            <p className="text-[10px] text-success-100 mt-0.5">₹{genericPrice} vs ₹{brandPrice}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
            <p className="text-[10px] font-semibold text-success-100 uppercase tracking-wider mb-1">Monthly</p>
            <p className="text-2xl font-extrabold text-white">₹{monthly}</p>
            <p className="text-[10px] text-success-100 mt-0.5">
              {/* TODO: monthly_savings from API */}
              Placeholder
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm border border-white/30 ring-1 ring-white/30">
            <p className="text-[10px] font-semibold text-success-100 uppercase tracking-wider mb-1">Yearly</p>
            <p className="text-3xl font-extrabold text-white">₹{yearly}</p>
            <p className="text-[10px] text-success-100 mt-0.5">
              {/* TODO: yearly_savings from API */}
              Placeholder
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-success-100 mb-1.5">
            <span>Generic Price (₹{genericPrice})</span>
            <span className="font-bold text-white">{savingsPct}% saved</span>
            <span>Brand Price (₹{brandPrice})</span>
          </div>
          <div
            className="w-full h-3 bg-white/20 rounded-full overflow-hidden"
            role="meter"
            aria-label={`Savings: ${savingsPct}%`}
            aria-valuenow={savingsPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${savingsPct}%` }}
            />
          </div>
          <p className="text-[10px] text-success-100 text-center mt-2">
            {/* TODO: savings calculated by backend from price data */}
            Savings percentage is a placeholder estimate.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SavingsBreakdown
