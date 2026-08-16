/**
 * Component: PopularMedicinesSection
 *
 * Purpose:
 *   Displays a grid of popular medicine chips that users can click
 *   to immediately search for that medicine, reducing typing effort.
 *
 * Responsibilities:
 *   - Render MedicineChip components in a responsive wrap grid
 *   - Each chip shows a medicine icon + name
 *   - Clicking a chip triggers an onSearch callback (navigation placeholder)
 *   - Section title with a healthcare icon
 *
 * Dependencies:
 *   - React Icons (hi2, md)
 *
 * Backend readiness:
 *   - POPULAR_MEDICINES placeholder → GET /api/v1/medicines/popular
 *   - Replace the static array with API data in Module 7B.
 *
 * Accessibility:
 *   - Each chip is a <button> with descriptive aria-label
 *   - Section uses aria-labelledby linked to the h2
 *   - role="list" + role="listitem" for screen reader enumeration
 */

import { MdMedication } from 'react-icons/md'
import { HiOutlineFire } from 'react-icons/hi2'

// ======================================
// Popular medicine data
// TODO: Replace with GET /api/v1/medicines/popular in Module 7B
// ======================================
const POPULAR_MEDICINES = [
  { id: 1,  name: 'Paracetamol',   category: 'Analgesic'     },
  { id: 2,  name: 'Dolo 650',      category: 'Analgesic'     },
  { id: 3,  name: 'Crocin',        category: 'Analgesic'     },
  { id: 4,  name: 'Cetirizine',    category: 'Antihistamine' },
  { id: 5,  name: 'Azithromycin',  category: 'Antibiotic'    },
  { id: 6,  name: 'Vitamin D3',    category: 'Supplement'    },
  { id: 7,  name: 'ORS',           category: 'Electrolytes'  },
  { id: 8,  name: 'Pantoprazole',  category: 'Antacid'       },
  { id: 9,  name: 'Amoxicillin',   category: 'Antibiotic'    },
  { id: 10, name: 'Metformin',     category: 'Antidiabetic'  },
  { id: 11, name: 'Omeprazole',    category: 'Antacid'       },
  { id: 12, name: 'Vitamin C',     category: 'Supplement'    },
]

// ======================================
// MedicineChip sub-component
// ======================================
function MedicineChip({ medicine, onSearch }) {
  return (
    <li role="listitem">
      <button
        type="button"
        onClick={() => onSearch?.(medicine.name)}
        aria-label={`Search for ${medicine.name} — ${medicine.category}`}
        className={[
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-full',
          'border border-slate-200 bg-white',
          'text-sm font-medium text-slate-700',
          'hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50',
          'hover:shadow-sm hover:-translate-y-0.5',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        ].join(' ')}
      >
        <MdMedication
          size={15}
          className="text-primary-400 shrink-0"
          aria-hidden="true"
        />
        {medicine.name}
      </button>
    </li>
  )
}

// ======================================
// Popular Medicines Section
// ======================================
function PopularMedicinesSection({ onSearch }) {
  return (
    <section aria-labelledby="popular-medicines-heading" className="py-4">

      {/* ====================================== */}
      {/* Popular Medicines Header               */}
      {/* ====================================== */}
      <div className="flex items-center gap-1.5 mb-4">
        <HiOutlineFire
          size={16}
          className="text-warning-500"
          aria-hidden="true"
        />
        <h2
          id="popular-medicines-heading"
          className="text-sm font-semibold text-slate-800"
        >
          Popular Medicines
        </h2>
        {/* API placeholder note — visible only in development */}
        <span
          className="ml-1 text-[10px] text-slate-400"
          aria-hidden="true"
          title="Will be populated from GET /api/v1/medicines/popular"
        >
          {/* TODO: data from GET /api/v1/medicines/popular */}
        </span>
      </div>

      {/* ====================================== */}
      {/* Medicine Chips                         */}
      {/* ====================================== */}
      <ul
        className="flex flex-wrap gap-2"
        role="list"
        aria-label="Popular medicines — click to search"
      >
        {POPULAR_MEDICINES.map((medicine) => (
          <MedicineChip
            key={medicine.id}
            medicine={medicine}
            onSearch={onSearch}
          />
        ))}
      </ul>

    </section>
  )
}

export default PopularMedicinesSection
