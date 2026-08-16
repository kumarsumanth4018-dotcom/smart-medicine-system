/**
 * Component: PriceComparisonSection
 *
 * Description:
 *   Side-by-side price comparison between the branded medicine and
 *   its Jan Aushadhi generic alternative, with savings calculation.
 *
 * Responsibilities:
 *   - Display brand price, generic price, savings amount, savings %
 *   - Visual progress bar showing relative price difference
 *   - Savings badge
 *
 * Backend readiness:
 *   - prices → GET /api/v1/medicines/:id/price-comparison
 *   All values are placeholders.
 */

import { HiOutlineCurrencyRupee } from 'react-icons/hi2'
import Badge from '../../../components/ui/Badge'

// =====================================================
// Price Comparison Section
// =====================================================
function PriceComparisonSection({ prices = {} }) {
  // TODO: replace with data from GET /api/v1/medicines/:id/price-comparison
  const {
    brandName    = 'Branded Medicine',
    brandPrice   = 120,
    genericName  = 'Jan Aushadhi Generic',
    genericPrice = 38,
  } = prices

  const savings        = brandPrice - genericPrice
  const savingsPct     = Math.round((savings / brandPrice) * 100)
  const genericBarPct  = Math.round((genericPrice / brandPrice) * 100)

  return (
    <section aria-labelledby="price-comparison-heading">

      {/* =====================================================
          Price Comparison
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiOutlineCurrencyRupee size={18} className="text-primary-600" aria-hidden="true" />
          <h2
            id="price-comparison-heading"
            className="text-base font-bold text-slate-900"
          >
            Price Comparison
          </h2>
          <Badge variant="success" size="sm">{savingsPct}% savings available</Badge>
        </div>

        {/* Price cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Brand price */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Brand Price
            </p>
            <p className="text-3xl font-extrabold text-slate-700">₹{brandPrice}</p>
            <p className="text-xs text-slate-400 truncate">{brandName}</p>
            <div className="w-full h-2 bg-slate-300 rounded-full mt-1" />
          </div>

          {/* Savings indicator */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-success-50 border border-success-200 text-center">
            <p className="text-[11px] font-semibold text-success-500 uppercase tracking-wider">
              You Save
            </p>
            <p className="text-3xl font-extrabold text-success-700">₹{savings}</p>
            <Badge variant="success" size="sm">{savingsPct}% off</Badge>
            <p className="text-[10px] text-success-500 mt-1">
              {/* TODO: Actual savings from API */}
              Estimated savings
            </p>
          </div>

          {/* Generic price */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary-50 border border-primary-200 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge variant="primary" size="sm">⭐ Best</Badge>
            </div>
            <p className="text-[11px] font-semibold text-primary-500 uppercase tracking-wider">
              Generic Price
            </p>
            <p className="text-3xl font-extrabold text-primary-700">₹{genericPrice}</p>
            <p className="text-xs text-primary-400 truncate">{genericName}</p>
            {/* Relative bar */}
            <div className="w-full h-2 bg-primary-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${genericBarPct}%` }}
                aria-label={`Generic price is ${genericBarPct}% of brand price`}
              />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-slate-400 mt-4 text-center">
          {/* TODO: prices from GET /api/v1/medicines/:id/price-comparison */}
          Prices shown are indicative. Actual prices may vary by pharmacy and location.
        </p>
      </div>
    </section>
  )
}

export default PriceComparisonSection
