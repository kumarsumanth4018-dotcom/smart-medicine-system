/**
 * Component: MedicineReminderSection
 *
 * Description:
 *   UI placeholder for the future medicine reminder feature.
 *
 * Backend readiness:
 *   - reminders → GET /api/v1/users/me/reminders
 *   - create    → POST /api/v1/users/me/reminders
 */

import { HiOutlineBell, HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Badge from '../../../components/ui/Badge'
import Toggle from '../../../components/forms/Toggle'
import { useState } from 'react'

const REMINDERS = [
  { id: 'r1', name: 'Paracetamol IP 500mg', time: '8:00 AM',  frequency: 'Daily',    isEnabled: true  },
  { id: 'r2', name: 'Metformin 500mg',       time: '9:00 AM',  frequency: 'Twice daily', isEnabled: false },
]

function ReminderCard({ reminder }) {
  const [enabled, setEnabled] = useState(reminder.isEnabled)
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 shrink-0">
        <MdMedication size={18} className="text-primary-600" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{reminder.name}</p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
          <HiOutlineClock size={10} aria-hidden="true" />{reminder.time}
          <HiOutlineCalendarDays size={10} aria-hidden="true" />{reminder.frequency}
        </div>
      </div>
      <Toggle size="sm" checked={enabled} onChange={() => setEnabled(v => !v)} aria-label={`Toggle reminder for ${reminder.name}`} />
    </div>
  )
}

function MedicineReminderSection() {
  return (
    <section aria-labelledby="reminder-heading">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineBell size={18} className="text-warning-500" aria-hidden="true" />
          <h2 id="reminder-heading" className="text-base font-bold text-slate-900">
            Medicine Reminders
          </h2>
          <Badge variant="neutral" size="sm">Coming Soon</Badge>
        </div>
        <div className="space-y-2 mb-4">
          {REMINDERS.map((r) => <ReminderCard key={r.id} reminder={r} />)}
        </div>
        <button
          type="button"
          disabled
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
          aria-label="Add medicine reminder (coming soon)"
        >
          + Add Reminder — Coming Soon
          {/* TODO: POST /api/v1/users/me/reminders */}
        </button>
      </div>
    </section>
  )
}

export default MedicineReminderSection
