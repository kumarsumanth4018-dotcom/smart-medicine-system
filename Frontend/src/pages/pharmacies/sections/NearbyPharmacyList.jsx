/**
 * Component: NearbyPharmacyList
 *
 * Description:
 *   Scrollable list of extended pharmacy cards with all required fields
 *   and action buttons. Clicking a card selects it on the map.
 *
 * Responsibilities:
 *   - Render NearbyPharmacyCard for each pharmacy
 *   - Highlight the currently selected card
 *   - Pass onSelect, onViewDetails, onReserve callbacks
 *
 * Backend readiness:
 *   - pharmacies → GET /api/v1/pharmacies/nearby?medicine=...
 */

import { useState } from 'react'
import {
  HiOutlineMapPin, HiOutlinePhone, HiOutlineClock,
  HiOutlineStar, HiOutlineTruck, HiOutlineArrowRight,
  HiOutlineCalendarDays, HiBookmark, HiOutlineBookmark,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'

// =======================================================
// Extended pharmacy data
// TODO: Replace with GET /api/v1/pharmacies/nearby?medicine=...&lat=...&lng=...
// =======================================================
const NEARBY_PHARMACIES = [
  {
    id: 'p1',
    name: 'Jan Aushadhi Kendra — Andheri West',
    address: '12, Veera Desai Road, Andheri West, Mumbai 400053',
    distance: '0.8 km',
    travelTime: '~10 min walk',
    phone: '+91 98765 43210',
    hours: '8:00 AM – 9:00 PM',
    isOpen: true,
    isJanAushadhi: true,
    availability: 'available',
    rating: 4.5,
    ratingCount: 128,
  },
  {
    id: 'p2',
    name: 'Shree Medical Store',
    address: '5, SV Road, Near Andheri Station, Mumbai 400058',
    distance: '1.2 km',
    travelTime: '~15 min walk',
    phone: '+91 98123 45678',
    hours: '9:00 AM – 10:00 PM',
    isOpen: true,
    isJanAushadhi: false,
    availability: 'limited',
    rating: 4.2,
    ratingCount: 87,
  },
  {
    id: 'p3',
    name: 'Jan Aushadhi Kendra — Versova',
    address: '22, New Link Road, Versova, Andheri West, Mumbai 400061',
    distance: '1.6 km',
    travelTime: '~5 min auto',
    phone: '+91 99887 65432',
    hours: '8:00 AM – 8:00 PM',
    isOpen: true,
    isJanAushadhi: true,
    availability: 'available',
    rating: 4.7,
    ratingCount: 214,
  },
  {
    id: 'p4',
    name: 'Apollo Pharmacy',
    address: '101, Lokhandwala Complex, Andheri West, Mumbai 400053',
    distance: '1.9 km',
    travelTime: '~7 min auto',
    phone: '+91 98001 23456',
    hours: '24 Hours',
    isOpen: false,
    isJanAushadhi: false,
    availability: 'unavailable',
    rating: 4.0,
    ratingCount: 302,
  },
]

const AVAIL_CONFIG = {
  available:   { variant: 'success', label: 'In Stock'      },
  limited:     { variant: 'warning', label: 'Limited Stock' },
  unavailable: { variant: 'danger',  label: 'Out of Stock'  },
}

// =======================================================
// Extended Pharmacy Card
// =======================================================
function NearbyPharmacyCard({ pharmacy, isSelected, onSelect, onViewDetails, onReserve, onViewOnMap }) {
  const [saved, setSaved] = useState(false)
  const avail = AVAIL_CONFIG[pharmacy.availability] ?? AVAIL_CONFIG.available

  return (
    <article
      aria-label={`${pharmacy.name} — ${pharmacy.isOpen ? 'Open' : 'Closed'} — ${avail.label}`}
      onClick={() => onSelect?.(pharmacy.id)}
      className={[
        'relative flex flex-col gap-3 p-5 rounded-2xl bg-white border cursor-pointer',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        isSelected
          ? 'border-2 border-primary-400 ring-2 ring-primary-100 shadow-md'
          : 'border-slate-100 shadow-sm',
      ].join(' ')}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm" dot>Selected</Badge>
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary-50 shrink-0">
          <MdLocalPharmacy size={22} className="text-secondary-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{pharmacy.name}</h3>
            {pharmacy.isJanAushadhi && <Badge variant="info" size="sm">Jan Aushadhi</Badge>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={pharmacy.isOpen ? 'success' : 'danger'} dot size="sm">
              {pharmacy.isOpen ? 'Open' : 'Closed'}
            </Badge>
            <Badge variant={avail.variant} size="sm">{avail.label}</Badge>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-xs text-slate-500">
        <HiOutlineMapPin size={12} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span>{pharmacy.address}</span>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <HiOutlineMapPin size={11} className="text-secondary-400" aria-hidden="true" />
          {pharmacy.distance}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineTruck size={11} aria-hidden="true" />
          {pharmacy.travelTime}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineClock size={11} aria-hidden="true" />
          {pharmacy.hours}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineStar size={11} className="text-warning-400" aria-hidden="true" />
          {pharmacy.rating} ({pharmacy.ratingCount})
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onViewDetails?.(pharmacy.id) }}
          aria-label={`View details for ${pharmacy.name}`}
          className="flex-1 text-xs font-semibold py-2 rounded-xl bg-secondary-600 text-white hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onViewOnMap?.(pharmacy.id) }}
          aria-label={`View ${pharmacy.name} on map`}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:border-secondary-300 hover:text-secondary-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
        >
          <HiOutlineMapPin size={13} aria-hidden="true" />
          Map
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReserve?.(pharmacy.id) }}
          aria-label={`Reserve medicine at ${pharmacy.name}`}
          disabled={pharmacy.availability === 'unavailable'}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-success-300 text-xs text-success-700 hover:bg-success-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiOutlineCalendarDays size={13} aria-hidden="true" />
          Reserve
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setSaved(s => !s) }}
          aria-label={saved ? `Remove ${pharmacy.name} from saved` : `Save ${pharmacy.name}`}
          aria-pressed={saved}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:text-warning-500 hover:border-warning-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-400"
        >
          {saved ? <HiBookmark size={14} aria-hidden="true" /> : <HiOutlineBookmark size={14} aria-hidden="true" />}
        </button>

        <a
          href={`tel:${pharmacy.phone?.replace(/\s/g,'')}`}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Call ${pharmacy.name}`}
          className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:text-secondary-600 hover:border-secondary-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
        >
          <HiOutlinePhone size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

// =======================================================
// Nearby Pharmacy List
// =======================================================
function NearbyPharmacyList({ pharmacies = [], selectedId, onSelect, onViewDetails, onReserve }) {
  function handleViewOnMap(id) {
    onSelect?.(id)
    // Scroll to map is handled by the parent
  }

  return (
    <section aria-labelledby="pharmacy-list-heading">

      {/* =======================================================
          Nearby Pharmacies
         ======================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 id="pharmacy-list-heading" className="text-base font-bold text-slate-900">
            Nearby Pharmacies
          </h2>
          <Badge variant="primary" size="sm">
            {pharmacies.length} found
          </Badge>
        </div>

        {pharmacies.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-400">
            No Jan Aushadhi Kendras found within range.
          </p>
        ) : (
          <div className="flex flex-col gap-4" role="list" aria-label="Nearby pharmacy list">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.id} role="listitem">
                <NearbyPharmacyCard
                  pharmacy={pharmacy}
                  isSelected={pharmacy.id === selectedId}
                  onSelect={onSelect}
                  onViewDetails={onViewDetails}
                  onReserve={onReserve}
                  onViewOnMap={handleViewOnMap}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NearbyPharmacyList