/**
 * Component: SimilarMedicinesSection
 *
 * Description:
 *   Horizontal scrolling row of similar medicines.
 *   Reuses the existing MedicineCard component.
 *
 * Backend readiness:
 *   - medicines → GET /api/v1/medicines/:id/similar
 */

import { useNavigate } from 'react-router-dom'
import MedicineCard from '../../../components/cards/MedicineCard'
import { ROUTES } from '../../../constants/routes'

// TODO: replace with GET /api/v1/medicines/:id/similar
const SIMILAR_MEDICINES = [
  { id: 's1', name: 'Crocin 500',         genericName: 'Paracetamol',       manufacturer: 'GSK',          price: 32, mrp: 32, availability: 'available', category: 'Analgesic'  },
  { id: 's2', name: 'Dolo 650',           genericName: 'Paracetamol 650mg', manufacturer: 'Micro Labs',   price: 30, mrp: 30, availability: 'available', category: 'Analgesic'  },
  { id: 's3', name: 'Calpol 250 Susp.',   genericName: 'Paracetamol',       manufacturer: 'GSK',          price: 65, mrp: 65, availability: 'limited',   category: 'Pediatric'  },
  { id: 's4', name: 'Paracip 500',        genericName: 'Paracetamol IP',    manufacturer: 'Cipla',        price: 26, mrp: 30, availability: 'available', category: 'Analgesic'  },
  { id: 's5', name: 'Metacin 500',        genericName: 'Paracetamol',       manufacturer: 'Troikaa',      price: 22, mrp: 28, availability: 'available', category: 'Analgesic'  },
]

// =====================================================
// Similar Medicines Section
// =====================================================
function SimilarMedicinesSection() {
  const navigate = useNavigate()

  function handleViewMedicine(id) {
    // TODO: navigate to medicine detail with real id from API
    navigate(ROUTES.USER.MEDICINE_DETAIL.replace(':id', id))
  }

  return (
    <section aria-labelledby="similar-medicines-heading">

      {/* =====================================================
          Similar Medicines
         ===================================================== */}
      <div>
        <h2
          id="similar-medicines-heading"
          className="text-base font-bold text-slate-900 mb-4"
        >
          Similar Medicines
          {/* TODO: from GET /api/v1/medicines/:id/similar */}
        </h2>

        {/* Horizontal scroll on mobile, grid on larger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {SIMILAR_MEDICINES.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onView={() => handleViewMedicine(medicine.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SimilarMedicinesSection
