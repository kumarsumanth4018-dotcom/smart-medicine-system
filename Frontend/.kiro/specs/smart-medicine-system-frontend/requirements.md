# Requirements Document

## Introduction

The Smart Medicine System Frontend is a professional-grade React web application built with Vite, serving four distinct user roles: Pharmacists/Pharmacy Staff, Doctors/Clinicians, Patients, and Admins/System Managers. The application provides role-specific dashboards, medicine and prescription management, inventory control, and reporting through a responsive, accessible UI. All backend communication is abstracted behind placeholder API service files to enable seamless future REST integration.

---

## Glossary

- **Application**: The Smart Medicine System Frontend React application.
- **Router**: The React Router instance managing client-side navigation.
- **Auth_UI**: The authentication interface comprising Login, OTP, and session management screens.
- **Role**: A user type that determines which views and actions are accessible (Pharmacist, Doctor, Patient, Admin).
- **Dashboard**: The role-specific home screen rendered after successful authentication.
- **Medicine_Catalog**: The browsable, searchable list of medicines available in the system.
- **Prescription**: A digital record associating a doctor, a patient, and one or more medicine orders.
- **Dispense_Record**: A record created when a pharmacist fulfills a prescription.
- **Inventory**: The stock of medicines tracked by the system, including quantities and expiry dates.
- **Supplier**: An entity that provides medicines to the pharmacy.
- **Alert**: An in-app notification triggered by system events such as low stock or expiring medicines.
- **API_Service**: A placeholder TypeScript/JavaScript module that encapsulates all REST API call signatures for future backend integration.
- **State_Store**: The global state management container implemented with Redux Toolkit.
- **Form_Validator**: The client-side validation layer applied to all user-input forms.
- **Protected_Route**: A React Router route that redirects unauthenticated users to the login screen.
- **OTP_Screen**: The one-time-password entry screen shown after primary credential submission.
- **Responsive_Layout**: A layout that adapts correctly to viewport widths from 320px to 2560px.
- **Toast**: A transient non-blocking notification message displayed at the edge of the screen.
- **Modal**: A dialog overlay requiring user interaction before dismissal.
- **Data_Table**: A reusable paginated, sortable, and filterable tabular data component.
- **Sidebar**: The collapsible role-aware navigation panel rendered in authenticated views.

---

## Requirements

---

### Requirement 1: Project Architecture and Tooling

**User Story:** As a developer, I want a well-structured Vite + React project, so that the codebase is maintainable, scalable, and ready for production.

#### Acceptance Criteria

1. THE Application SHALL be bootstrapped with Vite using the React + TypeScript template.
2. THE Application SHALL organize source files under the following top-level folders: `src/components`, `src/pages`, `src/routes`, `src/store`, `src/services`, `src/hooks`, `src/utils`, `src/types`, `src/assets`, and `src/styles`.
3. THE Application SHALL use absolute import aliases (e.g., `@components/`, `@pages/`) configured in `vite.config.ts` and `tsconfig.json`.
4. THE Application SHALL enforce ESLint and Prettier rules consistently across all source files.
5. THE Application SHALL include a `README.md` documenting project setup, folder structure, available scripts, and environment variable usage.

---

### Requirement 2: Routing and Navigation

**User Story:** As a user, I want client-side navigation with role-appropriate routes, so that I can move between screens without full page reloads and cannot access screens outside my role.

#### Acceptance Criteria

1. THE Router SHALL define routes using React Router v6 `createBrowserRouter`.
2. THE Router SHALL render a `Protected_Route` component that redirects unauthenticated users to `/login`.
3. WHEN an authenticated user navigates to a route outside their Role's permitted set, THE Router SHALL redirect them to their Dashboard.
4. THE Router SHALL support the following public routes: `/login`, `/otp`, `/forgot-password`.
5. THE Router SHALL support role-specific protected route prefixes: `/pharmacist/*`, `/doctor/*`, `/patient/*`, `/admin/*`.
6. WHEN a user navigates to an unknown URL, THE Router SHALL render a styled 404 page with a link back to the user's Dashboard.
7. THE Router SHALL preserve the originally requested URL and redirect the user there after successful authentication.

---

### Requirement 3: Authentication UI

**User Story:** As any user, I want a secure and clear login experience, so that I can authenticate with my credentials and access my role-specific dashboard.

#### Acceptance Criteria

1. THE Auth_UI SHALL render a Login screen at `/login` containing fields for email and password.
2. THE Form_Validator SHALL validate that the email field contains a syntactically valid email address before form submission.
3. THE Form_Validator SHALL validate that the password field is not empty before form submission.
4. IF the Form_Validator detects a validation error, THEN THE Auth_UI SHALL display an inline error message adjacent to the offending field.
5. WHEN the user submits valid credentials, THE Auth_UI SHALL display a loading indicator and call the `API_Service.login()` placeholder.
6. WHEN `API_Service.login()` resolves successfully, THE Auth_UI SHALL navigate to the OTP_Screen at `/otp`.
7. THE OTP_Screen SHALL render six individual single-character input fields that auto-advance focus on entry.
8. WHEN the user completes all six OTP fields and submits, THE Auth_UI SHALL call the `API_Service.verifyOtp()` placeholder.
9. WHEN `API_Service.verifyOtp()` resolves successfully, THE Auth_UI SHALL store the user's Role and session token in the State_Store and navigate to the corresponding Dashboard.
10. THE Auth_UI SHALL render a "Forgot Password" link on the Login screen that navigates to `/forgot-password`.
11. THE Auth_UI SHALL render a logout button in the Sidebar that clears the State_Store session and redirects to `/login`.

---

### Requirement 4: Global State Management

**User Story:** As a developer, I want a predictable global state container, so that user session, UI state, and cached API data are consistently accessible across the component tree.

#### Acceptance Criteria

1. THE State_Store SHALL be implemented using Redux Toolkit with typed slices.
2. THE State_Store SHALL contain an `authSlice` holding the current user's Role, display name, and session token.
3. THE State_Store SHALL contain a `uiSlice` holding sidebar collapsed state, active Toast messages, and Modal open/closed state.
4. THE State_Store SHALL contain domain slices for `medicines`, `prescriptions`, `inventory`, and `alerts`, each with `loading`, `error`, and `data` fields.
5. THE State_Store SHALL persist the `authSlice` to `localStorage` so that page refreshes do not log out authenticated users.
6. WHEN the session token in `localStorage` is absent or malformed, THE State_Store SHALL initialise the `authSlice` with an unauthenticated state.

---

### Requirement 5: Reusable Component Library

**User Story:** As a developer, I want a set of reusable UI primitives, so that consistent design is enforced across all pages without duplicating markup.

#### Acceptance Criteria

1. THE Application SHALL provide a `Button` component accepting `variant` (primary, secondary, danger, ghost), `size` (sm, md, lg), `loading`, and `disabled` props.
2. THE Application SHALL provide a `TextInput` component accepting `label`, `error`, `placeholder`, `type`, and `disabled` props.
3. THE Application SHALL provide a `SelectInput` component accepting `label`, `options`, `error`, and `disabled` props.
4. THE Application SHALL provide a `Data_Table` component accepting `columns`, `rows`, `pagination`, `onSort`, and `onFilter` props.
5. THE Application SHALL provide a `Modal` component accepting `title`, `isOpen`, `onClose`, and `children` props, rendering content in a focus-trapped overlay.
6. THE Application SHALL provide a `Toast` component that accepts `message`, `type` (success, error, warning, info), and `duration` props and auto-dismisses after the specified duration.
7. THE Application SHALL provide a `Sidebar` component that renders role-filtered navigation links and collapses to an icon-only view on viewports narrower than 768px.
8. THE Application SHALL provide a `PageHeader` component accepting `title` and `breadcrumbs` props.
9. THE Application SHALL provide a `StatCard` component accepting `label`, `value`, `icon`, and `trend` props for dashboard summary displays.
10. THE Application SHALL provide a `Badge` component accepting `label` and `color` props for status indicators.

---

### Requirement 6: Responsive Design and Theming

**User Story:** As any user, I want the application to look and function correctly on any device, so that I can use it from a desktop workstation, tablet, or mobile phone.

#### Acceptance Criteria

1. THE Responsive_Layout SHALL use CSS Grid and Flexbox to reflow content at breakpoints 320px, 768px, 1024px, and 1440px.
2. THE Responsive_Layout SHALL collapse the Sidebar into a bottom navigation bar on viewports narrower than 768px.
3. THE Application SHALL support a light theme and a dark theme, toggled via a control in the Sidebar header.
4. WHEN the user toggles the theme, THE Application SHALL persist the preference to `localStorage` and apply it on subsequent page loads.
5. THE Application SHALL define all colors, typography, spacing, and shadow tokens in a central CSS custom-properties file (`src/styles/tokens.css`).
6. THE Application SHALL meet WCAG 2.1 AA color contrast requirements for all text and interactive elements in both light and dark themes.
7. WHEN rendered on a touch device, THE Application SHALL ensure all interactive targets are at least 44×44 CSS pixels.

---

### Requirement 7: API Service Placeholder Layer

**User Story:** As a developer, I want all backend calls isolated behind typed service modules, so that replacing placeholders with real REST calls requires no changes to components or pages.

#### Acceptance Criteria

1. THE API_Service SHALL expose typed async functions in dedicated files under `src/services/` — one file per domain: `authService.ts`, `medicineService.ts`, `prescriptionService.ts`, `inventoryService.ts`, `supplierService.ts`, `reportService.ts`, `userService.ts`, and `alertService.ts`.
2. EACH API_Service function SHALL return a typed Promise matching the corresponding response shape defined in `src/types/`.
3. EACH API_Service function SHALL currently resolve with hardcoded mock data to enable UI development without a live backend.
4. THE API_Service SHALL read the base URL from the `VITE_API_BASE_URL` environment variable defined in `.env`.
5. THE API_Service SHALL include a shared `apiClient` utility (e.g., an Axios instance or `fetch` wrapper) configured with the base URL, default headers, and a request interceptor that attaches the session token from the State_Store.
6. THE API_Service SHALL include a response interceptor that dispatches a Toast on network errors and, on 401 responses, clears the State_Store session and redirects to `/login`.

---

### Requirement 8: Pharmacist Dashboard and Medicine Dispensing

**User Story:** As a Pharmacist, I want a dashboard that surfaces pending prescriptions and key stock alerts, so that I can prioritize my dispensing workflow efficiently.

#### Acceptance Criteria

1. THE Dashboard FOR the Pharmacist Role SHALL display a summary row of StatCards showing: pending prescriptions count, medicines dispensed today, low-stock alerts count, and expiring medicines count.
2. THE Dashboard SHALL render a Data_Table of pending prescriptions with columns: Prescription ID, Patient Name, Doctor Name, Date, Status, and an Actions column.
3. WHEN the Pharmacist selects a prescription row, THE Application SHALL navigate to the prescription detail page displaying all ordered medicines and their required quantities.
4. THE Application SHALL provide a "Dispense" action on the prescription detail page that calls `API_Service.dispensePrescription()` and creates a Dispense_Record.
5. WHEN `API_Service.dispensePrescription()` resolves successfully, THE Application SHALL update the prescription status to "Dispensed" in the State_Store and display a success Toast.
6. THE Application SHALL render a Medicine Search page at `/pharmacist/medicines` with a search input that filters the Medicine_Catalog by name, generic name, or barcode.
7. WHEN a medicine is selected from search results, THE Application SHALL display a detail panel showing stock level, expiry dates, dosage forms, and storage instructions.
8. THE Application SHALL render a Dispense History page at `/pharmacist/history` showing a Data_Table of past Dispense_Records filterable by date range and patient name.

---

### Requirement 9: Pharmacist Inventory Management

**User Story:** As a Pharmacist, I want to view and update medicine stock levels, so that the pharmacy never runs out of critical medicines.

#### Acceptance Criteria

1. THE Application SHALL render an Inventory page at `/pharmacist/inventory` displaying a Data_Table of all medicines with columns: Name, SKU, Category, Current Stock, Unit, Reorder Level, Expiry Date, and Status Badge.
2. THE Data_Table on the Inventory page SHALL support sorting by any column and filtering by Category, Status (In Stock, Low Stock, Out of Stock, Expired), and search by name or SKU.
3. WHEN a medicine's Current Stock falls at or below its Reorder Level, THE Application SHALL display a "Low Stock" Badge and surface an Alert in the Sidebar alert counter.
4. THE Application SHALL provide an "Add Stock" action per inventory row that opens a Modal accepting batch number, quantity, expiry date, and supplier, then calls `API_Service.addStock()`.
5. THE Form_Validator SHALL require all four fields of the Add Stock form and validate that quantity is a positive integer and expiry date is a future date before submission.
6. THE Application SHALL provide an "Edit Medicine" action that opens a pre-populated Modal for updating medicine details and calls `API_Service.updateMedicine()`.
7. THE Application SHALL render an Expiry Alerts page at `/pharmacist/expiry-alerts` listing medicines expiring within the next 30 days, sorted by expiry date ascending.

---

### Requirement 10: Doctor Dashboard and Prescription Management

**User Story:** As a Doctor, I want a dashboard showing my patients' active prescriptions, so that I can review, create, and manage prescriptions efficiently.

#### Acceptance Criteria

1. THE Dashboard FOR the Doctor Role SHALL display StatCards for: active prescriptions written today, total patients, pending refill requests, and upcoming patient appointments (placeholder count).
2. THE Application SHALL render a Prescriptions page at `/doctor/prescriptions` with a Data_Table showing all prescriptions authored by the authenticated Doctor, with columns: Prescription ID, Patient Name, Date Issued, Medicines Count, Status, and Actions.
3. THE Application SHALL provide a "New Prescription" button on the Prescriptions page that navigates to a Prescription Builder form at `/doctor/prescriptions/new`.
4. THE Prescription Builder SHALL allow the Doctor to search and select a patient by name or ID using a typeahead input that calls `API_Service.searchPatients()`.
5. THE Prescription Builder SHALL allow the Doctor to add one or more medicine line items, each specifying medicine name (typeahead from Medicine_Catalog), dosage, frequency, duration, and instructions.
6. THE Form_Validator SHALL require patient selection and at least one medicine line item before the Prescription Builder form can be submitted.
7. WHEN the Doctor submits the Prescription Builder, THE Application SHALL call `API_Service.createPrescription()` and on success navigate to the new prescription's detail page and display a success Toast.
8. THE Application SHALL provide an "Edit" action for prescriptions in "Draft" status that re-opens the Prescription Builder pre-populated with existing data.
9. THE Application SHALL provide a "Void" action for non-dispensed prescriptions that opens a confirmation Modal and calls `API_Service.voidPrescription()` on confirmation.
10. THE Application SHALL render a Patient List page at `/doctor/patients` displaying a Data_Table of the Doctor's patients with search by name or patient ID.
11. WHEN the Doctor selects a patient from the Patient List, THE Application SHALL navigate to a Patient Profile page displaying the patient's demographics, prescription history, and active medicines.

---

### Requirement 11: Doctor Prescription Templates

**User Story:** As a Doctor, I want to save and reuse common prescription templates, so that I can create recurring prescriptions faster.

#### Acceptance Criteria

1. THE Application SHALL render a Templates page at `/doctor/templates` displaying saved prescription templates in a card grid layout.
2. THE Application SHALL provide a "Save as Template" action on the Prescription Builder that opens a Modal accepting a template name and calls `API_Service.saveTemplate()`.
3. WHEN the Doctor selects a template from the Templates page, THE Application SHALL navigate to the Prescription Builder pre-populated with the template's medicine line items and instructions.
4. THE Application SHALL provide a "Delete Template" action on each template card that opens a confirmation Modal and calls `API_Service.deleteTemplate()` on confirmation.

---

### Requirement 12: Patient Dashboard and Prescription Tracking

**User Story:** As a Patient, I want a dashboard that shows my active prescriptions and medicine intake schedule, so that I can manage my health regimen without confusion.

#### Acceptance Criteria

1. THE Dashboard FOR the Patient Role SHALL display StatCards for: active prescriptions count, medicines to take today, upcoming refill due dates, and recent dispenses count.
2. THE Application SHALL render a My Prescriptions page at `/patient/prescriptions` showing a Data_Table of the authenticated Patient's prescriptions with columns: Prescription ID, Doctor Name, Date Issued, Status, and Actions.
3. WHEN the Patient selects a prescription, THE Application SHALL display a Prescription Detail page listing each medicine, dosage, frequency, duration, and dispensing status.
4. THE Application SHALL render a Medicine Schedule page at `/patient/schedule` displaying today's medicine intake tasks as a checklist organized by time of day (Morning, Afternoon, Evening, Night).
5. WHEN a Patient marks a medicine intake task as taken, THE Application SHALL update the task's visual state to completed and call `API_Service.logIntake()`.
6. THE Application SHALL render a Refill Requests page at `/patient/refills` where the Patient can request a refill for an active prescription by clicking a "Request Refill" button that calls `API_Service.requestRefill()`.
7. THE Application SHALL render a Dispense History page at `/patient/history` showing a Data_Table of all Dispense_Records associated with the Patient, sorted by date descending.
8. THE Application SHALL render a Profile page at `/patient/profile` displaying the Patient's name, contact information, and a form to update contact preferences, calling `API_Service.updateProfile()` on submission.

---

### Requirement 13: Admin Dashboard and System Management

**User Story:** As an Admin, I want a comprehensive dashboard with system-wide metrics and management tools, so that I can oversee operations, manage users, and generate reports.

#### Acceptance Criteria

1. THE Dashboard FOR the Admin Role SHALL display StatCards for: total registered users, total medicines in catalog, total prescriptions this month, low-stock medicines count, and pending supplier orders count.
2. THE Dashboard SHALL render a line chart showing prescription volume over the past 30 days and a bar chart showing top 10 dispensed medicines.
3. THE Application SHALL render a User Management page at `/admin/users` displaying a Data_Table of all system users with columns: Name, Email, Role, Status (Active/Inactive), and Actions.
4. THE Application SHALL provide an "Add User" button on the User Management page that opens a Modal with fields for name, email, role, and temporary password, calling `API_Service.createUser()` on submission.
5. THE Form_Validator SHALL require all fields on the Add User form and validate that email is unique (client-side duplicate check against loaded user data) before submission.
6. THE Application SHALL provide an "Edit" action per user row that opens a pre-populated Modal and calls `API_Service.updateUser()` on submission.
7. THE Application SHALL provide a "Deactivate / Activate" toggle action per user row that calls `API_Service.setUserStatus()` after a confirmation Modal.
8. THE Application SHALL render a Medicine Catalog Management page at `/admin/medicines` with a Data_Table of all medicines and "Add Medicine", "Edit", and "Archive" actions.
9. WHEN the Admin clicks "Add Medicine", THE Application SHALL open a Modal form with fields: generic name, brand names, category, dosage forms, unit, reorder level, and storage instructions.
10. THE Form_Validator SHALL require generic name, category, dosage form, unit, and reorder level fields, and validate that reorder level is a non-negative integer.

---

### Requirement 14: Admin Supplier Management

**User Story:** As an Admin, I want to manage supplier records and purchase orders, so that the pharmacy can maintain a reliable medicine supply chain.

#### Acceptance Criteria

1. THE Application SHALL render a Suppliers page at `/admin/suppliers` displaying a Data_Table of all Suppliers with columns: Supplier Name, Contact Person, Phone, Email, Address, and Actions.
2. THE Application SHALL provide "Add Supplier", "Edit", and "Deactivate" actions that open appropriate Modals and call the corresponding `API_Service` functions.
3. THE Application SHALL render a Purchase Orders page at `/admin/purchase-orders` displaying a Data_Table of orders with columns: Order ID, Supplier, Order Date, Expected Delivery, Status, Total Items, and Actions.
4. THE Application SHALL provide a "Create Purchase Order" workflow that allows the Admin to select a Supplier, add medicine line items with quantities and unit prices, set expected delivery date, and call `API_Service.createPurchaseOrder()`.
5. THE Form_Validator SHALL require supplier selection, at least one line item, and a future expected delivery date before the purchase order form can be submitted.
6. THE Application SHALL provide a "Mark as Received" action on Purchase Orders in "Pending" status that updates the order status and calls `API_Service.receivePurchaseOrder()`.

---

### Requirement 15: Admin Reporting

**User Story:** As an Admin, I want to generate and export reports on prescriptions, inventory, and dispensing activity, so that I can support operational decisions and compliance audits.

#### Acceptance Criteria

1. THE Application SHALL render a Reports page at `/admin/reports` with a report type selector (Prescription Summary, Inventory Status, Dispense Activity, Supplier Orders, Expiry Report).
2. WHEN the Admin selects a report type and a date range, THE Application SHALL call the corresponding `API_Service` report function and render the results in a Data_Table.
3. THE Application SHALL provide an "Export CSV" button that serialises the current report Data_Table rows into a CSV file and triggers a browser download.
4. THE Application SHALL provide an "Export PDF" button that renders the current report in a print-friendly layout and triggers a browser print dialog.
5. THE Form_Validator SHALL require a valid date range (start date is on or before end date) before a report can be generated.

---

### Requirement 16: Alerts and Notifications

**User Story:** As any authenticated user, I want to receive in-app alerts relevant to my role, so that I am informed of time-sensitive events without leaving the application.

#### Acceptance Criteria

1. THE Application SHALL render an Alerts panel accessible from the Sidebar showing unread alerts for the authenticated user's Role.
2. WHEN the Sidebar alert counter is greater than zero, THE Application SHALL display a numeric badge on the Sidebar alert icon.
3. THE Application SHALL poll `API_Service.getAlerts()` at a configurable interval (default 60 seconds) while the user is authenticated.
4. WHEN a new Alert is received, THE Application SHALL display a Toast notification and increment the Sidebar alert counter.
5. WHEN the user marks an Alert as read, THE Application SHALL call `API_Service.markAlertRead()` and remove the alert from the unread list in the State_Store.
6. THE Application SHALL surface low-stock alerts exclusively to Pharmacist and Admin roles.
7. THE Application SHALL surface prescription status change alerts exclusively to Doctor and Patient roles.

---

### Requirement 17: Form Validation Standards

**User Story:** As any user, I want clear, immediate feedback when I fill forms incorrectly, so that I can correct mistakes before submitting data.

#### Acceptance Criteria

1. THE Form_Validator SHALL display inline error messages below each invalid field immediately after the field loses focus (on-blur validation).
2. THE Form_Validator SHALL re-validate all fields on form submission and prevent submission while any field is invalid.
3. THE Form_Validator SHALL display a summary error Toast listing all validation errors when the user attempts to submit a form with multiple invalid fields.
4. THE Form_Validator SHALL clear a field's error message as soon as the field value becomes valid.
5. WHEN a required field is empty on blur, THE Form_Validator SHALL display the message "[Field Label] is required."
6. WHEN an email field contains a syntactically invalid value on blur, THE Form_Validator SHALL display the message "Please enter a valid email address."
7. WHEN a numeric field receives a non-numeric value, THE Form_Validator SHALL display the message "[Field Label] must be a number."
8. WHEN a date field receives a value that does not satisfy the field's constraint (e.g., must be a future date), THE Form_Validator SHALL display a descriptive constraint message.

---

### Requirement 18: Accessibility

**User Story:** As any user with assistive technology, I want the application to be navigable and understandable using a keyboard and screen reader, so that the system is inclusive.

#### Acceptance Criteria

1. THE Application SHALL assign correct ARIA roles, labels, and descriptions to all interactive components including Modals, Data_Tables, Sidebars, and form inputs.
2. THE Application SHALL manage focus correctly when a Modal opens (focus moves to Modal) and when it closes (focus returns to the trigger element).
3. THE Application SHALL ensure all pages are fully navigable using the Tab, Shift+Tab, Enter, Space, and Escape keyboard keys.
4. THE Application SHALL provide visible focus indicators on all interactive elements that meet WCAG 2.1 AA standards.
5. THE Data_Table component SHALL include `scope` attributes on header cells and associate data cells with their headers for screen reader compatibility.
6. THE Application SHALL provide text alternatives for all non-decorative images and icons.

---

### Requirement 19: Error Handling and Loading States

**User Story:** As any user, I want clear feedback when data is loading or when an error occurs, so that I am never left wondering whether the application is working.

#### Acceptance Criteria

1. WHEN an API_Service call is in-flight, THE Application SHALL display a skeleton loading state or spinner within the affected component rather than a blank area.
2. WHEN an API_Service call fails, THE Application SHALL display an error Toast with a human-readable message and log the technical error to the browser console.
3. THE Application SHALL render a full-page error boundary that catches unhandled component errors, displays a friendly error message, and offers a "Reload" button.
4. IF a Data_Table has no rows to display, THEN THE Application SHALL render an empty-state illustration with a contextual message (e.g., "No prescriptions found").
5. WHEN a form submission API_Service call fails, THE Application SHALL re-enable the submit button and display an error Toast without clearing the form fields.

---

### Requirement 20: Performance and Code Quality

**User Story:** As a developer and end-user, I want the application to load and respond quickly, so that workflows are not impeded by slow rendering.

#### Acceptance Criteria

1. THE Application SHALL implement route-based code splitting using React `lazy()` and `Suspense` so that each page's bundle is loaded on demand.
2. THE Application SHALL memoize expensive derived data using `useMemo` and prevent unnecessary re-renders using `React.memo` and `useCallback` in Data_Table and Dashboard components.
3. THE Application SHALL achieve a Lighthouse Performance score of 80 or above on a production build served locally.
4. THE Application SHALL pass the Vite production build (`npm run build`) without TypeScript compilation errors or ESLint errors.
5. THE Application SHALL use environment-specific `.env` files (`.env`, `.env.development`, `.env.production`) and MUST NOT commit secrets or API keys to source control.
