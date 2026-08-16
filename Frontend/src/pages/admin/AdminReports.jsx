/**
 * Component: AdminReports
 *
 * Description: Reports center with export placeholders.
 * Backend readiness: TODO: GET /api/v1/admin/reports
 */

import { HiOutlineDocumentArrowDown, HiOutlinePrinter, HiOutlineTableCells } from 'react-icons/hi2'
import Badge from '../../components/ui/Badge'
import { REPORT_TYPES } from './data/adminData'

function AdminReports() {
  return (
    <article aria-label="Reports Center" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Reports Center</h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET /api/v1/admin/reports</p>
      </div>

      {/* ======================================================
          Analytics & Reports
         ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-bold text-slate-900">{r.label}</p>
              <p className="text-xs text-slate-400">{r.period}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button type="button" aria-label={`Export ${r.label} as PDF`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
                <HiOutlineDocumentArrowDown size={13} aria-hidden="true" /> PDF
              </button>
              <button type="button" aria-label={`Export ${r.label} as Excel`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
                <HiOutlineTableCells size={13} aria-hidden="true" /> Excel
              </button>
              <button type="button" aria-label={`Print ${r.label}`} className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
                <HiOutlinePrinter size={13} aria-hidden="true" />
              </button>
              <Badge variant="neutral" size="sm" className="ml-auto">Placeholder</Badge>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default AdminReports
