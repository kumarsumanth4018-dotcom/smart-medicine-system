/**
 * Component: CtaSection
 *
 * Purpose:
 *   Full-width call-to-action banner encouraging visitors to start
 *   using the platform. Placed at the bottom of the Home page before
 *   the Footer.
 *
 * Responsibilities:
 *   - Display conversion headline and supporting copy
 *   - Render primary CTA (Search Medicines) and secondary CTA (Register)
 *   - Provide a visually distinct, high-contrast section break
 *
 * Dependencies:
 *   - Button (components/ui)
 *   - ROUTES (constants/routes)
 *   - React Router Link
 *   - React Icons (hi2)
 */

import { Link } from 'react-router-dom'
import { HiOutlineMagnifyingGlass, HiOutlineUserPlus } from 'react-icons/hi2'
import Button from '../../../components/ui/Button'
import { ROUTES } from '../../../constants/routes'

function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 py-20"
    >
      {/* Subtle pattern overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none"
      />

      <div className="container-app relative text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-4">
          Get Started Today
        </span>
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug max-w-2xl mx-auto"
        >
          Start your affordable healthcare journey now
        </h2>
        <p className="mt-4 text-primary-100 text-base max-w-xl mx-auto leading-relaxed">
          Search medicines, discover generic alternatives, and locate nearby pharmacies —
          all free, all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to={ROUTES.USER.SEARCH} aria-label="Search medicines on the platform">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<HiOutlineMagnifyingGlass size={18} />}
              className="bg-white text-primary-700 hover:bg-primary-50 focus-visible:ring-white shadow-lg"
            >
              Search Medicines
            </Button>
          </Link>
          <Link to={ROUTES.REGISTER} aria-label="Create a free account">
            <Button
              variant="ghost"
              size="lg"
              leftIcon={<HiOutlineUserPlus size={18} />}
              className="border border-white/60 text-white hover:bg-white/10 focus-visible:ring-white"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
