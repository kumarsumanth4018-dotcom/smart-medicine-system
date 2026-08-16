/**
 * NearbyPharmacyModal
 *
 * Frontend placeholder for location-based pharmacy search.
 *
 * ⚠ PLACEHOLDER — No real geolocation or maps integration.
 * TODO: Integrate browser Geolocation API → navigator.geolocation
 * TODO: Integrate Google Maps / React Leaflet for map display
 * TODO: Backend endpoint: GET /api/v1/pharmacies/nearby?lat=&lng=&radius=
 *       FastAPI + PostGIS geospatial queries
 *
 * Current behaviour:
 *   - "Detect My Location" simulates location detection
 *   - City/Area/PIN search fields are UI placeholders
 *   - "Find Pharmacies" shows demo pharmacy cards after 1.5s
 *
 * Props:
 *   isOpen   {boolean}  — controls visibility
 *   onClose  {Function} — called when modal is dismissed
 */

import { useState, useCallback } from 'react'
import {
  HiOutlineXMark, HiOutlineMapPin, HiOutlineBuildingStorefront,
  HiOutlineClock, HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'
import { MdLocalPharmacy } from 'react-icons/md'

// Demo pharmacy results — placeholder data
// TODO: Replace with GET /api/v1/pharmacies/nearby?lat=&lng=&radius= response
const DEMO_PHARMACIES = [
  { id: 1, name: 'Jan Aushadhi Kendra — Andheri', distance: '1.2 km', isOpen: true,  type: 'Jan Aushadhi' },
  { id: 2, name: 'ABC Medical Store',              distance: '1.8 km', isOpen: true,  type: 'General'      },
  { id: 3, name: 'Jan Aushadhi Kendra — Versova',  distance: '2.5 km', isOpen: true,  type: 'Jan Aushadhi' },
  { id: 4, name: 'HealthPlus Pharmacy',            distance: '3.1 km', isOpen: false, type: 'General'      },
]

function NearbyPharmacyModal({ isOpen, onClose }) {
  const [phase,  setPhase]  = useState('form')   // form | locating | results
  const [city,   setCity]   = useState('')
  const [area,   setArea]   = useState('')
  const [pin,    setPin]    = useState('')

  function resetAndClose() {
    setPhase('form')
    setCity(''); setArea(''); setPin('')
    onClose?.()
  }

  const handleDetectLocation = useCallback(() => {
    /**
     * TODO: Replace simulation with real geolocation:
     *
     * navigator.geolocation.getCurrentPosition(
     *   (pos) => {
     *     const { latitude, longitude } = pos.coords
     *     fetchNearbyPharmacies(latitude, longitude)
     *   },
     *   (err) => showLocationError(err)
     * )
     *
     * Google Maps integration:
     *   Use @react-google-maps/api or existing React Leaflet
     *   Display pharmacy markers on map
     *
     * FastAPI backend:
     *   GET /api/v1/pharmacies/nearby?lat={lat}&lng={lng}&radius=5
     */
    setPhase('locating')
    setTimeout(() => setPhase('results'), 1500)
  }, [])

  const handleSearch = useCallback(() => {
    /**
     * TODO: Replace with:
     *   GET /api/v1/pharmacies/search?city={city}&area={area}&pin={pin}
     */
    setPhase('locating')
    setTimeout(() => setPhase('results'), 1500)
  }, [])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nearby-modal-title"
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={resetAndClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close nearby pharmacy search"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineXMark size={18} aria-hidden="true" />
        </button>

        {/* Title */}
        <div>
          <h2 id="nearby-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineMapPin size={18} className="text-primary-600" aria-hidden="true" />
            Find Nearby Pharmacy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Locate Jan Aushadhi Kendras and pharmacies near you</p>
        </div>

        {/* Phase: Form */}
        {phase === 'form' && (
          <>
            {/* Detect location */}
            {/* TODO: navigator.geolocation.getCurrentPosition() */}
            <button
              type="button"
              onClick={handleDetectLocation}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <HiOutlineMapPin size={16} aria-hidden="true" />
              Allow Location Access — Detect My Location
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Manual search fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="city-input" className="text-xs font-semibold text-slate-700 mb-1 block">Search City</label>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter city name (e.g. Mumbai)"
                  className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
              <div>
                <label htmlFor="area-input" className="text-xs font-semibold text-slate-700 mb-1 block">Search Area</label>
                <input
                  id="area-input"
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="Enter locality or area (e.g. Andheri West)"
                  className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
              <div>
                <label htmlFor="pin-input" className="text-xs font-semibold text-slate-700 mb-1 block">Search PIN Code</label>
                <input
                  id="pin-input"
                  type="text"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter 6-digit PIN code (e.g. 400053)"
                  maxLength={6}
                  className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-3 rounded-xl bg-secondary-600 text-white text-sm font-bold hover:bg-secondary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            >
              Find Pharmacies
            </button>
          </>
        )}

        {/* Phase: Locating */}
        {phase === 'locating' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-14 h-14 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" aria-hidden="true" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">Locating pharmacies…</p>
              <p className="text-xs text-slate-500 mt-1">Finding nearby Jan Aushadhi Kendras</p>
            </div>
            {/* TODO: Google Maps / Leaflet map will render here during real search */}
          </div>
        )}

        {/* Phase: Results */}
        {phase === 'results' && (
          <>
            <p className="text-xs font-semibold text-slate-700">
              {DEMO_PHARMACIES.length} pharmacies found near you
            </p>
            <div className="space-y-3">
              {DEMO_PHARMACIES.map(ph => (
                <div
                  key={ph.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${ph.type === 'Jan Aushadhi' ? 'bg-secondary-100' : 'bg-primary-100'}`}>
                      <MdLocalPharmacy size={20} className={ph.type === 'Jan Aushadhi' ? 'text-secondary-600' : 'text-primary-600'} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{ph.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <HiOutlineMapPin size={11} aria-hidden="true" />{ph.distance}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: ph.isOpen ? '#16a34a' : '#dc2626' }}>
                          <HiOutlineClock size={11} aria-hidden="true" />
                          {ph.isOpen ? 'Open' : 'Closed'}
                        </span>
                        {ph.type === 'Jan Aushadhi' && (
                          <span className="text-[10px] font-bold text-secondary-700 bg-secondary-100 px-1.5 py-0.5 rounded-full">JA</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`View details for ${ph.name}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0"
                  >
                    View
                    <HiOutlineArrowTopRightOnSquare size={11} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhase('form')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                New Search
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Done
              </button>
            </div>
            {/* TODO: Replace placeholder cards with real data from:
                      GET /api/v1/pharmacies/nearby?lat={lat}&lng={lng}&radius=5
                      Display results on React Leaflet map */}
            <p className="text-[10px] text-slate-400 text-center">
              📍 Placeholder results — Location services not yet integrated.
            </p>
          </>
        )}

        {/* Footer notice */}
        {/* TODO: Google Maps API Key + Leaflet integration required.
                  Geolocation: navigator.geolocation.getCurrentPosition()
                  Backend: GET /api/v1/pharmacies/nearby (FastAPI + PostGIS) */}
        <p className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
          📍 Location-based search placeholder — Maps integration pending.
        </p>
      </div>
    </div>
  )
}

export default NearbyPharmacyModal
