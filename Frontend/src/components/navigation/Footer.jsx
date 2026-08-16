/**
 * Footer Component
 *
 * Purpose : Site-wide footer for MainLayout public pages.
 *           Provides branding, quick links, contact placeholder,
 *           social media placeholder, and copyright.
 * Location : src/components/navigation/Footer.jsx
 *
 * Features :
 *   - 4-column responsive grid (collapses to 2 on tablet, 1 on mobile)
 *   - Brand column with tagline
 *   - Quick Links column
 *   - Contact info placeholder
 *   - Social media icon row placeholder
 *   - Bottom bar with copyright + version
 *
 * Future modules : Module 4 wires actual contact/social links.
 *
 * Props :
 *   quickLinks   — [{ label, to }]
 *   contactEmail — string
 *   contactPhone — string
 *   showSocials  — boolean (default true)
 */

import { Link } from 'react-router-dom'
import { MdMedication } from 'react-icons/md'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { ROUTES } from '../../constants/routes'
import { APP_NAME, APP_VERSION } from '../../constants/app'

const CURRENT_YEAR = new Date().getFullYear()

const DEFAULT_QUICK_LINKS = [
  { label: 'Home',               to: ROUTES.HOME },
  { label: 'Search Medicines',   to: ROUTES.USER.SEARCH },
  { label: 'Nearby Pharmacies',  to: ROUTES.USER.NEARBY_PHARMACIES },
  { label: 'Login',              to: ROUTES.LOGIN },
  { label: 'Register',           to: ROUTES.REGISTER },
]

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-slate-400 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 rounded"
    >
      {children}
    </Link>
  )
}

/**
 * @param {object}   props
 * @param {Array}    [props.quickLinks]
 * @param {string}   [props.contactEmail]
 * @param {string}   [props.contactPhone]
 * @param {string}   [props.contactAddress]
 * @param {boolean}  [props.showSocials=true]
 */
function Footer({
  quickLinks = DEFAULT_QUICK_LINKS,
  contactEmail = 'support@smartmedicine.in',
  contactPhone = '+91 98765 43210',
  contactAddress = 'Mumbai, Maharashtra, India',
  showSocials = true,
}) {
  return (
    <footer
      className="bg-slate-900 text-slate-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-md"
              aria-label={`${APP_NAME} — home`}
            >
              <span className="flex items-center justify-center w-9 h-9 bg-primary-600 rounded-lg text-white group-hover:bg-primary-500 transition-colors">
                <MdMedication size={20} aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white">Smart Medicine</span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase">Janaushadhi</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Empowering patients with access to affordable Janaushadhi medicines and intelligent generic recommendations.
            </p>
            {/* Social placeholders */}
            {showSocials && (
              <div className="flex items-center gap-3 mt-5">
                {[
                  { Icon: FaGithub,   label: 'GitHub',   href: '#' },
                  { Icon: FaLinkedin, label: 'LinkedIn', href: '#' },
                  { Icon: FaTwitter,  label: 'Twitter',  href: '#' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 text-slate-400 hover:bg-primary-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  >
                    <Icon size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {[
                'Medicine Availability Check',
                'Generic Recommendations',
                'Nearby Pharmacy Locator',
                'Prescription Management',
                'Inventory Tracking',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 rounded"
                >
                  <FiMail size={15} className="mt-0.5 shrink-0 group-hover:text-primary-400" aria-hidden="true" />
                  {contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="flex items-start gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 rounded"
                >
                  <FiPhone size={15} className="mt-0.5 shrink-0 group-hover:text-primary-400" aria-hidden="true" />
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <FiMapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                {contactAddress}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {CURRENT_YEAR} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Final Year Engineering Project · v{APP_VERSION}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
