import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import { Link } from 'react-router-dom'

import Badge from '../../../components/ui/Badge'
import { ROUTES } from '../../../constants/routes'


// =====================================================
// Generic Recommendation Section
// =====================================================

function GenericRecommendationSection({
  generic = {},
}) {
  const {
    id = 'gen-001',

    pmbiCode = '',

    name = 'Paracetamol IP 500mg',

    equivalentName =
      'Acetaminophen (Generic)',

    composition =
      'Paracetamol IP 500mg',

    price = 18,

    brandPrice = 120,

    manufacturer =
      'Jan Aushadhi (BPPI)',

    isCompositionMatch = true,
    isQualityAssured = true,
  } = generic


  // =====================================================
  // Savings calculation
  // =====================================================

  const savings =
    Math.max(
      Number(brandPrice) - Number(price),
      0,
    )

  const savingsPct =
    Number(brandPrice) > 0
      ? Math.round(
        (
          savings
          / Number(brandPrice)
        ) * 100,
      )
      : 0


  // =====================================================
  // Nearby Kendra URL
  // =====================================================

  const nearbyPageUrl =
    `${ROUTES.USER.NEARBY_PHARMACIES}`
    + `?medicine=${encodeURIComponent(pmbiCode)}`
    + `&name=${encodeURIComponent(name)}`
    + `&genericName=${encodeURIComponent(
      equivalentName,
    )}`


  // =====================================================
  // Component UI
  // =====================================================

  return (
    <section
      aria-labelledby="generic-rec-heading"
    >
      <div
        className="relative overflow-hidden
                   rounded-2xl border-2
                   border-success-200
                   bg-gradient-to-br
                   from-success-50
                   to-primary-50
                   p-6 shadow-md"
      >
        {/* Background accent */}

        <div
          aria-hidden="true"
          className="absolute right-0 top-0
                     h-32 w-32 translate-x-1/2
                     -translate-y-1/2 rounded-full
                     bg-success-100 opacity-50"
        />


        {/* Header badges */}

        <div
          className="relative mb-4
                     flex flex-wrap gap-2"
        >
          <Badge
            variant="success"
            size="md"
            icon={
              <span aria-hidden="true">
                ⭐
              </span>
            }
          >
            Recommended Alternative
          </Badge>

          <Badge
            variant="info"
            size="md"
            icon={
              <span aria-hidden="true">
                🏥
              </span>
            }
          >
            PM Jan Aushadhi
          </Badge>

          <Badge
            variant="success"
            size="md"
          >
            {savingsPct}% Cheaper
          </Badge>
        </div>


        <div
          className="relative grid
                     grid-cols-1 gap-6
                     sm:grid-cols-2"
        >
          {/* Medicine information */}

          <div className="flex flex-col gap-3">
            <div
              className="flex items-start gap-3"
            >
              <div
                className="flex h-12 w-12
                           shrink-0 items-center
                           justify-center rounded-xl
                           bg-success-100"
              >
                <MdMedication
                  size={26}
                  className="text-success-700"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2
                  id="generic-rec-heading"
                  className="text-base font-bold
                             text-slate-900"
                >
                  {name}
                </h2>

                <p
                  className="mt-0.5 text-xs
                             text-slate-500"
                >
                  {equivalentName}
                </p>

                <p
                  className="mt-0.5 text-[11px]
                             text-slate-400"
                >
                  {composition}
                </p>
              </div>
            </div>


            {/* Quality information */}

            <div
              className="flex flex-col gap-1.5"
            >
              {isCompositionMatch && (
                <div
                  className="flex items-center
                             gap-2 text-xs
                             text-success-700"
                >
                  <HiOutlineCheckCircle
                    size={14}
                    aria-hidden="true"
                  />

                  <span>
                    Same active composition as
                    branded medicine
                  </span>
                </div>
              )}

              {isQualityAssured && (
                <div
                  className="flex items-center
                             gap-2 text-xs
                             text-primary-700"
                >
                  <HiOutlineShieldCheck
                    size={14}
                    aria-hidden="true"
                  />

                  <span>
                    WHO-GMP quality assured
                  </span>
                </div>
              )}

              <div
                className="flex items-center gap-2
                           text-xs text-slate-500"
              >
                <HiOutlineCheckCircle
                  size={14}
                  aria-hidden="true"
                />

                <span>
                  Manufactured by: {manufacturer}
                </span>
              </div>
            </div>
          </div>


          {/* Price and buttons */}

          <div
            className="flex flex-col
                       justify-between gap-4"
          >
            <div
              className="rounded-xl border
                         border-success-200
                         bg-white p-4 text-center
                         shadow-sm"
            >
              <p
                className="mb-1 text-[11px]
                           font-semibold uppercase
                           tracking-wider
                           text-slate-400"
              >
                Jan Aushadhi Price
              </p>

              <p
                className="text-3xl font-extrabold
                           text-success-700"
              >
                ₹{price}
              </p>

              <p
                className="mt-0.5 text-xs
                           text-slate-400
                           line-through"
              >
                Brand: ₹{brandPrice}
              </p>

              <div
                className="mt-2 flex items-center
                           justify-center gap-1.5"
              >
                <Badge
                  variant="success"
                  size="sm"
                >
                  Save ₹{savings}
                  {' '}
                  ({savingsPct}% off)
                </Badge>
              </div>
            </div>


            {/* Action buttons */}

            <div className="flex flex-col gap-2">
              {pmbiCode ? (
                <Link
                  to={nearbyPageUrl}
                  className="flex items-center
                             justify-center gap-2
                             rounded-xl
                             bg-success-600
                             px-4 py-2.5
                             text-sm font-semibold
                             text-white
                             transition-colors
                             hover:bg-success-700
                             focus-visible:outline-none
                             focus-visible:ring-2
                             focus-visible:ring-success-500"
                  aria-label={
                    `Find ${name} at nearby pharmacies`
                  }
                >
                  Find at Nearby Pharmacy

                  <HiOutlineArrowRight
                    size={15}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed
                             items-center justify-center
                             rounded-xl bg-slate-300
                             px-4 py-2.5 text-sm
                             font-semibold text-white"
                >
                  Medicine code unavailable
                </button>
              )}

              <button
                type="button"
                className="flex items-center
                           justify-center gap-2
                           rounded-xl border
                           border-success-300
                           px-4 py-2.5 text-sm
                           font-medium
                           text-success-700
                           transition-colors
                           hover:bg-success-50
                           focus-visible:outline-none
                           focus-visible:ring-2
                           focus-visible:ring-success-500"
                aria-label={
                  `View details for ${name}`
                }
              >
                View Generic Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default GenericRecommendationSection