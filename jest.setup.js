const { jest } = require('@jest/globals');

jest.mock('expo-updates', () => ({
  __esModule: true,
  isEnabled: false,
  checkForUpdateAsync: jest.fn(async () => ({ isAvailable: false })),
  fetchUpdateAsync: jest.fn(async () => ({ isNew: false })),
  reloadAsync: jest.fn(async () => undefined),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const data = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async key => data.get(key) ?? null),
      setItem: jest.fn(async (key, value) => { data.set(key, value); }),
      removeItem: jest.fn(async key => { data.delete(key); }),
      clear: jest.fn(async () => { data.clear(); }),
      getAllKeys: jest.fn(async () => [...data.keys()]),
      multiGet: jest.fn(async keys => keys.map(key => [key, data.get(key) ?? null])),
      multiSet: jest.fn(async entries => { entries.forEach(([key, value]) => data.set(key, value)); }),
      multiRemove: jest.fn(async keys => { keys.forEach(key => data.delete(key)); }),
    },
  };
});

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(async () => true),
  resetGenericPassword: jest.fn(async () => true),
}));

jest.mock('react-native-biometrics', () =>
  jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn(async () => ({ available: true, biometryType: 'Biometrics' })),
    simplePrompt: jest.fn(async () => ({ success: true })),
  })),
);

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    requestAuthorization: jest.fn(success => success?.()),
    getCurrentPosition: jest.fn(success =>
      success({ coords: { latitude: 10.7, longitude: 106.6 }, timestamp: Date.now() }),
    ),
  },
}));

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Camera: (props: object) => React.createElement(View, props),
    useCameraDevice: () => ({ id: 'mock-back-camera', position: 'back' }),
    useCameraPermission: () => ({ hasPermission: true, requestPermission: jest.fn(async () => true) }),
    useCodeScanner: (scanner: unknown) => scanner,
  };
});

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
