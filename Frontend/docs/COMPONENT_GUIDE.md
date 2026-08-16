# Component Guide

## Every Reusable Component Explained

---

## How to Read This Guide

For each component you will find:
- **What it is** — purpose in plain English
- **Props** — what inputs it accepts
- **Used in** — which pages use it
- **Why it was created** — the problem it solves

---

## UI Components (`components/ui/`)

### Button

**What it is:** The primary interactive element. Used for every clickable action.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | `primary`, `secondary`, `danger`, `outline`, `ghost` |
| `size` | string | `'md'` | `sm`, `md`, `lg` |
| `isLoading` | boolean | `false` | Shows spinner, disables button |
| `leftIcon` | node | — | Icon before label |
| `rightIcon` | node | — | Icon after label |
| `fullWidth` | boolean | `false` | Stretches to container width |
| `disabled` | boolean | `false` | Disables interaction |

**Used in:** Every page — login forms, search actions, inventory, admin actions.

**Why it was created:** Without a shared Button component, every developer writes their own button HTML with different classes. This creates visual inconsistency. One Button component means one consistent style everywhere.

---

### Badge

**What it is:** A small inline label used to communicate status or category.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `accent` |
| `size` | string | `'md'` | `sm`, `md` |
| `dot` | boolean | `false` | Shows a coloured dot before the label |
| `icon` | node | — | Icon before text |

**Example uses:**
- "In Stock" — `variant="success" dot`
- "Out of Stock" — `variant="danger" dot`
- "Jan Aushadhi" — `variant="info"`
- "Admin" — `variant="danger"`

**Used in:** SearchResultCard, MedicineCard, UserDashboard, AdminUsers, InventoryPage.

---

### Avatar

**What it is:** Displays a user's profile picture. Falls back to initials if no image.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Image URL |
| `name` | string | User name (used to generate initials) |
| `size` | string | `xs`, `sm`, `md`, `lg`, `xl` |
| `status` | string | `online`, `offline`, `busy` — shows status dot |

**Used in:** TopBar (logged-in user avatar), ProfilePage, UserDashboard, AdminUsers.

---

### Divider

**What it is:** A horizontal or vertical line that separates content sections.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `orientation` | string | `horizontal` (default) or `vertical` |
| `label` | string | Optional text shown in the middle of the line |

**Used in:** Auth pages ("or continue with"), card sections, form sections.

---

### IconButton

**What it is:** A square button containing only an icon. Used for compact toolbar actions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `icon` | node | The icon to render |
| `variant` | string | Same as Button variants |
| `size` | string | `sm`, `md`, `lg` |
| `aria-label` | string | **Required** for accessibility |

**Used in:** TopBar (theme toggle), modal close buttons, table action columns.

---

## Form Components (`components/forms/`)

### Input

**What it is:** A styled text input field with label, helper text, and error state.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Label above the input |
| `error` | string | Error message shown below |
| `leftIcon` | node | Icon inside left of input |
| `rightIcon` | node | Icon inside right of input |
| `helperText` | string | Hint text below input |

**Used in:** LoginPage, RegisterPage, MedicineFormPage, ProfilePage.

---

### PasswordInput

**What it is:** Input with a show/hide toggle for password fields.

**Why it was created:** Password fields need a consistent toggle behaviour. Without this component, every password field would need to duplicate the show/hide logic.

**Used in:** LoginPage, RegisterPage, ResetPasswordPage.

---

### PasswordStrength

**What it is:** A visual bar that shows password strength (Weak / Fair / Strong / Very Strong).

**How it works:** Checks for: minimum length, uppercase, lowercase, number. Each criterion adds to the strength score.

**Used in:** RegisterPage alongside the PasswordInput.

---

### OtpInput

**What it is:** Six individual single-digit input boxes for OTP entry. Automatically advances focus to the next box when a digit is entered.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `length` | number | Number of boxes (default 6) |
| `onChange` | function | Called with the full OTP string when complete |

**Used in:** VerifyOtpPage.

---

### Select

**What it is:** A styled dropdown select element.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `options` | array | `[{ value, label }]` |
| `label` | string | Label above the select |
| `error` | string | Error message |

**Used in:** MedicineFormPage (medicine type, category), AdminSettings.

---

### Toggle

**What it is:** An on/off switch. Visually superior to a checkbox for binary settings.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `checked` | boolean | Current state |
| `onChange` | function | Called when toggled |
| `label` | string | Label beside the toggle |

**Used in:** UserDashboard (notification settings), AdminSettings, ProfilePage.

---

### FormField

**What it is:** A wrapper component that adds label, error message, and helper text to any form control.

**Why it was created:** Every input needs a label above and an error below. Instead of duplicating this HTML in every input component, FormField wraps any child and adds it.

---

## Card Components (`components/cards/`)

### MedicineCard

**What it is:** A basic medicine display card for grids and recommendation sections.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `medicine` | object | Medicine data (name, genericName, price, availability) |
| `onView` | function | Called when card is clicked |
| `variant` | string | `default`, `compact`, `horizontal` |

**Used in:** GenericRecommendationPage, UserDashboard recent medicines section.

---

### SearchResultCard

**What it is:** The rich medicine card on the Search Results page. Much more detailed than MedicineCard.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `medicine` | object | Full medicine object |
| `isComparing` | boolean | Whether comparison mode is active |
| `isSelected` | boolean | Whether this card is selected for compare |
| `onCompare` | function | Toggle comparison selection |
| `onView` | function | Navigate to medicine detail |
| `onShare` | function | Share medicine (uses Web Share API) |
| `isBestValue` | boolean | Shows "Best Value" ribbon |
| `layout` | string | `'grid'` or `'list'` |

**Features:**
- Smart availability badges
- Compare checkbox
- Save/bookmark toggle (local state)
- Share button (Web Share API fallback)
- "Best Value" ribbon for the best-priced generic

**Used in:** SearchResultsPage only.

---

### PharmacyCard

**What it is:** Displays a pharmacy's name, address, distance, and stock status.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `pharmacy` | object | Pharmacy data (name, address, distance, isOpen) |
| `onView` | function | Navigate to pharmacy detail |
| `onGetDirections` | function | Opens map directions |

**Used in:** NearbyPharmaciesPage pharmacy list alongside the Leaflet map.

---

### NotificationCard

**What it is:** A single notification item showing icon, message, time, and read/unread state.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `notification` | object | `{ type, title, message, time, isRead }` |
| `onMarkRead` | function | Mark this notification as read |
| `onDismiss` | function | Remove this notification |

**Used in:** NotificationsPage.

---

### InfoCard

**What it is:** A generic stat/info card for dashboards showing a title, value, icon, and trend.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Card label (e.g. "Total Searches") |
| `value` | string/number | Main metric value |
| `icon` | node | Icon to display |
| `trend` | string | `up` or `down` |
| `trendValue` | string | e.g. "+12%" |
| `variant` | string | Colour variant |

**Used in:** UserDashboard, PharmacyDashboard, AdminDashboard.

---

## Common Components (`components/common/`)

### Breadcrumb

**What it is:** A horizontal navigation trail showing the user's location in the app hierarchy.

**Example:** `Home > Medicines > Paracetamol 500mg`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | array | `[]` | `[{ label, to }]` — last item is current page |
| `showHome` | boolean | `true` | Prepend a Home link |

**Accessibility:** Uses `<nav aria-label="Breadcrumb">`, `<ol>`, `aria-current="page"` on last item.

**Used in:** MedicineDetailsPage, InventoryPage, Admin pages.

---

### SearchBar

**What it is:** A search input field with a submit button and optional clear button.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `value` | string | Current search value |
| `onChange` | function | Called on input change |
| `onSubmit` | function | Called on form submit |
| `placeholder` | string | Placeholder text |
| `isLoading` | boolean | Shows spinner in button |

**Used in:** MedicineSearchPage, InventoryPage (search filter).

---

### Pagination

**What it is:** Page navigation component with previous/next buttons and page number display.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | number | Active page |
| `totalPages` | number | Total number of pages |
| `onPageChange` | function | Called with new page number |

**Used in:** SearchResultsPage, InventoryPage, AdminUsers, AdminMedicines.

---

### AppErrorBoundary

**What it is:** A React class component that catches JavaScript errors in the component tree and shows `ServerErrorPage` instead of a blank screen.

**Why it was created:** Without an error boundary, any uncaught JavaScript error crashes the entire app and shows a blank white screen. This catches it gracefully.

**Used in:** `main.jsx` — wraps the entire application.

---

## Feedback Components (`components/feedback/`)

### Spinner

**Props:** `size` (sm/md/lg), `color`, `label` (screen reader text)

**Used in:** Route loading fallback, button loading states, page loading states.

---

### Skeleton

**What it is:** A grey animated placeholder that mimics the shape of content while it loads. Better UX than a spinner because users can see the layout before data arrives.

**Used in:** Medicine search results while loading, dashboard sections.

---

### EmptyState

**What it is:** A friendly "nothing to show" screen with an icon and description.

**Props:** `title`, `description`, `icon`, `actionLabel`, `onAction`

**Used in:** Search results (no medicines found), notifications (no notifications), inventory (empty stock).

---

### ErrorState

**What it is:** A friendly "something went wrong" screen with a retry button.

**Props:** `title`, `description`, `onRetry`

**Used in:** Any data-loading section that might fail.

---

## Navigation Components (`components/navigation/`)

### Navbar

**What it is:** The top navigation bar on the public home page. Shows the app logo, nav links, and login/register buttons.

**Used in:** `MainLayout` (home page only).

---

### Sidebar

**What it is:** The left navigation panel in all authenticated dashboards. Renders nav items from `navConfig.js` based on the current role.

**How it works:** Reads the nav items array (`USER_NAV`, `PHARMACY_NAV`, `ADMIN_NAV`) and renders links. Active link is highlighted using React Router's `NavLink`.

**Used in:** `UserLayout`, `PharmacyLayout`, `AdminLayout`.

---

### TopBar

**What it is:** The horizontal top bar inside authenticated layouts. Shows page title, user avatar, notification bell, and theme toggle.

**Used in:** `UserLayout`, `PharmacyLayout`, `AdminLayout`.

---

### Footer

**What it is:** The site footer with project information, links, and copyright.

**Used in:** `MainLayout` (public home page).

---

## Dialog Components (`components/dialogs/`)

### Modal

**What it is:** A configurable overlay dialog.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Whether the modal is visible |
| `onClose` | function | Called when closing |
| `title` | string | Modal header title |
| `size` | string | `sm`, `md`, `lg`, `xl` |

**Accessibility:** Traps focus inside the modal when open, closes on Escape key.

**Used in:** MedicineDetailsPage (quick view), GenericRecommendationPage.

---

### ConfirmDialog

**What it is:** A specialised modal with "Confirm" and "Cancel" buttons. Used for destructive actions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Visibility |
| `onConfirm` | function | Called on confirm |
| `onCancel` | function | Called on cancel |
| `title` | string | Dialog heading |
| `description` | string | Explanation of what will happen |
| `confirmLabel` | string | Button text (default "Confirm") |
| `isDangerous` | boolean | Makes confirm button red |

**Used in:** InventoryPage (delete stock), AdminUsers (delete user), AdminMedicines (delete medicine).

---

## Layout Components (`components/layout/`)

### Container

**What it is:** A `<div>` with `max-width: 1280px` and responsive horizontal padding. Prevents content from stretching too wide on large screens.

**Used in:** Every page section.

---

### PageHeader

**What it is:** A consistent page heading block with title, optional subtitle, breadcrumb, and action button.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Page title |
| `subtitle` | string | Page subtitle |
| `breadcrumbs` | array | Breadcrumb items |
| `action` | node | Optional action button |

**Used in:** InventoryPage, AdminPages, ProfilePage.

---

### SectionHeader

**What it is:** A section title within a page (h2 level).

**Used in:** HomePage sections, UserDashboard sections.
