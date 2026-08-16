/**
 * AboutSection
 *
 * Component: AboutSection
 *
 * Purpose:
 *   Explains the purpose of the platform, who it serves, and the
 *   problem it solves — using a clean two-column card layout.
 *
 * Responsibilities:
 *   - Display four about-cards covering core platform pillars
 *   - Section header with eyebrow label + heading + body copy
 *
 * Dependencies:
 *   - React Icons (hi2, md)
 *   - Tailwind design system tokens
 */

import {
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

const ABOUT_CARDS = [
  {
    icon: MdMedication,
    color: 'bg-primary-50 text-primary-600',
    title: 'Medicine Availability',
    description:
      'Instantly check whether a specific branded or generic medicine is available at pharmacies near you, reducing wasted trips and time.',
  },
  {
    icon: HiOutlineCurrencyRupee,
    color: 'bg-success-50 text-success-600',
    title: 'Affordable Alternatives',
    description:
      'Our intelligent recommendation engine suggests Jan Aushadhi generic alternatives that offer the same therapeutic benefit at a fraction of the cost.',
  },
  {
    icon: HiOutlineMapPin,
    color: 'bg-secondary-50 text-secondary-600',
    title: 'Nearby Pharmacy Locator',
    description:
      'Find Jan Aushadhi Kendras and pharmacies near your location with real-time availability data through an interactive map view.',
  },
  {
    icon: HiOutlineUserGroup,
    color: 'bg-accent-50 text-accent-600',
    title: 'Inclusive Healthcare',
    description:
      'Designed for patients, doctors, and pharmacists — the platform bridges the gap between healthcare providers and affordable medicines.',
  },
]

function AboutCard({ icon: Icon, color, title, description }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${color}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="section bg-slate-50"
    >
      <div className="container-app">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            About the Project
          </span>
          <h2
            id="about-heading"
            className="mt-2 text-3xl font-bold text-slate-900 tracking-tight"
          >
            A smarter way to access affordable healthcare
          </h2>
          <p className="mt-3 text-slate-500 text-base leading-relaxed">
            India&apos;s healthcare landscape faces challenges of medicine affordability and availability.
            This platform uses technology to connect patients with the right medicines at the right price,
            powered by the PM Jan Aushadhi initiative.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {ABOUT_CARDS.map((card) => (
            <AboutCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
