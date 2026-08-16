/**
 * Component: ProfilePage
 *
 * Description:
 *   User profile management page. Displays account information
 *   and allows editing personal details.
 *
 * Route: /profile  (ProtectedRoute → UserLayout)
 *
 * Backend readiness:
 *   - TODO: GET /api/v1/users/me
 *   - TODO: PUT /api/v1/users/me
 */

import { useForm }  from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }        from 'zod'
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi2'
import Avatar  from '../../components/ui/Avatar'
import Badge   from '../../components/ui/Badge'
import Input   from '../../components/forms/Input'
import Toggle  from '../../components/forms/Toggle'
import Button  from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const profileSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
})

function ProfilePage() {
  const { currentUser } = useAuth()
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [saved,        setSaved]        = useState(false)

  const name  = currentUser?.name  ?? 'Demo User'
  const email = currentUser?.email ?? 'demo@example.com'
  const role  = currentUser?.role  ?? 'patient'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, email, phone: '' },
  })

  function onSubmit(_data) {
    // TODO: PUT /api/v1/users/me
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <article aria-label="Profile" className="max-w-2xl mx-auto flex flex-col gap-5">

      {/* Profile header card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar name={name} size="xl" online={true} />
          <div>
            <h1 className="text-xl font-extrabold text-white">{name}</h1>
            <p className="text-primary-200 text-sm">{email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="success" size="sm" dot>Active</Badge>
              <Badge variant="primary" size="sm">{role}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
          <HiOutlineUser size={15} className="text-primary-600" aria-hidden="true" />
          Personal Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name"       required error={errors.name?.message}  {...register('name')}  placeholder="Enter your full name" />
            <Input label="Email Address"   required type="email" error={errors.email?.message} {...register('email')} placeholder="Enter your email address" />
          </div>
          <Input label="Mobile Number" type="tel" error={errors.phone?.message} {...register('phone')} placeholder="Enter your 10-digit mobile number" helperText="TODO: verify via OTP after update" />
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
            <p className="text-[11px] text-slate-400">
              {/* TODO: PUT /api/v1/users/me */}
              Changes saved locally — backend integration in Module 14+
            </p>
          </div>
        </form>
      </div>

      {/* Account settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
          <HiOutlineBell size={15} className="text-primary-600" aria-hidden="true" />
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <div>
              <p className="text-xs font-semibold text-slate-700">Notifications</p>
              <p className="text-[11px] text-slate-400">Medicine availability and reminders</p>
            </div>
            <Toggle size="sm" checked={notifEnabled} onChange={setNotifEnabled} aria-label="Toggle notifications" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-slate-700">Language</p>
              <p className="text-[11px] text-slate-400">English (India)</p>
            </div>
            <Badge variant="neutral" size="sm">Placeholder</Badge>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <HiOutlineShieldCheck size={15} className="text-success-600" aria-hidden="true" />
          Security
        </h2>
        <div className="space-y-2">
          <button type="button" className="w-full text-left text-xs font-medium text-primary-600 hover:text-primary-700 py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
            Change Password →
          </button>
          <p className="text-[10px] text-slate-400 px-3">
            {/* TODO: POST /api/v1/auth/change-password */}
            Password change requires backend integration.
          </p>
        </div>
      </div>
    </article>
  )
}

export default ProfilePage
