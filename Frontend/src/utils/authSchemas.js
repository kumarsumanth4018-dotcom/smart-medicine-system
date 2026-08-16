/**
 * Authentication Validation Schemas (Zod)
 *
 * All auth form schemas live here so they are reusable across pages
 * and unit-testable independently of React components.
 *
 * Validation Messages — Professional & Friendly:
 *   All error messages use plain, instructive language.
 *   Example: "Please enter a valid email address." not "Invalid email".
 *
 * Uses Zod v4 API (imported as `z` from 'zod').
 */

import { z } from 'zod'

// ── Reusable field definitions ─────────────────────────────────────────────
const emailField = z
  .string()
  .min(1, 'Email address is required.')
  .email('Please enter a valid email address.')

const passwordField = z
  .string()
  .min(8,  'Password must contain at least 8 characters.')
  .regex(/[A-Z]/,    'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/,    'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/,    'Password must contain at least one number.')

const mobileField = z
  .string()
  .min(1, 'Mobile number is required.')
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')

const nameField = z
  .string()
  .min(2,  'Full name must be at least 2 characters.')
  .max(60, 'Full name must not exceed 60 characters.')
  .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces.')

// ── Login schema ───────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:      emailField,
  password:   z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
})

// ── Register schema ────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    fullName:        nameField,
    email:           emailField,
    mobile:          mobileField,
    password:        passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    acceptTerms:     z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms & Conditions to continue.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please re-enter your password.',
    path:    ['confirmPassword'],
  })

// ── OTP schema ─────────────────────────────────────────────────────────────
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits.')
    .regex(/^\d{6}$/, 'Verification code must contain only digits.'),
})

// ── Forgot password schema ─────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: emailField,
})

// ── Reset password schema ──────────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    password:        passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please re-enter your new password.',
    path:    ['confirmPassword'],
  })
