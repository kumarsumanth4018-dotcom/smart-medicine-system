/**
 * Component: MedicineOverviewSection
 *
 * Description:
 *   Hero overview card for the Medicine Details page.
 *   Displays the medicine image placeholder, all identity fields,
 *   smart badges, and metadata in a two-column layout.
 *
 * Responsibilities:
 *   - Medicine image placeholder (swappable asset)
 *   - Name, generic name, composition, strength, type, category
 *   - Manufacturer, prescription status, last updated
 *   - Availability, Jan Aushadhi, and prescription badges
 *
 * Backend readiness:
 *   - medicine → GET /api/v1/medicines/:id
 */

import { HiOutlineBuildingOffice2, HiOutlineCalendar, HiOutlineShieldCheck } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

// =====================================================
// Medicine Image Placeholder
// Replace with <img src={medicine.imageUrl} /> when available
// =====================================================
function MedicineImageCard({ type, name }) {
  return (
    <div
      aria-label={`Medicine image placeholder for ${name}`}
      className="relative flex flex-col items-center justify-center w-full aspect-square max-w-[220px] mx-auto rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 border-2 border-primary-100 shadow-md overflow-hidden"
    >
      <MdMedication size={64} className="text-primary-200" aria-hidden="true" />
      <span className="mt-2 text-xs font-medium text-primary-400">{type || 'Medicine'}</span>
      {/* TODO: replace with <img src={medicine.imageUrl} alt={name} /> */}
      <span className="absolute bottom-2 right-2 text-[9px] font-semibold text-slate-300 bg-white/80 rounded px-1.5 py-0.5">
        Image placeholder
      </span>
    </div>
  )
}

// =====================================================
// Detail Row helper
// =====================================================
function DetailRow({ label, value, valueClass = '' }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 w-32 shrink-0">{label}</span>
      <span className={`text-xs text-slate-700 flex-1 ${valueClass}`}>{value}</span>
    </div>
  )
}

// =====================================================
// Medicine Overview Section
// =====================================================
function MedicineOverviewSection({ medicine = {} }) {
  const {
    name              = 'Paracetamol 500mg',
    genericName       = 'Acetaminophen',
    composition       = 'Paracetamol IP 500mg',
    strength          = '500mg',
    type              = 'Tablet',
    category          = 'Analgesic / Antipyretic',
    manufacturer      = 'Jan Aushadhi (BPPI)',
    prescriptionReqd  = false,
    availability      = 'available',
    isJanAushadhi     = true,
    isGeneric         = true,
    description       = 'Paracetamol is a common pain reliever and fever reducer used for the temporary relief of mild to moderate pain and to reduce fever.',
    // TODO: lastUpdated from API response timestamp
    lastUpdated       = 'July 2025',
  } = medicine

  const availConfig = {
    available:   { variant: 'success', label: 'In Stock',      dot: true },
    unavailable: { variant: 'danger',  label: 'Out of Stock',  dot: true },
    limited:     { variant: 'warning', label: 'Limited Stock', dot: true },
  }
  const avail = availConfig[availability] ?? availConfig.available

  return (
    <section aria-labelledby="medicine-overview-heading">

      {/* =====================================================
          Medicine Overview
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

          {/* ── Left: image + badges ─────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <MedicineImageCard type={type} name={name} />

            {/* Smart badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant={avail.variant} dot={avail.dot} size="sm">
                {avail.label}
              </Badge>
              {isGeneric && (
                <Badge variant="secondary" size="sm">Generic</Badge>
              )}
              {isJanAushadhi && (
                <Badge variant="info" size="sm">Jan Aushadhi</Badge>
              )}
              {prescriptionReqd && (
                <Badge variant="warning" size="sm">Rx Required</Badge>
              )}
            </div>
          </div>

          {/* ── Right: identity + details ────────────────────── */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Name block */}
            <div>
              <div className="flex items-start gap-2 flex-wrap">
                <h1
                  id="medicine-overview-heading"
                  className="text-2xl font-extrabold text-slate-900 leading-tight"
                >
                  {name}
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1 italic">{genericName}</p>
              {description && (
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
              )}
            </div>

            {/* Detail rows */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-1">
              <DetailRow label="Composition"   value={composition} />
              <DetailRow label="Strength"      value={strength} />
              <DetailRow label="Type"          value={type} />
              <DetailRow label="Category"      value={category} />
              <DetailRow label="Manufacturer"  value={manufacturer} />
              <DetailRow
                label="Prescription"
                value={prescriptionReqd ? 'Required (Rx)' : 'Not Required (OTC)'}
                valueClass={prescriptionReqd ? 'text-warning-700 font-medium' : 'text-success-700 font-medium'}
              />
            </div>

            {/* Footer meta */}
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <HiOutlineBuildingOffice2 size={12} aria-hidden="true" />
                {manufacturer}
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineCalendar size={12} aria-hidden="true" />
                {/* TODO: lastUpdated from API */}
                Last updated: {lastUpdated}
              </span>
              {isJanAushadhi && (
                <span className="flex items-center gap-1 text-success-600">
                  <HiOutlineShieldCheck size={12} aria-hidden="true" />
                  BPPI Quality Assured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MedicineOverviewSection
