/**
 * Component: SearchFiltersSection
 *
 * Purpose:
 *   Provides a structured filter panel enabling users to narrow search
 *   results by medicine type, availability, brand, generic status,
 *   manufacturer, sort order, price range, and distance.
 *
 * Responsibilities:
 *   - Render a collapsible filter panel
 *   - Display all filter controls using reusable form components
 *   - Provide Reset and Apply Filters buttons (UI placeholders)
 *   - Show active filter count badge when filters are changed
 *
 * Props:
 *   None — all state is local placeholder state only.
 *
 * Dependencies:
 *   - Select  (components/forms) — reused for dropdown filters
 *   - Toggle  (components/forms) — reused for boolean toggles
 *   - Button  (components/ui)    — reused for Reset / Apply
 *   - Badge   (components/ui)    — active filter count indicator
 *   - React Icons (hi2)
 *
 * Backend readiness:
 *   - Filter values → POST /api/v1/medicines/search with body filters
 *   - Sort options  → supported by sort_by query param
 *   - Price range   → min_price / max_price query params
 *   - Distance      → lat, lng, radius params (after location module)
 *   All wiring deferred to Module 7B.
 *
 * Accessibility:
 *   - All controls use existing accessible form components
 *   - Panel toggle button has aria-expanded
 *   - Section uses aria-labelledby
 */

import { useState } from 'react'
import {
  HiOutlineFunnel,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineXMark,
} from 'react-icons/hi2'
import Select  from '../../../components/forms/Select'
import Toggle  from '../../../components/forms/Toggle'
import Button  from '../../../components/ui/Button'
import Badge   from '../../../components/ui/Badge'

// ===========================================
// Filter option data
// TODO: populate from GET /api/v1/medicines/filters in Module 7B
// ===========================================
const MEDICINE_TYPE_OPTIONS = [
  { value: '',           label: 'All Types'        },
  { value: 'tablet',     label: 'Tablet'           },
  { value: 'syrup',      label: 'Syrup'            },
  { value: 'capsule',    label: 'Capsule'          },
  { value: 'injection',  label: 'Injection'        },
  { value: 'ointment',   label: 'Ointment'         },
  { value: 'drops',      label: 'Drops'            },
  { value: 'powder',     label: 'Powder'           },
]

const AVAILABILITY_OPTIONS = [
  { value: '',            label: 'Any Availability' },
  { value: 'available',   label: 'In Stock'         },
  { value: 'unavailable', label: 'Out of Stock'     },
  { value: 'limited',     label: 'Limited Stock'    },
]

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Relevance'          },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'name_asc',    label: 'Name: A to Z'       },
  { value: 'name_desc',   label: 'Name: Z to A'       },
]

const MANUFACTURER_OPTIONS = [
  { value: '',          label: 'All Manufacturers'  },
  { value: 'cipla',     label: 'Cipla'              },
  { value: 'sun_pharma',label: 'Sun Pharma'         },
  { value: 'dr_reddy',  label: "Dr. Reddy's"        },
  { value: 'mankind',   label: 'Mankind Pharma'     },
  { value: 'janaushadhi',label: 'Jan Aushadhi'      },
]

// Default (empty) filter state
const DEFAULT_FILTERS = {
  medicineType:    '',
  availability:    '',
  sortBy:          'relevance',
  manufacturer:    '',
  isGeneric:       false,
  isBrandName:     false,
}

// ===========================================
// Filter row label component
// ===========================================
function FilterLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-600 mb-1.5">{children}</p>
  )
}

// ===========================================
// Search Filters Section
// ===========================================
function SearchFiltersSection({ onApply, onReset }) {
  const [open,    setOpen]    = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // Count active (non-default) filters for badge
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (typeof val === 'boolean') return val
    if (key === 'sortBy') return val !== 'relevance'
    return val !== ''
  }).length

  function handleChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS)
    // TODO: Module 7B — clear active filters in search results
    onReset?.()
  }

  function handleApply() {
    // TODO: Module 7B — pass filters to search API
    onApply?.(filters)
  }

  return (
    <section aria-labelledby="filters-heading" className="py-4">

      {/* ===========================================  */}
      {/* Filter Panel Toggle Header                  */}
      {/* ===========================================  */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="filter-panel"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md p-0.5"
        >
          <HiOutlineFunnel
            size={16}
            className="text-slate-500 group-hover:text-primary-600 transition-colors"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">
            Filters
          </span>
          {activeCount > 0 && (
            <Badge variant="primary" size="sm">{activeCount} active</Badge>
          )}
          {open
            ? <HiOutlineChevronUp  size={14} className="text-slate-400 ml-1" aria-hidden="true" />
            : <HiOutlineChevronDown size={14} className="text-slate-400 ml-1" aria-hidden="true" />
          }
        </button>

        {/* Reset button — shown when any filter is active */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset all filters"
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-danger-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 rounded"
          >
            <HiOutlineXMark size={13} aria-hidden="true" />
            Reset
          </button>
        )}
      </div>

      {/* ===========================================  */}
      {/* Collapsible Filter Panel                    */}
      {/* ===========================================  */}
      {open && (
        <div
          id="filter-panel"
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5"
        >
          {/* Row 1: Medicine Type + Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <FilterLabel>Medicine Type</FilterLabel>
              <Select
                options={MEDICINE_TYPE_OPTIONS}
                value={filters.medicineType}
                onChange={(e) => handleChange('medicineType', e.target.value)}
                placeholder="All Types"
              />
            </div>

            <div>
              <FilterLabel>Availability</FilterLabel>
              <Select
                options={AVAILABILITY_OPTIONS}
                value={filters.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                placeholder="Any Availability"
              />
            </div>

            <div>
              <FilterLabel>Manufacturer</FilterLabel>
              <Select
                options={MANUFACTURER_OPTIONS}
                value={filters.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
                placeholder="All Manufacturers"
              />
            </div>

            <div>
              <FilterLabel>Sort By</FilterLabel>
              <Select
                options={SORT_OPTIONS}
                value={filters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Boolean toggles */}
          <div className="flex flex-wrap gap-6 pt-1 border-t border-slate-100">
            <Toggle
              label="Generic Medicine Only"
              size="sm"
              checked={filters.isGeneric}
              onChange={(val) => handleChange('isGeneric', val)}
              helperText="Show only Jan Aushadhi / generic alternatives"
            />
            <Toggle
              label="Brand Name Only"
              size="sm"
              checked={filters.isBrandName}
              onChange={(val) => handleChange('isBrandName', val)}
              helperText="Show only branded pharmaceutical products"
            />
          </div>

          {/* Row 3: Placeholder sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            {/* Price Range placeholder */}
            <div>
              <FilterLabel>Price Range (₹)</FilterLabel>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center px-3">
                  <span className="text-xs text-slate-400">
                    {/* TODO: replace with RangeSlider in Module 7B */}
                    ₹0 — ₹500 (placeholder)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {/* TODO: GET /api/v1/medicines/price-range for min/max */}
                Price filter will be enabled after backend integration.
              </p>
            </div>

            {/* Distance placeholder */}
            <div>
              <FilterLabel>Distance (km)</FilterLabel>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center px-3">
                  <span className="text-xs text-slate-400">
                    {/* TODO: requires geolocation permission in Module 7B */}
                    Within 5 km (placeholder)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {/* TODO: requires user location permission */}
                Distance filter requires location access.
              </p>
            </div>
          </div>

          {/* ===========================================  */}
          {/* Apply / Reset action buttons                */}
          {/* ===========================================  */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              aria-label="Reset all filters to default"
            >
              Reset Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              aria-label="Apply selected filters to search results"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

    </section>
  )
}

export default SearchFiltersSection
