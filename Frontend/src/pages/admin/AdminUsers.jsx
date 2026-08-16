/**
 * Component: AdminUsers
 *
 * Description: User management page for the admin portal.
 * Responsibilities: View, edit, deactivate, delete users with search/filter/sort/pagination.
 * Backend readiness: TODO: GET /api/v1/admin/users
 */

import { HiOutlineEye, HiOutlinePencil, HiOutlineNoSymbol, HiOutlineTrash } from 'react-icons/hi2'
import Badge     from '../../components/ui/Badge'
import Avatar    from '../../components/ui/Avatar'
import AdminTable from './components/AdminTable'
import { USERS }  from './data/adminData'

const ROLE_VARIANT = { patient:'neutral', doctor:'primary', pharmacist:'secondary', admin:'danger' }
const STATUS_VARIANT = { active:'success', inactive:'danger' }

const COLUMNS = [
  {
    key: 'name', label: 'User',
    render: row => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} size="sm" />
        <div>
          <p className="text-xs font-semibold text-slate-900">{row.name}</p>
          <p className="text-[10px] text-slate-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'role',   label: 'Role',   render: row => <Badge variant={ROLE_VARIANT[row.role]   ?? 'neutral'} size="sm">{row.role}</Badge> },
  { key: 'status', label: 'Status', render: row => <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'} dot size="sm">{row.status}</Badge> },
  { key: 'joined', label: 'Joined', hide: 'md', render: row => <span className="text-xs text-slate-500">{row.joined}</span> },
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
        <button type="button" aria-label={`Deactivate ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-warning-600 hover:bg-warning-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warning-400">
          <HiOutlineNoSymbol size={14} aria-hidden="true" />
        </button>
        <button type="button" aria-label={`Delete ${row.name}`} className="p-1.5 rounded text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger-400">
          <HiOutlineTrash size={14} aria-hidden="true" />
        </button>
      </div>
    ),
  },
]

function AdminUsers() {
  return (
    <article aria-label="User Management" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {/* TODO: GET /api/v1/admin/users */}
          Manage registered users across all roles
        </p>
      </div>

      {/* ======================================================
          User Management
         ====================================================== */}
      <AdminTable
        columns={COLUMNS}
        data={USERS}
        searchPlaceholder="Search users by name, email or role…"
        ariaLabel="Users management table"
      />
    </article>
  )
}

export default AdminUsers
