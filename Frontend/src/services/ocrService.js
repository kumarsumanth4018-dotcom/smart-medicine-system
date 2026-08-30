/**
 * OCR Service
 *
 * Communicates with the separate FastAPI OCR service
 * running on port 8001.
 */

const OCR_API_URL =
  import.meta.env.VITE_OCR_API_URL ||
  'http://127.0.0.1:8001/api/v1'


const ocrService = {
  async scanPrescription(file, { timeoutMs = 180000 } = {}) {
    if (!file) {
      throw new Error('Please select a prescription image.')
    }

    const formData = new FormData()
    formData.append('file', file)

    // Handwriting recognition can genuinely take a while (a heavier,
    // more accurate model + wide beam search per unmatched line, all
    // on CPU) — this timeout exists so the UI can show a clear,
    // honest message instead of spinning forever with no feedback,
    // not because 3 minutes is always "too long" for this to take.
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeoutMs,
    )

    let response
    try {
      response = await fetch(
        `${OCR_API_URL}/ocr/prescription`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        },
      )
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(
          'Scanning is taking longer than expected. The OCR service '
          + 'may still be processing, or may not be reachable — check '
          + 'that it is running, then try again.',
        )
      }
      throw new Error(
        'Could not reach the OCR service. Make sure it is running.',
      )
    } finally {
      clearTimeout(timeoutId)
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.detail ||
        'Unable to scan the prescription.',
      )
    }

    return data
  },
}


export default ocrService