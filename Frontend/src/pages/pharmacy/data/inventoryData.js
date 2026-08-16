/**
 * Pharmacy Inventory Placeholder Data
 *
 * All data is hardcoded placeholder only.
 * TODO: Replace with GET /api/v1/pharmacy/inventory in Module 12+
 */

export const INVENTORY = [
  { id: 'i1',  name: 'Paracetamol IP 500mg',    genericName: 'Acetaminophen',    composition: 'Paracetamol IP 500mg',    manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-001', mfgDate: '2025-01-10', expiry: '2027-01-09', qty: 480, category: 'Analgesic',      dosageForm: 'Tablet',   strength: '500mg',  price: 18,  status: 'available' },
  { id: 'i2',  name: 'Azithromycin 500mg',       genericName: 'Azithromycin',     composition: 'Azithromycin IP 500mg',   manufacturer: 'Cipla Ltd.',          batch: 'BAT-2025-002', mfgDate: '2025-02-01', expiry: '2026-08-30', qty: 85,  category: 'Antibiotic',     dosageForm: 'Tablet',   strength: '500mg',  price: 45,  status: 'low'       },
  { id: 'i3',  name: 'Metformin 500mg',           genericName: 'Metformin HCl',    composition: 'Metformin HCl IP 500mg',  manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-003', mfgDate: '2025-01-15', expiry: '2027-01-14', qty: 320, category: 'Antidiabetic',   dosageForm: 'Tablet',   strength: '500mg',  price: 12,  status: 'available' },
  { id: 'i4',  name: 'Cetirizine 10mg',           genericName: 'Cetirizine HCl',   composition: 'Cetirizine HCl IP 10mg',  manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-004', mfgDate: '2025-03-01', expiry: '2025-09-30', qty: 15,  category: 'Antihistamine',  dosageForm: 'Tablet',   strength: '10mg',   price: 8,   status: 'critical'  },
  { id: 'i5',  name: 'Amoxicillin 500mg',         genericName: 'Amoxicillin',      composition: 'Amoxicillin IP 500mg',    manufacturer: 'Sun Pharma',          batch: 'BAT-2025-005', mfgDate: '2025-01-20', expiry: '2025-07-19', qty: 0,   category: 'Antibiotic',     dosageForm: 'Capsule',  strength: '500mg',  price: 55,  status: 'out'       },
  { id: 'i6',  name: 'Paracetamol Syrup 120mg',   genericName: 'Acetaminophen',    composition: 'Paracetamol IP 120mg/5ml',manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-006', mfgDate: '2025-02-10', expiry: '2026-02-09', qty: 240, category: 'Analgesic',      dosageForm: 'Syrup',    strength: '120mg/5ml',price: 28, status: 'available' },
  { id: 'i7',  name: 'Pantoprazole 40mg',         genericName: 'Pantoprazole',     composition: 'Pantoprazole Sodium 40mg',manufacturer: 'Mankind Pharma',      batch: 'BAT-2025-007', mfgDate: '2025-03-05', expiry: '2025-07-04', qty: 60,  category: 'Antacid',        dosageForm: 'Tablet',   strength: '40mg',   price: 22,  status: 'expiring'  },
  { id: 'i8',  name: 'Vitamin D3 60000 IU',       genericName: 'Cholecalciferol',  composition: 'Cholecalciferol 60000 IU',manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-008', mfgDate: '2025-01-25', expiry: '2026-07-24', qty: 180, category: 'Supplement',     dosageForm: 'Capsule',  strength: '60000 IU',price: 35, status: 'available' },
  { id: 'i9',  name: 'Ibuprofen 400mg',           genericName: 'Ibuprofen',        composition: 'Ibuprofen IP 400mg',      manufacturer: 'Jan Aushadhi (BPPI)', batch: 'BAT-2025-009', mfgDate: '2025-02-15', expiry: '2027-02-14', qty: 390, category: 'NSAID',          dosageForm: 'Tablet',   strength: '400mg',  price: 14,  status: 'available' },
  { id: 'i10', name: 'ORS Sachet',                genericName: 'ORS',              composition: 'Sodium Chloride + Glucose',manufacturer: 'Jan Aushadhi (BPPI)',batch: 'BAT-2025-010', mfgDate: '2025-01-01', expiry: '2027-12-31', qty: 50,  category: 'Electrolytes',   dosageForm: 'Sachet',   strength: 'Standard', price: 5, status: 'low'      },
]

export const CATEGORIES = [
  'Analgesic', 'Antibiotic', 'Antidiabetic', 'Antihistamine',
  'Antacid', 'Supplement', 'NSAID', 'Electrolytes', 'Pediatric',
  'Cardiology', 'Neurology', 'Respiratory', 'Ayurvedic',
]

export const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Sachet',
  'Cream', 'Ointment', 'Drops', 'Powder', 'Inhaler',
]

export const STATUS_CONFIG = {
  available: { variant: 'success', label: 'Available',     bg: 'bg-success-50',  border: 'border-success-200',  text: 'text-success-700'  },
  low:       { variant: 'warning', label: 'Low Stock',     bg: 'bg-warning-50',  border: 'border-warning-200',  text: 'text-warning-700'  },
  critical:  { variant: 'danger',  label: 'Critical',      bg: 'bg-danger-50',   border: 'border-danger-200',   text: 'text-danger-700'   },
  out:       { variant: 'danger',  label: 'Out of Stock',  bg: 'bg-slate-50',    border: 'border-slate-200',    text: 'text-slate-500'    },
  expiring:  { variant: 'warning', label: 'Expiring Soon', bg: 'bg-orange-50',   border: 'border-orange-200',   text: 'text-orange-700'   },
}
