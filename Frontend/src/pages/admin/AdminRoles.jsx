/**
 * Component: AdminRoles
 *
 * Description: Role and permission management UI.
 * Backend readiness: TODO: GET /api/v1/admin/roles
 */

import { HiOutlineShieldCheck } from 'react-icons/hi2'
import Badge from '../../components/ui/Badge'
import { ROLES } from './data/adminData'

const PERMISSIONS = ['Search', 'View Details', 'Generic Recommendations', 'Save Medicines', 'Inventory', 'Add Medicine', 'Edit Medicine', 'Manage Pharmacies', 'Manage Users', 'Platform Config', 'Reports', 'Broadcast Notifications']
const ROLE_HAS = {
  'Administrator':    new Set(PERMISSIONS),
  'Pharmacy Manager': new Set(['Search','View Details','Generic Recommendations','Inventory','Add Medicine','Edit Medicine']),
  'Doctor':           new Set(['Search','View Details','Generic Recommendations','Save Medicines']),
  'Registered User':  new Set(['Search','View Details','Save Medicines']),
}

function AdminRoles() {
  return (
    <article aria-label="Role Management" className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <HiOutlineShieldCheck size={22} className="text-primary-600" aria-hidden="true" />
          Roles & Permissions
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET /api/v1/admin/roles</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        {ROLES.map(r => (
          <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-900">{r.name}</p>
              <Badge variant="primary" size="sm">{r.users} users</Badge>
            </div>
            <p className="text-xs text-slate-500">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <p className="text-sm font-bold text-slate-800 px-5 py-3 border-b border-slate-100">Permission Matrix <Badge variant="neutral" size="sm" className="ml-2">Placeholder</Badge></p>
        <div className="overflow-x-auto">
          <table className="table-base" aria-label="Permission matrix">
            <thead>
              <tr>
                <th scope="col">Permission</th>
                {ROLES.map(r => <th key={r.id} scope="col" className="text-center">{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(perm => (
                <tr key={perm}>
                  <td className="text-xs font-medium text-slate-700">{perm}</td>
                  {ROLES.map(r => (
                    <td key={r.id} className="text-center">
                      {ROLE_HAS[r.name]?.has(perm)
                        ? <span className="text-success-500 text-base" aria-label="Allowed">✓</span>
                        : <span className="text-slate-200 text-base" aria-label="Not allowed">—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  )
}

export default AdminRoles
