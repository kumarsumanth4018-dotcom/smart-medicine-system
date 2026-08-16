/**
 * Component: SearchResultCard
 *
 * Description:
 *   Rich medicine result card used on the Search Results page.
 *   Extends the basic MedicineCard with additional fields, smart
 *   badges, compare/save/share actions, and a Best Value highlight.
 *
 * Responsibilities:
 *   - Display medicine image placeholder, name, generic name,
 *     composition, manufacturer, strength, type, category
 *   - Render smart availability/value badges
 *   - Support compare checkbox selection (up to 4 medicines)
 *   - Support save (bookmark) toggle with local state
 *   - Support share icon (placeholder)
 *   - Highlight "Best Value" card with premium border + ribbon
 *   - Support grid and list layout modes
 *
 * Props:
 *   medicine     {object}   — medicine data object
 *   isComparing  {boolean}  — whether comparison mode is active
 *   isSelected   {boolean}  — whether this card is selected for compare
 *   onCompare    {Function} — toggle compare selection
 *   onView       {Function} — navigate to medicine detail
 *   isBestValue  {boolean}  — renders the "Best Value" highlight
 *   layout       {'grid'|'list'} — card orientation
 *
 * Dependencies:
 *   - Badge     (components/ui) — reused
 *   - MdMedication, react-icons — healthcare icons
 *
 * Backend readiness:
 *   - onView → navigate to GET /api/v1/medicines/:id
 *   - onSave → POST/DELETE /api/v1/users/me/saved-medicines/:id
 *   - onShare → Web Share API / share dialog (future module)
 *   - onCompare → local UI state only (comparison in Module 7B Part 2)
 */

import { useState } from 'react'
import {
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlineMapPin,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../ui/Badge'

// ── Smart badge configuration ──────────────────────────────────────────────
const AVAILABILITY_CONFIG = {
  available:   { variant: 'success', label: 'In Stock',      dot: true  },
  unavailable: { variant: 'danger',  label: 'Out of Stock',  dot: true  },
  limited:     { variant: 'warning', label: 'Limited Stock', dot: true  },
}

// ── Medicine image placeholder ─────────────────────────────────────────────
function MedicineImagePlaceholder({ type }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg"
    >
      <MdMedication size={32} className="text-primary-300" />
      {type && (
        <span className="absolute bottom-1 left-1 text-[9px] font-medium text-primary-400 bg-white/80 rounded px-1">
          {type}
        </span>
      )}
    </div>
  )
}

// ── Smart badges row ───────────────────────────────────────────────────────
function SmartBadges({ medicine }) {
  const {
    availability = 'available',
    isGeneric, isJanAushadhi, isAffordable, isNewArrival,
    nearbyPharmacyCount,
  } = medicine

  const avail = AVAILABILITY_CONFIG[availability] ?? AVAILABILITY_CONFIG.available

  return (
    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Medicine badges">
      <span role="listitem">
        <Badge variant={avail.variant} dot={avail.dot} size="sm">{avail.label}</Badge>
      </span>
      {isGeneric && (
        <span role="listitem">
          <Badge variant="secondary" size="sm">Generic</Badge>
        </span>
      )}
      {isJanAushadhi && (
        <span role="listitem">
          <Badge variant="info" size="sm" icon={<span aria-hidden="true">🏥</span>}>
            Jan Aushadhi
          </Badge>
        </span>
      )}
      {isAffordable && (
        <span role="listitem">
          <Badge variant="success" size="sm" icon={<span aria-hidden="true">💰</span>}>
            Affordable
          </Badge>
        </span>
      )}
      {isNewArrival && (
        <span role="listitem">
          <Badge variant="accent" size="sm">New</Badge>
        </span>
      )}
      {nearbyPharmacyCount > 0 && (
        <span role="listitem">
          <Badge variant="primary" size="sm" icon={<HiOutlineMapPin size={10} />}>
            {nearbyPharmacyCount} nearby
          </Badge>
        </span>
      )}
    </div>
  )
}

// ── Card action buttons ────────────────────────────────────────────────────
function CardActions({ medicine, isSaved, onToggleSave, isSelected, onCompare, onView, onShare }) {
  return (
    <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-slate-100">
      {/* View Details */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onView?.() }}
        aria-label={`View details for ${medicine.name}`}
        className="flex-1 text-xs font-semibold text-center py-2 px-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        View Details
      </button>

      {/* Compare toggle */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onCompare?.() }}
        aria-label={isSelected ? `Remove ${medicine.name} from comparison` : `Add ${medicine.name} to comparison`}
        aria-pressed={isSelected}
        className={[
          'flex items-center justify-center w-8 h-8 rounded-lg border transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          isSelected
            ? 'bg-primary-100 border-primary-400 text-primary-700'
            : 'border-slate-200 text-slate-400 hover:border-primary-300 hover:text-primary-500',
        ].join(' ')}
        title={isSelected ? 'Remove from compare' : 'Add to compare'}
      >
        {isSelected
          ? <HiOutlineCheckCircle size={16} aria-hidden="true" />
          : <HiOutlinePlusCircle  size={16} aria-hidden="true" />
        }
      </button>

      {/* Save / Bookmark */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleSave?.() }}
        aria-label={isSaved ? `Remove ${medicine.name} from saved` : `Save ${medicine.name}`}
        aria-pressed={isSaved}
        className={[
          'flex items-center justify-center w-8 h-8 rounded-lg border transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          isSaved
            ? 'bg-warning-100 border-warning-400 text-warning-600'
            : 'border-slate-200 text-slate-400 hover:border-warning-300 hover:text-warning-500',
        ].join(' ')}
        title={isSaved ? 'Remove from saved' : 'Save medicine'}
      >
        {isSaved
          ? <HiBookmark         size={16} aria-hidden="true" />
          : <HiOutlineBookmark  size={16} aria-hidden="true" />
        }
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onShare?.() }}
        aria-label={`Share ${medicine.name}`}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:border-secondary-300 hover:text-secondary-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
        title="Share medicine"
      >
        <HiOutlineShare size={16} aria-hidden="true" />
      </button>
    </div>
  )
}

// ── Main SearchResultCard ──────────────────────────────────────────────────
function SearchResultCard({
  medicine = {},
  isComparing = false,
  isSelected  = false,
  onCompare,
  onView,
  onShare,
  isBestValue = false,
  layout = 'grid',
}) {
  const [isSaved, setIsSaved] = useState(false)

  const {
    name         = 'Medicine Name',
    genericName  = '',
    composition  = '',
    manufacturer = '',
    strength     = '',
    type         = '',
    category     = '',
    price,
    mrp,
  } = medicine

  const savings = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : null

  function handleShare() {
    if (onShare) {
      onShare(medicine)
      return
    }
    // TODO: Web Share API or share dialog — future enhancement
    if (navigator.share) {
      navigator.share({ title: name, text: `${name} — ${genericName}` }).catch(() => {})
    }
  }

  const isListLayout = layout === 'list'

  return (
    <article
      aria-label={`${name}${isBestValue ? ' — Best Value' : ''}`}
      onClick={onView}
      className={[
        'relative flex bg-white rounded-xl border cursor-pointer',
        'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-primary-400',
        isBestValue
          ? 'border-primary-400 ring-2 ring-primary-200'
          : 'border-slate-100',
        isSelected
          ? 'ring-2 ring-primary-300'
          : '',
        isListLayout
          ? 'flex-row items-start gap-4 p-4'
          : 'flex-col p-4 gap-3',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Best Value ribbon ──────────────────────────────────────── */}
      {isBestValue && (
        <div
          aria-label="Best Value recommendation"
          className="absolute -top-3 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-600 text-white text-[10px] font-bold shadow-md z-10"
        >
          <span aria-hidden="true">⭐</span>
          Best Value
        </div>
      )}

      {/* ── Compare checkbox (shown when comparison mode active) ── */}
      {isComparing && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onCompare}
            aria-label={`Select ${name} for comparison`}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
          />
        </div>
      )}

      {/* ── Image placeholder ─────────────────────────────────────── */}
      <div
        className={[
          'relative rounded-lg overflow-hidden shrink-0 bg-slate-50',
          isListLayout ? 'w-20 h-20' : 'w-full h-32',
        ].join(' ')}
      >
        <MedicineImagePlaceholder type={type} />
      </div>

      {/* ── Card content ──────────────────────────────────────────── */}
      <div className={`flex flex-col gap-2 min-w-0 ${isListLayout ? 'flex-1' : ''}`}>

        {/* ── Smart badges ──────────────────────────────────────── */}
        <SmartBadges medicine={medicine} />

        {/* ── Name block ────────────────────────────────────────── */}
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
            {name}
          </h3>
          {genericName && (
            <p className="text-xs text-slate-500 truncate">{genericName}</p>
          )}
          {composition && (
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{composition}</p>
          )}
        </div>

        {/* ── Meta row ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
          {manufacturer && (
            <span className="flex items-center gap-1 truncate">
              <HiOutlineBuildingOffice2 size={11} aria-hidden="true" />
              {manufacturer}
            </span>
          )}
          {strength && <span>{strength}</span>}
          {category && (
            <Badge variant="neutral" size="sm">{category}</Badge>
          )}
        </div>

        {/* ── Price row ─────────────────────────────────────────── */}
        <div className="flex items-baseline gap-2">
          {price !== undefined ? (
            <>
              <span className="text-base font-extrabold text-slate-900">₹{price}</span>
              {mrp && mrp !== price && (
                <span className="text-xs text-slate-400 line-through">₹{mrp}</span>
              )}
              {savings > 0 && (
                <Badge variant="success" size="sm">{savings}% off</Badge>
              )}
              {isBestValue && mrp && price && (
                <span className="text-xs font-semibold text-success-600">
                  Save ₹{mrp - price}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-400 italic">
              {/* TODO: price from GET /api/v1/medicines/:id */}
              Price not available
            </span>
          )}
        </div>

        {/* ── Card actions ──────────────────────────────────────── */}
        <CardActions
          medicine={medicine}
          isSaved={isSaved}
          onToggleSave={() => setIsSaved((s) => !s)}
          isSelected={isSelected}
          onCompare={onCompare}
          onView={onView}
          onShare={handleShare}
        />
      </div>
    </article>
  )
}

export default SearchResultCard
