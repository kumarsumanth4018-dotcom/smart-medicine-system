/**
 * Avatar Component
 *
 * Purpose : Displays a user's profile picture, initials, or a
 *           default placeholder. Used in navbars, user cards,
 *           and comment threads.
 * Location : src/components/ui/Avatar.jsx
 *
 * Sources  : image URL | initials string | default icon fallback
 * Sizes    : xs | sm | md | lg | xl
 * Features : optional online indicator dot
 *
 * Future usage: Navbar user menu, patient profiles, doctor cards,
 *               admin user management table.
 */

import { HiOutlineUser } from 'react-icons/hi2'

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

const INDICATOR_SIZES = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
}

const BG_COLORS = [
  'bg-primary-100 text-primary-700',
  'bg-secondary-100 text-secondary-700',
  'bg-accent-100 text-accent-700',
  'bg-warning-100 text-warning-700',
  'bg-success-100 text-success-700',
]

/** Deterministic color from name string */
function colorFromName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length]
}

/** Extract up to two initials from a full name */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/**
 * @param {object}  props
 * @param {string}  [props.src]         — image URL
 * @param {string}  [props.name]        — full name (used for initials + alt)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {boolean} [props.online]      — shows a green indicator dot
 * @param {string}  [props.className]
 */
function Avatar({ src, name = '', size = 'md', online, className = '' }) {
  const sizeClass = SIZES[size] ?? SIZES.md
  const indicatorSize = INDICATOR_SIZES[size] ?? INDICATOR_SIZES.md
  const initials = getInitials(name)
  const colorClass = colorFromName(name)

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Image */}
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white`}
        />
      ) : initials ? (
        /* Initials */
        <div
          className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold ring-2 ring-white`}
          aria-label={name}
        >
          {initials}
        </div>
      ) : (
        /* Default icon */
        <div
          className={`${sizeClass} bg-slate-100 text-slate-400 rounded-full flex items-center justify-center ring-2 ring-white`}
          aria-label="User avatar"
        >
          <HiOutlineUser className="w-1/2 h-1/2" aria-hidden="true" />
        </div>
      )}

      {/* Online indicator */}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${indicatorSize} rounded-full ring-2 ring-white ${online ? 'bg-success-500' : 'bg-slate-300'}`}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  )
}

export default Avatar
