/**
 * OtpInput Component
 *
 * Purpose : Six-box OTP entry with auto-advance, backspace navigation,
 *           and paste support.
 * Location : src/components/forms/OtpInput.jsx
 *
 * Features :
 *   - Auto-focuses next box after each digit
 *   - Backspace moves focus to previous box
 *   - Paste fills all boxes from clipboard
 *   - Accepts only numeric digits
 *   - Accessible: labelled group with individual aria-labels
 *
 * @param {string}   props.value    — full 6-char string (controlled)
 * @param {Function} props.onChange — (value: string) => void
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.hasError]
 */

import { useRef } from 'react'

const LENGTH = 6

function OtpInput({ value = '', onChange, disabled = false, hasError = false }) {
  const inputRefs = useRef([])

  const digits = Array.from(
  { length: LENGTH },
  (_, index) => value[index] || '',
)

  function handleChange(e, index) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next  = digits.map((d, i) => (i === index ? char : d)).join('')
    onChange(next)
    if (char && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d)).join('')
        onChange(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft'  && index > 0)          inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < LENGTH - 1)  inputRefs.current[index + 1]?.focus()
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    onChange(pasted.padEnd(LENGTH, '').slice(0, LENGTH))
    const nextFocus = Math.min(pasted.length, LENGTH - 1)
    inputRefs.current[nextFocus]?.focus()
  }

  return (
    <div
      role="group"
      aria-label="One-time password"
      className="flex items-center justify-center gap-2 sm:gap-3"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={index === 0}
          aria-label={`OTP digit ${index + 1} of ${LENGTH}`}
          className={[
            'w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-xl border-2',
            'transition-all duration-150 outline-none',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            'disabled:bg-slate-100 disabled:cursor-not-allowed',
            digit ? 'bg-white text-slate-900' : 'bg-slate-50 text-slate-900',
            hasError
              ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20'
              : 'border-slate-300',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

export default OtpInput
