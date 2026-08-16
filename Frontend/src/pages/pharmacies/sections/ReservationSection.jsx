/**
 * Component: ReservationSection
 *
 * Description:
 *   Placeholder UI for future medicine reservation functionality.
 *   Displays reservation options for both the brand and generic medicine.
 *
 * Backend readiness:
 *   - Reserve → POST /api/v1/pharmacies/:id/reserve
 *   - Status  → GET  /api/v1/reservations/:reservationId
 *   Both deferred to future module.
 */

import { HiOutlineCalendarDays, HiOutlineCheckBadge, HiOutlineClock } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

// =======================================================
// Reservation Section
// =======================================================
function ReservationSection({ pharmacyId }) {
  function handleReserve(type) {
    // TODO: POST /api/v1/pharmacies/:id/reserve { medicineType: type }
  }

  return (
    <section aria-labelledby="reservation-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineCalendarDays size={18} className="text-success-600" aria-hidden="true" />
          <h2 id="reservation-heading" className="text-base font-bold text-slate-900">
            Reserve Medicine
          </h2>
          <Badge variant="neutral" size="sm">Coming Soon</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Reserve branded */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <MdMedication size={16} className="text-slate-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-700">Reserve Brand Medicine</span>
            </div>
            <p className="text-[11px] text-slate-500">Crocin 500 — ₹120/strip</p>
            <button
              type="button"
              onClick={() => handleReserve('brand')}
              disabled
              className="w-full py-2 rounded-lg bg-slate-200 text-slate-400 text-xs font-medium cursor-not-allowed"
              aria-label="Reserve branded medicine (coming soon)"
            >
              Reserve — Coming Soon
            </button>
          </div>

          {/* Reserve generic */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-success-200 bg-success-50">
            <div className="flex items-center gap-2">
              <MdMedication size={16} className="text-success-600" aria-hidden="true" />
              <span className="text-xs font-semibold text-success-800">Reserve Generic (Recommended)</span>
            </div>
            <p className="text-[11px] text-success-700">Paracetamol IP 500mg — ₹18/strip</p>
            <button
              type="button"
              onClick={() => handleReserve('generic')}
              disabled
              className="w-full py-2 rounded-lg bg-success-200 text-success-600 text-xs font-medium cursor-not-allowed"
              aria-label="Reserve generic medicine (coming soon)"
            >
              Reserve — Coming Soon
            </button>
          </div>
        </div>

        {/* Status placeholder */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
          <HiOutlineClock size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
          <div>
            <span className="font-medium text-slate-600">Reservation Status: </span>
            {/* TODO: reservation status from GET /api/v1/reservations */}
            No active reservation
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-3">
          {/* TODO: reservation feature requires POST /api/v1/pharmacies/:id/reserve */}
          Reservation feature will be available after backend integration.
        </p>
      </div>
    </section>
  )
}

export default ReservationSection
