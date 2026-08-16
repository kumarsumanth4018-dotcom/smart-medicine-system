/**
 * Component: CompareBar
 *
 * Description:
 *   Floating bottom bar that appears when compare mode is active
 *   and at least one medicine is selected. Shows selected medicine
 *   names and a "Compare Now" CTA.
 *
 * Responsibilities:
 *   - Display up to 4 selected medicine slots
 *   - Show medicine name in each slot (or empty placeholder)
 *   - Allow individual deselection from the bar
 *   - Provide Compare Now button (placeholder — Module 7B Part 2)
 *
 * Props:
 *   selectedMedicines {Array}    — array of selected medicine objects
 *   maxCount          {number}   — max allowed (default 4)
 *   onRemove          {Function} — (id) => void
 *   onCompare         {Function} — triggers comparison view
 *   onClear           {Function} — clears all selections
 *
 * Backend readiness:
 *   - onCompare → navigate to compare page / modal in Module 7B Part 2
 */

import { HiOutlineXMark, HiOutlineArrowsRightLeft } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

const MAX_COMPARE = 4

// ======================================
// Compare Bar
// ======================================
function CompareBar({
  selectedMedicines = [],
  onRemove,
  onCompare,
  onClear,
}) {
  if (!selectedMedicines.length) return null

  const slots = Array.from({ length: MAX_COMPARE }).map((_, i) => selectedMedicines[i] ?? null)
  const canCompare = selectedMedicines.length >= 2

  return (
    <div
      role="status"
      aria-label={`${selectedMedicines.length} medicines selected for comparison`}
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[400] w-[calc(100%-2rem)] max-w-3xl"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-primary-200 shadow-xl">

        {/* Icon */}
        <HiOutlineArrowsRightLeft
          size={18}
          className="text-primary-600 shrink-0"
          aria-hidden="true"
        />

        {/* Slots */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {slots.map((med, i) => (
            <div
              key={i}
              className={[
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border min-w-[140px] shrink-0',
                med
                  ? 'border-primary-200 bg-primary-50 text-primary-800'
                  : 'border-dashed border-slate-200 text-slate-300',
              ].join(' ')}
            >
              {med ? (
                <>
                  <MdMedication size={13} className="text-primary-500 shrink-0" aria-hidden="true" />
                  <span className="font-medium truncate flex-1">{med.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemove?.(med.id)}
                    aria-label={`Remove ${med.name} from comparison`}
                    className="text-primary-400 hover:text-danger-500 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400 rounded"
                  >
                    <HiOutlineXMark size={12} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <span className="text-[10px] w-full text-center">
                  Select medicine {i + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear all comparison selections"
            className="text-xs text-slate-400 hover:text-danger-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 rounded"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={!canCompare}
            aria-label={canCompare ? `Compare ${selectedMedicines.length} medicines` : 'Select at least 2 medicines to compare'}
            className={[
              'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              canCompare
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            Compare {selectedMedicines.length > 0 ? `(${selectedMedicines.length})` : ''}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CompareBar
