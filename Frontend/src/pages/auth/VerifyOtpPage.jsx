/**
 * Verify OTP Page
 *
 * Route     : /verify-otp  (inside AuthLayout → PublicRoute)
 * Purpose   : Validates the 6-digit OTP sent to the user's email.
 *             Used for both account activation and password reset flows.
 *
 * Features  : 6-box OTP input with auto-advance/backspace/paste,
 *             resend OTP with 60-second cooldown timer,
 *             validation, loading/error states.
 *
 * Receives  : location.state.email, location.state.flow ('register'|'reset')
 * On success (register flow) → /login
 * On success (reset flow)    → /reset-password with token state
 */

import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiAlertCircle, FiMail } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../constants/routes'
import OtpInput from '../../components/forms/OtpInput'
import Button from '../../components/ui/Button'

const RESEND_COOLDOWN = 60  // seconds

function VerifyOtpPage() {
  const { verifyOtp, resendOtp, isLoading, authError, clearError } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const email = location.state?.email ?? ''
  const flow  = location.state?.flow  ?? 'register'

  const [otp,       setOtp]       = useState('')
  const [otpError,  setOtpError]  = useState('')
  const [cooldown,  setCooldown]  = useState(0)
  const [resendMsg, setResendMsg] = useState('')

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate(ROUTES.LOGIN, { replace: true })
  }, [email, navigate])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleVerify() {
    clearError()
    setOtpError('')

    if (otp.replace(/\D/g, '').length !== 6) {
      setOtpError('Please enter all 6 digits of your OTP.')
      return
    }

    try {
      await verifyOtp({ email, otp, flow })
      if (flow === 'reset') {
        navigate(ROUTES.RESET_PASSWORD, { replace: true, state: { email, otp } })
      } else {
        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { message: 'Account verified! Please sign in.' },
        })
      }
    } catch {
      // error set in AuthContext
    }
  }

  async function handleResend() {
    clearError()
    setResendMsg('')
    try {
      await resendOtp({ email, flow })
      setCooldown(RESEND_COOLDOWN)
      setResendMsg('A new OTP has been sent to your email.')
      setOtp('')
    } catch {
      // error set in AuthContext
    }
  }

  const displayError = otpError || authError

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 mx-auto mb-5">
        <FiMail size={26} aria-hidden="true" />
      </div>

      {/* Header */}
      <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
      <p className="text-sm text-slate-500 mt-1 mb-1">
        We sent a 6-digit code to
      </p>
      <p className="text-sm font-semibold text-primary-700 mb-6 break-all">
        {email}
      </p>

      {/* Error */}
      {displayError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm text-left"
        >
          <FiAlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {displayError}
        </div>
      )}

      {/* Success resend msg */}
      {resendMsg && !displayError && (
        <p className="mb-4 text-xs text-success-600 bg-success-50 border border-success-200 rounded-lg p-2.5">
          {resendMsg}
        </p>
      )}

      {/* OTP input */}
      <OtpInput
        value={otp}
        onChange={setOtp}
        disabled={isLoading}
        hasError={!!displayError}
      />

      {/* Verify button */}
      <Button
        variant="primary"
        fullWidth
        loading={isLoading}
        onClick={handleVerify}
        className="mt-6"
        disabled={otp.replace(/\D/g, '').length < 6}
      >
        Verify OTP
      </Button>

      {/* Resend */}
      <div className="mt-4 text-sm text-slate-500">
        Didn&apos;t receive the code?{' '}
        {cooldown > 0 ? (
          <span className="text-slate-400">
            Resend in <span className="font-semibold text-slate-600">{cooldown}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            Resend OTP
          </button>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <Link
          to={ROUTES.LOGIN}
          className="text-xs text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  )
}

export default VerifyOtpPage
