/**
 * OcrScanModal
 *
 * Frontend placeholder for OCR Prescription Scanning functionality.
 *
 * ⚠ PLACEHOLDER — OCR is NOT implemented.
 * TODO: Integrate Tesseract.js (client-side) or backend OCR service
 *       Backend endpoint: POST /api/v1/ocr/scan  — accepts image, returns medicines
 *       FastAPI + Tesseract OCR / Google Vision API
 *
 * Current behaviour:
 *   - Shows upload area with drag-and-drop placeholder
 *   - On "Scan Prescription" click, shows loading animation for 2.5s
 *   - Then shows demo detected medicines list
 *   - onDetected(medicines[]) callback fires when user clicks "Search"
 *
 * Props:
 *   isOpen      {boolean}    — controls visibility
 *   onClose     {Function}   — called when modal is dismissed
 *   onDetected  {Function}   — called with array of detected medicine names
 */

import { useState, useCallback } from 'react'
import {
  HiOutlineCamera, HiOutlineXMark, HiOutlineCheckCircle,
  HiOutlineArrowUpTray, HiOutlineMagnifyingGlass,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'

// Demo: simulated detected medicines after OCR scan
// TODO: Replace with real OCR API response
const DEMO_DETECTED = [
  { id: 1, name: 'Paracetamol 650mg' },
  { id: 2, name: 'Pantoprazole 40mg' },
  { id: 3, name: 'Cetirizine 10mg'   },
  { id: 4, name: 'Vitamin D3 60K'    },
]

function OcrScanModal({ isOpen, onClose, onDetected }) {
  const [phase, setPhase] = useState('upload') // upload | scanning | results

  function resetAndClose() {
    setPhase('upload')
    onClose?.()
  }

  const handleScan = useCallback(() => {
    /**
     * TODO: Replace this simulation with real OCR:
     *
     * Client-side option:
     *   import Tesseract from 'tesseract.js'
     *   const { data: { text } } = await Tesseract.recognize(imageFile, 'eng')
     *   // Parse medicine names from text
     *
     * Backend option (recommended):
     *   const formData = new FormData()
     *   formData.append('image', imageFile)
     *   const res = await axios.post('/api/v1/ocr/scan', formData)
     *   // res.data.medicines = [{ name, confidence }]
     *
     * FastAPI backend endpoint:
     *   POST /api/v1/ocr/scan
     *   Request:  multipart/form-data  { image: File }
     *   Response: { medicines: [{ name, composition, confidence }] }
     */
    setPhase('scanning')
    setTimeout(() => setPhase('results'), 2500)
  }, [])

  function handleSearchAll() {
    onDetected?.(DEMO_DETECTED.map(m => m.name))
    resetAndClose()
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ocr-modal-title"
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={resetAndClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">

        {/* Close */}
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close prescription scan"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineXMark size={18} aria-hidden="true" />
        </button>

        {/* Title */}
        <div>
          <h2 id="ocr-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineCamera size={18} className="text-secondary-600" aria-hidden="true" />
            Scan Prescription
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Upload a prescription image to detect medicines automatically</p>
        </div>

        {/* Phase: Upload */}
        {phase === 'upload' && (
          <>
            {/* Drag & Drop area */}
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center gap-3 bg-slate-50 hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Click to upload prescription image"
              onKeyDown={e => e.key === 'Enter' && handleScan()}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm">
                <HiOutlineArrowUpTray size={24} className="text-slate-400" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">Choose Image</p>
                <p className="text-xs text-slate-400 mt-0.5">or drag &amp; drop here</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>PNG</span><span>·</span><span>JPG</span><span>·</span><span>PDF</span>
              </div>
              {/* TODO: Implement file input — <input type="file" accept="image/*" /> */}
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Camera placeholder */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-100 shrink-0">
                <HiOutlineCamera size={20} className="text-secondary-600" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700">Use Camera</p>
                <p className="text-[11px] text-slate-400">
                  {/* TODO: Integrate getUserMedia / camera capture API */}
                  Camera capture — coming soon
                </p>
              </div>
            </div>

            {/* Scan button */}
            <button
              type="button"
              onClick={handleScan}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary-600 text-white text-sm font-bold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            >
              <HiOutlineCamera size={16} aria-hidden="true" />
              Scan Prescription
            </button>
          </>
        )}

        {/* Phase: Scanning */}
        {phase === 'scanning' && (
          <div className="flex flex-col items-center gap-5 py-8">
            {/* Animated scan ring */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-secondary-200 border-t-secondary-600 animate-spin" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MdMedication size={28} className="text-secondary-600" aria-hidden="true" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">Scanning…</p>
              <p className="text-xs text-slate-500 mt-1">
                Detecting medicines from prescription
              </p>
              {/* TODO: Progress bar here when real OCR is integrated */}
            </div>
          </div>
        )}

        {/* Phase: Results */}
        {phase === 'results' && (
          <>
            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
              <p className="text-xs font-bold text-success-700 mb-3 flex items-center gap-1.5">
                <HiOutlineCheckCircle size={14} aria-hidden="true" />
                Detected Medicines
              </p>
              <ul className="space-y-2" aria-label="Detected medicines from prescription">
                {DEMO_DETECTED.map(m => (
                  <li key={m.id} className="flex items-center gap-2 text-sm text-slate-800">
                    <HiOutlineCheckCircle size={14} className="text-success-600 shrink-0" aria-hidden="true" />
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSearchAll}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <HiOutlineMagnifyingGlass size={15} aria-hidden="true" />
                Search Detected Medicines
              </button>
              <button
                type="button"
                onClick={() => setPhase('upload')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Rescan
              </button>
            </div>
          </>
        )}

        {/* Placeholder notice */}
        {/* TODO: Replace simulation with Tesseract.js or FastAPI OCR endpoint.
                  POST /api/v1/ocr/scan — multipart/form-data {image: File}
                  This is a frontend placeholder only. */}
        <p className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
          📷 OCR Scan placeholder — Tesseract OCR not yet implemented.
        </p>
      </div>
    </div>
  )
}

export default OcrScanModal
