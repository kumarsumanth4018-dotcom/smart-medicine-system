/**
 * PasswordStrength Component
 *
 * Purpose : Visual password strength meter shown below the password
 *           input on Register and Reset Password pages.
 * Location : src/components/forms/PasswordStrength.jsx
 *
 * Levels: weak (1) | fair (2) | good (3) | strong (4)
 * Each segment lights up progressively as criteria are met.
 */

const CRITERIA = [
  { label: 'At least 8 characters',       test: (p) => p.length >= 8          },
  { label: 'One uppercase letter (A–Z)',   test: (p) => /[A-Z]/.test(p)        },
  { label: 'One lowercase letter (a–z)',   test: (p) => /[a-z]/.test(p)        },
  { label: 'One number (0–9)',             test: (p) => /[0-9]/.test(p)        },
]

const LEVEL_COLORS = ['', 'bg-danger-500', 'bg-warning-500', 'bg-primary-400', 'bg-success-500']
const LEVEL_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const LEVEL_TEXT   = ['', 'text-danger-600', 'text-warning-600', 'text-primary-600', 'text-success-600']

/**
 * @param {string} password — current password value
 */
function PasswordStrength({ password = '' }) {
  const score = CRITERIA.filter((c) => c.test(password)).length

  if (!password) return null

  return (
    <div className="mt-2 space-y-2" aria-live="polite" aria-atomic="true">
      {/* Strength bar */}
      <div className="flex gap-1" role="meter" aria-label={`Password strength: ${LEVEL_LABELS[score]}`} aria-valuenow={score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-300',
              score >= seg ? LEVEL_COLORS[score] : 'bg-slate-200',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Level label */}
      <p className={`text-xs font-medium ${LEVEL_TEXT[score]}`}>
        {LEVEL_LABELS[score]}
      </p>

      {/* Criteria checklist */}
      <ul className="space-y-0.5">
        {CRITERIA.map((c) => {
          const met = c.test(password)
          return (
            <li
              key={c.label}
              className={`flex items-center gap-1.5 text-[11px] ${met ? 'text-success-600' : 'text-slate-400'}`}
            >
              <span aria-hidden="true">{met ? '✓' : '○'}</span>
              {c.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordStrength
