/**
 * Navbar Component
 *
 * Purpose : Top navigation bar rendered by MainLayout and UserLayout.
 *           Provides branding, navigation links, notification placeholder,
 *           and user profile placeholder.
 * Location : src/components/navigation/Navbar.jsx
 *
 * Features :
 *   - Sticky top bar with backdrop blur
 *   - Desktop horizontal nav links with active-route highlight
 *   - Mobile hamburger menu (slide-down, fully accessible)
 *   - Notification icon placeholder (wired in Module 4)
 *   - User avatar/profile placeholder (wired in Module 2 auth)
 *   - Logo + brand name
 *
 * Future modules : Module 2 wires auth state, Module 4 wires
 *                  notification count badge, Module 3 search.
 *
 * Props :
 *   navLinks  — array of { label, to, icon? } for desktop nav
 *   showAuth  — show Login/Register buttons (public pages)
 *   user      — current user object (or null)
 *   onLogout  — logout handler
 */

import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineBell, HiOutlineUser, HiOutlineBars3, HiOutlineXMark, HiOutlineMagnifyingGlass, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import { ROUTES } from '../../constants/routes'
import { APP_NAME } from '../../constants/app'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useTheme } from '../../contexts/ThemeContext'

// ── Nav link base styles ────────────────────────────────────────────────────
const LINK_BASE =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ' +
  'transition-colors duration-150 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-primary-500'

const LINK_IDLE   = 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
const LINK_ACTIVE = 'text-primary-700 bg-primary-50 font-semibold'

const MOBILE_LINK_BASE =
  'flex items-center gap-2 w-full px-4 py-3 text-sm font-medium ' +
  'transition-colors duration-150 border-b border-slate-100 last:border-0'
const MOBILE_LINK_IDLE   = 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
const MOBILE_LINK_ACTIVE = 'text-primary-700 bg-primary-50 font-semibold'

function NavbarLink({ to, icon: Icon, children, mobile = false, onClick }) {
  if (mobile) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          [MOBILE_LINK_BASE, isActive ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE].join(' ')
        }
      >
        {Icon && <Icon size={18} aria-hidden="true" />}
        {children}
      </NavLink>
    )
  }
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [LINK_BASE, isActive ? LINK_ACTIVE : LINK_IDLE].join(' ')
      }
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </NavLink>
  )
}

/**
 * @param {object}   props
 * @param {Array}    [props.navLinks=[]]   — [{ label, to, icon? }]
 * @param {boolean}  [props.showAuth=true] — show Login/Register on public nav
 * @param {object}   [props.user=null]     — { name, avatar, role }
 * @param {Function} [props.onLogout]
 * @param {React.ReactNode} [props.actions] — optional slot for extra actions
 */
function Navbar({
  navLinks = [],
  showAuth = true,
  user = null,
  onLogout,
  actions,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { isDark, toggleTheme } = useTheme()

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <header
      className="sticky top-0 z-[200] w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm"
      role="banner"
    >
      <nav
        className="container-app flex items-center justify-between h-16"
        aria-label="Main navigation"
        ref={menuRef}
      >
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
          aria-label={`${APP_NAME} — home`}
        >
          <span className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg text-white group-hover:bg-primary-700 transition-colors">
            <MdMedication size={20} aria-hidden="true" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400 tracking-tight">Smart Medicine</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider uppercase">Janaushadhi</span>
          </span>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────────────────── */}
        {navLinks.length > 0 && (
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavbarLink to={link.to} icon={link.icon}>
                  {link.label}
                </NavbarLink>
              </li>
            ))}
          </ul>
        )}

        {/* ── Desktop right actions ──────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Extra action slot */}
          {actions}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-md text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {isDark
              ? <HiOutlineSun  size={20} aria-hidden="true" />
              : <HiOutlineMoon size={20} aria-hidden="true" />}
          </button>

          {/* Search shortcut */}
          <Link
            to={ROUTES.USER.SEARCH}
            aria-label="Search medicines"
            className="flex items-center justify-center w-9 h-9 rounded-md text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <HiOutlineMagnifyingGlass size={20} aria-hidden="true" />
          </Link>

          {user ? (
            <>
              {/* Notifications */}
              <Link
                to={ROUTES.USER.NOTIFICATIONS}
                aria-label="Notifications"
                className="relative flex items-center justify-center w-9 h-9 rounded-md text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <HiOutlineBell size={20} aria-hidden="true" />
                {/* Unread dot — populated in Module 4 */}
              </Link>
              {/* User avatar */}
              <Link
                to={ROUTES.USER.PROFILE}
                aria-label="Your profile"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
              </Link>
            </>
          ) : showAuth ? (
            <>
              <Button variant="ghost" size="sm" as={Link} to={ROUTES.LOGIN}>
                Log in
              </Button>
              <Button variant="primary" size="sm" as={Link} to={ROUTES.REGISTER}>
                Register
              </Button>
            </>
          ) : (
            <Link
              to={ROUTES.USER.PROFILE}
              aria-label="Profile"
              className="flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:text-primary-600 transition-colors"
            >
              <HiOutlineUser size={20} aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* ── Mobile hamburger ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {menuOpen
            ? <HiOutlineXMark size={22} aria-hidden="true" />
            : <HiOutlineBars3 size={22} aria-hidden="true" />}
        </button>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 shadow-lg"
        >
          {navLinks.map((link) => (
            <NavbarLink key={link.to} to={link.to} icon={link.icon} mobile onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavbarLink>
          ))}

          {/* Theme toggle in mobile menu */}
          <button
            type="button"
            onClick={() => { toggleTheme(); setMenuOpen(false) }}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors"
          >
            {isDark
              ? <><HiOutlineSun size={18} aria-hidden="true" /> Switch to Light Mode</>
              : <><HiOutlineMoon size={18} aria-hidden="true" /> Switch to Dark Mode</>}
          </button>

          {/* Auth actions for mobile */}
          {!user && showAuth && (
            <div className="flex flex-col gap-2 p-4 border-t border-slate-100 dark:border-slate-700">
              <Link
                to={ROUTES.LOGIN}
                className="w-full text-center py-2 px-4 rounded-md border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="w-full text-center py-2 px-4 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
