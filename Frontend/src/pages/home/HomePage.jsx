/**
 * Component: HomePage
 *
 * Purpose:
 *   Main landing page of the Smart Medicine Availability &
 *   Intelligent Janaushadhi Recommendation System.
 *   Creates the first impression for all visitors — patients,
 *   doctors, pharmacists, and administrators.
 *
 * Responsibilities:
 *   - Compose all home page sections in the specified order
 *   - Act as a pure layout orchestrator with no business logic
 *   - Remain future-ready for backend integration per section
 *
 * Section order (per Module 6 specification):
 *   1. HeroSection        — Value proposition + CTAs
 *   2. AboutSection       — Platform purpose and problem statement
 *   3. JanAushadhiSection — PMJAP government initiative overview
 *   4. FeaturesSection    — 8 key platform capabilities
 *   5. HowItWorksSection  — 6-step user journey workflow
 *   6. BenefitsSection    — Generic medicine advantages + price comparison
 *   7. StatsSection       — Placeholder statistics (API-ready)
 *   8. FaqSection         — Accessible accordion FAQ
 *   9. CtaSection         — Conversion banner
 *
 * Architecture:
 *   Each section is self-contained in ./sections/.
 *   This file is a pure composition layer — add/remove/reorder
 *   sections here without touching individual section components.
 *
 * Route: / (index route inside MainLayout → Navbar + Footer)
 *
 * Backend readiness:
 *   Section-level data (stats, FAQs, features) can be replaced
 *   with API responses in future modules without redesigning layout.
 *
 * Dependencies:
 *   - MainLayout (layouts/MainLayout) — provides Navbar + Footer
 *   - All section components (./sections/*)
 */

import { lazy, Suspense } from 'react'
import { Spinner } from '../../components/feedback'

// ── Eagerly loaded: above-the-fold sections ──────────────────────────────────
import HeroSection        from './sections/HeroSection'
import AboutSection       from './sections/AboutSection'

// ── Lazily loaded: below-the-fold sections ───────────────────────────────────
// Lazy loading reduces initial bundle parsed/evaluated on first paint.
// Each section is independently code-split by Vite.
const JanAushadhiSection = lazy(() => import('./sections/JanAushadhiSection'))
const FeaturesSection    = lazy(() => import('./sections/FeaturesSection'))
const HowItWorksSection  = lazy(() => import('./sections/HowItWorksSection'))
const BenefitsSection    = lazy(() => import('./sections/BenefitsSection'))
const StatsSection       = lazy(() => import('./sections/StatsSection'))
const FaqSection         = lazy(() => import('./sections/FaqSection'))
const CtaSection         = lazy(() => import('./sections/CtaSection'))

// ── Section loading placeholder ──────────────────────────────────────────────
// Used as Suspense fallback while lazy sections are being loaded.
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="md" color="muted" label="Loading section…" />
    </div>
  )
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <>
      {/* ===================================================== */}
      {/* Hero Section                                          */}
      {/* Eagerly loaded — first contentful paint               */}
      {/* ===================================================== */}
      <HeroSection />

      {/* ===================================================== */}
      {/* About Project                                         */}
      {/* Eagerly loaded — immediately below the fold          */}
      {/* ===================================================== */}
      <AboutSection />

      {/* ===================================================== */}
      {/* All sections below are lazy-loaded                   */}
      {/* ===================================================== */}
      <Suspense fallback={<SectionLoader />}>

        {/* ================================================= */}
        {/* About PM Jan Aushadhi                             */}
        {/* ================================================= */}
        <JanAushadhiSection />

        {/* ================================================= */}
        {/* Key Features                                      */}
        {/* TODO: can be driven by GET /api/v1/features       */}
        {/* ================================================= */}
        <FeaturesSection />

        {/* ================================================= */}
        {/* How It Works                                      */}
        {/* ================================================= */}
        <HowItWorksSection />

        {/* ================================================= */}
        {/* Benefits of Generic Medicines                     */}
        {/* ================================================= */}
        <BenefitsSection />

        {/* ================================================= */}
        {/* Statistics                                        */}
        {/* TODO: values from GET /api/v1/stats/platform      */}
        {/* ================================================= */}
        <StatsSection />

        {/* ================================================= */}
        {/* FAQ                                               */}
        {/* TODO: can be driven by GET /api/v1/content/faqs   */}
        {/* ================================================= */}
        <FaqSection />

        {/* ================================================= */}
        {/* Call To Action                                    */}
        {/* ================================================= */}
        <CtaSection />

      </Suspense>
    </>
  )
}

export default HomePage
