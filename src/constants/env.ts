declare const process: { env: { APP_ENV?: string; API_BASE_URL?: string } };

export type AppEnv = 'development' | 'staging' | 'production';

const configuredEnvironment = process.env.APP_ENV;
const validEnvironments: AppEnv[] = ['development', 'staging', 'production'];
export const APP_ENV: AppEnv = validEnvironments.includes(configuredEnvironment as AppEnv)
  ? (configuredEnvironment as AppEnv)
  : __DEV__
    ? 'development'
    : 'production';

// Use the deployed API by default so local Android runs and EAS builds can
// authenticate without requiring a separate local backend.
const DEPLOYED_API_URL = 'https://shopai-backend-kjii.onrender.com';

const API_URLS: Record<AppEnv, string> = {
  development: DEPLOYED_API_URL,
  staging: DEPLOYED_API_URL,
  production: DEPLOYED_API_URL,
};

export const API_BASE_URL: string = process.env.API_BASE_URL || API_URLS[APP_ENV];
export const ENABLE_CRASHLYTICS = APP_ENV !== 'development';
export const ENABLE_OTA_UPDATE = APP_ENV !== 'development';
export const APP_VERSION = '1.0.0';
