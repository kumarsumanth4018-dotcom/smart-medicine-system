/**
 * Component: HeroSection
 *
 * Purpose:
 *   Main landing hero with enhanced search section as the primary
 *   attraction. The search area spans the full hero width below
 *   the headline, with four large action cards beneath the search box.
 *
 * Search methods:
 *   1. Text Search     — standard search input
 *   2. Voice Search    — Web Speech API placeholder (VoiceSearchModal)
 *   3. OCR Scan        — Tesseract OCR placeholder (OcrScanModal)
 *   4. Nearby Pharmacy — Geolocation placeholder (NearbyPharmacyModal)
 *
 * Future backend integration points:
 *   // FastAPI Medicine Search API: GET /api/v1/medicines/search?q=
 *   // FastAPI Voice Recognition:   POST /api/v1/search/voice
 *   // FastAPI OCR Prescription:    POST /api/v1/ocr/scan
 *   // FastAPI Nearby Pharmacies:   GET /api/v1/pharmacies/nearby?lat=&lng=
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineMicrophone,
  HiOutlineCamera,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Button             from '../../../components/ui/Button'
import VoiceSearchModal   from '../../../components/common/VoiceSearchModal'
import OcrScanModal       from '../../../components/common/OcrScanModal'
import NearbyPharmacyModal from '../../../components/common/NearbyPharmacyModal'
import { ROUTES }         from '../../../constants/routes'

// ── Popular search pills ──────────────────────────────────────────────────────
// TODO: Replace with GET /api/v1/medicines/popular
const POPULAR_SEARCHES = [
  'Paracetamol', 'Crocin', 'Dolo 650', 'Azithromycin', 'Cetirizine', 'Vitamin D3',
]

// ── Search method action cards data ──────────────────────────────────────────
// Each card maps to one search method with its own icon, colour, and handler.
const SEARCH_CARDS = [
  {
    id:       'text',
    emoji:    '🔍',
    label:    'Text Search',
    desc:     'Search medicines by entering the medicine name, generic name or composition.',
    iconBg:   'bg-primary-100',
    iconColor:'text-primary-700',
    ring:     'focus-visible:ring-primary-500',
    border:   'border-primary-200',
    hover:    'hover:border-primary-400 hover:bg-primary-50',
    btnLabel: 'Search Medicines',
    btnClass: 'bg-primary-600 hover:bg-primary-700 text-white',
    action:   'text',
  },
  {
    id:       'voice',
    emoji:    '🎤',
    label:    'Voice Search',
    // FastAPI Speech Recognition Integration (placeholder)
    // TODO: POST /api/v1/search/voice + Web Speech API (SpeechRecognition)
    desc:     'Speak the medicine name for quick and hands-free searching.',
    iconBg:   'bg-secondary-100',
    iconColor:'text-secondary-700',
    ring:     'focus-visible:ring-secondary-500',
    border:   'border-secondary-200',
    hover:    'hover:border-secondary-400 hover:bg-secondary-50',
    btnLabel: 'Start Voice Search',
    btnClass: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    action:   'voice',
  },
  {
    id:       'ocr',
    emoji:    '📷',
    label:    'Scan Prescription',
    // Tesseract OCR Integration (placeholder)
    // TODO: POST /api/v1/ocr/scan + Tesseract.js / Google Vision API
    desc:     'Upload a prescription image and extract medicines automatically using OCR.',
    iconBg:   'bg-accent-100',
    iconColor:'text-accent-700',
    ring:     'focus-visible:ring-accent-500',
    border:   'border-accent-200',
    hover:    'hover:border-accent-400 hover:bg-accent-50',
    btnLabel: 'Scan Prescription',
    btnClass: 'bg-accent-600 hover:bg-accent-700 text-white',
    action:   'ocr',
  },
  {
    id:       'nearby',
    emoji:    '📍',
    label:    'Nearby Pharmacy',
    // Google Maps / Leaflet + Geolocation API Integration (placeholder)
    // TODO: GET /api/v1/pharmacies/nearby?lat=&lng=&radius=
    //       navigator.geolocation.getCurrentPosition()
    desc:     'Find Jan Aushadhi Kendras and pharmacies near your current location.',
    iconBg:   'bg-success-100',
    iconColor:'text-success-700',
    ring:     'focus-visible:ring-success-500',
    border:   'border-success-200',
    hover:    'hover:border-success-400 hover:bg-success-50',
    btnLabel: 'Find Nearby Pharmacy',
    btnClass: 'bg-success-600 hover:bg-success-700 text-white',
    action:   'nearby',
  },
]

// ── Inline SVG illustration placeholder ──────────────────────────────────────
function HeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100 flex items-center justify-center overflow-hidden shadow-lg"
    >
      <svg viewBox="0 0 400 300" className="w-3/4 h-3/4 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="220" rx="50" ry="22" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
        <ellipse cx="80" cy="220" rx="25" ry="22" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" />
        <ellipse cx="320" cy="80" rx="42" ry="18" fill="#ccfbf1" stroke="#5eead4" strokeWidth="2" />
        <ellipse cx="320" cy="80" rx="21" ry="18" fill="#99f6e4" stroke="#5eead4" strokeWidth="1.5" />
        <rect x="145" y="50" width="110" height="200" rx="16" fill="white" stroke="#bfdbfe" strokeWidth="2.5" />
        <rect x="155" y="70" width="90" height="130" rx="6" fill="#eff6ff" />
        <rect x="163" y="82" width="55" height="8" rx="3" fill="#93c5fd" />
        <rect x="163" y="96" width="74" height="5" rx="2.5" fill="#bfdbfe" />
        <rect x="163" y="107" width="60" height="5" rx="2.5" fill="#bfdbfe" />
        <circle cx="200" cy="145" r="20" fill="#dbeafe" />
        <path d="M193 145h14M200 138v14" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="163" y="174" width="74" height="14" rx="7" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1.5" />
        <circle cx="172" cy="181" r="3.5" stroke="#0d9488" strokeWidth="1.5" />
        <rect x="270" y="155" width="90" height="36" rx="10" fill="white" stroke="#bbf7d0" strokeWidth="1.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.08))" />
        <circle cx="287" cy="173" r="8" fill="#dcfce7" />
        <path d="M284 173h6M287 170v6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="299" y="167" width="52" height="5" rx="2" fill="#bbf7d0" />
        <rect x="299" y="176" width="38" height="4" rx="2" fill="#d1fae5" />
        <rect x="38" y="100" width="80" height="36" rx="10" fill="white" stroke="#bfdbfe" strokeWidth="1.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.08))" />
        <circle cx="55" cy="118" r="8" fill="#dbeafe" />
        <path d="M55 113a5 5 0 0 1 5 5c0 3.5-5 7.5-5 7.5S50 121.5 50 118a5 5 0 0 1 5-5z" fill="#3b82f6" />
        <circle cx="55" cy="118" r="2" fill="white" />
        <rect x="67" y="112" width="42" height="5" rx="2" fill="#bfdbfe" />
        <rect x="67" y="121" width="30" height="4" rx="2" fill="#dbeafe" />
        {[40,60,80,100,120].map((y, i) => (
          <circle key={i} cx={380} cy={y + 20} r="3" fill="#e0e7ff" opacity="0.7" />
        ))}
        {[20,40,60,80].map((x, i) => (
          <circle key={i} cx={x} cy={280} r="2.5" fill="#ccfbf1" opacity="0.8" />
        ))}
      </svg>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
        <MdMedication size={16} className="text-primary-600" />
      </div>
    </div>
  )
}

// ── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: HiOutlineShieldCheck, text: 'Verified Generic Medicines' },
  { icon: MdMedication,         text: 'Jan Aushadhi Network' },
  { icon: HiOutlineMapPin,      text: 'Real-Time Pharmacy Locator' },
]

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [query,       setQuery]       = useState('')
  const [voiceOpen,   setVoiceOpen]   = useState(false)
  const [ocrOpen,     setOcrOpen]     = useState(false)
  const [nearbyOpen,  setNearbyOpen]  = useState(false)
  const navigate = useNavigate()

  // FastAPI Medicine Search API — TODO: GET /api/v1/medicines/search?q={query}
  const handleSearch = useCallback(() => {
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(trimmed)}`)
  }, [query, navigate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSearch()
  }, [handleSearch])

  const handlePopular = useCallback((term) => {
    setQuery(term)
    navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(term)}`)
  }, [navigate])

  // FastAPI Voice Recognition — TODO: POST /api/v1/search/voice
  const handleVoiceResult = useCallback((text) => {
    setQuery(text)
    navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(text)}`)
  }, [navigate])

  // Tesseract OCR — TODO: POST /api/v1/ocr/scan
  const handleOcrDetected = useCallback((medicines) => {
    if (medicines.length > 0) {
      navigate(`${ROUTES.USER.SEARCH_RESULTS}?q=${encodeURIComponent(medicines[0])}`)
    }
  }, [navigate])

  function handleCardAction(action) {
    if (action === 'text')   document.getElementById('hero-search-input')?.focus()
    if (action === 'voice')  setVoiceOpen(true)
    if (action === 'ocr')    setOcrOpen(true)
    if (action === 'nearby') setNearbyOpen(true)
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-20 lg:pt-24 lg:pb-28"
    >
      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] opacity-60 pointer-events-none"
      />

      <div className="container-app relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-primary-700 tracking-wide uppercase">
                PM Jan Aushadhi Initiative
              </span>
            </div>

            {/* Official branding badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-200/60 w-fit shadow-sm"
              aria-label="Supported by Pradhan Mantri Bhartiya Janaushadhi Pariyojana"
            >
              <div className="flex flex-col gap-0.5 shrink-0" aria-hidden="true">
                <span className="block w-5 h-1 rounded-full bg-orange-500" />
                <span className="block w-5 h-1 rounded-full bg-white border border-slate-200" />
                <span className="block w-5 h-1 rounded-full bg-green-600" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Government of India</span>
                <span className="text-xs font-bold text-slate-800">PM Bhartiya Janaushadhi Pariyojana</span>
                <span className="text-[10px] text-slate-400">Dept. of Pharmaceuticals · MoC&amp;F</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight tracking-tight"
            >
              Smart Medicine{' '}
              <span className="text-primary-600">Availability</span>
              {' '}&amp;{' '}
              <span className="text-secondary-600">Intelligent</span>{' '}
              Janaushadhi Recommendation
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Discover affordable medicines, compare generic alternatives,
              locate nearby Jan Aushadhi pharmacies, and promote awareness
              of government healthcare initiatives — all in one platform.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Icon size={14} className="text-primary-500 shrink-0" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: illustration ────────────────────────────── */}
          <div className="hidden lg:flex items-center justify-center">
            <HeroIllustration />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            ENHANCED SEARCH SECTION — full width below the headline grid
            ══════════════════════════════════════════════════════════════ */}
        <div className="mt-10 lg:mt-14">

          {/* Search section header */}
          <div className="text-center mb-7">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              🔍 Search Medicines
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
              Find medicines, compare prices, discover Jan Aushadhi alternatives and locate nearby pharmacies.
            </p>
          </div>

          {/* ── Main search box ──────────────────────────────────────── */}
          {/* FastAPI Medicine Search API — TODO: GET /api/v1/medicines/search?q={query} */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 sm:gap-3 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-lg ring-2 ring-slate-100 dark:ring-slate-700 focus-within:ring-primary-400 transition-all duration-200">
              <div className="relative flex-1">
                <HiOutlineMagnifyingGlass
                  size={22}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                {/*
                  Search Box Color Standards:
                  Light mode: text-gray-900 (#111827) — dark black typed text, cursor dark
                  Dark mode: dark:text-white — white typed text, dark:caret-white cursor
                  Placeholder: slate-400 in light, slate-500 in dark
                  opacity-100 prevents browser from auto-dimming placeholder
                */}
                <input
                  id="hero-search-input"
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by Brand, Generic or Jan Aushadhi medicine name…"
                  aria-label="Search medicines by brand name, generic name or Jan Aushadhi name"
                  className="w-full h-14 sm:h-16 pl-12 pr-4 text-base sm:text-lg font-medium border-0 bg-transparent focus:outline-none text-gray-900 dark:text-white caret-gray-900 dark:caret-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:opacity-100"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                aria-label="Search medicines"
                className="flex items-center gap-2 h-14 sm:h-16 px-6 sm:px-8 rounded-xl bg-primary-600 text-white text-sm sm:text-base font-bold hover:bg-primary-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0 shadow-sm"
              >
                <HiOutlineMagnifyingGlass size={20} aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Helper text: explains Jan Aushadhi recommendation on brand name search */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              💡 Searching with a Brand name will automatically recommend Generic and Jan Aushadhi alternatives.
            </p>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Popular:</span>
              {POPULAR_SEARCHES.map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePopular(term)}
                  aria-label={`Search for ${term}`}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shadow-sm font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* ── Four search method cards — 2×2 grid ──────────────────── */}
          {/*
            Layout:
              Mobile  (< sm)  : 1 column
              Tablet  (sm+)   : 2 columns  ← 2×2
              Desktop (lg+)   : 2 columns  ← 2×2  (wider, not 4-across)
          */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 max-w-3xl mx-auto"
            role="list"
            aria-label="Search method options"
          >
            {SEARCH_CARDS.map(card => (
              <div key={card.id} role="listitem">
                <div
                  className={[
                    'flex flex-col gap-4 p-6 sm:p-7 rounded-2xl bg-white border-2 h-full',
                    'shadow-sm hover:shadow-lg hover:-translate-y-1.5',
                    'transition-all duration-200',
                    card.border,
                    card.hover,
                  ].join(' ')}
                >
                  {/* Icon + title row */}
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${card.iconBg} shrink-0 shadow-sm`}>
                      <span className="text-3xl" role="img" aria-hidden="true">{card.emoji}</span>
                    </div>
                    <div>
                      <p className={`text-base font-extrabold ${card.iconColor} leading-tight`}>{card.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                        {card.id === 'text'   ? 'Medicine Search'      : ''}
                        {card.id === 'voice'  ? 'Speech Recognition'   : ''}
                        {card.id === 'ocr'    ? 'OCR · Placeholder'    : ''}
                        {card.id === 'nearby' ? 'Geolocation · Placeholder' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{card.desc}</p>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={() => handleCardAction(card.action)}
                    aria-label={card.btnLabel}
                    className={[
                      'w-full flex items-center justify-center gap-2',
                      'py-3 px-5 rounded-xl text-sm font-bold',
                      'transition-all duration-150 active:scale-95',
                      'focus-visible:outline-none focus-visible:ring-2',
                      card.btnClass, card.ring,
                    ].join(' ')}
                  >
                    <span className="text-base" aria-hidden="true">{card.emoji}</span>
                    {card.btnLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Filters hint row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick filters:</span>
            {['Brand', 'Generic', 'Jan Aushadhi', 'Available', 'Lowest Price'].map(f => (
              <button
                key={f}
                type="button"
                aria-label={`Filter by ${f}`}
                className="text-xs px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 font-medium shadow-sm"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {/* FastAPI Voice Recognition — TODO: POST /api/v1/search/voice */}
      <VoiceSearchModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onResult={handleVoiceResult}
      />
      {/* Tesseract OCR — TODO: POST /api/v1/ocr/scan */}
      <OcrScanModal
        isOpen={ocrOpen}
        onClose={() => setOcrOpen(false)}
        onDetected={handleOcrDetected}
      />
      {/* Google Maps / Leaflet + Geolocation — TODO: GET /api/v1/pharmacies/nearby */}
      <NearbyPharmacyModal
        isOpen={nearbyOpen}
        onClose={() => setNearbyOpen(false)}
      />
    </section>
  )
}

export default HeroSection
