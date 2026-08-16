/**
 * Admin Layout
 *
 * Wraps all admin back-office pages.
 *
 * Structure (desktop):
 *   ┌─────────┬──────────────────────────┐
 *   │         │  TopBar                  │
 *   │  Admin  ├──────────────────────────┤
 *   │ Sidebar │  <Outlet />              │
 *   └─────────┴──────────────────────────┘
 *
 * Sidebar uses ADMIN_NAV config.
 * Admin sidebar starts collapsed by default (wider nav tree).
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, TopBar } from '../components/navigation'
import { ADMIN_NAV } from '../constants/navConfig'
import { useAuth } from '../contexts/AuthContext'
import DemoBanner from '../components/common/DemoBanner'

function AdminLayout() {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, logout, isDemo } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        navItems={ADMIN_NAV}
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
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 page-enter"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
