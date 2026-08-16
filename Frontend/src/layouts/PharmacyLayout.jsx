/**
 * Pharmacy Layout
 *
 * Wraps all pharmacy staff dashboard pages.
 *
 * Structure (desktop):
 *   ┌─────────┬──────────────────────────┐
 *   │         │  TopBar                  │
 *   │ Sidebar ├──────────────────────────┤
 *   │         │  <Outlet />              │
 *   └─────────┴──────────────────────────┘
 *
 * Sidebar uses PHARMACY_NAV config.
 * Mobile sidebar renders as off-canvas overlay.
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, TopBar } from '../components/navigation'
import { PHARMACY_NAV } from '../constants/navConfig'
import { useAuth } from '../contexts/AuthContext'
import DemoBanner from '../components/common/DemoBanner'

function PharmacyLayout() {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, logout, isDemo } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        navItems={PHARMACY_NAV}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={currentUser}
        onLogout={logout}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onMenuOpen={() => setMobileOpen(true)}
          user={currentUser}
          onLogout={logout}
        />

        {/* Demo mode banner — visible only during demo sessions */}
        {isDemo && <DemoBanner />}

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 page-enter"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default PharmacyLayout
