# Project Overview

## Smart Medicine Availability & Intelligent Janaushadhi Recommendation System

---

## 1. Project Introduction

This is a **Final Year Engineering Project** that builds a production-quality **React frontend** for a healthcare web application. The system helps ordinary citizens in India find affordable medicines, discover generic alternatives under the **Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)**, and locate nearby **Jan Aushadhi pharmacies** on an interactive map.

The application is designed for real-world use — it follows professional React architecture, uses an industry-standard design system, and is fully wired to integrate with a **FastAPI backend** whenever that backend is developed.

---

## 2. Problem Statement

Medicine prices in India can be extremely high for branded drugs. Most people are unaware that:

- Generic medicines with the **same active composition** are available at 50–90% lower cost
- Over **9,000 Jan Aushadhi stores** across India sell government-approved affordable generics
- Patients and doctors often do not know which generic alternative is available or where to get it

**The problem this project solves:**
> "A patient is prescribed an expensive branded medicine. They have no easy way to find if a cheaper generic version exists, what it is called, and where to buy it near them."

---

## 3. Objectives

| # | Objective |
|---|-----------|
| 1 | Allow users to search medicines by name or composition |
| 2 | Show generic / Jan Aushadhi alternatives with price comparison |
| 3 | Display nearby Jan Aushadhi pharmacies on an interactive map |
| 4 | Provide role-based dashboards for patients, pharmacists, and admins |
| 5 | Build a professional, accessible, and responsive UI |
| 6 | Architect the frontend so backend integration requires minimal effort |

---

## 4. Target Users

| Role | Who They Are | What They Do |
|------|-------------|--------------|
| **Patient** | Any Indian citizen | Search medicines, find generics, locate pharmacies |
| **Doctor** | Medical professional | Search medicines, recommend alternatives |
| **Pharmacist** | Pharmacy staff | Manage inventory, check stock |
| **Admin** | System administrator | Manage users, medicines, pharmacies, view analytics |

---

## 5. Complete Frontend Workflow

```
[User visits website]
         ↓
[Home Page — Public Landing]
         ↓
[Login / Register]
    ↓            ↓
[OTP Verify]  [Forgot Password → Reset]
         ↓
[Role-based redirect]
    ↓           ↓           ↓
[Patient     [Pharmacist  [Admin
 Dashboard]   Dashboard]   Dashboard]
    ↓
[Search Medicine by name / composition]
         ↓
[Search Results Page — list of medicines with prices]
         ↓
[Medicine Details Page — composition, usage, side effects]
         ↓
[Generic Recommendation Page — Jan Aushadhi alternatives]
         ↓
[Nearby Pharmacies — React Leaflet interactive map]
         ↓
[Profile → Notifications → Logout]
```

---

## 6. Features

### Patient Features
- Medicine search by name, brand, or composition
- Search results with smart badges (In Stock, Generic, Jan Aushadhi, Affordable)
- Medicine details with full information tabs
- Generic / Janaushadhi alternative recommendation
- Price comparison — branded vs generic
- Nearby pharmacies on interactive Leaflet map
- User dashboard with quick actions
- Notifications panel
- Profile management

### Pharmacist Features
- Pharmacy dashboard with inventory summary
- Searchable, sortable, paginated inventory table
- Add / Edit medicine stock entries
- Prescriptions view (placeholder for future module)

### Admin Features
- Admin dashboard with system metrics
- User management table
- Pharmacy management
- Medicine catalogue management
- Generic drug mapping
- Analytics and reports
- Notifications management
- Activity logs
- Role management
- System settings

### System Features
- Light / dark theme toggle
- Offline detection (shows offline page)
- Session expiry detection
- Global error boundary (catches crashes)
- 404 Not Found page
- 403 Unauthorized page
- Lazy loading (all pages code-split)
- Responsive design (mobile, tablet, desktop)
- Keyboard accessible (ARIA labels, skip link)

---

## 7. Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.7 | UI library |
| **Vite** | 8.1.2 | Build tool and dev server |
| **React Router DOM** | 7.18.1 | Client-side routing |
| **Tailwind CSS** | 4.3.2 | Utility-first CSS framework |
| **TanStack React Query** | 5.101.2 | Server-state caching |
| **Axios** | 1.18.1 | HTTP client for API calls |
| **React Hook Form** | 7.80.0 | Form state management |
| **Zod** | 4.4.3 | Schema-based form validation |
| **React Leaflet** | 5.0.0 | Interactive maps |
| **Leaflet** | 1.9.4 | Map engine |
| **React Icons** | 5.7.0 | Icon library (HeroIcons, Material) |
| **React Toastify** | 11.1.0 | Toast notifications |
| **ESLint** | 9.39.4 | Code linting |

---

## 8. Folder Structure

```
Frontend/
├── docs/                          ← Project documentation (this folder)
├── public/                        ← Static assets
├── src/
│   ├── components/                ← Reusable UI building blocks
│   │   ├── cards/                 ← Card components
│   │   ├── common/                ← General utilities (Breadcrumb, SearchBar)
│   │   ├── dialogs/               ← Modal and ConfirmDialog
│   │   ├── feedback/              ← Spinner, Skeleton, EmptyState, ErrorState
│   │   ├── forms/                 ← Input, Select, Checkbox, Toggle, etc.
│   │   ├── layout/                ← Container, PageHeader, SectionHeader
│   │   ├── navigation/            ← Navbar, Sidebar, Footer, TopBar
│   │   └── ui/                    ← Button, Badge, Avatar, Divider, IconButton
│   ├── config/                    ← Axios, env variables, React Query client
│   ├── constants/                 ← App constants, routes, nav config
│   ├── contexts/                  ← React Context (Auth, Theme, User)
│   ├── hooks/                     ← Custom React hooks
│   ├── layouts/                   ← Page layout wrappers
│   ├── pages/                     ← All application pages
│   ├── routes/                    ← Router, ProtectedRoute, PublicRoute
│   ├── services/                  ← Axios service layer for API calls
│   ├── styles/                    ← Design tokens and theme config
│   ├── utils/                     ← Pure utility functions
│   ├── App.jsx                    ← Root application component
│   ├── index.css                  ← Tailwind v4 CSS-first design tokens
│   └── main.jsx                   ← Entry point — mounts providers
├── index.html                     ← HTML shell
├── package.json                   ← Dependencies and scripts
├── vite.config.js                 ← Vite build configuration
└── eslint.config.js               ← ESLint rules
```

---

## 9. Future Backend Integration

The frontend is **backend-ready**. Every API call is pre-wired in the service layer. When the **FastAPI backend** is developed, only the service files need to be updated — zero component changes required.

| What to do | Where to do it |
|------------|---------------|
| Set API base URL | `.env` → `VITE_API_BASE_URL` |
| Replace mock login | `AuthContext.jsx` → swap `TODO` comment |
| All medicine API calls | `src/services/medicineService.js` |
| All auth API calls | `src/services/authService.js` |
| All pharmacy API calls | `src/services/pharmacyService.js` |
| All user profile calls | `src/services/userService.js` |
| All inventory calls | `src/services/inventoryService.js` |
| Enable JWT session guard | `App.jsx` → set `enabled: true` in `useSessionGuard` |

The backend API base URL is: `http://localhost:8000/api/v1` (configurable via `.env`).
