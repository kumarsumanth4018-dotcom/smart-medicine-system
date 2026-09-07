import { useState } from 'react'
import {
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineStar,
  HiOutlineTruck,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'

import Badge from '../../../components/ui/Badge'


const AVAILABILITY_CONFIG = {
  available: {
    variant: 'success',
    label: 'In Stock',
  },
  limited: {
    variant: 'warning',
    label: 'Limited Stock',
  },
  unavailable: {
    variant: 'danger',
    label: 'Out of Stock',
  },
}

const TRUST_CONFIG = {
  verified: {
    label: 'Verified batch',
    className: 'bg-success-50 text-success-700',
  },
  distributor: {
    label: 'Distributor verified',
    className: 'bg-warning-50 text-warning-700',
  },
  unverified: {
    label: 'Unverified batch',
    className: 'bg-slate-100 text-slate-600',
  },
}


function formatPrice(value) {
  const price = Number(value)

  if (!Number.isFinite(price)) {
    return 'Not available'
  }

  return `₹${price.toFixed(2)}`
}


function formatWsmScore(value) {
  const score = Number(value)

  if (!Number.isFinite(score)) {
    return null
  }

  return {
    decimal: score.toFixed(4),
    percentage: `${(score * 100).toFixed(1)}%`,
  }
}


function WsmRankingPanel({ pharmacy }) {
  if (!pharmacy.rank || pharmacy.wsmScore == null) {
    return null
  }

  const score = formatWsmScore(pharmacy.wsmScore)
  const trust =
    TRUST_CONFIG[pharmacy.verificationStatus] ??
    TRUST_CONFIG.unverified

  return (
    <div
      className="rounded-xl border border-primary-100
                 bg-primary-50/60 p-3"
    >
      <div
        className="flex flex-wrap items-center
                   justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <span
            className="rounded-full bg-primary-600 px-3 py-1
                       text-xs font-bold text-white"
          >
            Rank #{pharmacy.rank}
          </span>

          <span className="text-xs font-semibold text-primary-800">
            Smart recommendation
          </span>
        </div>

        {score && (
          <div className="text-right">
            <p className="text-sm font-bold text-primary-700">
              {score.decimal}
            </p>
            <p className="text-[10px] text-primary-600">
              WSM score ({score.percentage})
            </p>
          </div>
        )}
      </div>

      <div
        className="mt-3 grid grid-cols-2 gap-2
                   text-xs sm:grid-cols-4"
      >
        <div className="rounded-lg bg-white p-2">
          <p className="text-slate-400">Price</p>
          <p className="mt-0.5 font-bold text-slate-800">
            {formatPrice(pharmacy.price)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-2">
          <p className="text-slate-400">Quantity</p>
          <p className="mt-0.5 font-bold text-slate-800">
            {pharmacy.totalQty ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-white p-2">
          <p className="text-slate-400">Freshness</p>
          <p className="mt-0.5 font-bold text-slate-800">
            {pharmacy.daysToExpiry != null
              ? `${pharmacy.daysToExpiry} days`
              : 'Not available'}
          </p>
        </div>

        <div className="rounded-lg bg-white p-2">
          <p className="text-slate-400">Trust</p>
          <span
            className={`mt-1 inline-flex rounded-full px-2 py-0.5
                        text-[10px] font-semibold ${trust.className}`}
          >
            {trust.label}
          </span>
        </div>
      </div>
    </div>
  )
}


function NearbyPharmacyCard({
  pharmacy,
  isSelected,
  onSelect,
  onViewDetails,
  onReserve,
  onViewOnMap,
}) {
  const [saved, setSaved] = useState(false)

  const availability =
    AVAILABILITY_CONFIG[pharmacy.availability] ??
    AVAILABILITY_CONFIG.available

  return (
    <article
      aria-label={`${pharmacy.name} — ${availability.label}`}
      onClick={() => onSelect?.(pharmacy.id)}
      className={[
        'relative flex cursor-pointer flex-col gap-3 rounded-2xl',
        'border bg-white p-5 transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        isSelected
          ? 'border-2 border-primary-400 ring-2 ring-primary-100 shadow-md'
          : 'border-slate-100 shadow-sm',
      ].join(' ')}
    >
      {isSelected && (
        <div className="absolute right-3 top-3">
          <Badge variant="primary" size="sm" dot>
            Selected
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center
                     justify-center rounded-xl bg-secondary-50"
        >
          <MdLocalPharmacy
            size={22}
            className="text-secondary-600"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-start gap-2">
            <h3
              className="max-w-[260px] truncate text-sm
                         font-bold text-slate-900"
            >
              {pharmacy.name}
            </h3>

            {pharmacy.isJanAushadhi && (
              <Badge variant="info" size="sm">
                Jan Aushadhi
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={pharmacy.isOpen ? 'success' : 'danger'}
              dot
              size="sm"
            >
              {pharmacy.isOpen ? 'Open' : 'Closed'}
            </Badge>

            <Badge variant={availability.variant} size="sm">
              {availability.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-slate-500">
        <HiOutlineMapPin
          size={12}
          className="mt-0.5 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <span>{pharmacy.address}</span>
      </div>

      <div
        className="grid grid-cols-2 gap-x-4 gap-y-1
                   text-xs text-slate-500"
      >
        <span className="flex items-center gap-1">
          <HiOutlineMapPin
            size={11}
            className="text-secondary-400"
            aria-hidden="true"
          />
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
          <HiOutlineStar
            size={11}
            className="text-warning-400"
            aria-hidden="true"
          />
          {pharmacy.rating} ({pharmacy.ratingCount})
        </span>
      </div>

      <WsmRankingPanel pharmacy={pharmacy} />

      <div
        className="flex flex-wrap items-center gap-2
                   border-t border-slate-100 pt-2"
      >
        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            onViewDetails?.(pharmacy.id)
          }}
          className="min-w-[140px] flex-1 rounded-xl
                     bg-secondary-600 py-2 text-xs font-semibold
                     text-white hover:bg-secondary-700"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            onViewOnMap?.(pharmacy.id)
          }}
          className="flex items-center justify-center gap-1
                     rounded-xl border border-slate-200 px-3 py-2
                     text-xs text-slate-600 hover:border-secondary-300
                     hover:text-secondary-600"
        >
          <HiOutlineMapPin size={13} />
          Map
        </button>

        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            onReserve?.(pharmacy.id)
          }}
          disabled={pharmacy.availability === 'unavailable'}
          className="flex items-center justify-center gap-1
                     rounded-xl border border-success-300 px-3 py-2
                     text-xs text-success-700 hover:bg-success-50
                     disabled:cursor-not-allowed disabled:opacity-40"
        >
          <HiOutlineCalendarDays size={13} />
          Reserve
        </button>

        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            setSaved(current => !current)
          }}
          aria-label={saved ? 'Remove saved Kendra' : 'Save Kendra'}
          aria-pressed={saved}
          className="flex h-8 w-8 items-center justify-center
                     rounded-xl border border-slate-200 text-slate-400
                     hover:border-warning-300 hover:text-warning-500"
        >
          {saved ? (
            <HiBookmark size={14} />
          ) : (
            <HiOutlineBookmark size={14} />
          )}
        </button>

        <a
          href={
            pharmacy.phone
              ? `tel:${pharmacy.phone.replace(/\s/g, '')}`
              : undefined
          }
          onClick={event => event.stopPropagation()}
          aria-label={`Call ${pharmacy.name}`}
          className="flex h-8 w-8 items-center justify-center
                     rounded-xl border border-slate-200 text-slate-400
                     hover:border-secondary-300 hover:text-secondary-600"
        >
          <HiOutlinePhone size={14} />
        </a>
      </div>
    </article>
  )
}


function NearbyPharmacyList({
  pharmacies = [],
  selectedId,
  onSelect,
  onViewDetails,
  onReserve,
}) {
  function handleViewOnMap(id) {
    onSelect?.(id)

    document
      .getElementById('interactive-map-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="pharmacy-list-heading">
      <div
        className="mb-4 flex items-center
                   justify-between gap-3"
      >
        <h2
          id="pharmacy-list-heading"
          className="text-base font-bold text-slate-900"
        >
          {pharmacies.some(pharmacy => pharmacy.rank)
            ? 'Recommended Kendras'
            : 'Nearby Pharmacies'}
        </h2>

        <Badge variant="primary" size="sm">
          {pharmacies.length} found
        </Badge>
      </div>

      {pharmacies.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No Jan Aushadhi Kendras found within range.
        </p>
      ) : (
        <div
          className="flex flex-col gap-4"
          role="list"
          aria-label="Nearby pharmacy list"
        >
          {pharmacies.map(pharmacy => (
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
    </section>
  )
}


export default NearbyPharmacyList
