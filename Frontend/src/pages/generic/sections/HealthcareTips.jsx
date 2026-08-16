/**
 * Component: HealthcareTips
 *
 * Description:
 *   Educational healthcare tips card. Uses factual, verified content only.
 *   No unsupported medical claims.
 *
 * Responsibilities:
 *   - Display 6 practical, evidence-based healthcare tips
 *   - Professional styling consistent with healthcare platform tone
 */

import { HiOutlineLightBulb, HiOutlineCheckCircle } from 'react-icons/hi2'

const TIPS = [
  {
    id: 't1',
    tip: 'Store medicines in a cool, dry place away from direct sunlight and moisture unless otherwise instructed on the packaging.',
  },
  {
    id: 't2',
    tip: 'Always consult your doctor or pharmacist before switching from a branded medicine to a generic alternative.',
  },
  {
    id: 't3',
    tip: 'Verify the dosage and strength when purchasing generic medicines — the same active ingredient may be available in multiple strengths.',
  },
  {
    id: 't4',
    tip: 'Generic medicines contain the same active ingredients as branded medicines and must meet the same quality, safety, and efficacy standards.',
  },
  {
    id: 't5',
    tip: 'Check the expiry date printed on every medicine pack before purchase. Never use expired medicines.',
  },
  {
    id: 't6',
    tip: 'Jan Aushadhi medicines are manufactured in WHO-GMP certified facilities. Quality concerns can be reported at pmjanaushadhi.gov.in.',
  },
]

// ======================================================
// Smart Healthcare Tips
// ======================================================
function HealthcareTips() {
  return (
    <section aria-labelledby="healthcare-tips-heading">

      {/* ======================================================
          Smart Healthcare Tips
         ====================================================== */}
      <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineLightBulb size={18} className="text-primary-600" aria-hidden="true" />
          <h2 id="healthcare-tips-heading" className="text-base font-bold text-slate-900">
            Smart Healthcare Tips
          </h2>
        </div>

        <ul className="space-y-3" role="list">
          {TIPS.map((t) => (
            <li key={t.id} className="flex items-start gap-3" role="listitem">
              <HiOutlineCheckCircle
                size={15}
                className="text-primary-500 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-slate-600 leading-relaxed">{t.tip}</p>
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-primary-400 mt-4 pt-3 border-t border-primary-100">
          All tips are for general educational purposes. Always follow advice from qualified healthcare professionals.
        </p>
      </div>
    </section>
  )
}

export default HealthcareTips
