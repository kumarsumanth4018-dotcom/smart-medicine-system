/**
 * Environment Configuration
 *
 * Single source of truth for environment variables.
 */

const env = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8002/api/v1',

  OCR_API_URL:
    import.meta.env.VITE_OCR_API_URL ||
    'http://127.0.0.1:8001/api/v1',

  APP_NAME:
    import.meta.env.VITE_APP_NAME ||
    'Smart Medicine System',

  APP_VERSION:
    import.meta.env.VITE_APP_VERSION ||
    '1.0.0',

  APP_ENV:
    import.meta.env.VITE_APP_ENV ||
    'development',

  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}

export default env