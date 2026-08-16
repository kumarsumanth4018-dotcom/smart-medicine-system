/**
 * Component: AdminMedicines
 *
 * Description: Master medicine catalog management.
 * Backend readiness: TODO: GET /api/v1/admin/medicines
 */

import { HiOutlineEye, HiOutlinePencil, HiOutlineArchiveBox, HiOutlinePlus } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge      from '../../components/ui/Badge'
import AdminTable from './components/AdminTable'
import { MEDICINES_CATALOG } from './data/adminData'

const STATUS_VARIANT = { active:'success', archived:'neutral' }

const COLUMNS = [
  {
    key: 'name', label: 'Medicine',
    render: row => (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 shrink-0">
          <MdMedication size={14} className="text-primary-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">{row.name}</p>
          <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{row.composition}</p>
        </div>
      </div>
    ),
  },
  { key: 'genericName',  label: 'Generic',      hide: 'md', render: row => <span className="text-xs text-slate-500">{row.genericName}</span> },
  { key: 'category',     label: 'Category',     hide: 'lg', render: row => <Badge variant="neutral" size="sm">{row.category}</Badge> },
  { key: 'manufacturer', label: 'Manufacturer', hide: 'xl', render: row => <span className="text-xs text-slate-500 truncate max-w-[100px] block">{row.manufacturer}</span> },
  { key: 'status',       label: 'Status', render: row => <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'} dot size="sm">{row.status}</Badge> },
  {
    key: '_actions', label: 'Actions',
    render: row => (
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`View ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500">
          <HiOutlineEye size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Edit ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-secondary-600 hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500">
          <HiOutlinePencil size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Archive ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-warning-600 hover:bg-warning-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warning-400">
          <HiOutlineArchiveBox size={14} aria-hidden="true" />
        </button>
      </div>
    ),
  },
]

function AdminMedicines() {
  return (
    <article aria-label="Medicine Catalog" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Medicine Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">TODO: GET /api/v1/admin/medicines</p>
        </div>
        <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
          <HiOutlinePlus size={15} aria-hidden="true" /> Add Medicine
        </button>
      </div>

      {/* ======================================================
          Medicine Catalog
         ====================================================== */}
      <AdminTable columns={COLUMNS} data={MEDICINES_CATALOG} searchPlaceholder="Search medicines by name, generic name or category…" ariaLabel="Medicine catalog table" />
    </article>
  )
}

export default AdminMedicines
