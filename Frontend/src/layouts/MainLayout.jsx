/**
 * Main Layout
 *
 * Public-facing layout: landing page, medicine search (unauthenticated),
 * nearby pharmacies (unauthenticated), and static pages.
 *
 * Structure:
 *   ┌──────────────────────────────┐
 *   │         Navbar               │  sticky top
 *   ├──────────────────────────────┤
 *   │  <Outlet /> (flex-1)         │  page content
 *   ├──────────────────────────────┤
 *   │         Footer               │
 *   └──────────────────────────────┘
 */

import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components/navigation'
import { PUBLIC_NAV_LINKS } from '../constants/navConfig'
import { useAuth } from '../contexts/AuthContext'

function MainLayout() {
  const { currentUser, isAuthenticated, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        navLinks={PUBLIC_NAV_LINKS}
        showAuth={!isAuthenticated}
        user={isAuthenticated ? currentUser : null}
        onLogout={logout}
      />

      <main className="flex-1 page-enter" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
