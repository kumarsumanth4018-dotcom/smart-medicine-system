/**
 * Component: FaqSection
 *
 * Purpose:
 *   Provides answers to common questions about the platform and
 *   generic medicines in an accessible accordion layout.
 *
 * Responsibilities:
 *   - Render expandable FAQ items with smooth height transition
 *   - Support keyboard navigation (Enter/Space to toggle)
 *   - Correct aria-expanded / aria-controls linkage
 *
 * Dependencies:
 *   - React useState
 *   - React Icons (hi2)
 *   - Tailwind design system tokens
 *
 * Backend readiness:
 *   FAQS array can be replaced with API data:
 *   GET /api/v1/content/faqs
 */

import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'

const FAQS = [
  {
    q: 'What is PM Jan Aushadhi?',
    a: 'Pradhan Mantri Jan Aushadhi Pariyojana (PMJAP) is a Government of India initiative to provide quality generic medicines at affordable prices through Jan Aushadhi Kendras across the country.',
  },
  {
    q: 'Are generic medicines safe and effective?',
    a: 'Yes. Generic medicines contain the same active ingredients, in the same dosage forms and strengths, as their branded counterparts. They must pass the same quality, safety, and efficacy tests prescribed by regulatory authorities.',
  },
  {
    q: 'How do I search for a medicine on this platform?',
    a: 'Use the Search Medicines feature. Enter the brand name, generic name, or active composition. The platform will display availability, pricing, and generic alternatives from the Jan Aushadhi basket.',
  },
  {
    q: 'How does the pharmacy locator work?',
    a: 'The Nearby Pharmacy feature uses your location to show Jan Aushadhi Kendras and pharmacies on an interactive map, along with their stock availability and contact information.',
  },
  {
    q: 'Who can register on this platform?',
    a: 'Patients/individuals, doctors, pharmacists, and administrators can register. Each role has a separate dashboard with relevant features.',
  },
  {
    q: 'Is my health data secure?',
    a: 'The platform follows industry security standards including JWT-based authentication, HTTPS communication, and role-based access control to protect user data.',
  },
]

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  const id = `faq-answer-${index}`

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex items-center justify-between w-full py-4 text-left gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
      >
        <span className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">
          {q}
        </span>
        <HiChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={id}
        role="region"
        aria-label={q}
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}
      >
        <p className="text-sm text-slate-500 leading-relaxed pr-6">{a}</p>
      </div>
    </div>
  )
}

function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="section bg-white"
    >
      <div className="container-app">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="mt-2 text-3xl font-bold text-slate-900 tracking-tight"
            >
              Frequently asked questions
            </h2>
          </div>

          {/* Accordion — key uses question string for stable identity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
