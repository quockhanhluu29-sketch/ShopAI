import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { createOrder } from '@services/orderApi';
import { useCartStore } from '@store/useCartStore';
import { formatCurrency } from '@utils/formatCurrency';
import type { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const CheckoutScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const total = useCartStore(state => state.totalPrice());
  const { colors } = useTheme();

  const mutation = useMutation({
    mutationFn: () => createOrder(items, total),
    onSuccess: async () => {
      clearCart();
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (mutation.isSuccess) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Typography variant="h1" color={COLORS.success}>Đặt hàng thành công</Typography>
        <Typography variant="body2" color={COLORS.textLight}>Mã đơn: {mutation.data.id}</Typography>
        <Typography variant="body2" color={COLORS.textLight}>Trạng thái: {mutation.data.status}</Typography>
        <ShopButton title="Xem đơn hàng" onPress={() => navigation.replace('OrderDetail', { orderId: mutation.data.id })} style={styles.button} />
        <ShopButton title="Tiếp tục mua sắm" variant="outline" onPress={() => navigation.popToTop()} style={styles.button} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h2">Xác nhận đơn hàng</Typography>
      {items.map(item => (
        <View key={item.id} style={[styles.line, { borderBottomColor: colors.border }]}>
          <Typography variant="body2" numberOfLines={2} style={styles.name}>{item.name} × {item.quantity}</Typography>
          <Typography variant="body2">{formatCurrency(item.price * item.quantity)}</Typography>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Typography variant="body2" color={COLORS.textLight}>Tổng thanh toán</Typography>
        <Typography variant="h3" color={COLORS.primary}>{formatCurrency(total)}</Typography>
      </View>
      {mutation.isError ? (
        <Typography variant="small" color={COLORS.error} style={styles.error}>
          Đặt hàng thất bại. Giỏ hàng vẫn được giữ để bạn thử lại.
        </Typography>
      ) : null}
      {mutation.isPending ? (
        <ActivityIndicator color={COLORS.primary} style={styles.button} />
      ) : (
        <ShopButton title="Xác nhận đặt hàng" disabled={!items.length} onPress={() => mutation.mutate()} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.padding, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: COLORS.background },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  name: { flex: 1 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 },
  error: { marginTop: 18, textAlign: 'center' },
  button: { width: '100%', marginTop: 22 },
});

export default CheckoutScreen;
