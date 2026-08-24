import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineCloudArrowUp,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineExclamationTriangle,
  HiOutlinePhoto,
  HiOutlineXMark,
} from 'react-icons/hi2'

import ocrService from '../../services/ocrService'


const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024


function formatPrice(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return '—'
  }

  return `₹${number.toFixed(2)}`
}


function formatConfidence(value) {
  const confidence = Number(value)

  if (!Number.isFinite(confidence)) {
    return '—'
  }

  return `${(confidence * 100).toFixed(1)}%`
}


function PrescriptionUploadPage() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])


  const validateAndSelectFile = (file) => {
    setError('')
    setScanResult(null)
    setSelectedCandidate(null)

    if (!file) {
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(
        'Only JPG, JPEG, PNG and WEBP images are allowed.',
      )
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        'Prescription image must not exceed 10 MB.',
      )
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }


  const handleFileInput = (event) => {
    const file = event.target.files?.[0]
    validateAndSelectFile(file)
  }


  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    validateAndSelectFile(file)
  }


  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }


  const handleDragLeave = () => {
    setIsDragging(false)
  }


  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(null)
    setPreviewUrl('')
    setScanResult(null)
    setSelectedCandidate(null)
    setError('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }


  const handleScan = async () => {
    if (!selectedFile) {
      setError(
        'Please select a prescription image first.',
      )
      return
    }

    setIsScanning(true)
    setError('')
    setScanResult(null)
    setSelectedCandidate(null)

    try {
      const response =
        await ocrService.scanPrescription(selectedFile)

      setScanResult(response)

      const detectedMatches =
        response?.medicine_matching?.matches ?? []

      const allCandidates = detectedMatches.flatMap(
        (match) => match.candidates ?? [],
      )

      /*
       * Automatically select the first candidate.
       * The customer can select a different candidate
       * before confirming.
       */
      if (allCandidates.length > 0) {
        setSelectedCandidate(allCandidates[0])
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to scan the prescription.',
      )
    } finally {
      setIsScanning(false)
    }
  }


  const handleConfirmMedicine = () => {
    const firstDetectedCandidate =
      scanResult?.medicine_matching?.matches?.[0]
        ?.candidates?.[0]

    const confirmedCandidate =
      selectedCandidate || firstDetectedCandidate

    if (!confirmedCandidate?.medicine_id) {
      setError(
        'Please select a medicine candidate first.',
      )
      return
    }

    navigate(
      `/medicine/${confirmedCandidate.medicine_id}`,
    )
  }


  const matchingData = scanResult?.medicine_matching

  const matches = matchingData?.matches ?? []

  const unmatchedLines =
    matchingData?.unmatched_lines ?? []

  const extractedText =
    scanResult?.result?.full_text ?? ''

  const hasMatchedMedicines = matches.length > 0
  const hasUnmatchedMedicines = unmatchedLines.length > 0

  const noMedicineDetected =
    scanResult &&
    !hasMatchedMedicines &&
    !hasUnmatchedMedicines


  return (
    <article className="mx-auto w-full max-w-6xl">
      {/* Page heading */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <HiOutlineDocumentMagnifyingGlass size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Prescription Search
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload a prescription to identify possible
              medicines and Jan Aushadhi alternatives.
            </p>
          </div>
        </div>
      </header>


      {/* Medical safety warning */}
      <section className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <HiOutlineExclamationTriangle
          className="mt-0.5 shrink-0 text-amber-600"
          size={21}
        />

        <div>
          <p className="text-sm font-semibold text-amber-900">
            Medicine confirmation is required
          </p>

          <p className="mt-1 text-sm text-amber-700">
            OCR may misread handwriting. Always confirm the
            extracted medicine with your doctor or pharmacist.
          </p>
        </div>
      </section>


      {/* Error message */}
      {error && (
        <section className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <HiOutlineExclamationTriangle
            className="mt-0.5 shrink-0 text-red-600"
            size={20}
          />

          <p className="flex-1 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700"
            aria-label="Close error"
          >
            <HiOutlineXMark size={20} />
          </button>
        </section>
      )}


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upload panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Upload Prescription
          </h2>

          {!selectedFile ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  inputRef.current?.click()
                }
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={[
                'flex min-h-72 cursor-pointer flex-col',
                'items-center justify-center rounded-xl',
                'border-2 border-dashed p-8 text-center',
                'transition-colors',
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50',
              ].join(' ')}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <HiOutlineCloudArrowUp size={32} />
              </div>

              <p className="font-semibold text-slate-800">
                Choose or drop prescription image
              </p>

              <p className="mt-2 text-sm text-slate-500">
                JPG, PNG or WEBP · Maximum 10 MB
              </p>

              <span className="mt-5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white">
                Choose Image
              </span>
            </div>
          ) : (
            <div>
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Selected prescription preview"
                  className="h-72 w-full object-contain"
                />

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove selected prescription"
                >
                  <HiOutlineXMark size={20} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <HiOutlinePhoto
                  className="shrink-0 text-primary-600"
                  size={21}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(
                      selectedFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{' '}
                    MB
                  </p>
                </div>
              </div>
            </div>
          )}


          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />


          <button
            type="button"
            onClick={handleScan}
            disabled={!selectedFile || isScanning}
            className={[
              'mt-5 flex w-full items-center justify-center',
              'gap-2 rounded-xl px-5 py-3',
              'text-sm font-semibold text-white',
              'transition-colors',
              !selectedFile || isScanning
                ? 'cursor-not-allowed bg-primary-300'
                : 'bg-primary-600 hover:bg-primary-700',
            ].join(' ')}
          >
            {isScanning ? (
              <>
                <HiOutlineArrowPath
                  className="animate-spin"
                  size={20}
                />

                Scanning Prescription…
              </>
            ) : (
              <>
                <HiOutlineDocumentMagnifyingGlass
                  size={20}
                />

                Scan Prescription
              </>
            )}
          </button>


          {isScanning && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Handwritten prescriptions may take a little
              longer to process.
            </p>
          )}
        </section>


        {/* Results panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Identified Medicines
          </h2>


          {/* No scan yet */}
          {!scanResult && !isScanning && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center">
              <HiOutlineDocumentMagnifyingGlass
                className="mb-4 text-slate-300"
                size={48}
              />

              <p className="font-medium text-slate-600">
                No prescription scanned
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Identified medicines will appear here.
              </p>
            </div>
          )}


          {/* Loading */}
          {isScanning && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-slate-50">
              <HiOutlineArrowPath
                className="animate-spin text-primary-600"
                size={40}
              />

              <p className="mt-4 font-medium text-slate-700">
                Reading prescription…
              </p>
            </div>
          )}


          {/* No medicine-like text detected */}
          {noMedicineDetected && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
              <HiOutlineExclamationTriangle
                className="mb-4 text-amber-500"
                size={44}
              />

              <p className="font-semibold text-amber-900">
                No medicine identified
              </p>

              <p className="mt-2 text-sm text-amber-700">
                Try a clearer image or ask a pharmacist to
                verify the prescription.
              </p>
            </div>
          )}


          {/* Successfully matched medicines */}
          {scanResult && hasMatchedMedicines && (
            <div className="space-y-5">
              {matches.map((match, matchIndex) => (
                <div
                  key={`${match.ocr_text}-${matchIndex}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      OCR detected
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {match.ocr_text}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      OCR confidence:{' '}
                      {formatConfidence(
                        match.ocr_confidence,
                      )}
                    </p>
                  </div>


                  <div className="space-y-3">
                    {(match.candidates ?? []).map(
                      (candidate) => {
                        const isSelected =
                          selectedCandidate?.medicine_id ===
                          candidate.medicine_id

                        return (
                          <button
                            type="button"
                            key={
                              candidate.medicine_id ||
                              candidate.pmbi_code
                            }
                            onClick={() =>
                              setSelectedCandidate(candidate)
                            }
                            className={[
                              'w-full rounded-xl border p-4',
                              'text-left transition-colors',
                              isSelected
                                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100'
                                : 'border-slate-200 hover:border-primary-300',
                            ].join(' ')}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {candidate.generic_name ||
                                    'Unknown medicine'}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  Brand:{' '}
                                  {candidate.brand_name ||
                                    'Not available'}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {candidate.composition ||
                                    'Composition not available'}
                                </p>
                              </div>

                              {isSelected && (
                                <HiOutlineCheckCircle
                                  className="shrink-0 text-primary-600"
                                  size={24}
                                />
                              )}
                            </div>


                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                              <div className="rounded-lg bg-green-50 p-2">
                                <p className="text-xs text-green-600">
                                  Jan Aushadhi
                                </p>

                                <p className="font-bold text-green-700">
                                  {formatPrice(
                                    candidate.jan_aushadhi_mrp,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-lg bg-slate-100 p-2">
                                <p className="text-xs text-slate-500">
                                  Brand price
                                </p>

                                <p className="font-bold text-slate-700">
                                  {formatPrice(
                                    candidate.branded_avg_mrp,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-lg bg-blue-50 p-2">
                                <p className="text-xs text-blue-600">
                                  Savings
                                </p>

                                <p className="font-bold text-blue-700">
                                  {candidate.saving_pct ?? 0}%
                                </p>
                              </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                              Match score:{' '}
                              {candidate.match_score ?? 0}%
                            </p>
                          </button>
                        )
                      },
                    )}
                  </div>
                </div>
              ))}


              <button
                type="button"
                onClick={handleConfirmMedicine}
                disabled={!selectedCandidate}
                className={[
                  'flex w-full items-center justify-center',
                  'gap-2 rounded-xl px-5 py-3',
                  'font-semibold text-white',
                  selectedCandidate
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'cursor-not-allowed bg-green-300',
                ].join(' ')}
              >
                <HiOutlineCheckCircle size={21} />

                Confirm and View Medicine
              </button>
            </div>
          )}


          {/* Recognized but unavailable medicines */}
          {scanResult && hasUnmatchedMedicines && (
            <div
              className={[
                hasMatchedMedicines ? 'mt-5' : '',
                'rounded-xl border border-amber-300',
                'bg-amber-50 p-4',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <HiOutlineExclamationTriangle
                  className="mt-0.5 shrink-0 text-amber-600"
                  size={22}
                />

                <div>
                  <h3 className="font-semibold text-amber-900">
                    Recognized but unavailable in catalogue
                  </h3>

                  <p className="mt-1 text-sm text-amber-700">
                    OCR recognized the following possible
                    medicine names, but they were not found in
                    the current medicine catalogue.
                  </p>
                </div>
              </div>


              <div className="mt-4 space-y-3">
                {unmatchedLines.map((item, index) => (
                  <div
                    key={`${item.ocr_text}-${index}`}
                    className="rounded-lg border border-amber-200 bg-white p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.ocr_text}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          OCR confidence:{' '}
                          {formatConfidence(
                            item.ocr_confidence,
                          )}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Manual review
                      </span>
                    </div>
                  </div>
                ))}
              </div>


              <p className="mt-4 text-xs font-medium text-red-600">
                Do not purchase or consume these medicines
                based only on OCR results. Ask a doctor or
                pharmacist to confirm them.
              </p>
            </div>
          )}
        </section>
      </div>


      {/* Extracted prescription text */}
      {scanResult && extractedText && (
        <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer font-semibold text-slate-800">
            View all extracted prescription text
          </summary>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {extractedText}
          </pre>
        </details>
      )}
    </article>
  )
}


export default PrescriptionUploadPage