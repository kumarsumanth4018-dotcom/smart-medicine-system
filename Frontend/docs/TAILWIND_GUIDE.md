# Tailwind CSS Guide

## How Tailwind is Used in This Project

---

## 1. Why Tailwind CSS?

Traditional CSS approach:
```css
/* styles.css */
.medicine-card { background: white; border-radius: 12px; padding: 16px; }
.medicine-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
```
Problem: You have two files to maintain. CSS files grow huge. Class names can conflict.

Tailwind approach:
```jsx
<div className="bg-white rounded-xl p-4 hover:shadow-card transition-shadow">
```
All styling is inline in the JSX. No context-switching between files. No class name conflicts.

**Why Tailwind was chosen for this project:**
1. **Speed** — build UIs very quickly using utility classes
2. **Consistency** — the design system is enforced by the token system
3. **No CSS files** — no separate stylesheets to maintain
4. **Responsive built-in** — `sm:`, `md:`, `lg:` prefixes
5. **Design system** — `@theme {}` in `index.css` defines all tokens

---

## 2. How Tailwind v4 Works (CSS-First Design System)

This project uses **Tailwind v4** with a **CSS-first design system**. The custom design tokens are defined in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-600: #2563eb;
  --color-success-500: #22c55e;
  
  /* Typography */
  --font-sans: 'Inter', ui-sans-serif;
  
  /* Spacing */
  --spacing-section-y: 5rem;
}
```

These tokens become Tailwind utility classes automatically:
- `--color-primary-600` → `text-primary-600`, `bg-primary-600`, `border-primary-600`
- `--color-success-500` → `text-success-500`, `bg-success-500`

---

## 3. Flexbox

Flexbox is the most-used layout system in this project.

**Common patterns:**

```jsx
{/* Center content horizontally and vertically */}
<div className="flex items-center justify-center h-64">
  <Spinner />
</div>

{/* Space items with gap */}
<div className="flex items-center gap-3">
  <Avatar />
  <span>{user.name}</span>
</div>

{/* Push items to opposite ends */}
<div className="flex items-center justify-between">
  <h1>Dashboard</h1>
  <Button>Add New</Button>
</div>

{/* Wrap badges on overflow */}
<div className="flex flex-wrap gap-1.5">
  <Badge>In Stock</Badge>
  <Badge>Generic</Badge>
  <Badge>Jan Aushadhi</Badge>
</div>
```

| Class | Effect |
|-------|--------|
| `flex` | Enable flexbox |
| `flex-col` | Stack children vertically |
| `flex-row` | Arrange children horizontally |
| `items-center` | Align on cross axis (vertically in row) |
| `justify-center` | Align on main axis (horizontally in row) |
| `justify-between` | Space items to opposite ends |
| `flex-1` | Grow to fill available space |
| `flex-wrap` | Allow wrapping to next line |
| `gap-3` | Spacing between children (12px) |
| `shrink-0` | Prevent item from shrinking |

---

## 4. Grid

Used for card grids and multi-column layouts.

```jsx
{/* Responsive card grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {medicines.map(m => <SearchResultCard key={m.id} medicine={m} />)}
</div>

{/* Two-column form */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Input label="First Name" />
  <Input label="Last Name" />
</div>
```

---

## 5. Spacing

Tailwind uses a spacing scale based on `0.25rem` units:
- `p-4` = `padding: 1rem` (4 × 0.25rem)
- `m-2` = `margin: 0.5rem`
- `gap-3` = `gap: 0.75rem`

**Spacing in this project:**

```jsx
{/* Card padding */}
<div className="p-4">           {/* 16px padding all sides */}
<div className="px-4 py-3">    {/* 16px horizontal, 12px vertical */}
<div className="p-6">          {/* 24px — larger cards */}

{/* Section spacing */}
<section className="py-20">   {/* 80px vertical padding for sections */}

{/* Small gap */}
<div className="gap-1.5">     {/* 6px between badges */}
<div className="gap-4">       {/* 16px between cards */}
```

---

## 6. Typography

```jsx
{/* Page title */}
<h1 className="text-3xl font-bold text-slate-900">Medicine Search</h1>

{/* Section subtitle */}
<p className="text-lg text-slate-600">Find affordable medicines</p>

{/* Card name */}
<h3 className="text-sm font-bold text-slate-900 truncate">{medicine.name}</h3>

{/* Muted helper text */}
<p className="text-xs text-slate-400">{medicine.composition}</p>

{/* Price */}
<span className="text-base font-extrabold text-slate-900">₹{price}</span>

{/* Strikethrough MRP */}
<span className="text-xs text-slate-400 line-through">₹{mrp}</span>
```

| Class | Size |
|-------|------|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |

---

## 7. Colors

This project uses a **Medical Blue + Teal** colour palette defined in `index.css`:

```jsx
{/* Primary medical blue */}
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  View Details
</button>

{/* Success green */}
<Badge className="bg-success-100 text-success-700">In Stock</Badge>

{/* Warning amber */}
<Badge className="bg-warning-100 text-warning-700">Limited Stock</Badge>

{/* Danger red */}
<Badge className="bg-danger-100 text-danger-700">Out of Stock</Badge>

{/* Neutral slate */}
<p className="text-slate-500">Secondary text</p>
<p className="text-slate-400">Muted text</p>
```

---

## 8. Responsive Classes

Tailwind's mobile-first responsive system uses breakpoint prefixes:

| Prefix | Min-width | Device |
|--------|-----------|--------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Large mobile |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

**Example from SearchResultsPage:**
```jsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

**Example from Sidebar:**
```jsx
{/* Hidden on mobile, shown on large screens */}
<aside className="hidden lg:flex w-64 flex-col">
```

---

## 9. Hover and Focus States

Every interactive element has hover and focus styles for UX and accessibility:

```jsx
{/* Button hover */}
<button className="bg-primary-600 hover:bg-primary-700 transition-colors">

{/* Card hover */}
<div className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

{/* Link hover */}
<a className="text-slate-400 hover:text-primary-600 transition-colors">

{/* Focus ring for keyboard users */}
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
```

`focus-visible:` only shows the ring when using keyboard — not on mouse click (cleaner UX).

---

## 10. Transitions and Animations

```jsx
{/* Smooth color change */}
<button className="transition-colors duration-200">

{/* Card lift on hover */}
<div className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

{/* Page enter animation (applied to all layouts) */}
<main className="page-enter">
```

The `page-enter` animation is defined in `index.css`:
```css
@keyframes page-enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter {
  animation: page-enter 200ms ease-out;
}
```

---

## 11. Cards

The standard card pattern used throughout:

```jsx
<div className="
  bg-white 
  rounded-xl 
  border border-slate-100 
  shadow-sm 
  hover:shadow-md 
  hover:-translate-y-0.5 
  transition-all duration-200
  p-4
">
  {/* Card content */}
</div>
```

**Premium / highlighted card (Best Value):**
```jsx
<div className="border-primary-400 ring-2 ring-primary-200">
```

---

## 12. Forms Styling

```jsx
{/* Input field */}
<input className="
  w-full 
  px-3 py-2 
  text-sm 
  border border-slate-200 
  rounded-lg 
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary-500 
  focus:border-transparent
  transition-shadow
" />

{/* Error state */}
<input className="border-danger-400 focus:ring-danger-400" />

{/* Label */}
<label className="block text-sm font-medium text-slate-700 mb-1">
```

---

## 13. Dark Mode

The theme system applies `dark` class to `<html>` via ThemeContext. Tailwind's `dark:` prefix activates dark variants:

```jsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

The design token system in `index.css` also overrides `@theme` values under `.dark {}` for seamless theming.

---

## 14. Utility Combinations (Real Examples)

**Skip link (index.html):**
```css
.skip-link {
  position: absolute;
  top: -100%;   /* Hidden by default */
}
.skip-link:focus {
  top: 0;       /* Visible when focused by keyboard */
}
```

**Badge with dot:**
```jsx
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
  <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
  In Stock
</span>
```

**Truncated text:**
```jsx
<h3 className="text-sm font-bold text-slate-900 truncate max-w-full">
  {medicineName}
</h3>
```
