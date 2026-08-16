/**
 * TopBar Component
 *
 * Purpose : Authenticated top bar rendered inside UserLayout,
 *           PharmacyLayout, and AdminLayout above the main content.
 *           Sits alongside the Sidebar, not replacing the public Navbar.
 *
 * Location : src/components/navigation/TopBar.jsx
 *
 * Features :
 *   - Mobile hamburger to open/close Sidebar
 *   - Page title / breadcrumb slot
 *   - Notification bell (placeholder, wired in Module 5)
 *   - User avatar with role badge
 *   - Theme toggle placeholder
 *   - Search shortcut (for user layout)
 *
 * Props :
 *   onMenuOpen    — () => void  open mobile sidebar
 *   title         — string  current page title
 *   breadcrumb    — React node
 *   user          — { name, role, avatar? }
 *   onLogout      — () => void
 *   showSearch    — boolean (default false)
 *   notifCount    — number  notification badge count
 */

import { Link } from 'react-router-dom'
import { HiOutlineBars3, HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { ROUTES } from '../../constants/routes'

function TopBar({
  onMenuOpen,
  title,
  breadcrumb,
  user,
  onLogout,
  showSearch = false,
  notifCount = 0,
}) {
  return (
    <header className="sticky top-0 z-[200] flex items-center h-14 px-4 bg-white border-b border-slate-200 gap-3 shrink-0">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-slate-500 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <HiOutlineBars3 size={20} aria-hidden="true" />
      </button>

      {/* Title / breadcrumb */}
      <div className="flex-1 min-w-0">
        {breadcrumb ?? (
          title && (
            <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
          )
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Search shortcut */}
        {showSearch && (
          <Link
            to={ROUTES.USER.SEARCH}
            aria-label="Search medicines"
            className="flex items-center justify-center w-9 h-9 rounded-md text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <HiOutlineMagnifyingGlass size={18} aria-hidden="true" />
          </Link>
        )}

        {/* Notifications */}
        <Link
          to={ROUTES.USER.NOTIFICATIONS}
          aria-label={`Notifications${notifCount > 0 ? `, ${notifCount} unread` : ''}`}
          className="relative flex items-center justify-center w-9 h-9 rounded-md text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineBell size={18} aria-hidden="true" />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold leading-none">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </Link>

        {/* User avatar + role */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-xs font-semibold text-slate-700">{user.name}</span>
              <Badge variant="primary" size="sm" className="mt-0.5">{user.role}</Badge>
            </div>
            <button
              type="button"
              aria-label="User menu"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
            >
              <Avatar src={user.avatar} name={user.name} size="sm" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
