/**
 * Component: AdminNotifications
 *
 * Description: Broadcast notification center for sending system-wide alerts.
 * Backend readiness: TODO: POST /api/v1/admin/notifications/broadcast
 */

import { useState } from 'react'
import { HiOutlineBell, HiOutlinePaperAirplane } from 'react-icons/hi2'
import Input    from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'
import Select   from '../../components/forms/Select'
import Button   from '../../components/ui/Button'
import Badge    from '../../components/ui/Badge'
import NotificationCard from '../../components/cards/NotificationCard'

const HISTORY = [
  { id: 'h1', title: 'Stock Alert',          description: 'Paracetamol IP 500mg in stock at 15 pharmacies.',  time: '1 hour ago', type: 'success', isRead: true },
  { id: 'h2', title: 'System Maintenance',   description: 'Scheduled maintenance on 30 July 2025.',           time: '2 days ago', type: 'warning', isRead: true },
]

function AdminNotifications() {
  const [title, setTitle]   = useState('')
  const [body,  setBody]    = useState('')
  const [sent,  setSent]    = useState(false)

  function handleSend(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setTitle(''); setBody('')
  }

  return (
    <article aria-label="Notification Broadcast Center" className="flex flex-col gap-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <HiOutlineBell size={20} className="text-warning-500" aria-hidden="true" />
          Broadcast Notifications
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: POST /api/v1/admin/notifications/broadcast</p>
      </div>

      {/* Compose form */}
      <form onSubmit={handleSend} noValidate className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <p className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Compose Notification</p>
        <Input label="Title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title…" />
        <Textarea label="Message" required value={body} onChange={e => setBody(e.target.value)} placeholder="Notification message…" rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Target Audience" options={[{value:'all',label:'All Users'},{value:'patients',label:'Patients'},{value:'pharmacists',label:'Pharmacists'},{value:'doctors',label:'Doctors'}]} />
          <Select label="Priority" options={[{value:'normal',label:'Normal'},{value:'high',label:'High'},{value:'urgent',label:'Urgent'}]} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" leftIcon={<HiOutlinePaperAirplane size={15} />}>
            {sent ? 'Sent! (placeholder)' : 'Send Notification'}
          </Button>
          <Badge variant="neutral" size="sm">No backend yet</Badge>
        </div>
      </form>

      {/* History */}
      <div>
        <p className="text-sm font-bold text-slate-800 mb-3">Recent Broadcasts</p>
        <div className="space-y-2">
          {HISTORY.map(n => <NotificationCard key={n.id} notification={n} />)}
        </div>
      </div>
    </article>
  )
}

export default AdminNotifications
