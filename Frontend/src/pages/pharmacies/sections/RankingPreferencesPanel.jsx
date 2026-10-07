import { useEffect, useState } from 'react'

import userPreferenceService, {
  DEFAULT_RANKING_PREFERENCES,
} from '../../../services/userPreferenceService'


// =====================================================
// Ranking criteria configuration
// =====================================================

const CRITERIA = [
  {
    key: 'distance',
    label: 'Distance',
    description: 'Prefer Kendras closer to your location.',
  },
  {
    key: 'price',
    label: 'Price',
    description: 'Prefer Kendras offering a lower price.',
  },
  {
    key: 'quantity',
    label: 'Stock quantity',
    description: 'Prefer Kendras with more available stock.',
  },
  {
    key: 'freshness',
    label: 'Medicine freshness',
    description: 'Prefer batches with more time before expiry.',
  },
  {
    key: 'trust',
    label: 'Batch trust',
    description: 'Prefer verified medicine batches.',
  },
]


// =====================================================
// Conversion helpers
// =====================================================

function toPercentages(weights) {
  const source =
    weights ?? DEFAULT_RANKING_PREFERENCES

  return {
    distance: Math.round(
      Number(source.distance) * 100,
    ),
    price: Math.round(
      Number(source.price) * 100,
    ),
    quantity: Math.round(
      Number(source.quantity) * 100,
    ),
    freshness: Math.round(
      Number(source.freshness) * 100,
    ),
    trust: Math.round(
      Number(source.trust) * 100,
    ),
  }
}


function toDecimalWeights(percentages) {
  return {
    distance:
      Number(percentages.distance) / 100,
    price:
      Number(percentages.price) / 100,
    quantity:
      Number(percentages.quantity) / 100,
    freshness:
      Number(percentages.freshness) / 100,
    trust:
      Number(percentages.trust) / 100,
  }
}


// =====================================================
// Ranking Preferences Panel
// =====================================================

function RankingPreferencesPanel({
  weights = DEFAULT_RANKING_PREFERENCES,
  defaultWeights = DEFAULT_RANKING_PREFERENCES,
  onApply,
  onReset,
}) {
  const [values, setValues] = useState(
    () => toPercentages(weights),
  )

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSaving, setIsSaving] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [messageType, setMessageType] =
    useState('success')


  // =====================================================
  // Calculated total
  // =====================================================

  const total = Object.values(values).reduce(
    (sum, value) => sum + Number(value),
    0,
  )

  const isValid = total === 100


  // =====================================================
  // Load saved preferences from MongoDB
  // =====================================================

  useEffect(() => {
    let isMounted = true

    async function loadPreferences() {
      setIsLoading(true)
      setMessage('')

      try {
        const response =
          await userPreferenceService
            .getRankingPreferences()

        if (!isMounted) {
          return
        }

        const loadedPreferences =
          response.data?.preferences
          ?? defaultWeights

        setValues(
          toPercentages(loadedPreferences),
        )

        onApply?.(loadedPreferences)

        if (response.data?.source === 'saved') {
          setMessage(
            'Your saved ranking preferences were loaded.',
          )
        } else {
          setMessage(
            'Default ranking preferences are being used.',
          )
        }

        setMessageType('success')
      } catch (error) {
        if (!isMounted) {
          return
        }

        /*
         * If preferences cannot be loaded, the page can
         * still rank Kendras using the default weights.
         */
        const fallbackWeights =
          weights ?? defaultWeights

        setValues(
          toPercentages(fallbackWeights),
        )

        onApply?.(fallbackWeights)

        setMessage(
          error.response?.data?.detail
          ?? 'Could not load saved preferences. Default weights are being used.',
        )

        setMessageType('error')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPreferences()

    return () => {
      isMounted = false
    }

    // Load preferences once when the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // =====================================================
  // Slider change
  // =====================================================

  function handleChange(key, value) {
    setValues(current => ({
      ...current,
      [key]: Number(value),
    }))

    setMessage('')
  }


  // =====================================================
  // Save preferences
  // =====================================================

  async function handleApply() {
    if (!isValid) {
      setMessage(
        `The five preferences must total 100%. Current total: ${total}%.`,
      )

      setMessageType('error')
      return
    }

    const updatedWeights =
      toDecimalWeights(values)

    setIsSaving(true)
    setMessage('')

    try {
      const response =
        await userPreferenceService
          .saveRankingPreferences(
            updatedWeights,
          )

      const savedPreferences =
        response.data?.preferences
        ?? updatedWeights

      setValues(
        toPercentages(savedPreferences),
      )

      onApply?.(savedPreferences)

      setMessage(
        response.data?.message
        ?? 'Ranking preferences saved and applied.',
      )

      setMessageType('success')
    } catch (error) {
      setMessage(
        error.response?.data?.detail
        ?? error.message
        ?? 'Could not save ranking preferences.',
      )

      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }


  // =====================================================
  // Reset preferences
  // =====================================================

  async function handleReset() {
    setIsSaving(true)
    setMessage('')

    try {
      const response =
        await userPreferenceService
          .resetRankingPreferences()

      const resetPreferences =
        response.data?.preferences
        ?? defaultWeights

      setValues(
        toPercentages(resetPreferences),
      )

      onReset?.(resetPreferences)

      setMessage(
        response.data?.message
        ?? 'Default ranking preferences restored.',
      )

      setMessageType('success')
    } catch (error) {
      setMessage(
        error.response?.data?.detail
        ?? error.message
        ?? 'Could not reset ranking preferences.',
      )

      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }


  // =====================================================
  // Loading state
  // =====================================================

  if (isLoading) {
    return (
      <section
        aria-label="Loading ranking preferences"
        className="rounded-2xl border border-slate-200
                   bg-white p-5 shadow-sm"
      >
        <p className="text-sm text-slate-500">
          Loading your Kendra ranking preferences…
        </p>
      </section>
    )
  }


  // =====================================================
  // Component UI
  // =====================================================

  return (
    <section
      aria-labelledby="ranking-preferences-heading"
      className="rounded-2xl border border-slate-200
                 bg-white p-5 shadow-sm"
    >
      <div
        className="flex flex-col justify-between gap-3
                   sm:flex-row sm:items-start"
      >
        <div>
          <h2
            id="ranking-preferences-heading"
            className="text-base font-bold text-slate-900"
          >
            Kendra Ranking Preferences
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Choose what matters most when recommending a
            Kendra. All five values must total 100%.
          </p>
        </div>

        <div
          className={[
            'rounded-full px-3 py-1 text-xs font-bold',
            isValid
              ? 'bg-success-50 text-success-700'
              : 'bg-danger-50 text-danger-700',
          ].join(' ')}
        >
          Total: {total}%
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-1 gap-4
                   lg:grid-cols-2"
      >
        {CRITERIA.map(criterion => (
          <div
            key={criterion.key}
            className="rounded-xl border border-slate-100
                       bg-slate-50 p-4"
          >
            <div
              className="flex items-center
                         justify-between gap-3"
            >
              <label
                htmlFor={`ranking-${criterion.key}`}
                className="text-sm font-semibold
                           text-slate-800"
              >
                {criterion.label}
              </label>

              <span
                className="min-w-12 rounded-lg bg-white
                           px-2 py-1 text-center text-sm
                           font-bold text-primary-700"
              >
                {values[criterion.key]}%
              </span>
            </div>

            <input
              id={`ranking-${criterion.key}`}
              type="range"
              min="0"
              max="100"
              step="5"
              value={values[criterion.key]}
              disabled={isSaving}
              onChange={event =>
                handleChange(
                  criterion.key,
                  event.target.value,
                )
              }
              className="mt-3 w-full cursor-pointer
                         accent-primary-600
                         disabled:cursor-not-allowed
                         disabled:opacity-50"
            />

            <p
              className="mt-2 text-[11px]
                         text-slate-500"
            >
              {criterion.description}
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p
          role="status"
          className={[
            'mt-4 rounded-lg px-3 py-2 text-xs',
            messageType === 'success'
              ? 'bg-success-50 text-success-700'
              : 'bg-danger-50 text-danger-700',
          ].join(' ')}
        >
          {message}
        </p>
      )}

      <div
        className="mt-5 flex flex-wrap
                   justify-end gap-3"
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="rounded-xl border border-slate-300
                     px-4 py-2 text-sm font-semibold
                     text-slate-600 hover:bg-slate-50
                     disabled:cursor-not-allowed
                     disabled:opacity-50"
        >
          {isSaving
            ? 'Please wait…'
            : 'Reset Defaults'}
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={!isValid || isSaving}
          className="rounded-xl bg-primary-600
                     px-4 py-2 text-sm font-semibold
                     text-white hover:bg-primary-700
                     disabled:cursor-not-allowed
                     disabled:opacity-50"
        >
          {isSaving
            ? 'Saving…'
            : 'Save and Apply'}
        </button>
      </div>
    </section>
  )
}


export default RankingPreferencesPanel