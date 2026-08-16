/**
 * Component: SelectedMedicineSummary
 *
 * Description:
 *   Summary card showing the branded medicine the user selected,
 *   providing context before displaying generic alternatives.
 *
 * Responsibilities:
 *   - Display medicine name, brand, manufacturer, composition,
 *     strength, category, and prescription status
 *   - Medicine image placeholder
 *   - Availability badge
 *
 * Backend readiness:
 *   - medicine → GET /api/v1/medicines/:id
 */

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

function MedImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
    >
      <MdMedication size={40} className="text-slate-300" />
      <span className="text-[9px] text-slate-400 mt-1">Image</span>
    </div>
  )
}

function FieldRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-semibold text-slate-400 w-28 shrink-0">{label}</span>
      <span className="text-xs text-slate-700">{value}</span>
    </div>
  )
}

// =====================================================
// Selected Medicine Summary
// =====================================================
function SelectedMedicineSummary({ medicine = {} }) {
  // TODO: replace with GET /api/v1/medicines/:id
  const {
    name             = 'Crocin 500',
    brandName        = 'GlaxoSmithKline',
    manufacturer     = 'GlaxoSmithKline (GSK)',
    composition      = 'Paracetamol IP 500mg',
    strength         = '500mg',
    category         = 'Analgesic / Antipyretic',
    prescriptionReqd = false,
    availability     = 'available',
  } = medicine

  const availConfig = {
    available:   { variant: 'success', label: 'In Stock'     },
    unavailable: { variant: 'danger',  label: 'Out of Stock' },
    limited:     { variant: 'warning', label: 'Limited'      },
  }
  const avail = availConfig[availability] ?? availConfig.available

  return (
    <section aria-labelledby="selected-medicine-heading">

      {/* =====================================================
          Selected Medicine Summary
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2
          id="selected-medicine-heading"
          className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" aria-hidden="true" />
          Selected Branded Medicine
        </h2>

        <div className="grid grid-cols-[100px_1fr] gap-5 items-start">
          {/* Image placeholder */}
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
            <MedImagePlaceholder />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-2">
              <h3 className="text-base font-extrabold text-slate-900">{name}</h3>
              <Badge variant={avail.variant} dot size="sm">{avail.label}</Badge>
              {prescriptionReqd && <Badge variant="warning" size="sm">Rx</Badge>}
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1">
              <FieldRow label="Brand"         value={brandName}    />
              <FieldRow label="Manufacturer"  value={manufacturer} />
              <FieldRow label="Composition"   value={composition}  />
              <FieldRow label="Strength"      value={strength}     />
              <FieldRow label="Category"      value={category}     />
              <FieldRow
                label="Prescription"
                value={prescriptionReqd ? 'Required (Rx)' : 'Not Required (OTC)'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SelectedMedicineSummary
