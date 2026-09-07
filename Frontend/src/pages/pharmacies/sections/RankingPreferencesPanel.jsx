import { useState } from 'react'


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


function toPercentages(weights) {
  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [
      key,
      Math.round(Number(value) * 100),
    ]),
  )
}


function toDecimalWeights(percentages) {
  return Object.fromEntries(
    Object.entries(percentages).map(([key, value]) => [
      key,
      Number(value) / 100,
    ]),
  )
}


function RankingPreferencesPanel({
  weights,
  defaultWeights,
  onApply,
  onReset,
}) {
  const [values, setValues] = useState(
    () => toPercentages(weights),
  )
  const [message, setMessage] = useState('')

  const total = Object.values(values).reduce(
    (sum, value) => sum + Number(value),
    0,
  )

  const isValid = total === 100

  function handleChange(key, value) {
    setValues(current => ({
      ...current,
      [key]: Number(value),
    }))

    setMessage('')
  }

  function handleApply() {
    if (!isValid) {
      setMessage(
        `The five preferences must total 100%. Current total: ${total}%.`,
      )
      return
    }

    const updatedWeights = toDecimalWeights(values)

    onApply?.(updatedWeights)
    setMessage('Ranking preferences saved and applied.')
  }

  function handleReset() {
    const defaultPercentages =
      toPercentages(defaultWeights)

    setValues(defaultPercentages)
    onReset?.(defaultWeights)
    setMessage('Default ranking preferences restored.')
  }

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
            Choose what matters most when recommending a Kendra.
            All five values must total 100%.
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

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CRITERIA.map(criterion => (
          <div
            key={criterion.key}
            className="rounded-xl border border-slate-100
                       bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={`ranking-${criterion.key}`}
                className="text-sm font-semibold text-slate-800"
              >
                {criterion.label}
              </label>

              <span
                className="min-w-12 rounded-lg bg-white px-2 py-1
                           text-center text-sm font-bold text-primary-700"
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
              onChange={event =>
                handleChange(
                  criterion.key,
                  event.target.value,
                )
              }
              className="mt-3 w-full cursor-pointer accent-primary-600"
            />

            <p className="mt-2 text-[11px] text-slate-500">
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
            isValid
              ? 'bg-success-50 text-success-700'
              : 'bg-danger-50 text-danger-700',
          ].join(' ')}
        >
          {message}
        </p>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-slate-300
                     px-4 py-2 text-sm font-semibold text-slate-600
                     hover:bg-slate-50"
        >
          Reset Defaults
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={!isValid}
          className="rounded-xl bg-primary-600 px-4 py-2
                     text-sm font-semibold text-white
                     hover:bg-primary-700
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save and Apply
        </button>
      </div>
    </section>
  )
}


export default RankingPreferencesPanel
