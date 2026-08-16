/**
 * Sidebar Component
 *
 * Purpose : Collapsible side navigation for authenticated dashboards.
 *           Shared by UserLayout, PharmacyLayout, and AdminLayout.
 *           Each layout passes its own navItems config.
 *
 * Location : src/components/navigation/Sidebar.jsx
 *
 * Features :
 *   - Collapsible (icon-only ↔ full label mode)
 *   - Active route highlight via NavLink
 *   - Group headers for section separation
 *   - Nested child items (one level deep)
 *   - Mobile: off-canvas overlay drawer (controlled by parent)
 *   - Logo / brand strip at top
 *   - User profile strip at bottom
 *   - Keyboard accessible, focus-visible rings
 *
 * Props :
 *   navItems   — array of nav group/item config (see NAV_ITEM shape below)
 *   collapsed  — boolean (icon-only mode)
 *   onCollapse — () => void  toggle handler
 *   mobileOpen — boolean (mobile overlay visible)
 *   onMobileClose — () => void
 *   user       — { name, role, avatar? }
 *   onLogout   — () => void
 *
 * NAV_ITEM shape:
 *   { type: 'group', label }          — section divider with label
 *   { type: 'item',  label, to, icon, badge? }
 *   { type: 'item',  label, icon, children: [{ label, to }] }  — expandable
 */

import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MdMedication } from 'react-icons/md'
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineChevronDown, HiOutlineXMark, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { APP_NAME } from '../../constants/app'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { ROUTES } from '../../constants/routes'

// ── Shared style strings ───────────────────────────────────────────────────────
const ITEM_BASE =
  'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ' +
  'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-primary-500 w-full text-left'
const ITEM_IDLE   = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
const ITEM_ACTIVE = 'bg-primary-50 text-primary-700 font-semibold'

// ── Sub-item ─────────────────────────────────────────────────────────────────
function SubItem({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 pl-10 pr-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          isActive
            ? 'text-primary-700 bg-primary-50'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {item.label}
    </NavLink>
  )
}

// ── Nav item (single or expandable) ──────────────────────────────────────────
function NavItem({ item, collapsed }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  const Icon = item.icon

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className={`${ITEM_BASE} ${ITEM_IDLE} justify-between`}
          title={collapsed ? item.label : undefined}
        >
          <span className="flex items-center gap-3 min-w-0">
            {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
            {!collapsed && <span className="truncate">{item.label}</span>}
          </span>
          {!collapsed && (
            <HiOutlineChevronDown
              size={14}
              className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          )}
        </button>
        {expanded && !collapsed && (
          <div className="mt-0.5 space-y-0.5">
            {item.children.map((child) => (
              <SubItem key={child.to} item={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`
      }
    >
      {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge variant={item.badge.variant ?? 'primary'} size="sm">
              {item.badge.label}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  )
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({
  navItems = [],
  collapsed = false,
  onCollapse,
  mobileOpen = false,
  onMobileClose,
  user,
  onLogout,
}) {
  const overlayRef = useRef(null)

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return
    const handle = (e) => { if (e.key === 'Escape') onMobileClose?.() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [mobileOpen, onMobileClose])

  const sidebarContent = (
    <div className={[
      'flex flex-col h-full bg-white border-r border-slate-200',
      collapsed ? 'w-16' : 'w-64',
      'transition-all duration-300',
    ].join(' ')}>

      {/* ── Brand strip ─────────────────────────────────────────────── */}
      <div className={`flex items-center h-16 border-b border-slate-100 px-3 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link to={ROUTES.HOME} className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md">
            <span className="flex items-center justify-center w-7 h-7 bg-primary-600 rounded-lg text-white shrink-0">
              <MdMedication size={16} aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xs font-bold text-primary-700 truncate">{APP_NAME}</span>
              <span className="text-[9px] text-slate-400 tracking-wider uppercase">Janaushadhi</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <span className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg text-white">
            <MdMedication size={18} aria-hidden="true" />
          </span>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          type="button"
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0"
        >
          {collapsed
            ? <HiOutlineChevronRight size={14} aria-hidden="true" />
            : <HiOutlineChevronLeft  size={14} aria-hidden="true" />}
        </button>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <HiOutlineXMark size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Nav items ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Sidebar navigation">
        {navItems.map((item, idx) => {
          if (item.type === 'group') {
            return collapsed ? (
              <div key={idx} className="my-2 h-px bg-slate-100" aria-hidden="true" />
            ) : (
              <p key={idx} className="px-3 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
            )
          }
          return <NavItem key={item.to ?? idx} item={item} collapsed={collapsed} />
        })}
      </nav>

      {/* ── User strip ──────────────────────────────────────────────── */}
      {user && (
        <div className="shrink-0 border-t border-slate-100 p-3">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <Avatar src={user.avatar} name={user.name} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{user.role}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <HiOutlineArrowRightOnRectangle size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0" aria-label="Main sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[300] flex" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Backdrop */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex h-full" aria-label="Mobile sidebar">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
