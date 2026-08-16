/**
 * Login Page
 *
 * Route     : /login  (inside AuthLayout → PublicRoute)
 * Purpose   : Authenticates existing users.
 *
 * Features  : email + password, show/hide password, remember me,
 *             forgot password link, validation (Zod + RHF),
 *             loading state, error state, accessible form,
 *             Explore Demo section for project demonstrations.
 *
 * On success → navigates to role-appropriate dashboard.
 * On failure → displays inline error from AuthContext.
 *
 * Demo section:
 *   Shows Demo User and Demo Pharmacy cards only.
 *   Administrator demo is NOT shown here — it is available at /admin/login.
 *
 * ⚠ DEMO / DEVELOPMENT ONLY — Remove or disable the DemoSection before
 *   production deployment. Replace loginAsDemo() with real authService.login()
 *   during FastAPI backend integration.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle } from 'react-icons/fi'
import {
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2'
import { MdLocalPharmacy, MdInventory2 } from 'react-icons/md'
import { useAuth } from '../../contexts/AuthContext'
import { loginSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'
import { USER_ROLES } from '../../constants/app'
import Input from '../../components/forms/Input'
import PasswordInput from '../../components/forms/PasswordInput'
import Checkbox from '../../components/forms/Checkbox'
import Button from '../../components/ui/Button'

// ─── Demo explore cards (public login page — no Admin) ────────────────────────
/**
 * ⚠ DEMO / DEVELOPMENT ONLY.
 * Administrator demo is intentionally excluded from this public page.
 * Admin access is available via /admin/login.
 * TODO: Remove this section before production deployment.
 */
const DEMO_CARDS = [
  {
    role:       USER_ROLES.PATIENT,
    emoji:      '👤',
    label:      'Demo User',
    icon:       HiOutlineUser,
    iconBg:     'bg-primary-100 text-primary-700',
    cardBg:     'bg-primary-50 border-primary-200',
    btnClass:   'bg-primary-600 hover:bg-primary-700 text-white',
    btnLabel:   'Continue as Demo User',
    features: [
      { icon: HiOutlineMagnifyingGlass, text: 'Medicine Search' },
      { icon: HiOutlineCheckCircle,     text: 'Generic Recommendation' },
      { icon: HiOutlineMapPin,          text: 'Nearby Pharmacy' },
      { icon: HiOutlineBell,            text: 'Notifications & Dashboard' },
    ],
  },
  {
    role:       USER_ROLES.PHARMACIST,
    emoji:      '🏪',
    label:      'Demo Pharmacy',
    icon:       MdLocalPharmacy,
    iconBg:     'bg-secondary-100 text-secondary-700',
    cardBg:     'bg-secondary-50 border-secondary-200',
    btnClass:   'bg-secondary-600 hover:bg-secondary-700 text-white',
    btnLabel:   'Continue as Demo Pharmacy',
    features: [
      { icon: MdInventory2,             text: 'Inventory Management' },
      { icon: HiOutlineCheckCircle,     text: 'Medicine Management' },
      { icon: HiOutlineBell,            text: 'Stock Monitoring' },
      { icon: HiOutlineCheckCircle,     text: 'Pharmacy Dashboard' },
    ],
  },
]

// ─── Single demo explore card ─────────────────────────────────────────────────
function ExploreCard({ card, onDemo }) {
  const CardIcon = card.icon
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-2xl border ${card.cardBg} transition-colors`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} shrink-0`}>
          <CardIcon size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">
            {card.emoji} {card.label}
          </p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
            Explore
          </p>
        </div>
      </div>

      {/* Feature list */}
      <ul className="space-y-1.5" aria-label={`${card.label} features`}>
        {card.features.map(({ icon: FIcon, text }) => (
          <li key={text} className="flex items-center gap-2 text-xs text-slate-600">
            <FIcon size={12} className="text-slate-400 shrink-0" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <button
        type="button"
        onClick={() => onDemo(card.role)}
        className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500 ${card.btnClass}`}
      >
        {card.btnLabel}
      </button>
    </div>
  )
}

// ─── Explore Demo section ─────────────────────────────────────────────────────
function ExploreDemoSection({ onDemo }) {
  return (
    <div className="mt-6 pt-5 border-t border-slate-100">

      {/* Section heading */}
      <div className="flex items-center gap-2 justify-center mb-1">
        <HiOutlineRocketLaunch size={14} className="text-primary-500" aria-hidden="true" />
        <p className="text-sm font-bold text-slate-800">Explore Demo</p>
      </div>
      <p className="text-center text-xs text-slate-500 mb-4">
        Experience the Smart Medicine System instantly using sample accounts.
      </p>

      {/* Demo cards — User and Pharmacy only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_CARDS.map(card => (
          <ExploreCard key={card.role} card={card} onDemo={onDemo} />
        ))}
      </div>

      {/* Notice */}
      {/* TODO: Remove this entire ExploreDemoSection before production deployment.
                Replace loginAsDemo() with real authService.login() when FastAPI
                backend is integrated. Demo sessions are NOT real authenticated sessions. */}
      <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
        🔒 Demo access is available only for development and project
        demonstration purposes. Not for production use.
      </p>
    </div>
  )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage() {
  const { login, loginAsDemo, isLoading, authError, clearError } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  function roleRedirect(role) {
    if (from) return navigate(from, { replace: true })
    switch (role) {
      case USER_ROLES.ADMIN:      return navigate(ROUTES.ADMIN.DASHBOARD,    { replace: true })
      case USER_ROLES.PHARMACIST: return navigate(ROUTES.PHARMACY.DASHBOARD, { replace: true })
      default:                    return navigate(ROUTES.USER.DASHBOARD,     { replace: true })
    }
  }

  async function onSubmit(data) {
    clearError()
    try {
      const user = await login(data)
      roleRedirect(user.role)
    } catch {
      // error already set in AuthContext
    }
  }

  function handleDemoLogin(role) {
    clearError()
    const user = loginAsDemo(role)
    roleRedirect(user.role)
  }

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue</p>
      </div>

      {/* ── Global error ──────────────────────────────────────────────── */}
      {authError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm"
        >
          <FiAlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {authError}
        </div>
      )}

      {/* ── Login form — unchanged ─────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between gap-3">
          <Checkbox label="Remember me" {...register('rememberMe')} />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* ── Register link ─────────────────────────────────────────────── */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          Create account
        </Link>
      </p>

      {/* ── Explore Demo section ──────────────────────────────────────── */}
      <ExploreDemoSection onDemo={handleDemoLogin} />
    </div>
  )
}

export default LoginPage
