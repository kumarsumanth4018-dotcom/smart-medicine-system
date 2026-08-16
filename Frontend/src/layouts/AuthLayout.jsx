/**
 * Auth Layout
 *
 * Wraps authentication pages: Login, Register, Verify OTP,
 * Forgot Password, Reset Password.
 *
 * No Navbar or Footer — clean centred card, brand logo at top.
 *
 * Structure:
 *   ┌──────────────────────────────┐
 *   │  bg gradient                 │
 *   │   ┌──────────────────┐       │
 *   │   │  Brand logo      │       │
 *   │   │  <Outlet />      │       │
 *   │   └──────────────────┘       │
 *   │  copyright strip             │
 *   └──────────────────────────────┘
 */

import { Link, Outlet } from 'react-router-dom'
import { MdMedication } from 'react-icons/md'
import { APP_NAME, APP_VERSION } from '../constants/app'
import { ROUTES } from '../constants/routes'

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Skip to content */}
      <a
        href="#auth-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:text-sm"
      >
        Skip to form
      </a>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Brand */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 mb-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
          aria-label={`${APP_NAME} — home`}
        >
          <span className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl text-white shadow-md group-hover:bg-primary-700 transition-colors">
            <MdMedication size={22} aria-hidden="true" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-primary-700 tracking-tight">
              Smart Medicine
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">
              Janaushadhi System
            </span>
          </div>
        </Link>

        {/* Auth card */}
        <div
          id="auth-form"
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8"
        >
          <Outlet />
        </div>
      </div>

      {/* Bottom copyright */}
      <footer className="py-4 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {APP_NAME} · v{APP_VERSION} · Final Year Engineering Project
        </p>
      </footer>
    </div>
  )
}

export default AuthLayout
