# Smart Medicine Availability & Intelligent Janaushadhi Recommendation System

**Frontend — Release Candidate v1.0.0**

> Final Year Engineering Project  
> React + Vite + Tailwind CSS v4 + React Leaflet

---

## Project Overview

A production-quality healthcare web application that helps users:

- **Search** branded and generic medicines by name, composition, or manufacturer
- **Discover** affordable PM Jan Aushadhi generic alternatives
- **Compare** brand vs generic medicine prices and estimated savings
- **Locate** nearby Jan Aushadhi Kendras and pharmacies on an interactive map
- **Manage** pharmacy inventory and prescriptions (pharmacy staff)
- **Administer** the entire platform through a comprehensive admin portal

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first, `@theme` tokens) |
| Routing | React Router DOM v7 (nested, lazy-loaded) |
| State | TanStack React Query v5 + React Context API |
| Forms | React Hook Form v7 + Zod v4 validation |
| Maps | React Leaflet v5 + Leaflet v1 |
| HTTP | Axios v1 (interceptors ready for JWT) |
| Notifications | React Toastify v11 |
| Icons | React Icons v5 (hi2 + md + fi + gi) |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API_BASE_URL

# 3. Start development server
npm run dev

# 4. Production build
npm run build

# 5. Preview production build
npm run preview
```

---

## Application Workflow

```
Home Page
  └─ Medicine Search → Search Results → Medicine Details
       └─ Generic Recommendation → Nearby Pharmacies → Map

Authentication
  └─ Login / Register / OTP / Forgot Password / Reset Password

Dashboards
  ├─ User Dashboard    — saved medicines, search history, notifications
  ├─ Pharmacy Dashboard — inventory management, batch tracking
  └─ Admin Portal      — users, pharmacies, medicines, generic mapping
```

---

## Project Structure

```
src/
├── components/          # Reusable UI library
│   ├── ui/              # Button, Badge, Avatar, Divider, IconButton
│   ├── forms/           # Input, Select, Textarea, Toggle, Checkbox…
│   ├── cards/           # MedicineCard, PharmacyCard, InfoCard…
│   ├── feedback/        # Spinner, Skeleton, EmptyState, ErrorState
│   ├── dialogs/         # Modal, ConfirmDialog
│   ├── navigation/      # Navbar, Footer, Sidebar, TopBar
│   ├── layout/          # Container, PageHeader, SectionHeader
│   └── common/          # SearchBar, Breadcrumb, Pagination, AppErrorBoundary
│
├── config/              # Axios client, QueryClient, env
├── constants/           # Routes, app constants, nav config
├── contexts/            # AuthContext, ThemeContext, UserContext
├── hooks/               # useDebounce, useLocalStorage, useSessionGuard…
├── layouts/             # MainLayout, AuthLayout, UserLayout, PharmacyLayout, AdminLayout
├── pages/               # All page components (lazy-loaded)
├── routes/              # AppRouter, ProtectedRoute, PublicRoute
├── services/            # authService, medicineService, pharmacyService…
├── styles/              # Design tokens (JS), icon registry, theme config
└── utils/               # formatters, validators, storage, authSchemas
```

---

## Design System

All design tokens are defined in `src/index.css` inside the Tailwind v4 `@theme {}` block:

- **Colors**: Medical Blue (primary), Teal (secondary), Indigo (accent), semantic status colors
- **Typography**: Inter font, complete heading hierarchy
- **Spacing**: Section, card, input, and gutter tokens
- **Shadows**: xs → xl, card, focus ring variants
- **Animations**: `pageEnter` fade-up (applied to all `<main>` elements)

---

## Role-Based Access

| Role | Dashboard | Key Routes |
|---|---|---|
| Patient / Doctor | User Dashboard | `/dashboard`, `/search`, `/pharmacies/nearby` |
| Pharmacist | Pharmacy Dashboard | `/pharmacy/dashboard`, `/pharmacy/inventory` |
| Administrator | Admin Portal | `/admin/dashboard`, `/admin/users`, `/admin/medicines`… |

---

## Future Backend Integration

All API calls are prepared in `src/services/`. Replace `// TODO:` mock responses with real Axios calls:

```js
// AuthContext.jsx — login action
// Before (mock):
const data = { user: { ... }, accessToken: 'mock' }

// After (backend):
const { data } = await authService.login(credentials)
```

See `.env.example` for the complete list of expected API endpoints.

---

## Build Output

```
360 modules
43 code-split chunks (React.lazy + Suspense)
Main bundle: ~464 KB (137 KB gzip)
NearbyPharmaciesPage: ~191 KB (57 KB gzip) — React Leaflet
```

---

## Accessibility

- WCAG 2.1 AA color contrast throughout
- `aria-label`, `aria-labelledby`, `aria-describedby` on all interactive elements
- `role="list"`, `role="table"`, `role="dialog"`, `role="tablist"` semantics
- Keyboard navigation: Tab, Enter, Space, Arrow keys, Escape
- Skip-to-main-content link in `index.html`
- Focus-visible rings on all focusable elements

---

## License

Final Year Engineering Project — Not for commercial use without permission.

---

*Built with React + Vite + Tailwind CSS v4*  
*Smart Medicine System v1.0.0*
