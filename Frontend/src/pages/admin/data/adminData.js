/**
 * Admin Portal Placeholder Data
 * TODO: Replace all arrays with TanStack Query API calls once backend is ready.
 */

// ─── Users ────────────────────────────────────────────────────────────────────
export const USERS = [
  { id: 'u1', name: 'Priya Sharma',    email: 'priya@example.com',    role: 'patient',    status: 'active',    joined: '2025-01-12' },
  { id: 'u2', name: 'Dr. Arjun Mehta', email: 'arjun@example.com',   role: 'doctor',     status: 'active',    joined: '2025-01-18' },
  { id: 'u3', name: 'Pharmacy Staff',  email: 'staff@janaushadhi.in', role: 'pharmacist', status: 'active',    joined: '2025-02-01' },
  { id: 'u4', name: 'Rahul Verma',     email: 'rahul@example.com',    role: 'patient',    status: 'inactive',  joined: '2025-02-10' },
  { id: 'u5', name: 'Sneha Patil',     email: 'sneha@example.com',    role: 'patient',    status: 'active',    joined: '2025-03-05' },
  { id: 'u6', name: 'Kiran Joshi',     email: 'kiran@example.com',    role: 'doctor',     status: 'active',    joined: '2025-03-12' },
  { id: 'u7', name: 'Admin User',      email: 'admin@system.in',      role: 'admin',      status: 'active',    joined: '2025-01-01' },
]

// ─── Pharmacies ───────────────────────────────────────────────────────────────
export const PHARMACIES = [
  { id: 'ph1', name: 'Jan Aushadhi Kendra — Andheri',  owner: 'Ramesh Kumar',   license: 'MH-2025-001', location: 'Andheri West, Mumbai',   status: 'verified',  verified: true,  medicines: 248 },
  { id: 'ph2', name: 'Jan Aushadhi Kendra — Versova',  owner: 'Sunita Devi',    license: 'MH-2025-002', location: 'Versova, Mumbai',          status: 'verified',  verified: true,  medicines: 195 },
  { id: 'ph3', name: 'Apollo Pharmacy Juhu',            owner: 'Apollo Chain',   license: 'MH-2025-003', location: 'Juhu, Mumbai',             status: 'pending',   verified: false, medicines: 0   },
  { id: 'ph4', name: 'Jan Aushadhi Kendra — Borivali',  owner: 'Mohan Singh',    license: 'MH-2025-004', location: 'Borivali West, Mumbai',    status: 'suspended', verified: false, medicines: 312 },
  { id: 'ph5', name: 'MedPlus Pharmacy',                owner: 'MedPlus Chain',  license: 'MH-2025-005', location: 'Malad West, Mumbai',       status: 'pending',   verified: false, medicines: 0   },
]

// ─── Medicines ────────────────────────────────────────────────────────────────
export const MEDICINES_CATALOG = [
  { id: 'mc1', name: 'Paracetamol IP 500mg',    genericName: 'Acetaminophen',   composition: 'Paracetamol IP 500mg',    category: 'Analgesic',    manufacturer: 'BPPI (JA)', status: 'active',   availability: true  },
  { id: 'mc2', name: 'Azithromycin 500mg',      genericName: 'Azithromycin',    composition: 'Azithromycin IP 500mg',   category: 'Antibiotic',   manufacturer: 'Cipla Ltd.', status: 'active',  availability: true  },
  { id: 'mc3', name: 'Metformin 500mg',         genericName: 'Metformin HCl',   composition: 'Metformin HCl IP 500mg',  category: 'Antidiabetic', manufacturer: 'BPPI (JA)', status: 'active',   availability: true  },
  { id: 'mc4', name: 'Crocin 500',              genericName: 'Paracetamol',     composition: 'Paracetamol 500mg',       category: 'Analgesic',    manufacturer: 'GSK',        status: 'active',  availability: true  },
  { id: 'mc5', name: 'Amoxicillin 500mg',       genericName: 'Amoxicillin',     composition: 'Amoxicillin IP 500mg',    category: 'Antibiotic',   manufacturer: 'Sun Pharma', status: 'archived', availability: false },
  { id: 'mc6', name: 'Cetirizine 10mg',         genericName: 'Cetirizine HCl',  composition: 'Cetirizine HCl IP 10mg', category: 'Antihistamine',manufacturer: 'BPPI (JA)', status: 'active',   availability: true  },
]

// ─── Generic Mappings ─────────────────────────────────────────────────────────
export const GENERIC_MAPPINGS = [
  { id: 'gm1', brandName: 'Crocin 500',         genericName: 'Paracetamol IP 500mg',  composition: 'Paracetamol IP 500mg',   isJanAushadhi: true,  confidence: '97%', status: 'approved'  },
  { id: 'gm2', brandName: 'Dolo 650',           genericName: 'Paracetamol IP 650mg',  composition: 'Paracetamol IP 650mg',   isJanAushadhi: true,  confidence: '96%', status: 'approved'  },
  { id: 'gm3', brandName: 'Azee 500',           genericName: 'Azithromycin 500mg',    composition: 'Azithromycin IP 500mg',  isJanAushadhi: false, confidence: '94%', status: 'pending'   },
  { id: 'gm4', brandName: 'Glucophage 500',     genericName: 'Metformin 500mg',       composition: 'Metformin HCl IP 500mg', isJanAushadhi: true,  confidence: '98%', status: 'approved'  },
  { id: 'gm5', brandName: 'Allegra 120mg',      genericName: 'Fexofenadine 120mg',    composition: 'Fexofenadine HCl 120mg', isJanAushadhi: false, confidence: '88%', status: 'pending'   },
  { id: 'gm6', brandName: 'Zyrtec 10mg',        genericName: 'Cetirizine 10mg',       composition: 'Cetirizine HCl IP 10mg', isJanAushadhi: true,  confidence: '95%', status: 'rejected'  },
]

// ─── Activity Logs ────────────────────────────────────────────────────────────
export const ACTIVITY_LOGS = [
  { id: 'a1',  type: 'user',     icon: 'user',    label: 'New User Registered',           detail: 'Sneha Patil registered as patient',           time: '2 min ago',   module: 'Users',           status: 'success', user: 'Sneha Patil',      ip: '192.168.1.101', device: 'Chrome / Android' },
  { id: 'a2',  type: 'pharmacy', icon: 'pharmacy',label: 'Pharmacy Registration Submitted',detail: 'MedPlus Pharmacy submitted registration',     time: '15 min ago',  module: 'Pharmacies',       status: 'pending', user: 'MedPlus Chain',    ip: '192.168.1.102', device: 'Firefox / Windows' },
  { id: 'a3',  type: 'pharmacy', icon: 'pharmacy',label: 'Pharmacy Approved',              detail: 'Jan Aushadhi Kendra Andheri verified',        time: '1 hr ago',    module: 'Pharmacies',       status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a4',  type: 'pharmacy', icon: 'pharmacy',label: 'Pharmacy Rejected',              detail: 'Borivali Kendra application rejected',        time: '2 hr ago',    module: 'Pharmacies',       status: 'danger',  user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a5',  type: 'medicine', icon: 'medicine',label: 'Medicine Added',                 detail: 'Cetirizine 10mg added to catalog',            time: '2 hr ago',    module: 'Medicines',        status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a6',  type: 'medicine', icon: 'medicine',label: 'Medicine Updated',               detail: 'Paracetamol IP 500mg price updated',          time: '3 hr ago',    module: 'Medicines',        status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a7',  type: 'medicine', icon: 'medicine',label: 'Medicine Deleted',               detail: 'Amoxicillin 500mg archived',                  time: '3 hr ago',    module: 'Medicines',        status: 'danger',  user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a8',  type: 'mapping',  icon: 'mapping', label: 'Generic Mapping Created',        detail: 'Crocin 500 → Paracetamol IP mapping added',   time: '4 hr ago',    module: 'Generic Mapping',  status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a9',  type: 'mapping',  icon: 'mapping', label: 'Generic Mapping Updated',        detail: 'Dolo 650 confidence updated to 96%',          time: '4 hr ago',    module: 'Generic Mapping',  status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a10', type: 'notif',    icon: 'notif',   label: 'Notification Broadcasted',       detail: 'Stock alert broadcast sent to 84 users',      time: '5 hr ago',    module: 'Notifications',    status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a11', type: 'pharmacy', icon: 'pharmacy',label: 'Inventory Updated',              detail: 'Andheri Kendra stock updated for 12 items',   time: '6 hr ago',    module: 'Inventory',        status: 'success', user: 'Ramesh Kumar',     ip: '192.168.1.103', device: 'Safari / iOS' },
  { id: 'a12', type: 'user',     icon: 'user',    label: 'User Suspended',                 detail: 'Rahul Verma account suspended',               time: '7 hr ago',    module: 'Users',            status: 'warning', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a13', type: 'user',     icon: 'user',    label: 'User Activated',                 detail: 'Kiran Joshi account re-activated',            time: '8 hr ago',    module: 'Users',            status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a14', type: 'pharmacy', icon: 'pharmacy',label: 'Pharmacy Suspended',             detail: 'Borivali Kendra access suspended',            time: '9 hr ago',    module: 'Pharmacies',       status: 'danger',  user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'a15', type: 'admin',    icon: 'admin',   label: 'Administrator Login',            detail: 'Admin User logged in from Mumbai, MH',        time: '10 hr ago',   module: 'Security',         status: 'success', user: 'Admin User',       ip: '192.168.1.100', device: 'Chrome / Windows' },
]

// ─── Audit Trail ──────────────────────────────────────────────────────────────
export const AUDIT_TRAIL = [
  { id: 'at1',  date: '02 Jul 2026', time: '10:14 AM', admin: 'Admin User',   action: 'Approved pharmacy registration',  module: 'Pharmacies',      status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at2',  date: '02 Jul 2026', time: '09:52 AM', admin: 'Admin User',   action: 'Rejected generic mapping',        module: 'Generic Mapping', status: 'danger',  ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at3',  date: '02 Jul 2026', time: '09:31 AM', admin: 'Admin User',   action: 'Added new medicine to catalog',   module: 'Medicines',       status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at4',  date: '02 Jul 2026', time: '08:47 AM', admin: 'Admin User',   action: 'Broadcast notification sent',     module: 'Notifications',   status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at5',  date: '01 Jul 2026', time: '05:22 PM', admin: 'Admin User',   action: 'User account suspended',          module: 'Users',           status: 'warning', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at6',  date: '01 Jul 2026', time: '03:14 PM', admin: 'Admin User',   action: 'System settings updated',         module: 'Settings',        status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at7',  date: '01 Jul 2026', time: '11:05 AM', admin: 'Admin User',   action: 'Password policy changed',         module: 'Security',        status: 'warning', ip: '192.168.1.100', device: 'Chrome / Windows' },
  { id: 'at8',  date: '30 Jun 2026', time: '04:40 PM', admin: 'Admin User',   action: 'Role permissions updated',        module: 'Roles',           status: 'success', ip: '192.168.1.100', device: 'Chrome / Windows' },
]

// ─── Pending Approvals ────────────────────────────────────────────────────────
export const PENDING_PHARMACY_REGS = [
  { id: 'pp1', name: 'Apollo Pharmacy Juhu',  owner: 'Apollo Chain',   license: 'MH-2025-003', location: 'Juhu, Mumbai',        submitted: '30 Jun 2026', docs: ['Drug License', 'GST Certificate', 'Identity Proof'] },
  { id: 'pp2', name: 'MedPlus Pharmacy',       owner: 'MedPlus Chain',  license: 'MH-2025-005', location: 'Malad West, Mumbai',  submitted: '01 Jul 2026', docs: ['Drug License', 'GST Certificate'] },
]

export const PENDING_GENERIC_MAPPINGS = [
  { id: 'pg1', brandName: 'Azee 500',    genericName: 'Azithromycin 500mg', confidence: '94%', submittedBy: 'Dr. Arjun Mehta', submittedOn: '29 Jun 2026' },
  { id: 'pg2', brandName: 'Allegra 120', genericName: 'Fexofenadine 120mg', confidence: '88%', submittedBy: 'System Auto',     submittedOn: '01 Jul 2026' },
]

export const PENDING_MEDICINE_APPROVALS = [
  { id: 'pm1', name: 'Omeprazole 20mg',   composition: 'Omeprazole IP 20mg',  category: 'Antacid',    submittedBy: 'Ramesh Kumar',  submittedOn: '01 Jul 2026' },
  { id: 'pm2', name: 'Atorvastatin 10mg', composition: 'Atorvastatin IP 10mg',category: 'Cardiac',    submittedBy: 'System Import', submittedOn: '02 Jul 2026' },
]

// ─── Security Logs ────────────────────────────────────────────────────────────
export const SECURITY_LOGS = [
  { id: 's1', event: 'Failed Login Attempt',   user: 'unknown@test.com',      ip: '103.45.67.89',  time: '02 Jul 2026 09:12 AM', severity: 'warning', detail: '3 consecutive failed attempts' },
  { id: 's2', event: 'Account Locked',          user: 'rahul@example.com',     ip: '192.168.1.105', time: '01 Jul 2026 11:30 PM', severity: 'danger',  detail: 'Account auto-locked after 5 failures' },
  { id: 's3', event: 'Permission Change',        user: 'Admin User',            ip: '192.168.1.100', time: '01 Jul 2026 03:14 PM', severity: 'warning', detail: 'Role permissions updated for Pharmacy Manager' },
  { id: 's4', event: 'Suspicious Login',         user: 'kiran@example.com',     ip: '45.22.101.77',  time: '30 Jun 2026 02:22 AM', severity: 'danger',  detail: 'Login from unrecognised IP location' },
  { id: 's5', event: 'Security Alert Resolved',  user: 'Admin User',            ip: '192.168.1.100', time: '30 Jun 2026 09:00 AM', severity: 'success', detail: 'Suspicious activity reviewed and cleared' },
]

// ─── System Health ────────────────────────────────────────────────────────────
export const SYSTEM_SERVICES = [
  { id: 'sv1', name: 'Platform Status',          status: 'operational', uptime: '99.98%', note: 'All systems running' },
  { id: 'sv2', name: 'Database',                 status: 'operational', uptime: '99.95%', note: 'TODO: GET /api/v1/health/db' },
  { id: 'sv3', name: 'REST API',                 status: 'operational', uptime: '99.97%', note: 'TODO: GET /api/v1/health/api' },
  { id: 'sv4', name: 'Authentication Service',   status: 'operational', uptime: '99.99%', note: 'TODO: GET /api/v1/health/auth' },
  { id: 'sv5', name: 'Notification Service',     status: 'degraded',    uptime: '97.20%', note: 'Minor delays observed' },
  { id: 'sv6', name: 'Maps Service (Leaflet)',   status: 'operational', uptime: '99.80%', note: 'OpenStreetMap tiles healthy' },
  { id: 'sv7', name: 'OCR Engine',               status: 'coming_soon', uptime: 'N/A',    note: 'Planned for next phase' },
  { id: 'sv8', name: 'Storage / CDN',            status: 'operational', uptime: '99.90%', note: 'TODO: GET /api/v1/health/storage' },
]

// ─── Reports ──────────────────────────────────────────────────────────────────
export const REPORT_TYPES = [
  { id: 'r1', label: 'Daily Report',                     period: 'Today',               icon: 'calendar', category: 'time'     },
  { id: 'r2', label: 'Weekly Report',                    period: 'Last 7 days',          icon: 'week',     category: 'time'     },
  { id: 'r3', label: 'Monthly Report',                   period: 'Last 30 days',         icon: 'month',    category: 'time'     },
  { id: 'r4', label: 'Medicine Report',                  period: 'All medicines',        icon: 'medicine', category: 'entity'   },
  { id: 'r5', label: 'Pharmacy Report',                  period: 'All pharmacies',       icon: 'pharmacy', category: 'entity'   },
  { id: 'r6', label: 'User Report',                      period: 'All users',            icon: 'users',    category: 'entity'   },
  { id: 'r7', label: 'Inventory Report',                 period: 'Current stock',        icon: 'inventory',category: 'entity'   },
  { id: 'r8', label: 'Generic Recommendation Report',    period: 'All recommendations',  icon: 'generic',  category: 'entity'   },
]

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = [
  { id: 'r1', name: 'Administrator',    users: 1,    permissions: ['all'],               description: 'Full platform access and configuration' },
  { id: 'r2', name: 'Pharmacy Manager', users: 3,    permissions: ['inventory','orders'], description: 'Manage pharmacy inventory and prescriptions' },
  { id: 'r3', name: 'Doctor',           users: 2,    permissions: ['search','recommend'], description: 'Search and recommend medicines' },
  { id: 'r4', name: 'Registered User',  users: 1200, permissions: ['search','view'],     description: 'Search medicines and view recommendations' },
]

// ─── AI Services ──────────────────────────────────────────────────────────────
export const AI_SERVICES = [
  { id: 'ai1', name: 'Recommendation Engine',   status: 'active',      accuracy: '94.2%', note: 'Generic matching model v2.1' },
  { id: 'ai2', name: 'Prediction Engine',       status: 'coming_soon', accuracy: 'N/A',   note: 'Demand prediction — planned' },
  { id: 'ai3', name: 'OCR Engine',              status: 'coming_soon', accuracy: 'N/A',   note: 'Prescription scanning — planned' },
  { id: 'ai4', name: 'Voice Search',            status: 'coming_soon', accuracy: 'N/A',   note: 'Speech-to-text — planned' },
  { id: 'ai5', name: 'Barcode Scanner',         status: 'coming_soon', accuracy: 'N/A',   note: 'Medicine barcode detection — planned' },
]

// ─── Backup History ───────────────────────────────────────────────────────────
export const BACKUP_HISTORY = [
  { id: 'b1', label: 'Full Backup',    date: '02 Jul 2026 02:00 AM', size: '-- MB',  status: 'success', type: 'Scheduled' },
  { id: 'b2', label: 'Full Backup',    date: '01 Jul 2026 02:00 AM', size: '-- MB',  status: 'success', type: 'Scheduled' },
  { id: 'b3', label: 'Manual Backup',  date: '30 Jun 2026 04:15 PM', size: '-- MB',  status: 'success', type: 'Manual' },
  { id: 'b4', label: 'Full Backup',    date: '29 Jun 2026 02:00 AM', size: '-- MB',  status: 'failed',  type: 'Scheduled' },
]

// ─── Admin Notifications ──────────────────────────────────────────────────────
export const ADMIN_NOTIFICATIONS = [
  { id: 'an1', type: 'critical', title: 'Notification Service Degraded',      body: 'Push notification delays detected. Investigating.',     time: '10 min ago', read: false },
  { id: 'an2', type: 'security', title: 'Failed Login Attempts Detected',     body: '3 failed login attempts from IP 103.45.67.89',          time: '1 hr ago',  read: false },
  { id: 'an3', type: 'platform', title: 'Scheduled Maintenance Tonight',      body: 'System maintenance window: 02:00–03:00 AM IST',         time: '2 hr ago',  read: true  },
  { id: 'an4', type: 'register', title: 'New Pharmacy Registration',          body: 'MedPlus Pharmacy submitted for verification.',           time: '3 hr ago',  read: false },
  { id: 'an5', type: 'medicine', title: 'Medicine Approval Pending',          body: 'Omeprazole 20mg is awaiting admin review.',              time: '5 hr ago',  read: true  },
  { id: 'an6', type: 'inventory','title': 'Low Stock Alert',                  body: 'Cetirizine 10mg stock critical at Andheri Kendra.',      time: '6 hr ago',  read: true  },
]
