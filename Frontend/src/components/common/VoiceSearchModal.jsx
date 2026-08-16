/**
 * VoiceSearchModal
 *
 * Frontend placeholder for Voice Search functionality.
 *
 * ⚠ PLACEHOLDER — Speech recognition is NOT implemented.
 * TODO: Integrate Web Speech API → window.SpeechRecognition
 *       Backend endpoint: POST /api/v1/search/voice
 *       FastAPI + speech-to-text library (e.g. SpeechBrain, Whisper)
 *
 * Current behaviour:
 *   - Shows animated microphone and "Listening…" state
 *   - After 2.5s auto-populates the search box with a demo result
 *   - Calls onResult(text) which parent uses to fill the search input
 *
 * Props:
 *   isOpen   {boolean}   — controls visibility
 *   onClose  {Function}  — called when modal is dismissed
 *   onResult {Function}  — called with recognised speech text
 */

import { useState, useCallback } from 'react'
import { HiOutlineMicrophone, HiOutlineXMark, HiOutlineStopCircle } from 'react-icons/hi2'

// Demo: simulated speech result after listening period
// TODO: Replace with real SpeechRecognition API output
const DEMO_VOICE_RESULTS = [
  'Paracetamol 500mg',
  'Dolo 650',
  'Cetirizine 10mg',
  'Azithromycin 500',
]

function VoiceSearchModal({ isOpen, onClose, onResult }) {
  const [phase, setPhase] = useState('idle') // idle | listening | done
  const [result, setResult] = useState('')
  // State resets automatically when modal unmounts (isOpen === false returns null below)

  const startListening = useCallback(() => {
    /**
     * TODO: Replace this simulation with real Web Speech API:
     *
     * const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
     * if (!SpeechRecognition) { alert('Speech recognition not supported'); return }
     * const recognition = new SpeechRecognition()
     * recognition.lang = 'en-IN'
     * recognition.onresult = (e) => {
     *   const text = e.results[0][0].transcript
     *   setResult(text); setPhase('done')
     * }
     * recognition.start()
     *
     * FastAPI backend endpoint (future):
     * POST /api/v1/search/voice  — accepts audio blob, returns transcription
     */
    setPhase('listening')
    const pick = DEMO_VOICE_RESULTS[Math.floor(Math.random() * DEMO_VOICE_RESULTS.length)]
    setTimeout(() => {
      setResult(pick)
      setPhase('done')
    }, 2500)
  }, [])

  function handleStop() {
    setPhase('done')
    if (!result) {
      setResult(DEMO_VOICE_RESULTS[0])
    }
  }

  function handleUseResult() {
    onResult?.(result)
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-5">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close voice search"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineXMark size={18} aria-hidden="true" />
        </button>

        {/* Title */}
        <div className="text-center">
          <h2 id="voice-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2 justify-center">
            <HiOutlineMicrophone size={18} className="text-primary-600" aria-hidden="true" />
            Voice Search
          </h2>
          <p className="text-xs text-slate-500 mt-1">Speak the medicine name</p>
        </div>

        {/* Microphone animation */}
        <div className="relative flex items-center justify-center">
          {/* Pulse rings — shown while listening */}
          {phase === 'listening' && (
            <>
              <span className="absolute w-24 h-24 rounded-full bg-primary-100 animate-ping opacity-40" aria-hidden="true" />
              <span className="absolute w-20 h-20 rounded-full bg-primary-100 animate-ping opacity-30 delay-75" aria-hidden="true" />
            </>
          )}
          <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
            phase === 'listening' ? 'bg-primary-600' : phase === 'done' ? 'bg-success-600' : 'bg-slate-100'
          }`}>
            <HiOutlineMicrophone
              size={28}
              className={phase === 'listening' || phase === 'done' ? 'text-white' : 'text-slate-400'}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center min-h-[3rem] flex flex-col items-center justify-center">
          {phase === 'idle' && (
            <p className="text-sm text-slate-600">Press the button to start speaking</p>
          )}
          {phase === 'listening' && (
            <p className="text-sm font-semibold text-primary-700 animate-pulse">
              Listening…
            </p>
          )}
          {phase === 'done' && result && (
            <>
              <p className="text-xs text-slate-500 mb-1">Detected:</p>
              <p className="text-base font-bold text-slate-900 bg-primary-50 px-4 py-1.5 rounded-lg">
                {result}
              </p>
            </>
          )}
        </div>

        {/* Example phrases */}
        <div className="w-full bg-slate-50 rounded-xl px-4 py-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Try saying
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['"Paracetamol"', '"Dolo 650"', '"Cetirizine"'].map(ex => (
              <span key={ex} className="text-xs text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                {ex}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          {phase === 'idle' && (
            <button
              type="button"
              onClick={startListening}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <HiOutlineMicrophone size={16} aria-hidden="true" />
              Start Listening
            </button>
          )}
          {phase === 'listening' && (
            <>
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-danger-600 text-white text-sm font-bold hover:bg-danger-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <HiOutlineStopCircle size={16} aria-hidden="true" />
                Stop
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Cancel
              </button>
            </>
          )}
          {phase === 'done' && (
            <>
              <button
                type="button"
                onClick={handleUseResult}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Search This
              </button>
              <button
                type="button"
                onClick={() => { setPhase('idle'); setResult('') }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Retry
              </button>
            </>
          )}
        </div>

        {/* Placeholder notice */}
        {/* TODO: Integrate Web Speech API (SpeechRecognition) for real voice input.
                  Backend: POST /api/v1/search/voice — FastAPI + Whisper/SpeechBrain OCR.
                  This is a frontend placeholder only. */}
        <p className="text-[10px] text-slate-400 text-center">
          🎤 Voice Search placeholder — Speech recognition not yet implemented.
        </p>
      </div>
    </div>
  )
}

export default VoiceSearchModal
