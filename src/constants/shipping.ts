export const WAREHOUSE_COORDS = { latitude: 10.7769, longitude: 106.7009 };
export const DEFAULT_SHIPPING_FEE = 30000;

export const getDistanceKm = (
  latitude: number,
  longitude: number,
  targetLatitude: number,
  targetLongitude: number,
): number => {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = radians(targetLatitude - latitude);
  const longitudeDelta = radians(targetLongitude - longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(latitude)) *
      Math.cos(radians(targetLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const getShippingFee = (distanceKm: number): number =>
  distanceKm <= 5 ? DEFAULT_SHIPPING_FEE : DEFAULT_SHIPPING_FEE + Math.ceil(distanceKm - 5) * 3000;