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
  async scanPrescription(file) {
    if (!file) {
      throw new Error('Please select a prescription image.')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      `${OCR_API_URL}/ocr/prescription`,
      {
        method: 'POST',
        body: formData,
      },
    )

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