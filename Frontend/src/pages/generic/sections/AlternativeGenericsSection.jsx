/**
 * Component: AlternativeGenericsSection
 *
 * Description:
 *   Displays all available generic alternatives ranked by recommendation
 *   score. The top-ranked card is highlighted as "Best Recommendation".
 *
 * Responsibilities:
 *   - Render ranked AlternativeCard components
 *   - Highlight rank-1 card with gold border and trophy badge
 *   - Compare, View Details, Select, Save, Share actions (UI only)
 *   - PM Jan Aushadhi badge per card
 *
 * Backend readiness:
 *   - alternatives → GET /api/v1/medicines/:id/alternatives
 *   All data is placeholder. Replace with TanStack Query in Module 9+.
 */

import { useState } from 'react'
import {
  HiOutlineBookmark, HiBookmark,
  HiOutlineShare, HiOutlineArrowRight,
  HiOutlineCheckCircle, HiOutlineShieldCheck,
  HiOutlinePlusCircle, HiOutlineCheckBadge,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

// ======================================================
// Placeholder alternatives data
// TODO: Replace with GET /api/v1/medicines/:id/alternatives
// ======================================================
const ALTERNATIVES = [
  {
    id: 'alt-1',
    rank: 1,
    name: 'Paracetamol IP 500mg',
    manufacturer: 'Jan Aushadhi (BPPI)',
    composition: 'Paracetamol IP 500mg',
    strength: '500mg',
    dosageForm: 'Tablet',
    availability: 'available',
    price: 18,
    brandPrice: 120,
    savingsPct: 85,
    scoreLabel: '98%',
    isJanAushadhi: true,
    isGeneric: true,
  },
  {
    id: 'alt-2',
    rank: 2,
    name: 'Paracetamol IP 650mg',
    manufacturer: 'Jan Aushadhi (BPPI)',
    composition: 'Paracetamol IP 650mg',
    strength: '650mg',
    dosageForm: 'Tablet',
    availability: 'available',
    price: 22,
    brandPrice: 120,
    savingsPct: 82,
    scoreLabel: '95%',
    isJanAushadhi: true,
    isGeneric: true,
  },
  {
    id: 'alt-3',
    rank: 3,
    name: 'Paracetamol 500mg (Cipla)',
    manufacturer: 'Cipla Ltd.',
    composition: 'Paracetamol IP 500mg',
    strength: '500mg',
    dosageForm: 'Tablet',
    availability: 'available',
    price: 26,
    brandPrice: 120,
    savingsPct: 78,
    scoreLabel: '91%',
    isJanAushadhi: false,
    isGeneric: true,
  },
  {
    id: 'alt-4',
    rank: 4,
    name: 'Paracetamol Syrup 120mg/5ml',
    manufacturer: 'Jan Aushadhi (BPPI)',
    composition: 'Paracetamol IP 120mg/5ml',
    strength: '120mg/5ml',
    dosageForm: 'Syrup',
    availability: 'limited',
    price: 28,
    brandPrice: 120,
    savingsPct: 77,
    scoreLabel: '88%',
    isJanAushadhi: true,
    isGeneric: true,
  },
]

const AVAIL_CONFIG = {
  available:   { variant: 'success', label: 'In Stock'      },
  unavailable: { variant: 'danger',  label: 'Out of Stock'  },
  limited:     { variant: 'warning', label: 'Limited Stock' },
}

// ======================================================
// Score ring SVG placeholder
// ======================================================
function ScoreRing({ score = '98%', size = 52 }) {
  const numericScore = parseInt(score, 10) || 0
  const radius = (size / 2) - 5
  const circ   = 2 * Math.PI * radius
  const dash   = (numericScore / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Recommendation score ${score}`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="4" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke="#16a34a" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d" fontFamily="sans-serif">
        {score}
      </text>
    </svg>
  )
}

// ======================================================
// Alternative Card
// ======================================================
function AlternativeCard({ alt, isBest }) {
  const [saved,    setSaved]    = useState(false)
  const [selected, setSelected] = useState(false)
  const avail = AVAIL_CONFIG[alt.availability] ?? AVAIL_CONFIG.available

  return (
    <article
      aria-label={`${isBest ? 'Best recommendation: ' : ''}${alt.name}`}
      className={[
        'relative flex flex-col gap-4 p-5 rounded-2xl bg-white border',
        'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        isBest ? 'border-2 border-success-400 ring-2 ring-success-100' : 'border-slate-100',
      ].join(' ')}
    >
      {/* Best badge ribbon */}
      {isBest && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-success-600 text-white text-[10px] font-bold shadow-md z-10">
          🏆 Best Recommendation
        </div>
      )}

      {/* Top row: rank + score + availability */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Score ring */}
          <div className="shrink-0">
            <ScoreRing score={alt.scoreLabel} />
          </div>
          {/* Name block */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] font-bold text-slate-400">#{alt.rank}</span>
              <Badge variant={avail.variant} dot size="sm">{avail.label}</Badge>
              {alt.isJanAushadhi && <Badge variant="info" size="sm">Jan Aushadhi</Badge>}
              {alt.isGeneric && <Badge variant="secondary" size="sm">Generic</Badge>}
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{alt.name}</h3>
            <p className="text-[11px] text-slate-500">{alt.manufacturer}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-lg font-extrabold text-primary-700">₹{alt.price}</p>
          <p className="text-[10px] text-slate-400 line-through">₹{alt.brandPrice}</p>
          <Badge variant="success" size="sm">{alt.savingsPct}% off</Badge>
        </div>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
        <div><span className="text-[10px] font-semibold text-slate-400 block">Composition</span>{alt.composition}</div>
        <div><span className="text-[10px] font-semibold text-slate-400 block">Strength</span>{alt.strength}</div>
        <div><span className="text-[10px] font-semibold text-slate-400 block">Form</span>{alt.dosageForm}</div>
        <div><span className="text-[10px] font-semibold text-slate-400 block">Save</span><span className="text-success-600 font-semibold">₹{alt.brandPrice - alt.price}</span></div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {/* Select */}
        <button
          type="button"
          onClick={() => setSelected(s => !s)}
          aria-pressed={selected}
          aria-label={selected ? `Deselect ${alt.name}` : `Select ${alt.name}`}
          className={[
            'flex items-center justify-center w-8 h-8 rounded-lg border transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            selected ? 'bg-primary-100 border-primary-400 text-primary-700' : 'border-slate-200 text-slate-400 hover:border-primary-300',
          ].join(' ')}
        >
          {selected ? <HiOutlineCheckBadge size={16} aria-hidden="true" /> : <HiOutlinePlusCircle size={16} aria-hidden="true" />}
        </button>

        {/* View Details */}
        <button
          type="button"
          aria-label={`View details for ${alt.name}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => {/* TODO: navigate to medicine/:id */}}
        >
          View Details <HiOutlineArrowRight size={13} aria-hidden="true" />
        </button>

        {/* Compare */}
        <button
          type="button"
          aria-label={`Compare ${alt.name}`}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:border-primary-300 hover:text-primary-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          title="Compare"
          onClick={() => {/* TODO: add to compare */}}
        >
          <HiOutlineCheckCircle size={15} aria-hidden="true" />
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={() => setSaved(s => !s)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${alt.name} from saved` : `Save ${alt.name}`}
          className={[
            'flex items-center justify-center w-8 h-8 rounded-lg border transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-400',
            saved ? 'bg-warning-100 border-warning-400 text-warning-600' : 'border-slate-200 text-slate-400 hover:border-warning-300',
          ].join(' ')}
        >
          {saved ? <HiBookmark size={15} aria-hidden="true" /> : <HiOutlineBookmark size={15} aria-hidden="true" />}
        </button>

        {/* Share */}
        <button
          type="button"
          aria-label={`Share ${alt.name}`}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:border-secondary-300 hover:text-secondary-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          title="Share"
          onClick={() => {/* TODO: share */}}
        >
          <HiOutlineShare size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

// ======================================================
// Alternative Generics Section
// ======================================================
function AlternativeGenericsSection() {
  return (
    <section aria-labelledby="alternatives-heading">

      {/* ======================================================
          Alternative Generic Medicines
         ====================================================== */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 id="alternatives-heading" className="text-base font-bold text-slate-900">
              All Generic Alternatives
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {/* TODO: count from GET /api/v1/medicines/:id/alternatives */}
              Ranked by composition match and estimated savings
            </p>
          </div>
          <Badge variant="primary" size="sm">{ALTERNATIVES.length} found</Badge>
        </div>

        <div className="flex flex-col gap-4" role="list" aria-label="Generic medicine alternatives">
          {ALTERNATIVES.map((alt) => (
            <div key={alt.id} role="listitem">
              <AlternativeCard alt={alt} isBest={alt.rank === 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AlternativeGenericsSection
