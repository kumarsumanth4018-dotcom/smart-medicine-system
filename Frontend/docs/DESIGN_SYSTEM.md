# Design System

## Smart Medicine System — Visual Design Language

---

## 1. What is a Design System?

A design system is a set of rules, tokens, and components that define how the application looks and feels. It ensures:
- Every page has a consistent visual style
- Developers don't invent their own colours, fonts, or spacing
- The UI feels professional and trustworthy (critical for healthcare)

This project's design system is implemented in `src/index.css` using Tailwind v4's `@theme {}` CSS-first approach.

---

## 2. Healthcare Theme

The visual identity was designed specifically for a **healthcare application**:

- **Medical Blue** (`#2563eb`) — primary actions, links, trust
- **Teal** (`#0d9488`) — secondary actions, healthcare accent
- **Clean White** backgrounds — medical/clinical feel
- **Slate greys** — professional, neutral text
- **Green** for success (In Stock), **Red** for danger (Out of Stock)

This is intentional: healthcare apps should feel **safe, professional, and trustworthy**. Playful or loud colours would undermine user confidence.

---

## 3. Colour Palette

### Primary — Medical Blue
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Light background tints |
| `primary-100` | `#dbeafe` | Badge backgrounds |
| `primary-300` | `#93c5fd` | Placeholder icons |
| `primary-600` | `#2563eb` | **Main buttons, links** |
| `primary-700` | `#1d4ed8` | Button hover |
| `primary-900` | `#1e3a8a` | Dark headings |

### Secondary — Teal
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-500` | `#14b8a6` | Secondary buttons, accents |
| `secondary-600` | `#0d9488` | Secondary hover |

### Semantic Colours
| Colour | Variant | Usage |
|--------|---------|-------|
| **Green** | `success-*` | In Stock, positive feedback |
| **Amber** | `warning-*` | Limited Stock, low inventory |
| **Red** | `danger-*` | Out of Stock, delete, errors |
| **Blue** | `info-*` | Jan Aushadhi badges, information |
| **Purple** | `accent-*` | New arrivals, highlights |

### Text Colours
```
text-slate-900  → Primary headings
text-slate-700  → Body text
text-slate-500  → Secondary text
text-slate-400  → Muted/helper text
text-slate-300  → Placeholders
```

---

## 4. Typography

**Font:** Inter — chosen for its exceptional legibility in data-dense UI.

### Type Scale
| Class | Size | Usage |
|-------|------|-------|
| `text-[10px]` | 10px | Ribbon labels, tiny tags |
| `text-xs` | 12px | Helper text, captions |
| `text-sm` | 14px | Body text, card content |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Subtitles |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Page sub-headings |
| `text-3xl` | 30px | Page titles |
| `text-4xl` | 36px | Hero headings |
| `text-5xl` | 48px | Display / hero |

### Font Weights
| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, secondary headings |
| `font-semibold` | 600 | Buttons, strong labels |
| `font-bold` | 700 | Card titles, page headings |
| `font-extrabold` | 800 | Hero text, prices |

---

## 5. Spacing System

Tailwind's 4px base unit:
- `p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px

**Standard patterns used in this project:**
```
Card padding:         p-4  (16px) or p-6  (24px)
Section padding:      py-20 (80px vertical)
Component gap:        gap-3 (12px) or gap-4 (16px)
Badge gap:            gap-1.5 (6px)
Form field margin:    mb-4 (16px between fields)
Grid gap:             gap-4 (16px) or gap-6 (24px)
```

---

## 6. Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Badges, small elements |
| `rounded-md` | 6px | Inputs, small buttons |
| `rounded-lg` | 8px | Buttons, chips |
| `rounded-xl` | 12px | Cards |
| `rounded-2xl` | 16px | Large cards, modals |
| `rounded-full` | 9999px | Circular avatars, pill badges |

---

## 7. Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Resting state of cards |
| `shadow-md` | Card hover state |
| `shadow-lg` | Modals, dropdowns |
| `shadow-card` | Custom card shadow (`0 2px 8px rgba(15,23,42,0.08)`) |
| `shadow-cardHover` | Custom hover shadow |

**Standard card shadow pattern:**
```jsx
<div className="shadow-sm hover:shadow-md transition-shadow">
```

---

## 8. Buttons

Five variants:

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| `primary` | `bg-primary-600` | white | Main actions (View Details, Login) |
| `secondary` | `bg-secondary-600` | white | Secondary actions |
| `danger` | `bg-danger-600` | white | Destructive actions (Delete) |
| `outline` | transparent | `text-primary-600` | Alternative actions |
| `ghost` | transparent | `text-slate-600` | Subtle actions |

**Sizes:**
- `sm` — compact buttons in tables
- `md` — standard form/action buttons
- `lg` — hero CTA buttons

---

## 9. Badges

Used extensively for medicine status, user roles, and categories.

| Variant | Background | Text | Typical Use |
|---------|-----------|------|-------------|
| `success` | `bg-success-100` | `text-success-700` | In Stock |
| `danger` | `bg-danger-100` | `text-danger-700` | Out of Stock |
| `warning` | `bg-warning-100` | `text-warning-700` | Limited Stock |
| `info` | `bg-info-100` | `text-info-700` | Jan Aushadhi |
| `primary` | `bg-primary-100` | `text-primary-700` | Nearby count |
| `secondary` | `bg-secondary-100` | `text-secondary-700` | Generic |
| `neutral` | `bg-slate-100` | `text-slate-600` | Category |

---

## 10. Form Design

Consistent form styling across all pages:

**Input states:**
```
Default:  border-slate-200
Focused:  border-primary-500 ring-2 ring-primary-200
Error:    border-danger-400 ring-2 ring-danger-200
Disabled: bg-slate-50 text-slate-400 cursor-not-allowed
```

**Error message:** `text-xs text-danger-600` below the input

**Label:** `text-sm font-medium text-slate-700` above the input

---

## 11. Cards

Standard card construction:
```jsx
<div className="
  bg-white                           // White background
  rounded-xl                         // 12px corners
  border border-slate-100            // Subtle border
  shadow-sm                          // Resting shadow
  hover:shadow-md                    // Deeper shadow on hover
  hover:-translate-y-0.5             // Slight lift on hover
  transition-all duration-200        // Smooth transition
  p-4                                // Inner spacing
">
```

**Best Value card (premium state):**
```jsx
<div className="border-primary-400 ring-2 ring-primary-200">
```

---

## 12. Icons

All icons come from two icon sets via `react-icons`:

| Set | Prefix | Style | Usage |
|-----|--------|-------|-------|
| HeroIcons v2 | `HiOutline*` | Outline | Navigation, UI actions |
| HeroIcons v2 | `Hi*` (solid) | Filled | Active/selected states |
| Material Design | `Md*` | Filled | Healthcare icons (MdMedication) |

**Accessibility rule:** All decorative icons have `aria-hidden="true"`. Icons that convey meaning have `aria-label` on the parent element.

---

## 13. Animations

| Animation | CSS | Usage |
|-----------|-----|-------|
| Page enter | `page-enter` class | All layout `<main>` elements |
| Card hover lift | `hover:-translate-y-0.5` | All cards |
| Smooth transitions | `transition-all duration-200` | Interactive elements |
| Skeleton pulse | `animate-pulse` | Loading states |
| Spinner | `animate-spin` | Loading indicators |

---

## 14. Dark Mode Architecture

Dark mode is managed by:
1. `ThemeContext` — stores theme state in localStorage
2. `ThemeContext` applies/removes `dark` class on `<html>`
3. CSS variables in `index.css` override under `.dark {}`
4. Components use `dark:` Tailwind prefix for dark variants

```jsx
{/* Component example */}
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

---

## 15. Z-Index Layers

| Layer | Value | Used For |
|-------|-------|---------|
| `dropdown` | 100 | Dropdowns, autocomplete |
| `sticky` | 200 | Sticky headers, CompareBar |
| `overlay` | 300 | Modal backdrop |
| `modal` | 400 | Modal content |
| `toast` | 500 | Toast notifications |
| `tooltip` | 600 | Tooltips |

This layering is defined in `tokens.js` and documented for future reference.

---

## 16. Why Design Consistency Matters

In a healthcare application, visual inconsistency creates:
- **Confusion** — users don't know what to click
- **Distrust** — inconsistent design feels unprofessional
- **Cognitive load** — users have to re-learn each page

With a design system:
- Every button looks and behaves the same
- Users intuitively understand the interface
- Adding new pages automatically looks consistent
- The project looks professional for university evaluation
