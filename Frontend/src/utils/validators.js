/**
 * Validators
 *
 * Reusable frontend validation helpers used alongside
 * Zod schemas in React Hook Form.
 * These are pure functions — no side effects.
 */

/**
 * Validates an Indian mobile number (10 digits, optional +91 prefix).
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidIndianPhone(phone) {
  return /^(\+91)?[6-9]\d{9}$/.test(phone)
}

/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validates that a password meets minimum security requirements:
 *  - At least 8 characters
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one digit
 * @param {string} password
 * @returns {boolean}
 */
export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

/**
 * Validates a 6-digit OTP.
 * @param {string} otp
 * @returns {boolean}
 */
export function isValidOtp(otp) {
  return /^\d{6}$/.test(otp)
}
