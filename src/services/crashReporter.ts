import { API_BASE_URL, APP_ENV, ENABLE_CRASHLYTICS } from '@constants/env';

type CrashAttributes = Record<string, string>;

export const recordBreadcrumb = (message: string): void => {
  if (__DEV__ || !ENABLE_CRASHLYTICS) return;
  try {
    const firebaseApp = require('@react-native-firebase/app');
    if (firebaseApp.getApps().length === 0) return;
    require('@react-native-firebase/crashlytics').default().log(message);
  } catch {
    // Firebase configuration is optional in local development.
  }
};

export const recordNonFatal = (
  name: string,
  reason: unknown,
  attributes: CrashAttributes = {},
): void => {
  if (__DEV__ || !ENABLE_CRASHLYTICS) return;
  try {
    const firebaseApp = require('@react-native-firebase/app');
    if (firebaseApp.getApps().length === 0) return;
    const reporter = require('@react-native-firebase/crashlytics').default();
    reporter.setAttributes({ app_env: APP_ENV, api_base_url: API_BASE_URL, ...attributes });
    reporter.log(name);
    reporter.recordError(reason instanceof Error ? reason : new Error(String(reason)), name);
  } catch {
    // Missing Firebase app files must not affect shopping or checkout.
  }
};

export const triggerDevelopmentCrash = (): void => {
  if (!__DEV__) return;
  try {
    const firebaseApp = require('@react-native-firebase/app');
    if (firebaseApp.getApps().length > 0) {
      const reporter = require('@react-native-firebase/crashlytics').default();
      reporter.log('Development Crashlytics test triggered');
      reporter.setAttributes({ app_env: APP_ENV, test_mode: 'development' });
      reporter.crash();
      return;
    }
    console.warn('Crashlytics test skipped: Firebase is not configured in this build.');
  } catch (error) {
    console.warn('Crashlytics test could not start:', error);
  }
};
