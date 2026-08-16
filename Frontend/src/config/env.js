/**
 * Environment Configuration
 *
 * Single source of truth for environment variables.
 * All components and services import from here — never from
 * import.meta.env directly — so that env key changes only
 * need to be updated in one place.
 */

const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Smart Medicine System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}

export default env
