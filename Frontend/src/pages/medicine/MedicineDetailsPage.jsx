import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

import MedicineOverviewSection from './sections/MedicineOverviewSection'
import PriceComparisonSection from './sections/PriceComparisonSection'
import GenericRecommendationSection from './sections/GenericRecommendationSection'
import NearbyPharmacyPreview from './sections/NearbyPharmacyPreview'
import MedicineInfoTabs from './sections/MedicineInfoTabs'
import ActionPanel from './sections/ActionPanel'
import SimilarMedicinesSection from './sections/SimilarMedicinesSection'
import HealthcareDisclaimer from './sections/HealthcareDisclaimer'

import medicineService from '../../services/medicineService'
import { ROUTES } from '../../constants/routes'


function extractStrength(value = '') {
  const result = value.match(
    /\d+(\.\d+)?\s?(mg|g|ml|mcg|iu)/i,
  )

  return result ? result[0] : ''
}


function MedicineDetailsPage() {
  const { id } = useParams()

  const {
    data: medicineResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['medicine', id],

    queryFn: async () => {
      const { data } = await medicineService.getById(id)
      return data
    },

    enabled: Boolean(id),
  })

  const medicine = useMemo(() => {
    if (!medicineResponse) {
      return null
    }

    return {
      id: medicineResponse.id,
      pmbiCode: medicineResponse.pmbi_code,

      name:
        medicineResponse.brand_name ||
        medicineResponse.generic_name,

      genericName: medicineResponse.generic_name,

      composition: medicineResponse.composition,

      strength: extractStrength(
        medicineResponse.composition ||
        medicineResponse.generic_name,
      ),

      type: medicineResponse.pack_size || 'Medicine',

      category:
        medicineResponse.category ||
        'General Medicine',

      manufacturer:
        medicineResponse.manufacturer ||
        'Manufacturer not available',

      prescriptionReqd: false,

      availability: 'available',

      isJanAushadhi: true,
      isGeneric: true,

      isAffordable:
        Number(medicineResponse.saving_pct) >= 50,

      nearbyPharmacyCount: 0,

      price:
        Number(medicineResponse.jan_aushadhi_mrp) || 0,

      mrp:
        Number(medicineResponse.branded_avg_mrp) || 0,

      savingsPercentage:
        Number(medicineResponse.saving_pct) || 0,

      description:
        `${medicineResponse.generic_name} is available through the ` +
        `Jan Aushadhi medicine programme.`,

      lastUpdated: 'Recently',
    }
  }, [medicineResponse])

  const prices = useMemo(() => {
    if (!medicineResponse) {
      return null
    }

    return {
      brandName:
        `${medicineResponse.brand_name} (Branded)`,

      brandPrice:
        Number(medicineResponse.branded_avg_mrp) || 0,

      genericName:
        `${medicineResponse.generic_name} (Jan Aushadhi)`,

      genericPrice:
        Number(medicineResponse.jan_aushadhi_mrp) || 0,
    }
  }, [medicineResponse])

  const genericMedicine = useMemo(() => {
    if (!medicineResponse) {
      return null
    }

    return {
      id: medicineResponse.id,

      name: medicineResponse.generic_name,

      equivalentName:
        `${medicineResponse.generic_name} (Generic)`,

      composition: medicineResponse.composition,

      price:
        Number(medicineResponse.jan_aushadhi_mrp) || 0,

      brandPrice:
        Number(medicineResponse.branded_avg_mrp) || 0,

      manufacturer:
        medicineResponse.manufacturer ||
        'Jan Aushadhi',

      isCompositionMatch: true,
      isQualityAssured: true,
    }
  }, [medicineResponse])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full
                       border-4 border-primary-200
                       border-t-primary-600"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading medicine information...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    const errorMessage =
      error?.response?.data?.detail ||
      'Unable to load medicine information.'

    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl border
                     border-red-200 bg-red-50 p-6 text-center"
        >
          <h2 className="text-lg font-bold text-red-700">
            Medicine could not be loaded
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {errorMessage}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <Link
              to={ROUTES.USER.SEARCH}
              className="inline-flex items-center gap-2 rounded-lg
                         border border-slate-300 bg-white px-4 py-2
                         text-sm font-medium text-slate-700"
            >
              <HiOutlineArrowLeft />
              Back to Search
            </Link>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-primary-600 px-4 py-2
                         text-sm font-medium text-white
                         hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!medicine || !prices || !genericMedicine) {
    return null
  }

  return (
    <article
      aria-label={`Medicine details: ${medicine.name}`}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2
                   text-xs text-slate-400"
      >
        <Link
          to={ROUTES.USER.SEARCH}
          className="hover:text-primary-600"
        >
          Search
        </Link>

        <span aria-hidden="true">/</span>

        <Link
          to={
            `${ROUTES.USER.SEARCH_RESULTS}?q=` +
            encodeURIComponent(medicine.genericName)
          }
          className="hover:text-primary-600"
        >
          Results
        </Link>

        <span aria-hidden="true">/</span>

        <span className="truncate font-medium text-slate-600">
          {medicine.name}
        </span>
      </nav>

      <div
        className="grid grid-cols-1 gap-6
                   lg:grid-cols-[1fr_260px]"
      >
        {/* Main content */}
        <div className="flex min-w-0 flex-col gap-6">
          <MedicineOverviewSection
            medicine={medicine}
          />

          <PriceComparisonSection
            prices={prices}
          />

          <GenericRecommendationSection
            generic={genericMedicine}
          />

          {/* Nearby pharmacy data will be connected next */}
          <NearbyPharmacyPreview
          pmbiCode={medicine.pmbiCode}
        />

          <MedicineInfoTabs />

          <SimilarMedicinesSection />

          <HealthcareDisclaimer />
        </div>

        {/* Action panel */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <ActionPanel medicine={medicine} />
        </div>
      </div>
    </article>
  )
}

export default MedicineDetailsPage