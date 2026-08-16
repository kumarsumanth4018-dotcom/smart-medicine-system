/**
 * Reset Password Page
 *
 * Route     : /reset-password  (inside AuthLayout → PublicRoute)
 * Purpose   : Allows user to set a new password after OTP verification.
 *
 * Receives  : location.state.email, location.state.otp
 * Redirects to /login without state → user must re-authenticate.
 *
 * On success → /login with success flash message.
 */

import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { resetPasswordSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'
import PasswordInput from '../../components/forms/PasswordInput'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/forms/PasswordStrength'

function ResetPasswordPage() {
  const { resetPassword, isLoading, authError, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email ?? ''
  const otp   = location.state?.otp   ?? ''

  // Guard: must arrive with email + otp from verify step
  useEffect(() => {
    if (!email || !otp) navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
  }, [email, otp, navigate])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })

  async function onSubmit(data) {
    clearError()
    try {
      await resetPassword({ email, otp, password: data.password })
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { message: 'Password reset successful! Please sign in with your new password.' },
      })
    } catch {
      // error set in AuthContext
    }
  }

  return (
    <div>
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success-100 text-success-600 mx-auto mb-5">
        <FiCheckCircle size={22} aria-hidden="true" />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Set new password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a strong password for your account.
        </p>
      </div>

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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <PasswordInput
            label="New Password"
            placeholder="Create a strong new password (min. 8 characters)"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter your new password to confirm"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className="mt-2"
        >
          Reset Password
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage
