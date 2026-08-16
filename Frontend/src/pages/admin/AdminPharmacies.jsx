/**
 * Component: AdminPharmacies
 *
 * Description: Pharmacy network management page.
 * Backend readiness: TODO: GET /api/v1/admin/pharmacies
 */

import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlinePencil, HiOutlineNoSymbol } from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'
import Badge      from '../../components/ui/Badge'
import AdminTable from './components/AdminTable'
import { PHARMACIES } from './data/adminData'

const STATUS_VARIANT = { verified:'success', pending:'warning', suspended:'danger' }

const COLUMNS = [
  {
    key: 'name', label: 'Pharmacy',
    render: row => (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-50 shrink-0">
          <MdLocalPharmacy size={16} className="text-secondary-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">{row.name}</p>
          <p className="text-[10px] text-slate-400">{row.owner}</p>
        </div>
      </div>
    ),
  },
  { key: 'license',   label: 'License', hide: 'lg', render: row => <span className="text-xs font-mono text-slate-500">{row.license}</span> },
  { key: 'location',  label: 'Location', hide: 'md', render: row => <span className="text-xs text-slate-500">{row.location}</span> },
  { key: 'status',    label: 'Status', render: row => <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'} dot size="sm">{row.status}</Badge> },
  { key: 'medicines', label: 'Medicines', hide: 'xl', render: row => <span className="text-xs font-bold text-slate-700">{row.medicines}</span> },
  {
    key: '_actions', label: 'Actions',
    render: row => (
      <div className="flex items-center gap-1">
        {row.status === 'pending' && (
          <>
            <button type="button" aria-label={`Approve ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-success-600 hover:bg-success-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success-500">
              <HiOutlineCheckCircle size={14} aria-hidden="true" />
            </button>
            <button type="button" aria-label={`Reject ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400">
              <HiOutlineXCircle size={14} aria-hidden="true" />
            </button>
          </>
        )}
        <button type="button" aria-label={`View ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500">
          <HiOutlineEye size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Edit ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-secondary-600 hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500">
          <HiOutlinePencil size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Suspend ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-warning-600 hover:bg-warning-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warning-400">
          <HiOutlineNoSymbol size={14} aria-hidden="true" />
        </button>
      </div>
    ),
  },
]

function AdminPharmacies() {
  return (
    <article aria-label="Pharmacy Management" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Pharmacy Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">TODO: GET /api/v1/admin/pharmacies</p>
      </div>

      {/* ======================================================
          Pharmacy Management
         ====================================================== */}
      <AdminTable columns={COLUMNS} data={PHARMACIES} searchPlaceholder="Search pharmacies by name, owner, location…" ariaLabel="Pharmacy management table" />
    </article>
  )
}

export default AdminPharmacies
