/**
 * Admin Login Page
 *
 * Route     : /admin/login  (standalone — NOT inside PublicRoute or AuthLayout)
 * Purpose   : Dedicated entry point for platform administrators.
 *
 * This page is:
 *   - NOT linked from the public homepage
 *   - NOT linked from the user /login page
 *   - Accessible only by navigating directly to /admin/login
 *
 * Features:
 *   - Standard email + password login form (same validation as /login)
 *   - Demo Administrator card for project demonstrations
 *   - Authorized Personnel Only branding
 *
 * ⚠ DEMO / DEVELOPMENT ONLY — Demo authentication is intended only for
 *   development and project demonstrations. Remove or disable the demo
 *   section after backend authentication is integrated.
 *   Replace loginAsDemo() with real authService.login() when FastAPI
 *   backend is ready.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle } from 'react-icons/fi'
import {
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineClipboardDocument,
} from 'react-icons/hi2'
import { MdMedication, MdLocalPharmacy } from 'react-icons/md'
import { useAuth } from '../../contexts/AuthContext'
import { loginSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'
import { USER_ROLES } from '../../constants/app'
import { APP_NAME } from '../../constants/app'
import Input from '../../components/forms/Input'
import PasswordInput from '../../components/forms/PasswordInput'
import Button from '../../components/ui/Button'

// ─── Admin demo credentials ───────────────────────────────────────────────────
const ADMIN_DEMO = {
  email:    'admin@smartmedicine.com',
  password: 'Admin@123',
}

// ─── Admin Login Page ─────────────────────────────────────────────────────────
function AdminLoginPage() {
  const { login, loginAsDemo, isLoading, authError, clearError } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  function goToDashboard() {
    navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
  }

  async function onSubmit(data) {
    clearError()
    try {
      const user = await login(data)
      if (user.role === USER_ROLES.ADMIN) {
        goToDashboard()
      }
    } catch {
      // error already set in AuthContext
    }
  }

  function handleDemoAdmin() {
    clearError()
    loginAsDemo('admin')
    goToDashboard()
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* ── Brand header ────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-4 shadow-lg">
            <MdMedication size={28} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">{APP_NAME}</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-danger-900/60 border border-danger-700">
            <HiOutlineShieldCheck size={12} className="text-danger-400" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-danger-300 uppercase tracking-widest">
              Administrator Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Authorized Personnel Only</p>
        </div>

        {/* ── Login card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl p-6">

          {/* Card heading */}
          <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
            <HiOutlineShieldCheck size={16} className="text-primary-600" aria-hidden="true" />
            Administrator Login
          </h2>

          {/* Error */}
          {authError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm"
            >
              <FiAlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your administrator email"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your administrator password"
              required
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
            >
              Login to Administrator Portal
            </Button>
          </form>

          {/* ── Demo Administrator section ──────────────────────────── */}
          {/* TODO: Remove this demo section before production deployment.
                    Replace loginAsDemo() with real authService.login()
                    when FastAPI backend is integrated. */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
              Demo Administrator
            </p>
            <p className="text-center text-[11px] text-slate-400 mb-3">
              Project Demonstration Only
            </p>

            {/* Demo admin card */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-danger-50 border border-danger-200">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-danger-100 shrink-0">
                  <HiOutlineShieldCheck size={20} className="text-danger-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">🛡 Demo Administrator</p>
                  <p className="text-[10px] text-slate-500">System Admin</p>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-1.5" aria-label="Administrator features">
                {[
                  { icon: HiOutlineUsers,           text: 'User & Pharmacy Management' },
                  { icon: MdMedication,              text: 'Medicine Catalogue' },
                  { icon: MdLocalPharmacy,           text: 'Platform Analytics' },
                  { icon: HiOutlineChartBar,         text: 'Reports & Audit Logs' },
                  { icon: HiOutlineCog6Tooth,        text: 'System Settings' },
                  { icon: HiOutlineClipboardDocument,text: 'Activity Monitoring' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
                    <Icon size={12} className="text-slate-400 shrink-0" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>

              {/* Credentials display */}
              <div className="bg-white/70 rounded-lg px-3 py-2 space-y-0.5">
                <p className="text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-600">Email: </span>
                  {ADMIN_DEMO.email}
                </p>
                <p className="text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-600">Password: </span>
                  {ADMIN_DEMO.password}
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-danger-600 hover:bg-danger-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                Continue as Demo Administrator
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed">
              🔒 Demo access is available only for development and project
              demonstration purposes. Not for production use.
            </p>
          </div>
        </div>

        {/* ── Back link ───────────────────────────────────────────────── */}
        <p className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
          >
            ← Back to Home
          </Link>
        </p>

      </div>
    </div>
  )
}

export default AdminLoginPage
