import ReactNativeBiometrics from 'react-native-biometrics';

const biometrics = new ReactNativeBiometrics();

export const authenticateBiometric = async (): Promise<boolean> => {
  const sensor = await biometrics.isSensorAvailable();
  if (!sensor.available) return true;

  const result = await biometrics.simplePrompt({ promptMessage: 'Xác thực để mở ShopAI' });
  return result.success;
};