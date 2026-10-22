import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MapPin, RefreshCw } from 'lucide-react-native';

import { COLORS, SIZES } from '@constants/theme';
import { DEFAULT_SHIPPING_FEE, getDistanceKm, getShippingFee, WAREHOUSE_COORDS } from '@constants/shipping';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { formatCurrency } from '@utils/formatCurrency';
import Typography from './ui/Typography';
import { useTheme } from '@contexts/ThemeContext';

const LocationBadge = () => {
  const { colors } = useTheme();
  const { coordinates, loading, error, refresh } = useCurrentLocation();
  const distance = coordinates
    ? getDistanceKm(
        coordinates.latitude,
        coordinates.longitude,
        WAREHOUSE_COORDS.latitude,
        WAREHOUSE_COORDS.longitude,
      )
    : null;
  const shippingFee = distance === null ? DEFAULT_SHIPPING_FEE : getShippingFee(distance);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <MapPin color={COLORS.primary} size={18} />
      <View style={styles.copy}>
        <Typography variant="small" color={COLORS.textLight}>
          {loading ? 'Đang lấy vị trí' : error ? 'Phí giao hàng tạm tính' : distance === null ? 'Ước tính giao hàng' : `Cách kho ${distance.toFixed(1)} km`}
        </Typography>
        <Typography variant="body2" style={styles.fee}>{formatCurrency(shippingFee)}</Typography>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel="Làm mới vị trí" onPress={() => void refresh()} hitSlop={8}>
          <RefreshCw color={COLORS.textLight} size={16} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copy: { flex: 1 },
  fee: { marginTop: 2, fontWeight: '700' },
});

export default LocationBadge;
