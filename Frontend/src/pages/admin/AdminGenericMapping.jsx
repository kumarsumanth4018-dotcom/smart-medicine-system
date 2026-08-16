/**
 * Component: AdminGenericMapping
 *
 * Description: Generic medicine mapping management — the core intelligence feature.
 * Maps branded medicines to their PM Jan Aushadhi generic equivalents.
 * Backend readiness: TODO: GET /api/v1/admin/generic-mappings
 */

import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlinePencil, HiOutlineArrowRight } from 'react-icons/hi2'
import Badge      from '../../components/ui/Badge'
import AdminTable from './components/AdminTable'
import { GENERIC_MAPPINGS } from './data/adminData'

const STATUS_VARIANT = { approved:'success', pending:'warning', rejected:'danger' }

const COLUMNS = [
  {
    key: 'brandName', label: 'Brand Medicine',
    render: row => <div><p className="text-xs font-semibold text-slate-900">{row.brandName}</p><p className="text-[10px] text-slate-400">{row.composition}</p></div>,
  },
  {
    key: '_arrow', label: '',
    render: () => <HiOutlineArrowRight size={14} className="text-slate-300" aria-hidden="true" />,
  },
  {
    key: 'genericName', label: 'Generic Alternative',
    render: row => (
      <div>
        <p className="text-xs font-semibold text-success-700">{row.genericName}</p>
        {row.isJanAushadhi && <Badge variant="info" size="sm">🏥 Jan Aushadhi</Badge>}
      </div>
    ),
  },
  { key: 'confidence', label: 'Confidence', hide: 'md', render: row => (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-success-700">{row.confidence}</span>
      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-success-500 rounded-full" style={{ width: row.confidence }} />
      </div>
    </div>
  )},
  { key: 'status', label: 'Status', render: row => <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'} dot size="sm">{row.status}</Badge> },
  {
    key: '_actions', label: 'Actions',
    render: row => (
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`View mapping for ${row.brandName}`} className="p-1.5 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500">
          <HiOutlineEye size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Edit mapping for ${row.brandName}`} className="p-1.5 rounded text-slate-400 hover:text-secondary-600 hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-500">
          <HiOutlinePencil size={14} aria-hidden="true" />
        </button>
        {row.status === 'pending' && (
          <>
            <button type="button" aria-label={`Approve mapping for ${row.brandName}`} className="p-1.5 rounded text-slate-400 hover:text-success-600 hover:bg-success-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success-500">
              <HiOutlineCheckCircle size={14} aria-hidden="true" />
            </button>
            <button type="button" aria-label={`Reject mapping for ${row.brandName}`} className="p-1.5 rounded text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400">
              <HiOutlineXCircle size={14} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    ),
  },
]

function AdminGenericMapping() {
  return (
    <article aria-label="Generic Medicine Mapping" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Generic Medicine Mapping</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Map branded medicines to PM Jan Aushadhi generic alternatives. This drives the recommendation engine.
        </p>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET /api/v1/admin/generic-mappings</p>
      </div>

      {/* ======================================================
          Generic Mapping
         ====================================================== */}
      <AdminTable columns={COLUMNS} data={GENERIC_MAPPINGS} searchPlaceholder="Search brand or generic name…" ariaLabel="Generic medicine mappings table" />
    </article>
  )
}

export default AdminGenericMapping
