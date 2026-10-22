import { Vibration } from 'react-native';

export const hapticSuccess = (): void => {
  try {
    Vibration.vibrate(35);
  } catch {
    // Haptics are optional and must not interrupt the primary action.
  }
};

export const hapticError = (): void => {
  try {
    Vibration.vibrate([0, 45, 50, 45]);
  } catch {
    // Haptics are optional and must not interrupt the primary action.
  }
};