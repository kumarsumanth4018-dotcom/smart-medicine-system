/**
 * Component: PharmacySearchSummary
 *
 * Description:
 *   Context card at the top of the Nearby Pharmacies page showing
 *   the medicine being searched, its recommended generic, the user's
 *   current location placeholder, and the pharmacy count.
 *
 * Backend readiness:
 *   - medicine    → from URL search param or context
 *   - pharmacyCount → GET /api/v1/pharmacies/nearby?medicine=...&limit=...
 *   - userLocation  → Geolocation API (future module)
 */

import { HiOutlineMapPin, HiOutlineBuildingStorefront } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

// =======================================================
// Pharmacy Search Summary
// =======================================================
function PharmacySearchSummary({ medicine = {}, pharmacyCount = 8 }) {
  // TODO: medicine from URL params / search context
  const {
    name        = 'Crocin 500',
    genericName = 'Paracetamol IP 500mg',
  } = medicine

  return (
    <section aria-labelledby="pharmacy-summary-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">

          {/* Selected medicine */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 shrink-0">
              <MdMedication size={20} className="text-slate-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Selected Medicine</p>
              <p className="text-sm font-bold text-slate-900">{name}</p>
              <p className="text-[11px] text-slate-500">{genericName}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 shrink-0">
              <HiOutlineMapPin size={20} className="text-secondary-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Your Location</p>
              <p className="text-sm font-bold text-slate-900">Andheri West, Mumbai</p>
              <p className="text-[11px] text-slate-400">
                {/* TODO: from Geolocation API */}
                Location placeholder
              </p>
            </div>
          </div>

          {/* Pharmacy count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 shrink-0">
              <HiOutlineBuildingStorefront size={20} className="text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nearby Pharmacies</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {/* TODO: pharmacyCount from GET /api/v1/pharmacies/nearby */}
                  {pharmacyCount} found
                </p>
                <Badge variant="success" dot size="sm">In stock</Badge>
              </div>
              <p className="text-[11px] text-slate-400">Within 5 km radius</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default PharmacySearchSummary
