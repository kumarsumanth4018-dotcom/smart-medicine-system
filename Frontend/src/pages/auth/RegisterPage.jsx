/**
 * Register Page
 *
 * Route     : /register  (inside AuthLayout → PublicRoute)
 * Purpose   : New user account creation.
 *
 * Features  : full name, email, mobile, password, confirm password,
 *             password strength meter, show/hide password,
 *             terms checkbox, validation (Zod + RHF),
 *             loading state, error state.
 *
 * On success → navigates to /verify-otp passing email via state.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { registerSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'
import Input from '../../components/forms/Input'
import PasswordInput from '../../components/forms/PasswordInput'
import Checkbox from '../../components/forms/Checkbox'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/forms/PasswordStrength'

function RegisterPage() {
  const { register: registerUser, isLoading, authError, clearError } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '', email: '', mobile: '',
      password: '', confirmPassword: '', acceptTerms: false,
    },
  })

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })

  async function onSubmit(data) {
    clearError()
    try {
      const result = await registerUser(data)
      navigate(ROUTES.VERIFY_OTP, {
        replace: true,
        state: { email: result.email, flow: 'register' },
      })
    } catch {
      // error already set in AuthContext
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Join Smart Medicine System today</p>
      </div>

      {/* Global error */}
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
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mobile Number"
          type="tel"
          placeholder="Enter your 10-digit mobile number"
          required
          autoComplete="tel"
          helperText="Enter a valid Indian mobile number (10 digits, e.g. 9876543210)"
          error={errors.mobile?.message}
          {...register('mobile')}
        />

        {/* Password + strength */}
        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a strong password (min. 8 characters)"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password to confirm"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Checkbox
          label="I accept the Terms & Conditions and Privacy Policy"
          required
          error={errors.acceptTerms?.message}
          {...register('acceptTerms')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
