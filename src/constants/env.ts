import { Platform } from 'react-native';

declare const process: { env: { APP_ENV?: string; API_BASE_URL?: string } };

export type AppEnv = 'development' | 'staging' | 'production';

const configuredEnvironment = process.env.APP_ENV;
const validEnvironments: AppEnv[] = ['development', 'staging', 'production'];
export const APP_ENV: AppEnv = validEnvironments.includes(configuredEnvironment as AppEnv)
  ? (configuredEnvironment as AppEnv)
  : __DEV__
    ? 'development'
    : 'production';

const DEVELOPMENT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const API_URLS: Record<AppEnv, string> = {
  development: DEVELOPMENT_API_URL,
  staging: 'https://staging-api.shopai.example',
  production: 'https://api.shopai.example',
};

export const API_BASE_URL: string = process.env.API_BASE_URL || API_URLS[APP_ENV];
export const ENABLE_CRASHLYTICS = APP_ENV !== 'development';
export const ENABLE_OTA_UPDATE = APP_ENV !== 'development';
export const APP_VERSION = '1.0.0';
