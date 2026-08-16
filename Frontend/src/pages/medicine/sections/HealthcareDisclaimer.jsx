/**
 * Component: HealthcareDisclaimer
 *
 * Description:
 *   Professional medical disclaimer card displayed at the bottom
 *   of the Medicine Details page. Required for all healthcare apps.
 *
 * Responsibilities:
 *   - Display the standard healthcare disclaimer text
 *   - Visual "Information" style card — non-alarming but visible
 */

import { HiOutlineInformationCircle } from 'react-icons/hi2'

// =====================================================
// Healthcare Disclaimer
// =====================================================
function HealthcareDisclaimer() {
  return (
    <aside
      aria-label="Healthcare disclaimer"
      role="note"
      className="flex items-start gap-3 p-4 rounded-xl bg-info-50 border border-info-200"
    >
      <HiOutlineInformationCircle
        size={18}
        className="text-info-600 shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="text-xs font-semibold text-info-800">Healthcare Disclaimer</p>
        <p className="text-xs text-info-700 leading-relaxed">
          This application is intended to assist users in identifying medicines and generic
          alternatives. Information provided here is for educational purposes only and should
          not be used as a substitute for professional medical advice. Always consult a
          qualified healthcare professional before taking any medication. Medicine availability,
          prices, and stock status are subject to change.
        </p>
      </div>
    </aside>
  )
}

export default HealthcareDisclaimer
