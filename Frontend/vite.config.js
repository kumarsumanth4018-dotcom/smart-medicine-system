/**
 * Vite Configuration
 *
 * Smart Medicine Availability & Intelligent Janaushadhi Recommendation System
 *
 * Build optimizations:
 *   - @tailwindcss/vite plugin for CSS-first Tailwind v4 (no config file needed)
 *   - @vitejs/plugin-react for Fast Refresh + optimised JSX transform
 *   - Path alias @ → ./src for clean imports
 *   - chunkSizeWarningLimit raised to 800 KB (React Leaflet map chunks are large by nature)
 *   - Code splitting is handled by React.lazy() + Suspense in AppRouter.jsx
 */

import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import tailwindcss      from '@tailwindcss/vite'
import { resolve }      from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // ── Path alias ──────────────────────────────────────────────────────────
  // Allows: import Button from '@/components/ui/Button'
  // instead of: import Button from '../../../components/ui/Button'
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // ── Build configuration ─────────────────────────────────────────────────
  build: {
    // Raised from default 500 KB — React Leaflet (map library) produces a
    // ~190 KB chunk by design. This suppresses the false-positive warning.
    chunkSizeWarningLimit: 800,
  },
})
