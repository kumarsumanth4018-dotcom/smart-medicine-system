/**
 * Skeleton Loader Component
 *
 * Purpose : Animated placeholder shown while content is loading.
 *           Prevents layout shift and improves perceived performance.
 * Location : src/components/feedback/Skeleton.jsx
 *
 * Variants : text | circle | rect | card
 * Features : configurable width/height, rounded, repeat count,
 *            composable via children
 *
 * Future usage : Medicine cards, pharmacy cards, dashboard stats,
 *   search results (Module 4), inventory table rows (Module 5).
 */

const BASE = 'animate-pulse bg-slate-200 rounded'

/**
 * Single skeleton line / shape
 *
 * @param {string}  [props.variant='rect']  — 'text'|'rect'|'circle'
 * @param {string}  [props.width='w-full']  — Tailwind width class
 * @param {string}  [props.height='h-4']    — Tailwind height class
 * @param {string}  [props.className]
 */
export function SkeletonLine({
  variant = 'rect',
  width = 'w-full',
  height = 'h-4',
  className = '',
}) {
  const shape =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded'
      : 'rounded-md'

  return (
    <div
      aria-hidden="true"
      className={[BASE, shape, width, height, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

/**
 * Medicine Card Skeleton — mirrors MedicineCard layout
 */
export function MedicineCardSkeleton() {
  return (
    <div className="card p-4 space-y-3" aria-hidden="true">
      <div className="flex items-start gap-3">
        <SkeletonLine variant="circle" width="w-10" height="h-10" />
        <div className="flex-1 space-y-2">
          <SkeletonLine height="h-4" width="w-3/4" />
          <SkeletonLine height="h-3" width="w-1/2" />
        </div>
      </div>
      <SkeletonLine height="h-3" width="w-full" />
      <div className="flex gap-2">
        <SkeletonLine height="h-5" width="w-16" />
        <SkeletonLine height="h-5" width="w-20" />
      </div>
      <div className="flex justify-between items-center pt-1">
        <SkeletonLine height="h-5" width="w-24" />
        <SkeletonLine height="h-8" width="w-20" />
      </div>
    </div>
  )
}

/**
 * Pharmacy Card Skeleton
 */
export function PharmacyCardSkeleton() {
  return (
    <div className="card p-4 space-y-3" aria-hidden="true">
      <div className="flex justify-between">
        <SkeletonLine height="h-4" width="w-1/2" />
        <SkeletonLine height="h-5" width="w-16" />
      </div>
      <SkeletonLine height="h-3" width="w-3/4" />
      <SkeletonLine height="h-3" width="w-1/3" />
      <div className="flex gap-2 pt-1">
        <SkeletonLine height="h-8" width="w-full" />
        <SkeletonLine height="h-8" width="w-full" />
      </div>
    </div>
  )
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLine height="h-4" width={i === 0 ? 'w-3/4' : 'w-full'} />
        </td>
      ))}
    </tr>
  )
}

/**
 * Generic Skeleton — renders n repeated SkeletonLines
 *
 * @param {number} [props.lines=3]
 * @param {string} [props.className]
 */
function Skeleton({ lines = 3, className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={`space-y-3 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default Skeleton
