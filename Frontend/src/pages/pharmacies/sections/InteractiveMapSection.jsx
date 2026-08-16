/**
 * Component: InteractiveMapSection
 *
 * Description:
 *   React Leaflet interactive map displaying pharmacy locations
 *   and user position using placeholder coordinates.
 *
 * Responsibilities:
 *   - Render a Leaflet MapContainer with TileLayer (OpenStreetMap)
 *   - User location marker (blue circle)
 *   - Pharmacy markers (green = Jan Aushadhi, blue = regular)
 *   - Selected pharmacy highlighted marker
 *   - Map controls: zoom, Locate Me placeholder, Reset View
 *   - Map legend
 *
 * Important:
 *   All coordinates are hardcoded Mumbai placeholders.
 *   Do NOT connect to any real GPS or pharmacy API.
 *   TODO: replace with Geolocation API + GET /api/v1/pharmacies/nearby
 *
 * Dependencies:
 *   - react-leaflet (already installed in Module 1A)
 *   - leaflet (already installed)
 *   - Leaflet CSS imported in index.css
 */

import { useState } from 'react'
import {
  MapContainer, TileLayer, Marker, Popup, Circle, useMap,
} from 'react-leaflet'
import L from 'leaflet'
import {
  HiOutlineMapPin, HiOutlineArrowPath,
  HiOutlineMagnifyingGlassPlus,
} from 'react-icons/hi2'

// ── Fix Leaflet default icon path issue with Vite bundler ──────────────────
import markerIcon2x   from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon     from 'leaflet/dist/images/marker-icon.png'
import markerShadow   from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

// Custom pharmacy marker icons
const janAushadhiIcon = new L.DivIcon({
  html: `<div style="background:#16a34a;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">🏥</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
})

const regularIcon = new L.DivIcon({
  html: `<div style="background:#2563eb;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">+</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
})

const selectedIcon = new L.DivIcon({
  html: `<div style="background:#f59e0b;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:3px solid white;">★</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
})

// =======================================================
// Placeholder pharmacy coordinates (Mumbai area)
// TODO: Replace with GET /api/v1/pharmacies/nearby?lat=...&lng=...
// =======================================================
const PLACEHOLDER_USER_LOCATION = [19.1297, 72.8464]  // Andheri West
const PLACEHOLDER_PHARMACIES = [
  { id: 'p1', name: 'Jan Aushadhi Kendra — Andheri',  lat: 19.1320, lng: 72.8490, isJanAushadhi: true,  isOpen: true,  distance: '0.8 km' },
  { id: 'p2', name: 'Shree Medical Store',             lat: 19.1270, lng: 72.8440, isJanAushadhi: false, isOpen: true,  distance: '1.2 km' },
  { id: 'p3', name: 'Jan Aushadhi Kendra — Versova',   lat: 19.1350, lng: 72.8400, isJanAushadhi: true,  isOpen: true,  distance: '1.6 km' },
  { id: 'p4', name: 'Apollo Pharmacy',                 lat: 19.1240, lng: 72.8510, isJanAushadhi: false, isOpen: false, distance: '1.9 km' },
  { id: 'p5', name: 'Jan Aushadhi Kendra — Juhu',      lat: 19.1200, lng: 72.8380, isJanAushadhi: true,  isOpen: true,  distance: '2.4 km' },
]

// ── Reset view button (inside the map) ────────────────────────────────────
function ResetViewControl({ center, zoom }) {
  const map = useMap()
  return (
    <button
      type="button"
      onClick={() => map.setView(center, zoom)}
      aria-label="Reset map to initial view"
      className="absolute bottom-4 right-4 z-[999] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white shadow-md text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <HiOutlineArrowPath size={13} aria-hidden="true" />
      Reset View
    </button>
  )
}

// =======================================================
// Interactive Map Section
// =======================================================
function InteractiveMapSection({ selectedPharmacyId, onSelectPharmacy }) {
  const CENTER = PLACEHOLDER_USER_LOCATION
  const ZOOM   = 14

  return (
    <section aria-labelledby="map-heading">

      {/* =======================================================
          Interactive Map
         ======================================================= */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Map header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HiOutlineMapPin size={18} className="text-secondary-600" aria-hidden="true" />
            <h2 id="map-heading" className="text-base font-bold text-slate-900">
              Interactive Map
            </h2>
          </div>

          {/* Locate Me placeholder */}
          <button
            type="button"
            aria-label="Locate my position (requires location permission)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary-300 text-secondary-700 text-xs font-medium hover:bg-secondary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            onClick={() => {/* TODO: Geolocation API — navigator.geolocation.getCurrentPosition */}}
          >
            <HiOutlineMagnifyingGlassPlus size={13} aria-hidden="true" />
            Locate Me
            <span className="text-[10px] text-secondary-400">(placeholder)</span>
          </button>
        </div>

        {/* Leaflet map */}
        <div className="h-80 sm:h-96 relative" aria-label="Pharmacy map">
          <MapContainer
            center={CENTER}
            zoom={ZOOM}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
            aria-label="Interactive map showing nearby pharmacies"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* User location circle */}
            <Circle
              center={CENTER}
              radius={200}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.2 }}
            />
            <Marker position={CENTER}>
              <Popup>
                <div className="text-xs font-semibold">📍 Your Location (Placeholder)</div>
                <div className="text-[11px] text-slate-500">Andheri West, Mumbai</div>
                <div className="text-[10px] text-slate-400 mt-0.5">TODO: replace with GPS</div>
              </Popup>
            </Marker>

            {/* Pharmacy markers */}
            {PLACEHOLDER_PHARMACIES.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={
                  p.id === selectedPharmacyId
                    ? selectedIcon
                    : p.isJanAushadhi
                    ? janAushadhiIcon
                    : regularIcon
                }
                eventHandlers={{ click: () => onSelectPharmacy?.(p.id) }}
              >
                <Popup>
                  <div className="text-xs font-semibold">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.distance}</div>
                  <div className="text-[11px]">
                    <span className={p.isOpen ? 'text-success-600' : 'text-danger-600'}>
                      {p.isOpen ? '● Open' : '● Closed'}
                    </span>
                    {p.isJanAushadhi && <span className="ml-2 text-info-600">Jan Aushadhi</span>}
                  </div>
                </Popup>
              </Marker>
            ))}

            <ResetViewControl center={CENTER} zoom={ZOOM} />
          </MapContainer>
        </div>

        {/* Map legend */}
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-4 h-4 rounded-full bg-success-500 inline-block shrink-0" aria-hidden="true" />
            Jan Aushadhi Kendra
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-4 h-4 rounded-full bg-primary-600 inline-block shrink-0" aria-hidden="true" />
            Regular Pharmacy
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-4 h-4 rounded-full bg-warning-500 inline-block shrink-0" aria-hidden="true" />
            Selected
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-4 h-4 rounded-full bg-primary-300 inline-block shrink-0 opacity-60" aria-hidden="true" />
            Your Location
          </span>
          <span className="text-slate-400 ml-auto">
            {/* TODO: tile layer attribution */}
            Map data © OpenStreetMap contributors
          </span>
        </div>
      </div>
    </section>
  )
}

export default InteractiveMapSection
export { PLACEHOLDER_PHARMACIES, PLACEHOLDER_USER_LOCATION }
