# Page Guide

## Every Page Explained — Purpose, User Flow, Components, and Backend APIs

---

## Public Pages

---

### HomePage (`/`)

**Purpose:** The public landing page that explains the project to first-time visitors. Encourages users to register or log in.

**Layout:** `MainLayout` (Navbar + Footer)

**Sections (lazy-loaded subsections):**
1. **HeroSection** — Full-width banner with search CTA and headline
2. **AboutSection** — What the system does
3. **JanAushadhiSection** — What Jan Aushadhi is and why it matters
4. **FeaturesSection** — Key features of the app
5. **HowItWorksSection** — Step-by-step user journey
6. **BenefitsSection** — Benefits of using generic medicines
7. **StatsSection** — Impact numbers (pharmacies, savings, medicines)
8. **FaqSection** — Frequently asked questions
9. **CtaSection** — Final call-to-action with register button

**Components Used:** Navbar, Footer, Container, SectionHeader, Button, Badge

**User Flow:**
```
Visitor arrives at homepage
    → Scrolls through sections
    → Clicks "Get Started" or "Search Medicines"
    → Redirected to Login (if not authenticated)
```

**Future Backend APIs:**
```
GET /api/v1/stats/summary   → StatsSection (total pharmacies, medicines, users)
```

---

## Authentication Pages

**Layout:** `AuthLayout` (centered card, no sidebar)

---

### LoginPage (`/login`)

**Purpose:** Authenticates existing users.

**Features:**
- Email + Password form
- "Remember Me" checkbox
- Links to Register and Forgot Password
- Role-based redirect after login (patient → /dashboard, admin → /admin/dashboard)

**Form Validation (Zod `loginSchema`):**
- Email: required, valid email format
- Password: required (min 1 character)

**Components Used:** Input, PasswordInput, Checkbox, Button, Divider

**User Flow:**
```
User enters email + password
    → Clicks "Login"
    → AuthContext.login() called
    → On success: redirect to role dashboard
    → On failure: show error message
```

**Future Backend APIs:**
```
POST /api/v1/auth/login
Request:  { email, password }
Response: { user: {...}, accessToken, refreshToken }
```

---

### RegisterPage (`/register`)

**Purpose:** Creates a new patient account.

**Features:**
- Full name, email, mobile, password, confirm password
- Password strength indicator
- Terms & Conditions checkbox
- Submit → navigate to OTP verification

**Form Validation (Zod `registerSchema`):**
- Full name: 2–60 characters, letters only
- Email: valid format
- Mobile: valid Indian 10-digit number
- Password: 8+ chars, uppercase, lowercase, digit
- Passwords match
- Must accept terms

**Components Used:** Input, PasswordInput, PasswordStrength, Checkbox, Button

**Future Backend APIs:**
```
POST /api/v1/auth/register
Request:  { fullName, email, mobile, password }
Response: { message: "OTP sent to email" }
```

---

### VerifyOtpPage (`/verify-otp`)

**Purpose:** Verifies the 6-digit OTP sent to the user's email after registration or forgot password.

**Features:**
- 6-box OTP input with auto-focus advance
- 60-second countdown timer with "Resend OTP" button
- Shows the email address the OTP was sent to (passed via navigation state)

**Components Used:** OtpInput, Button, Spinner

**Future Backend APIs:**
```
POST /api/v1/auth/verify-otp
Request:  { email, otp }
Response: { message: "Account verified" }

POST /api/v1/auth/resend-otp
Request:  { email }
Response: { message: "OTP resent" }
```

---

### ForgotPasswordPage (`/forgot-password`)

**Purpose:** Initiates the password reset flow by sending an OTP to the user's email.

**Components Used:** Input, Button

**Future Backend APIs:**
```
POST /api/v1/auth/forgot-password
Request:  { email }
Response: { message: "Reset OTP sent" }
```

---

### ResetPasswordPage (`/reset-password`)

**Purpose:** Allows the user to set a new password after OTP verification.

**Components Used:** PasswordInput, PasswordStrength, Button

**Future Backend APIs:**
```
POST /api/v1/auth/reset-password
Request:  { email, otp, newPassword }
Response: { message: "Password reset successfully" }
```

---

## Patient / User Pages

**Layout:** `UserLayout` (Sidebar + TopBar)
**Route Guard:** `ProtectedRoute` — roles: `patient`, `doctor`

---

### UserDashboard (`/dashboard`)

**Purpose:** The patient's home screen after login. Shows a personalised overview of their activity and quick-access shortcuts.

**Sections:**
1. Welcome banner with user name
2. Quick action buttons (Search, Nearby Pharmacy, Notifications)
3. Recent searches
4. Saved medicines
5. Recent notifications (last 3)
6. Health tips section
7. Jan Aushadhi awareness banner
8. Stats (searches made, medicines saved)
9. Profile completion indicator
10. Nearby pharmacy teaser

**Components Used:** InfoCard, NotificationCard, MedicineCard, Avatar, Badge, Button, Toggle

**Future Backend APIs:**
```
GET /api/v1/users/me/dashboard   → Dashboard summary data
GET /api/v1/users/me/saved-medicines → Saved medicines list
GET /api/v1/users/me/notifications?limit=3 → Recent notifications
```

---

### MedicineSearchPage (`/search`)

**Purpose:** The main medicine search interface.

**Features:**
- Full-width search bar with autocomplete suggestions
- Quick action shortcuts (Search by Composition, Scan Barcode, Voice Search)
- Recent searches (stored in localStorage)
- Popular medicine suggestions
- Medicine category browse grid
- Advanced filter panel (type, availability, price range, manufacturer)
- Loading, empty, and error states

**Components Used:** SearchBar, Button, Badge, EmptyState, Skeleton, useDebounce

**Future Backend APIs:**
```
GET /api/v1/medicines/search?q={query}     → Search suggestions
GET /api/v1/medicines/popular              → Popular medicines
GET /api/v1/medicines/categories           → Category list
```

---

### SearchResultsPage (`/search/results`)

**Purpose:** Shows the list of medicines matching the search query.

**Features:**
- Results count and query display
- Filter sidebar (type, price range, availability, manufacturer, category)
- Sort options (relevance, price low/high, name A-Z)
- Grid / List view toggle
- Compare mode — select up to 4 medicines
- CompareBar — sticky bottom bar showing selected medicines
- Pagination

**Components Used:** SearchResultCard, Badge, Pagination, EmptyState, Skeleton, Button

**Future Backend APIs:**
```
GET /api/v1/medicines/search?q={query}&type=generic&sort=price_asc&page=1&limit=10
Response: { medicines: [...], total, page, totalPages }
```

---

### MedicineDetailsPage (`/medicine/:id`)

**Purpose:** Full detail view of a single medicine.

**Sections:**
1. Medicine header (name, manufacturer, price, availability badges)
2. Action panel (View Generic, Add to Saved, Share, Nearby Pharmacies)
3. MedicineInfoTabs: Overview | Composition | Usage | Side Effects | Storage
4. Generic Recommendation section (teaser with link to full page)
5. Nearby pharmacies teaser
6. Price comparison section
7. Related medicines
8. Disclaimer

**Components Used:** Badge, Button, Breadcrumb, Modal, MedicineCard, PharmacyCard

**Future Backend APIs:**
```
GET /api/v1/medicines/:id
Response: { id, name, genericName, composition, manufacturer, price, mrp, ... }

GET /api/v1/medicines/alternatives/:id
Response: [{ id, name, price, isJanAushadhi, ... }]
```

---

### GenericRecommendationPage (`/medicine/:id/generic`)

**Purpose:** A full-page view of the Jan Aushadhi generic alternatives for a specific branded medicine. This is the core feature of the system.

**Sections:**
1. Branded medicine summary
2. Why generics section (educational)
3. Generic alternatives list with price comparison
4. Jan Aushadhi pharmacy locator teaser
5. Cost savings calculator
6. Doctor consultation note
7. Savings summary
8. Evidence section
9. How to switch guide
10. Awareness banner
11. Legal disclaimer
12. FAQ section
13. Share this recommendation button
14. Call to action (View Nearby Pharmacies)
15. Health disclaimer footer

**Components Used:** MedicineCard, Badge, Button, Modal, InfoCard

**Future Backend APIs:**
```
GET /api/v1/medicines/:id/generic-recommendation
Response: {
  branded: {...},
  generics: [...],
  savings: { amount, percentage }
}
```

---

### NearbyPharmaciesPage (`/pharmacies/nearby`)

**Purpose:** Shows Jan Aushadhi pharmacies near the user on an interactive map.

**Features:**
- React Leaflet interactive map (OpenStreetMap tiles)
- Pharmacy marker pins
- Click marker → show pharmacy info popup
- Pharmacy list panel (sortable by distance)
- Filter panel (open now, has this medicine)
- Get Directions button (opens Google Maps)
- Search radius control

**Components Used:** PharmacyCard, Button, Badge, Spinner, EmptyState

**Future Backend APIs:**
```
GET /api/v1/pharmacies/nearby?lat={lat}&lng={lng}&radius={km}
Response: [{
  id, name, address, lat, lng, distance, isOpen, phone
}]
```

---

### NotificationsPage (`/notifications`)

**Purpose:** Shows all notifications for the logged-in user.

**Features:**
- Tab filter: All / Unread / Medicines / Alerts
- Mark all as read button
- Individual mark-read and dismiss per notification

**Components Used:** NotificationCard, Badge, Button, EmptyState

**Future Backend APIs:**
```
GET /api/v1/users/me/notifications
PATCH /api/v1/users/me/notifications/:id/read
DELETE /api/v1/users/me/notifications/:id
```

---

### ProfilePage (`/profile`)

**Purpose:** Allows the user to view and edit their profile information.

**Sections:**
- Avatar with upload option
- Personal info (name, email, phone)
- Change password
- Notification preferences (Toggle)
- Delete account

**Components Used:** Avatar, Input, PasswordInput, Toggle, Button

**Future Backend APIs:**
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
```

---

## Pharmacy Pages

**Layout:** `PharmacyLayout` | **Guard:** `PHARMACIST` role

---

### PharmacyDashboard (`/pharmacy/dashboard`)

**Purpose:** Overview dashboard for pharmacists showing inventory summary, recent orders, and quick actions.

**Components Used:** InfoCard, Badge, Button, Avatar

**Future Backend APIs:**
```
GET /api/v1/pharmacy/dashboard
GET /api/v1/pharmacy/stats
```

---

### InventoryPage (`/pharmacy/inventory`)

**Purpose:** Full inventory management — searchable, sortable, paginated medicine stock table.

**Features:**
- Search by name or composition
- Sort by name, stock, expiry
- Filter by category, availability
- Add New button → MedicineFormPage
- Edit button per row → MedicineFormPage in edit mode
- Delete with ConfirmDialog
- Pagination
- Low stock warning badges

**Components Used:** Button, Badge, Pagination, ConfirmDialog, Skeleton, EmptyState, SearchBar

**Future Backend APIs:**
```
GET    /api/v1/inventory?search={q}&page=1&limit=10
POST   /api/v1/inventory
PUT    /api/v1/inventory/:id
DELETE /api/v1/inventory/:id
```

---

### MedicineFormPage (`/pharmacy/inventory/add` and `/pharmacy/inventory/edit/:id`)

**Purpose:** Add or edit a medicine stock entry. Same form used for both operations — the presence of `:id` in the URL determines edit mode.

**Components Used:** Input, Select, Textarea, Button, FormField

**Future Backend APIs:**
```
POST /api/v1/inventory         (add)
PUT  /api/v1/inventory/:id     (edit)
GET  /api/v1/inventory/:id     (load for edit)
```

---

## Admin Pages

**Layout:** `AdminLayout` | **Guard:** `ADMIN` role

All admin pages use a shared `AdminTable` component and mock data from `pages/admin/data/`.

| Page | Route | Purpose |
|------|-------|---------|
| `AdminDashboard` | `/admin/dashboard` | System overview with key metrics |
| `AdminUsers` | `/admin/users` | User management table |
| `AdminPharmacies` | `/admin/pharmacies` | Pharmacy management table |
| `AdminMedicines` | `/admin/medicines` | Medicine catalogue management |
| `AdminGenericMapping` | `/admin/generic-mapping` | Map branded → generic medicines |
| `AdminAnalytics` | `/admin/analytics` | Usage analytics and charts |
| `AdminReports` | `/admin/reports` | Generate and download reports |
| `AdminNotifications` | `/admin/notifications` | Send system notifications |
| `AdminActivity` | `/admin/activity` | System activity and audit logs |
| `AdminRoles` | `/admin/roles` | Role and permission management |
| `AdminSettings` | `/admin/settings` | System configuration |

---

## Error Pages

| Page | Route | Purpose |
|------|-------|---------|
| `NotFoundPage` | `/*` | 404 — page not found |
| `UnauthorizedPage` | `/unauthorized` | 403 — access denied |
| `SessionExpiredPage` | `/session-expired` | JWT expired |
| `ServerErrorPage` | (AppErrorBoundary) | Caught React crash |
| `OfflinePage` | (App.jsx) | Browser is offline |
