import axios from 'axios'

const OCR_API_BASE_URL =
  import.meta.env.VITE_OCR_API_BASE_URL ||
  'http://127.0.0.1:8001/api/v1'

const ocrClient = axios.create({
  baseURL: OCR_API_BASE_URL,

  // PaddleOCR + TrOCR can take over one minute on CPU.
  timeout: 180000,

  headers: {
    Accept: 'application/json',
  },
})

const getErrorMessage = (error) => {
  if (
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ETIMEDOUT'
  ) {
    return (
      'The prescription scan exceeded three minutes. ' +
      'Check the OCR terminal and try again.'
    )
  }

  if (!error?.response) {
    return (
      'The OCR service could not be reached. ' +
      'Make sure it is running on port 8001.'
    )
  }

  const detail = error.response?.data?.detail

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || String(item))
      .join(', ')
  }

  return (
    error.response?.data?.message ||
    `OCR request failed with status ${error.response.status}.`
  )
}

const scanPrescription = async (file) => {
  if (!(file instanceof File)) {
    throw new Error(
      'Please select a valid prescription image.',
    )
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await ocrClient.post(
      '/ocr/prescription',
      formData,
      {
        timeout: 180000,
      },
    )

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

const checkHealth = async () => {
  try {
    const response = await ocrClient.get('/health', {
      timeout: 10000,
    })

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

const ocrService = {
  scanPrescription,
  checkHealth,
}

export default ocrService