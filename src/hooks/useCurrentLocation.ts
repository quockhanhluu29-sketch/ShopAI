import Geolocation, { type GeolocationResponse } from '@react-native-community/geolocation';
import { useCallback, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const requestPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return new Promise<boolean>(resolve =>
      Geolocation.requestAuthorization(() => resolve(true), () => resolve(false)),
    );
  }

  const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  const result = await PermissionsAndroid.request(permission, {
    title: 'ShopAI cần quyền vị trí',
    message: 'Dùng vị trí để ước tính phí giao hàng.',
    buttonPositive: 'Cho phép',
    buttonNegative: 'Để sau',
  });

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert('Cần quyền vị trí', 'Bật quyền vị trí trong Cài đặt để tính phí giao hàng.', [
      { text: 'Để sau', style: 'cancel' },
      { text: 'Mở Cài đặt', onPress: () => void Linking.openSettings() },
    ]);
  }

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const useCurrentLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!(await requestPermission())) throw new Error('Chưa cấp quyền vị trí');
      await new Promise<void>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            resolve();
          },
          reason => reject(new Error(reason.message)),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
        );
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không lấy được vị trí');
    } finally {
      setLoading(false);
    }
  }, []);

  return { coordinates, loading, error, refresh };
};