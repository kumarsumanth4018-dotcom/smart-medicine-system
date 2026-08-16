/**
 * Component: PharmacyDetailsPanel
 *
 * Description:
 *   Detailed information panel for the selected pharmacy including
 *   medicine availability, stock status, amenities, and actions.
 *
 * Backend readiness:
 *   - pharmacy → GET /api/v1/pharmacies/:id
 *   - availability → GET /api/v1/pharmacies/:id/inventory?medicine=...
 */

import {
  HiOutlineMapPin, HiOutlinePhone, HiOutlineClock,
  HiOutlineStar, HiOutlineBanknotes,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExclamationCircle,
} from 'react-icons/hi2'
import { MdLocalPharmacy, MdAccessible, MdDirectionsCar } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Jan Aushadhi Scheme']

const AVAILABILITY_ROWS = [
  { medicine: 'Paracetamol IP 500mg (Generic)', status: 'available',   batch: 'BAT-2025-07', expiry: 'Dec 2026' },
  { medicine: 'Crocin 500 (Branded)',           status: 'limited',     batch: 'BAT-2025-06', expiry: 'Oct 2026' },
  { medicine: 'Paracetamol IP 650mg (Generic)', status: 'unavailable', batch: '—',           expiry: '—'        },
]

const STATUS_ICON = {
  available:   <HiOutlineCheckCircle   size={15} className="text-success-500" aria-hidden="true" />,
  limited:     <HiOutlineExclamationCircle size={15} className="text-warning-500" aria-hidden="true" />,
  unavailable: <HiOutlineXCircle       size={15} className="text-danger-500" aria-hidden="true" />,
}
const STATUS_CONFIG = {
  available:   { variant: 'success', label: 'In Stock'      },
  limited:     { variant: 'warning', label: 'Limited'       },
  unavailable: { variant: 'danger',  label: 'Out of Stock'  },
}

// =======================================================
// Pharmacy Details Panel
// =======================================================
function PharmacyDetailsPanel({ pharmacyId }) {
  if (!pharmacyId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <MdLocalPharmacy size={40} className="text-slate-200 mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-500">Select a pharmacy from the list or map</p>
        <p className="text-xs text-slate-400 mt-1">Pharmacy details will appear here</p>
      </div>
    )
  }

  // TODO: fetch pharmacy by pharmacyId from GET /api/v1/pharmacies/:id
  const pharmacy = {
    id: pharmacyId,
    name: 'Jan Aushadhi Kendra — Andheri West',
    address: '12, Veera Desai Road, Andheri West, Mumbai 400053',
    phone: '+91 98765 43210',
    hours: '8:00 AM – 9:00 PM',
    rating: 4.5,
    ratingCount: 128,
    isOpen: true,
    isJanAushadhi: true,
    waitingTime: '~10 minutes',
    hasParking: true,
    isAccessible: true,
  }

  return (
    <section aria-labelledby="pharmacy-details-heading">

      {/* =======================================================
          Pharmacy Details
         ======================================================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Image placeholder */}
        <div
          aria-hidden="true"
          className="h-32 bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center border-b border-slate-100"
        >
          <MdLocalPharmacy size={56} className="text-secondary-200" />
          <span className="absolute text-[10px] text-slate-300 mt-16">Pharmacy image placeholder</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Name + badges */}
          <div>
            <h2 id="pharmacy-details-heading" className="text-base font-bold text-slate-900 mb-2">
              {pharmacy.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant={pharmacy.isOpen ? 'success' : 'danger'} dot size="sm">
                {pharmacy.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
              {pharmacy.isJanAushadhi && <Badge variant="info" size="sm">Jan Aushadhi</Badge>}
              <Badge variant="neutral" size="sm">
                <HiOutlineStar size={10} className="text-warning-400" aria-hidden="true" />
                {pharmacy.rating} ({pharmacy.ratingCount})
              </Badge>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <HiOutlineMapPin size={13} className="text-secondary-500 mt-0.5 shrink-0" aria-hidden="true" />
              {pharmacy.address}
            </div>
            <div className="flex items-center gap-2">
              <HiOutlinePhone size={13} className="text-secondary-500 shrink-0" aria-hidden="true" />
              <a href={`tel:${pharmacy.phone?.replace(/\s/g,'')}`} className="hover:text-secondary-600 transition-colors">
                {pharmacy.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineClock size={13} className="text-secondary-500 shrink-0" aria-hidden="true" />
              {pharmacy.hours}
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineClock size={13} className="text-warning-500 shrink-0" aria-hidden="true" />
              {/* TODO: estimated waiting time from API */}
              Estimated wait: {pharmacy.waitingTime}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                <HiOutlineBanknotes size={10} aria-hidden="true" />
                {m}
              </span>
            ))}
            {pharmacy.hasParking && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                <MdDirectionsCar size={10} aria-hidden="true" />Parking
              </span>
            )}
            {pharmacy.isAccessible && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 flex items-center gap-1">
                <MdAccessible size={10} aria-hidden="true" />Accessible
              </span>
            )}
          </div>

          {/* Medicine availability table */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Medicine Availability</p>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              {AVAILABILITY_ROWS.map((row) => {
                const cfg = STATUS_CONFIG[row.status] ?? STATUS_CONFIG.available
                return (
                  <div key={row.medicine} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-50 last:border-0 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {STATUS_ICON[row.status]}
                      <span className="truncate text-slate-700">{row.medicine}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              {/* TODO: stock data from GET /api/v1/pharmacies/:id/inventory */}
              Availability is indicative. Confirm with pharmacy before visiting.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PharmacyDetailsPanel
