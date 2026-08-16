# Frontend–Backend Mapping

## Complete API Integration Reference

Every frontend action mapped to its backend endpoint.

---

## Authentication

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request Body | Expected Response |
|---------------|-----------------|-------------|----------|--------------|-------------------|
| LoginPage | form submit | POST | `/api/v1/auth/login` | `{ email, password }` | `{ user: {...}, accessToken, refreshToken }` |
| RegisterPage | form submit | POST | `/api/v1/auth/register` | `{ fullName, email, mobile, password }` | `{ message: "OTP sent" }` |
| VerifyOtpPage | OTP submit | POST | `/api/v1/auth/verify-otp` | `{ email, otp }` | `{ message: "Verified" }` |
| VerifyOtpPage | Resend OTP | POST | `/api/v1/auth/resend-otp` | `{ email }` | `{ message: "OTP resent" }` |
| ForgotPasswordPage | form submit | POST | `/api/v1/auth/forgot-password` | `{ email }` | `{ message: "Reset OTP sent" }` |
| ResetPasswordPage | form submit | POST | `/api/v1/auth/reset-password` | `{ email, otp, newPassword }` | `{ message: "Password reset" }` |
| Any page | token refresh | POST | `/api/v1/auth/refresh-token` | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| TopBar | logout button | POST | `/api/v1/auth/logout` | (empty) | `{ message: "Logged out" }` |

---

## User Profile

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|-----------------|-------------|----------|---------|-------------------|
| ProfilePage | page load | GET | `/api/v1/users/me` | (headers only) | `{ id, name, email, mobile, role, avatar, ... }` |
| ProfilePage | save changes | PUT | `/api/v1/users/me` | `{ name, email, mobile }` | `{ updated user object }` |
| ProfilePage | delete account | DELETE | `/api/v1/users/me` | (empty) | `{ message: "Account deleted" }` |
| TopBar | user info | GET | `/api/v1/users/me` | (headers only) | `{ name, avatar, role }` |

---

## Medicine Search

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request Params | Expected Response |
|---------------|-----------------|-------------|----------|----------------|-------------------|
| MedicineSearchPage | search input | GET | `/api/v1/medicines/search` | `?q={query}` | `[{ id, name, genericName, ... }]` (suggestions) |
| MedicineSearchPage | page load | GET | `/api/v1/medicines/popular` | — | `[{ id, name, ... }]` |
| MedicineSearchPage | page load | GET | `/api/v1/medicines/categories` | — | `[{ id, name, icon }]` |
| SearchResultsPage | search results | GET | `/api/v1/medicines/search` | `?q={q}&type=generic&sort=price_asc&page=1&limit=10` | `{ medicines: [...], total, page, totalPages }` |
| MedicineDetailsPage | page load | GET | `/api/v1/medicines/:id` | — | `{ id, name, genericName, composition, manufacturer, price, mrp, availability, ... }` |
| MedicineDetailsPage | alternatives section | GET | `/api/v1/medicines/alternatives/:id` | — | `[{ id, name, price, isJanAushadhi, ... }]` |
| Admin — AdminMedicines | table | GET | `/api/v1/medicines` | `?page=1&limit=10` | `{ medicines: [...], total }` |
| Admin — AdminMedicines | add medicine | POST | `/api/v1/medicines` | `{ name, genericName, composition, ... }` | `{ created medicine }` |
| Admin — AdminMedicines | edit medicine | PUT | `/api/v1/medicines/:id` | `{ updated fields }` | `{ updated medicine }` |
| Admin — AdminMedicines | delete medicine | DELETE | `/api/v1/medicines/:id` | — | `{ message: "Deleted" }` |

---

## Generic Recommendation

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|-----------------|-------------|----------|---------|-------------------|
| GenericRecommendationPage | page load | GET | `/api/v1/medicines/:id/generic-recommendation` | — | `{ branded: {...}, generics: [{...}], savings: { amount, percentage } }` |
| GenericRecommendationPage | save recommendation | POST | `/api/v1/users/me/saved-medicines/:id` | — | `{ message: "Saved" }` |

---

## Pharmacy / Nearby

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request Params | Expected Response |
|---------------|-----------------|-------------|----------|----------------|-------------------|
| NearbyPharmaciesPage | map load | GET | `/api/v1/pharmacies/nearby` | `?lat={lat}&lng={lng}&radius=5` | `[{ id, name, address, lat, lng, distance, isOpen, phone, stock }]` |
| NearbyPharmaciesPage | pharmacy search | GET | `/api/v1/pharmacies/search` | `?q={name}` | `[{ id, name, address, ... }]` |
| MedicineDetailsPage | nearby section | GET | `/api/v1/pharmacies/nearby` | `?lat={lat}&lng={lng}&medicineId={id}` | `[pharmacies with this medicine in stock]` |
| Admin — AdminPharmacies | table | GET | `/api/v1/pharmacies` | `?page=1&limit=10` | `{ pharmacies: [...], total }` |
| Admin — AdminPharmacies | add pharmacy | POST | `/api/v1/pharmacies` | `{ name, address, lat, lng, phone, licenseNo }` | `{ created pharmacy }` |
| Admin — AdminPharmacies | edit pharmacy | PUT | `/api/v1/pharmacies/:id` | `{ updated fields }` | `{ updated pharmacy }` |

---

## Pharmacy Inventory

| Frontend Page | Component/Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|-----------------|-------------|----------|---------|-------------------|
| InventoryPage | table load | GET | `/api/v1/inventory` | `?search={q}&page=1&limit=10` | `{ items: [...], total, page }` |
| MedicineFormPage (add) | form submit | POST | `/api/v1/inventory` | `{ medicineId, quantity, price, expiryDate, batchNo }` | `{ created stock item }` |
| MedicineFormPage (edit) | form submit | PUT | `/api/v1/inventory/:id` | `{ updated fields }` | `{ updated stock item }` |
| InventoryPage | delete row | DELETE | `/api/v1/inventory/:id` | — | `{ message: "Deleted" }` |
| MedicineFormPage (load for edit) | page load | GET | `/api/v1/inventory/:id` | — | `{ id, medicine, quantity, price, expiryDate }` |

---

## User Dashboard Data

| Frontend Component | HTTP Method | Endpoint | Expected Response |
|-------------------|-------------|----------|-------------------|
| Dashboard summary | GET | `/api/v1/users/me/dashboard` | `{ recentSearches, savedMedicines, stats }` |
| Recent notifications | GET | `/api/v1/users/me/notifications?limit=3` | `[{ id, type, title, message, time, isRead }]` |
| Saved medicines | GET | `/api/v1/users/me/saved-medicines` | `[{ id, medicine, savedAt }]` |

---

## Notifications

| Frontend Page | Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|--------|-------------|----------|---------|-------------------|
| NotificationsPage | load all | GET | `/api/v1/users/me/notifications` | `?tab=all&page=1` | `[{ id, type, title, message, time, isRead }]` |
| NotificationsPage | mark one read | PATCH | `/api/v1/users/me/notifications/:id/read` | — | `{ message: "Updated" }` |
| NotificationsPage | mark all read | PATCH | `/api/v1/users/me/notifications/read-all` | — | `{ message: "All marked read" }` |
| NotificationsPage | dismiss | DELETE | `/api/v1/users/me/notifications/:id` | — | `{ message: "Dismissed" }` |

---

## Admin User Management

| Frontend Page | Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|--------|-------------|----------|---------|-------------------|
| AdminUsers | load table | GET | `/api/v1/users` | `?page=1&limit=10&role=patient` | `{ users: [...], total }` |
| AdminUsers | view user | GET | `/api/v1/users/:id` | — | `{ id, name, email, role, createdAt, ... }` |
| AdminUsers | update role | PUT | `/api/v1/users/:id` | `{ role }` | `{ updated user }` |
| AdminUsers | delete user | DELETE | `/api/v1/users/:id` | — | `{ message: "Deleted" }` |

---

## Admin Generic Mapping

| Frontend Page | Action | HTTP Method | Endpoint | Request | Expected Response |
|---------------|--------|-------------|----------|---------|-------------------|
| AdminGenericMapping | load mappings | GET | `/api/v1/generic-mappings` | `?page=1` | `[{ brandedMedicineId, genericMedicineId, similarity }]` |
| AdminGenericMapping | add mapping | POST | `/api/v1/generic-mappings` | `{ brandedId, genericId }` | `{ created mapping }` |
| AdminGenericMapping | delete mapping | DELETE | `/api/v1/generic-mappings/:id` | — | `{ message: "Deleted" }` |

---

## Analytics

| Frontend Page | Action | HTTP Method | Endpoint | Expected Response |
|---------------|--------|-------------|----------|-------------------|
| AdminAnalytics | load data | GET | `/api/v1/analytics/summary` | `{ totalSearches, totalUsers, avgSavings, ... }` |
| AdminDashboard | stats | GET | `/api/v1/admin/dashboard` | `{ users, pharmacies, medicines, searches }` |
| AdminReports | generate | POST | `/api/v1/reports/generate` | `{ type, dateRange }` | `{ downloadUrl }` |

---

## Request / Response Headers

**Every authenticated request must include:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

This is handled automatically by `axiosClient.js` interceptors.

**Standard success response shape:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

**Standard error response shape:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "SPECIFIC_ERROR_CODE"
}
```

**Pagination response shape:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "totalPages": 15,
  "limit": 10
}
```
