/**
 * Container Component
 *
 * Purpose : Responsive page wrapper that enforces consistent max-width,
 *           horizontal padding, and centring across all pages.
 *           All pages wrap their content in <Container> to guarantee
 *           layout consistency on every screen size.
 *
 * Location : src/components/layout/Container.jsx
 *
 * Sizes    : sm | md | lg | xl (default) | 2xl | full
 * Props    : size, padding (none|sm|md|lg), as (element tag), className
 *
 * Future modules : Used by every page component (Module 4–6).
 */

const MAX_WIDTHS = {
  sm:   'max-w-screen-sm',
  md:   'max-w-screen-md',
  lg:   'max-w-screen-lg',
  xl:   'max-w-screen-xl',
  '2xl':'max-w-screen-2xl',
  full: 'max-w-full',
}

const PADDINGS = {
  none: '',
  sm:   'px-4',
  md:   'px-4 sm:px-6',
  lg:   'px-4 sm:px-6 lg:px-8',
}

/**
 * @param {object}  props
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'full'} [props.size='xl']
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md']
 * @param {string}  [props.as='div']  — HTML element to render
 * @param {string}  [props.className]
 * @param {React.ReactNode} props.children
 */
function Container({
  size = 'xl',
  padding = 'md',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'w-full mx-auto',
    MAX_WIDTHS[size] ?? MAX_WIDTHS.xl,
    PADDINGS[padding] ?? PADDINGS.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

export default Container
