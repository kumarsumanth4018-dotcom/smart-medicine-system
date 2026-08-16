/**
 * Component: CompositionComparison
 *
 * Description:
 *   Side-by-side composition table comparing the branded medicine
 *   and its generic alternative to demonstrate bioequivalence.
 *
 * Responsibilities:
 *   - Brand vs generic composition columns
 *   - Highlight matching rows with a green checkmark
 *   - Strength, dosage form, equivalent match row
 *
 * Backend readiness:
 *   - composition → GET /api/v1/medicines/:id/composition-comparison
 */

import { HiOutlineCheckCircle, HiOutlineEquals } from 'react-icons/hi2'
import Badge from '../../../components/ui/Badge'

// =====================================================
// Composition Comparison
// =====================================================
function CompositionComparison({ comparison = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id/composition-comparison
  const {
    brandName    = 'Crocin 500',
    genericName  = 'Paracetamol IP 500mg',
    rows         = [
      { label: 'Active Ingredient', brand: 'Paracetamol IP',   generic: 'Paracetamol IP',   match: true  },
      { label: 'Strength',          brand: '500mg',             generic: '500mg',             match: true  },
      { label: 'Dosage Form',       brand: 'Tablet',            generic: 'Tablet',            match: true  },
      { label: 'Route',             brand: 'Oral',              generic: 'Oral',              match: true  },
      { label: 'Excipients',        brand: 'Proprietary blend', generic: 'Standard IP grade', match: false },
    ],
  } = comparison

  return (
    <section aria-labelledby="composition-comparison-heading">

      {/* =====================================================
          Composition Comparison
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiOutlineEquals size={18} className="text-primary-600" aria-hidden="true" />
          <h2 id="composition-comparison-heading" className="text-base font-bold text-slate-900">
            Composition Comparison
          </h2>
          <Badge variant="success" size="sm">Bioequivalent</Badge>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_40px] bg-slate-50 border-b border-slate-200">
            <div className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Property</div>
            <div className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{brandName}</div>
            <div className="px-4 py-2.5 text-[11px] font-semibold text-primary-600 uppercase tracking-wider">{genericName}</div>
            <div className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"></div>
          </div>

          {/* Rows */}
          {rows.map(({ label, brand, generic, match }) => (
            <div
              key={label}
              className={[
                'grid grid-cols-[1fr_1fr_1fr_40px] border-b border-slate-100 last:border-0 transition-colors',
                match ? 'hover:bg-success-50/30' : 'hover:bg-slate-50',
              ].join(' ')}
            >
              <div className="px-4 py-3 text-xs font-medium text-slate-600">{label}</div>
              <div className="px-4 py-3 text-xs text-slate-700">{brand}</div>
              <div className="px-4 py-3 text-xs font-medium text-slate-800">{generic}</div>
              <div className="px-4 py-3 flex items-center justify-center">
                {match ? (
                  <HiOutlineCheckCircle size={16} className="text-success-500" aria-label="Match" />
                ) : (
                  <span className="text-slate-300 text-xs" aria-label="Different">≈</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 mt-3">
          {/* TODO: composition data from GET /api/v1/medicines/:id/composition-comparison */}
          Composition data is a placeholder. Verified data will be loaded from the medicines database.
        </p>
      </div>
    </section>
  )
}

export default CompositionComparison
