/**
 * Component: MedicineCategoriesSection
 *
 * Purpose:
 *   Allows users to browse the medicine catalogue by therapeutic or
 *   dosage-form category, reducing the need to know exact medicine names.
 *
 * Responsibilities:
 *   - Render a responsive grid of CategoryCard components
 *   - Each card: icon, name, short description, hover animation
 *   - Clicking a category is a UI placeholder (filtering in Module 7B)
 *   - Section header with eyebrow label
 *
 * Dependencies:
 *   - React Icons (hi2, md, gi) for category-specific icons
 *
 * Backend readiness:
 *   - CATEGORIES array → GET /api/v1/medicines/categories in Module 7B
 *   - onCategorySelect → will apply category filter to search results
 *
 * Accessibility:
 *   - role="list" + role="listitem" for screen reader enumeration
 *   - Each card is a <button> with descriptive aria-label
 *   - Section uses aria-labelledby
 */

import {
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineCpuChip,
} from 'react-icons/hi2'
import { MdMedication, MdChildCare, MdOutlineAir } from 'react-icons/md'
import { GiMedicinePills, GiSyringe, GiBandaged } from 'react-icons/gi'

// ===========================================
// Category data
// TODO: Replace with GET /api/v1/medicines/categories in Module 7B
// ===========================================
const CATEGORIES = [
  {
    id: 'tablets',
    icon: MdMedication,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    name: 'Tablets',
    description: 'Oral solid dosage forms',
  },
  {
    id: 'syrups',
    icon: HiOutlineBeaker,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-700',
    name: 'Syrups',
    description: 'Liquid oral medicines',
  },
  {
    id: 'injections',
    icon: GiSyringe,
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-700',
    name: 'Injections',
    description: 'Parenteral preparations',
  },
  {
    id: 'capsules',
    icon: GiMedicinePills,
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
    name: 'Capsules',
    description: 'Gelatin-enclosed dosage',
  },
  {
    id: 'ointments',
    icon: GiBandaged,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-700',
    name: 'Ointments',
    description: 'Topical skin applications',
  },
  {
    id: 'ayurvedic',
    icon: HiOutlineSparkles,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-700',
    name: 'Ayurvedic',
    description: 'Traditional herbal medicines',
  },
  {
    id: 'pediatric',
    icon: MdChildCare,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-700',
    name: 'Pediatric',
    description: 'Medicines for children',
  },
  {
    id: 'cardiology',
    icon: HiOutlineHeart,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    name: 'Cardiology',
    description: 'Heart & cardiovascular care',
  },
  {
    id: 'neurology',
    icon: HiOutlineCpuChip,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    name: 'Neurology',
    description: 'Nervous system treatments',
  },
  {
    id: 'respiratory',
    icon: MdOutlineAir,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
    name: 'Respiratory',
    description: 'Breathing & lung care',
  },
]

// ===========================================
// CategoryCard sub-component
// ===========================================
function CategoryCard({ category, onSelect }) {
  const { id, icon: Icon, iconBg, iconColor, name, description } = category

  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      aria-label={`Browse ${name} — ${description}`}
      className={[
        'group flex flex-col items-center text-center gap-3 p-4 rounded-xl',
        'bg-white border border-slate-100 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'w-full',
      ].join(' ')}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} group-hover:scale-105 transition-transform duration-200`}
      >
        <Icon size={24} className={iconColor} aria-hidden="true" />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">
          {name}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </button>
  )
}

// ===========================================
// Medicine Categories Section
// ===========================================
function MedicineCategoriesSection({ onCategorySelect }) {
  return (
    <section aria-labelledby="categories-heading" className="py-6">

      {/* Section header */}
      <div className="mb-5">
        <h2
          id="categories-heading"
          className="text-base font-bold text-slate-900"
        >
          Browse by Category
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {/* TODO: counts will come from GET /api/v1/medicines/categories */}
          Select a category to filter medicines by type or therapeutic area.
        </p>
      </div>

      {/* Category grid: 2 → 4 → 5 columns */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"
        role="list"
        aria-label="Medicine categories"
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.id} role="listitem">
            <CategoryCard
              category={cat}
              onSelect={onCategorySelect}
            />
          </div>
        ))}
      </div>

    </section>
  )
}

export default MedicineCategoriesSection
