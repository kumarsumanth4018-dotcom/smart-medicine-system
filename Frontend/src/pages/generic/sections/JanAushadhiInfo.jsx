/**
 * Component: JanAushadhiInfo
 *
 * Description:
 *   Educational card about the PM Jan Aushadhi Pariyojana (PMJAP)
 *   initiative and the benefits of generic medicines. Uses factual,
 *   sourced content. No unsupported claims.
 *
 * Responsibilities:
 *   - Explain what PMJAP is
 *   - Why generic medicines are affordable
 *   - Benefits of choosing generics
 *   - Source attribution
 */

import {
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'

const BENEFITS = [
  'Generic medicines contain the same active ingredient, strength, and dosage form as branded medicines.',
  'All PMJAP medicines are manufactured by WHO-GMP certified facilities and quality-tested.',
  'Generic medicines cost significantly less because they do not carry the R&D and marketing expenses of original brands.',
  'Available at over 10,000 Jan Aushadhi Kendras across India, covering all states and union territories.',
  'Doctors across India are encouraged to prescribe generic medicines per MCI/NMC guidelines.',
]

// =====================================================
// PM Jan Aushadhi Information
// =====================================================
function JanAushadhiInfo() {
  return (
    <section aria-labelledby="janaushadhi-info-heading">

      {/* =====================================================
          PM Jan Aushadhi Information
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 shrink-0">
            <MdLocalPharmacy size={22} className="text-primary-700" aria-hidden="true" />
          </div>
          <div>
            <h2 id="janaushadhi-info-heading" className="text-base font-bold text-slate-900">
              About PM Jan Aushadhi
            </h2>
            <p className="text-xs text-slate-500">Government Initiative · Ministry of Chemicals and Fertilizers</p>
          </div>
        </div>

        {/* What is PMJAP */}
        <div className="mb-5 p-4 rounded-xl bg-primary-50 border border-primary-100">
          <div className="flex items-start gap-2 mb-2">
            <HiOutlineBuildingLibrary size={15} className="text-primary-600 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold text-primary-800">
              Pradhan Mantri Jan Aushadhi Pariyojana (PMJAP)
            </p>
          </div>
          <p className="text-xs text-primary-700 leading-relaxed">
            PMJAP is a campaign launched by the Department of Pharmaceuticals, Government of India,
            to provide quality generic medicines at affordable prices to all citizens through
            dedicated outlets called Jan Aushadhi Kendras.
          </p>
        </div>

        {/* Why affordable */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineInformationCircle size={15} className="text-slate-500" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-800">Why are generic medicines affordable?</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Generic medicines do not need to repeat the extensive clinical trials of the original brand,
            significantly reducing production costs. They compete with other manufacturers, further
            lowering prices through market competition.
          </p>
        </div>

        {/* Benefits list */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Benefits of choosing generics</h3>
          <ul className="space-y-2" role="list">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed" role="listitem">
                <HiOutlineCheckCircle size={14} className="text-success-500 shrink-0 mt-0.5" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Source attribution */}
        <p className="text-[10px] text-slate-400 mt-5 pt-3 border-t border-slate-100">
          Source: pmjanaushadhi.gov.in — Figures are indicative and subject to change.
          This information is educational only. Always consult a healthcare professional.
        </p>
      </div>
    </section>
  )
}

export default JanAushadhiInfo
