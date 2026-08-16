/**
 * FeaturesSection
 *
 * Displays role-specific platform features with a tab selector.
 * Public homepage — shows only public-facing roles.
 *
 * Roles shown:   User (Patient/Doctor) · Pharmacy Owner
 * Roles hidden:  Administrator — internal role, not promoted publicly.
 *                Admin accesses the platform via /admin/dashboard directly.
 */

import { useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
  HiOutlineCheckCircle,
  HiOutlineBookmark,
  HiOutlineBell,
  HiOutlineArrowsRightLeft,
} from 'react-icons/hi2'
import {
  MdMedication,
  MdLocalPharmacy,
  MdInventory2,
  MdAddBox,
  MdDashboard,
} from 'react-icons/md'

// ── Public-facing roles only — Administrator is intentionally excluded ─────────
// The Admin role is an internal platform role and is not promoted on the
// public homepage. Administrators access the platform directly via /admin/dashboard.
const ROLES = [
  { id: 'user',     label: 'User',           subtitle: 'Patient / Doctor' },
  { id: 'pharmacy', label: 'Pharmacy Owner', subtitle: 'Pharmacist' },
]

// ── Role-specific feature sets (public-facing roles only) ────────────────────
const FEATURES_BY_ROLE = {
  user: [
    {
      icon: HiOutlineMagnifyingGlass,
      color: 'bg-primary-100 text-primary-700',
      title: 'Search Medicines',
      description:
        'Find any medicine instantly by brand name, generic name, or active composition with intelligent search suggestions.',
    },
    {
      icon: MdMedication,
      color: 'bg-secondary-100 text-secondary-700',
      title: 'Find Generic Alternatives',
      description:
        'Discover affordable PM Jan Aushadhi generic alternatives for any branded medicine — same composition, far lower cost.',
    },
    {
      icon: HiOutlineCurrencyRupee,
      color: 'bg-success-100 text-success-700',
      title: 'Compare Medicine Prices',
      description:
        'Side-by-side price comparison of branded medicines versus Jan Aushadhi generics to make informed purchase decisions.',
    },
    {
      icon: HiOutlineMapPin,
      color: 'bg-info-100 text-info-700',
      title: 'Locate Nearby Pharmacies',
      description:
        'Find Jan Aushadhi Kendras and registered pharmacies near you on an interactive map with distance and stock indicators.',
    },
    {
      icon: HiOutlineCheckCircle,
      color: 'bg-warning-100 text-warning-700',
      title: 'Check Medicine Availability',
      description:
        'Verify whether a specific medicine is in stock at nearby pharmacies before visiting — saves time and effort.',
    },
    {
      icon: HiOutlineBookmark,
      color: 'bg-accent-100 text-accent-700',
      title: 'Save Medicines',
      description:
        'Bookmark medicines to your personal list for quick access, repeat purchases, and prescription tracking.',
    },
    {
      icon: HiOutlineBell,
      color: 'bg-primary-100 text-primary-700',
      title: 'Medicine Availability Notifications',
      description:
        'Receive notifications when a saved out-of-stock medicine becomes available at a nearby pharmacy.',
    },
  ],

  pharmacy: [
    {
      icon: MdInventory2,
      color: 'bg-secondary-100 text-secondary-700',
      title: 'Inventory Management',
      description:
        'Manage your complete medicine stock with a searchable, sortable, paginated inventory table.',
    },
    {
      icon: MdAddBox,
      color: 'bg-success-100 text-success-700',
      title: 'Add Medicines',
      description:
        'Add new medicines to your stock with batch number, quantity, price, expiry date, and category details.',
    },
    {
      icon: HiOutlineArrowsRightLeft,
      color: 'bg-primary-100 text-primary-700',
      title: 'Update Inventory',
      description:
        'Edit existing stock entries — update quantities, prices, and expiry information quickly and accurately.',
    },
    {
      icon: HiOutlineCheckCircle,
      color: 'bg-info-100 text-info-700',
      title: 'Stock Monitoring',
      description:
        'Monitor your current stock levels at a glance with visual indicators for healthy, low, and critical stock.',
    },
    {
      icon: HiOutlineBell,
      color: 'bg-warning-100 text-warning-700',
      title: 'Low Stock Alerts',
      description:
        'Receive automatic alerts when medicine quantities fall below the defined threshold — never run out unexpectedly.',
    },
    {
      icon: MdDashboard,
      color: 'bg-accent-100 text-accent-700',
      title: 'Pharmacy Dashboard',
      description:
        'A centralised dashboard showing inventory summary, recent updates, and quick-action shortcuts for daily operations.',
    },
    {
      icon: MdLocalPharmacy,
      color: 'bg-secondary-100 text-secondary-700',
      title: 'Medicine Availability Management',
      description:
        'Mark medicines as available, limited, or out-of-stock so patients searching nearby can see real-time availability.',
    },
  ],
}

// ── FeatureCard ───────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, color, title, description }) {
  return (
    <article className="group flex flex-col gap-3 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${color}`}
        aria-hidden="true"
      >
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </article>
  )
}

// ── RoleTab ───────────────────────────────────────────────────────────────────
function RoleTab({ role, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(role.id)}
      aria-pressed={isActive}
      className={[
        'flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        isActive
          ? 'bg-primary-600 text-white shadow-md'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400',
      ].join(' ')}
    >
      <span>{role.label}</span>
      <span className={`text-[10px] font-normal ${isActive ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
        {role.subtitle}
      </span>
    </button>
  )
}

// ── FeaturesSection ───────────────────────────────────────────────────────────
function FeaturesSection() {
  const [activeRole, setActiveRole] = useState('user')
  const features = FEATURES_BY_ROLE[activeRole]

  return (
    <section
      aria-labelledby="features-heading"
      className="section bg-slate-50 dark:bg-slate-900"
    >
      <div className="container-app">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Key Features
          </span>
          <h2
            id="features-heading"
            className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
          >
            Built for every role in healthcare
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Select your role to see the features designed specifically for you.
          </p>
        </div>

        {/* Role selector tabs */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-10"
          role="group"
          aria-label="Select your role to view relevant features"
        >
          {ROLES.map((role) => (
            <RoleTab
              key={role.id}
              role={role}
              isActive={activeRole === role.id}
              onClick={setActiveRole}
            />
          ))}
        </div>

        {/* Features grid: 1 → 2 → 4 columns */}
        <div
          key={activeRole}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          aria-label={`Features for ${ROLES.find(r => r.id === activeRole)?.label}`}
        >
          {features.map((f) => (
            <div key={f.title} role="listitem">
              <FeatureCard {...f} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection
