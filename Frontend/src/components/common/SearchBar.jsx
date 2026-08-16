/**
 * SearchBar Component
 *
 * Purpose : The primary search input for medicine name / composition
 *           search. Prominent, accessible, feature-rich.
 * Location : src/components/common/SearchBar.jsx
 *
 * Features :
 *   - Search icon on left
 *   - Clear (×) button when value is present
 *   - Loading spinner while fetching suggestions
 *   - Keyboard: Enter triggers onSearch, Escape clears
 *   - Suggestions slot (populated by Module 4)
 *   - Size variants: sm | md | lg
 *   - Disabled state
 *
 * Future usage :
 *   Module 4 — Home page hero search, medicine search page,
 *              inline search within pharmacy inventory view.
 *
 * @param {string}   props.value
 * @param {Function} props.onChange          — (value: string) => void
 * @param {Function} [props.onSearch]        — called on Enter / search icon click
 * @param {Function} [props.onClear]
 * @param {string}   [props.placeholder]
 * @param {boolean}  [props.loading=false]
 * @param {boolean}  [props.disabled=false]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {React.ReactNode} [props.suggestions] — suggestions dropdown slot
 * @param {string}   [props.className]
 */

import { useRef } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineXCircle } from 'react-icons/hi2'
import Spinner from '../feedback/Spinner'

const SIZES = {
  sm: { wrap: 'h-9',  input: 'text-sm pl-9 pr-9',   icon: 16 },
  md: { wrap: 'h-11', input: 'text-sm pl-10 pr-10',  icon: 18 },
  lg: { wrap: 'h-14', input: 'text-base pl-12 pr-12', icon: 22 },
}

const LEFT_POS  = { sm: 'left-2.5', md: 'left-3', lg: 'left-3.5' }
const RIGHT_POS = { sm: 'right-2.5', md: 'right-3', lg: 'right-3.5' }

function SearchBar({
  value = '',
  onChange,
  onSearch,
  onClear,
  // Improved placeholder — clearly communicates multi-method search capability
  // FastAPI Search API: GET /api/v1/medicines/search?q=
  placeholder = 'Search by Brand, Generic or Jan Aushadhi medicine name…',
  loading = false,
  disabled = false,
  size = 'md',
  suggestions,
  className = '',
}) {
  const inputRef = useRef(null)
  const s = SIZES[size] ?? SIZES.md

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); onSearch?.(value) }
    if (e.key === 'Escape') { onClear?.(); onChange?.('') }
  }

  function handleClear() {
    onChange?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative flex items-center ${s.wrap}`}>
        {/* Search icon / search button */}
        <button
          type="button"
          onClick={() => onSearch?.(value)}
          aria-label="Search"
          disabled={disabled}
          className={[
            'absolute z-10 flex items-center justify-center text-slate-400',
            'hover:text-primary-600 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded',
            LEFT_POS[size],
            disabled ? 'pointer-events-none' : '',
          ].join(' ')}
        >
          <HiOutlineMagnifyingGlass size={s.icon} aria-hidden="true" />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          aria-label={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={[
            'w-full h-full rounded-xl border border-slate-200 bg-white outline-none',
            'placeholder:text-slate-400 placeholder:opacity-100 text-slate-900',
            'transition-colors duration-150',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            'dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100',
            'dark:placeholder:text-slate-500',
            s.input,
          ].join(' ')}
        />

        {/* Right: spinner or clear */}
        <div className={`absolute z-10 ${RIGHT_POS[size]} flex items-center`}>
          {loading ? (
            <Spinner size="xs" />
          ) : value ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
            >
              <HiOutlineXCircle size={s.icon} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions slot */}
      {suggestions && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-1">
          {suggestions}
        </div>
      )}
    </div>
  )
}

export default SearchBar
