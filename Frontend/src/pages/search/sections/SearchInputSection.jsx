/**
 * Component: SearchInputSection
 *
 * Enhanced with Voice Search and OCR Scan buttons.
 * Modals are rendered here — state lifted to this component only.
 *
 * ⚠ Voice Search — placeholder only. TODO: Web Speech API integration.
 *   Backend: POST /api/v1/search/voice (FastAPI + speech-to-text)
 * ⚠ OCR Scan — placeholder only. TODO: Tesseract.js / FastAPI OCR.
 *   Backend: POST /api/v1/ocr/scan (FastAPI + Tesseract)
 */

import { useState, useCallback } from 'react'
import { HiOutlineCommandLine, HiOutlineMicrophone, HiOutlineCamera } from 'react-icons/hi2'
import SearchBar        from '../../../components/common/SearchBar'
import VoiceSearchModal from '../../../components/common/VoiceSearchModal'
import OcrScanModal     from '../../../components/common/OcrScanModal'

// =====================================================
// Example medicine quick-fill pills
// TODO: Replace with data from GET /api/v1/medicines/popular in Module 7B
// =====================================================
const EXAMPLE_MEDICINES = [
  'Paracetamol',
  'Azithromycin',
  'Amoxicillin',
  'Metformin',
  'Cetirizine',
  'Ibuprofen',
]

// Search method labels — kept inline in JSX below

// =====================================================
// Search Input Section
// =====================================================
function SearchInputSection({ query = '', onQueryChange, onSearch }) {
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [ocrOpen,   setOcrOpen]   = useState(false)

  function handleExampleClick(medicine) {
    onQueryChange?.(medicine)
    onSearch?.(medicine)
  }

  const handleVoiceResult = useCallback((text) => {
    onQueryChange?.(text)
    onSearch?.(text)
  }, [onQueryChange, onSearch])

  const handleOcrDetected = useCallback((medicines) => {
    if (medicines.length > 0) {
      onQueryChange?.(medicines[0])
      onSearch?.(medicines[0])
    }
  }, [onQueryChange, onSearch])

  return (
    <section aria-labelledby="search-input-label" className="py-6">

      <div className="max-w-3xl mx-auto">
        <label id="search-input-label" className="sr-only">
          Search for medicines by name, generic name, composition, or manufacturer
        </label>

        {/* Large SearchBar */}
        <div className="relative shadow-lg rounded-2xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary-500 transition-shadow duration-200">
          <SearchBar
            value={query}
            onChange={onQueryChange}
            onSearch={onSearch}
            onClear={() => onQueryChange?.('')}
            placeholder="Search by Brand, Generic or Jan Aushadhi medicine name, composition…"
            size="lg"
            className="[&_input]:rounded-2xl [&_input]:border-0 [&_input]:shadow-none [&_input]:h-16 [&_input]:text-base [&_input]:font-medium"
          />
        </div>

        {/* Helper text — explains Jan Aushadhi recommendation trigger */}
        <p className="text-xs text-slate-500 mt-2 px-1">
          💡 Searching with a Brand name will automatically recommend Generic and Jan Aushadhi alternatives.
        </p>

        {/* Keyboard hint + search methods */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Press Enter to search">
            <HiOutlineCommandLine size={13} aria-hidden="true" />
            <span>Press</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-mono font-medium text-slate-500">
              Enter
            </kbd>
            <span>to search</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Search by:</span>
            {['Medicine Name', 'Generic Name', 'Composition', 'Manufacturer'].map((m, i, arr) => (
              <span key={m} className="text-xs text-slate-500">
                {m}{i < arr.length - 1 && <span className="text-slate-300 mx-1">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* OR divider + Voice/OCR buttons */}
        <div className="mt-4 px-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">OR SEARCH USING</span>
            <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
          </div>

          <div className="flex gap-2">
            {/* Voice Search button
                TODO: Integrate Web Speech API → window.SpeechRecognition
                Backend: POST /api/v1/search/voice (FastAPI + speech-to-text) */}
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              aria-label="Search medicines by voice"
              className="flex flex-1 items-center justify-center gap-2 h-11 px-4 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 text-xs font-semibold hover:bg-primary-100 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <HiOutlineMicrophone size={15} aria-hidden="true" />
              🎤 Voice Search
            </button>

            {/* OCR Scan button
                TODO: Integrate Tesseract.js (client-side) or FastAPI OCR endpoint
                Backend: POST /api/v1/ocr/scan — multipart/form-data {image: File} */}
            <button
              type="button"
              onClick={() => setOcrOpen(true)}
              aria-label="Scan a prescription image to search medicines"
              className="flex flex-1 items-center justify-center gap-2 h-11 px-4 rounded-xl border border-secondary-200 bg-secondary-50 text-secondary-700 text-xs font-semibold hover:bg-secondary-100 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            >
              <HiOutlineCamera size={15} aria-hidden="true" />
              📷 Scan Prescription
            </button>
          </div>
        </div>

        {/* Example medicine quick-fill pills */}
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <span className="text-xs text-slate-400 self-center mr-1">Try:</span>
          {EXAMPLE_MEDICINES.map((medicine) => (
            <button
              key={medicine}
              type="button"
              onClick={() => handleExampleClick(medicine)}
              aria-label={`Search for ${medicine}`}
              className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {medicine}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <VoiceSearchModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} onResult={handleVoiceResult} />
      <OcrScanModal     isOpen={ocrOpen}   onClose={() => setOcrOpen(false)}   onDetected={handleOcrDetected} />

    </section>
  )
}

export default SearchInputSection
