import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

import { useAuth } from '../../contexts/AuthContext'
import { registerSchema } from '../../utils/authSchemas'
import { ROUTES } from '../../constants/routes'

import Input from '../../components/forms/Input'
import PasswordInput from '../../components/forms/PasswordInput'
import Checkbox from '../../components/forms/Checkbox'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/forms/PasswordStrength'

function RegisterPage() {
  const {
    register: registerUser,
    isLoading,
    authError,
    clearError,
  } = useAuth()

  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  })

  async function onSubmit(formData) {
  clearError()

  try {
    const result = await registerUser(formData)

    navigate(ROUTES.VERIFY_OTP, {
      replace: true,
      state: {
        email: result.email,
        flow: 'register',
      },
    })
  } catch {
    // The error is displayed by AuthContext.
  }
}

  return (
    <div>
      {/* Page heading */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Create your account
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Join Smart Medicine System today
        </p>
      </div>

      {/* Successful registration message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-2.5 mb-4 p-3 rounded-lg
                     bg-green-50 border border-green-200
                     text-green-700 text-sm"
        >
          <FiCheckCircle
            size={16}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <span>{successMessage}</span>
        </div>
      )}

      {/* Backend error message */}
      {authError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 mb-4 p-3 rounded-lg
                     bg-danger-50 border border-danger-200
                     text-danger-700 text-sm"
        >
          <FiAlertCircle
            size={16}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <span>{authError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
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
          helperText="Example: 9876543210"
          error={errors.mobile?.message}
          {...register('mobile')}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="Enter the password again"
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
          disabled={isLoading || Boolean(successMessage)}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}

        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600
                     hover:text-primary-700 hover:underline
                     focus-visible:outline-none
                     focus-visible:ring-2
                     focus-visible:ring-primary-500 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage