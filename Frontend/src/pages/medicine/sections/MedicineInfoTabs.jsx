/**
 * Component: MedicineInfoTabs
 *
 * Description:
 *   Tabbed content panel displaying detailed medicine information
 *   across seven categories. Each tab shows placeholder content
 *   ready for backend data integration.
 *
 * Responsibilities:
 *   - Tab navigation: Overview, Composition, Dosage, Side Effects,
 *     Storage, Precautions, Generic Alternatives
 *   - Accessible tab panel (role="tablist", role="tab", role="tabpanel")
 *   - Keyboard navigation: ArrowLeft/Right to switch tabs
 *
 * Backend readiness:
 *   - All tab content → GET /api/v1/medicines/:id (detailed fields)
 */

import { useState, useCallback } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

// =====================================================
// Tab data + placeholder content
// TODO: All content from GET /api/v1/medicines/:id
// =====================================================
const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>Paracetamol is a widely used analgesic and antipyretic. It is effective for the temporary relief of mild to moderate pain (headache, toothache, muscle ache) and for reducing fever.</p>
        <p>It belongs to the class of non-opioid analgesics and works by inhibiting the synthesis of prostaglandins in the central nervous system.</p>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: long_description from GET /api/v1/medicines/:id */}
          Detailed clinical description will be loaded from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'composition',
    label: 'Composition',
    content: (
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingredient</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-800">Paracetamol IP</td>
                <td className="px-4 py-2.5 text-slate-600">500 mg</td>
                <td className="px-4 py-2.5 text-slate-500">Active ingredient</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-800">Excipients</td>
                <td className="px-4 py-2.5 text-slate-600">q.s.</td>
                <td className="px-4 py-2.5 text-slate-500">Binders, fillers</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: composition data from API */}
          Full composition list will be populated from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'dosage',
    label: 'Dosage',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <div className="rounded-xl bg-primary-50 border border-primary-100 p-4">
          <p className="font-semibold text-primary-800 mb-2">Adult Dosage (Placeholder)</p>
          <ul className="space-y-1 text-sm text-primary-700 list-disc list-inside">
            <li>500mg – 1000mg orally every 4–6 hours as needed</li>
            <li>Maximum 4000mg per day</li>
            <li>Take with or without food</li>
          </ul>
        </div>
        <p className="text-xs text-warning-700 bg-warning-50 border border-warning-200 rounded-lg px-3 py-2">
          ⚠ Always follow your doctor's prescription. Dosage information shown is indicative only.
        </p>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: dosage_info from API */}
          Exact dosage instructions will be loaded from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'side-effects',
    label: 'Side Effects',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Common Side Effects (Placeholder)</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>Nausea or stomach upset (rare at therapeutic doses)</li>
          <li>Skin rash or allergic reaction (uncommon)</li>
          <li>Liver damage with overdose or prolonged use</li>
        </ul>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: side_effects from API */}
          Complete side effect profile will be loaded from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'storage',
    label: 'Storage',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <ul className="space-y-2 list-disc list-inside text-slate-500">
          <li>Store below 30°C in a dry place</li>
          <li>Protect from direct sunlight and moisture</li>
          <li>Keep out of reach of children</li>
          <li>Do not use after the expiry date printed on the pack</li>
        </ul>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: storage_info from API */}
          Storage conditions from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'precautions',
    label: 'Precautions',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <ul className="space-y-2 list-disc list-inside text-slate-500">
          <li>Avoid alcohol consumption while taking this medicine</li>
          <li>Consult a doctor if you have liver or kidney conditions</li>
          <li>Do not exceed the recommended dose</li>
          <li>Inform your doctor of all other medications being taken</li>
        </ul>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: precautions from API */}
          Full precaution list from the medicines database.
        </p>
      </div>
    ),
  },
  {
    id: 'generics',
    label: 'Generic Alternatives',
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-slate-600">
          The following Jan Aushadhi generic alternatives are available for this medicine.
          All contain the same active ingredient and meet quality standards.
        </p>
        <div className="space-y-2">
          {['Paracetamol IP 500mg (BPPI)', 'Paracetamol IP 650mg (BPPI)', 'Paracetamol Syrup 120mg/5ml'].map((g) => (
            <div key={g} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm">
              <span className="text-slate-700 font-medium">{g}</span>
              <span className="text-xs text-success-600 font-semibold">Available</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 italic">
          {/* TODO: generic_alternatives from GET /api/v1/medicines/:id/generic-alternatives */}
          Full list from the generic recommendation API.
        </p>
      </div>
    ),
  },
]

// =====================================================
// Medicine Info Tabs
// =====================================================
function MedicineInfoTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  const handleKeyDown = useCallback((e, currentIndex) => {
    if (e.key === 'ArrowRight') {
      const next = (currentIndex + 1) % TABS.length
      setActiveTab(TABS[next].id)
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentIndex - 1 + TABS.length) % TABS.length
      setActiveTab(TABS[prev].id)
    }
  }, [])

  const activeContent = TABS.find((t) => t.id === activeTab)?.content

  return (
    <section aria-labelledby="medicine-info-tabs-heading">

      {/* =====================================================
          Medicine Information Tabs
         ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-5 pb-0 border-b border-slate-100">
          <HiOutlineInformationCircle size={18} className="text-primary-600 shrink-0" aria-hidden="true" />
          <h2
            id="medicine-info-tabs-heading"
            className="text-base font-bold text-slate-900"
          >
            Medicine Information
          </h2>
        </div>

        {/* Tab list */}
        <div
          role="tablist"
          aria-label="Medicine information sections"
          className="flex overflow-x-auto border-b border-slate-100 px-2 gap-1 scrollbar-hide"
        >
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={[
                'shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="p-6"
        >
          {activeContent}
        </div>
      </div>
    </section>
  )
}

export default MedicineInfoTabs
