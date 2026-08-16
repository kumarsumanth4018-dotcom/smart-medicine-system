/**
 * Component: PharmacyTips
 *
 * Description:
 *   Educational pharmacy tips card using factual, professional content.
 *   No unsupported medical claims.
 */

import { HiOutlineLightBulb, HiOutlineCheckCircle } from 'react-icons/hi2'

const TIPS = [
  'Check pharmacy opening hours before visiting — Jan Aushadhi Kendras typically operate from 8 AM to 9 PM.',
  'Confirm medicine availability by calling the pharmacy before making the trip, especially for less common medicines.',
  'Always carry your original prescription when purchasing prescription (Rx) medicines.',
  'Compare the generic medicine name with your prescription to verify it is the correct alternative.',
  'Jan Aushadhi generic medicines are manufactured in WHO-GMP certified facilities and undergo quality testing.',
  'Retain your pharmacy receipt — it may be required for insurance claims or medical records.',
]

function PharmacyTips() {
  return (
    <section aria-labelledby="pharmacy-tips-heading">
      <div className="bg-secondary-50 rounded-2xl border border-secondary-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineLightBulb size={18} className="text-secondary-600" aria-hidden="true" />
          <h2 id="pharmacy-tips-heading" className="text-base font-bold text-slate-900">
            Smart Pharmacy Tips
          </h2>
        </div>
        <ul className="space-y-3" role="list">
          {TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5" role="listitem">
              <HiOutlineCheckCircle size={14} className="text-secondary-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-secondary-400 mt-4 pt-3 border-t border-secondary-100">
          For educational purposes only. Always follow guidance from qualified healthcare professionals.
        </p>
      </div>
    </section>
  )
}

export default PharmacyTips
