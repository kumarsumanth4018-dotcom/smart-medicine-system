/**
 * Component: SavedMedicinesSection
 *
 * Description:
 *   Displays the user's saved medicines with quick actions.
 *   Reuses Badge from ui components.
 *
 * Backend readiness:
 *   - medicines → GET /api/v1/users/me/saved-medicines
 *   - remove    → DELETE /api/v1/users/me/saved-medicines/:id
 */

import { useState } from 'react'
import {
  HiOutlineArrowRight, HiOutlineTrash, HiOutlineShare,
  HiOutlineArrowsRightLeft,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

// TODO: Replace with GET /api/v1/users/me/saved-medicines
const INIT_SAVED = [
  { id: 's1', name: 'Paracetamol IP 500mg', genericAlt: 'Jan Aushadhi Generic', savedDate: '2 days ago', availability: 'available' },
  { id: 's2', name: 'Azithromycin 500mg',   genericAlt: 'Generic Available',    savedDate: '5 days ago', availability: 'available' },
  { id: 's3', name: 'Metformin 500mg',       genericAlt: 'Jan Aushadhi Generic', savedDate: '1 week ago', availability: 'limited'   },
  { id: 's4', name: 'Cetirizine 10mg',       genericAlt: 'Generic Available',    savedDate: '2 weeks ago',availability: 'available' },
]

const AVAIL = {
  available: { variant: 'success', label: 'In Stock'      },
  limited:   { variant: 'warning', label: 'Limited Stock' },
  unavailable:{ variant: 'danger', label: 'Out of Stock'  },
}

function SavedMedicineCard({ medicine, onRemove }) {
  const avail = AVAIL[medicine.availability] ?? AVAIL.available
  return (
    <article
      aria-label={medicine.name}
      className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 shrink-0">
        <MdMedication size={20} className="text-primary-600" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 truncate">{medicine.name}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{medicine.genericAlt}</p>
          </div>
          <Badge variant={avail.variant} dot size="sm">{avail.label}</Badge>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Saved {medicine.savedDate}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Link
            to={ROUTES.USER.SEARCH}
            aria-label={`View details for ${medicine.name}`}
            className="flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <HiOutlineArrowRight size={11} aria-hidden="true" /> View
          </Link>
          <button type="button" aria-label={`Compare ${medicine.name}`} className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
            <HiOutlineArrowsRightLeft size={11} aria-hidden="true" /> Compare
          </button>
          <button type="button" aria-label={`Share ${medicine.name}`} className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-secondary-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
            <HiOutlineShare size={11} aria-hidden="true" /> Share
          </button>
          <button
            type="button"
            onClick={() => onRemove(medicine.id)}
            aria-label={`Remove ${medicine.name} from saved`}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-danger-500 px-2 py-1 rounded-lg hover:bg-danger-50 transition-colors ml-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400"
          >
            <HiOutlineTrash size={11} aria-hidden="true" /> Remove
          </button>
        </div>
      </div>
    </article>
  )
}

// ======================================================
// Saved Medicines
// ======================================================
function SavedMedicinesSection() {
  const [items, setItems] = useState(INIT_SAVED)

  return (
    <section aria-labelledby="saved-medicines-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="saved-medicines-heading" className="text-base font-bold text-slate-900">
          Saved Medicines
        </h2>
        <Badge variant="primary" size="sm">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">No saved medicines yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
          {items.map((m) => (
            <div key={m.id} role="listitem">
              <SavedMedicineCard medicine={m} onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default SavedMedicinesSection
