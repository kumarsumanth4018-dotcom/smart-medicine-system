/**
 * Forgot Password Page
 *
 * Route     : /forgot-password  (inside AuthLayout → PublicRoute)
 * Purpose   : Accepts user email and initiates the password reset flow
 *             by sending an OTP to that email.
 *
 * On success → /verify-otp with state { email, flow: 'reset' }
 */

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle, FiLock } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { forgotPasswordSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'
import Input from '../../components/forms/Input'
import Button from '../../components/ui/Button'

function ForgotPasswordPage() {
  const { forgotPassword, isLoading, authError, clearError } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data) {
    clearError()
    try {
      await forgotPassword(data)
      navigate(ROUTES.VERIFY_OTP, {
        replace: true,
        state: { email: data.email, flow: 'reset' },
      })
    } catch {
      // error set in AuthContext
    }
  }

  return (
    <div>
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mx-auto mb-5">
        <FiLock size={22} aria-hidden="true" />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Forgot your password?</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter your email and we&apos;ll send you a reset code.
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
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your registered email address"
          required
          autoComplete="email"
          helperText="We'll send a 6-digit OTP to this address."
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className="mt-2"
        >
          Send Reset Code
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

export default ForgotPasswordPage
