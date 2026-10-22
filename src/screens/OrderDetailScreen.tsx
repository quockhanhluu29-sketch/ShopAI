import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { fetchOrderById, payOrder } from '@services/orderApi';
import { formatCurrency } from '@utils/formatCurrency';
import type { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen = ({ route }: Props) => {
  const queryClient = useQueryClient();
  const orderId = route.params.orderId;
  const { colors } = useTheme();
  const orderQuery = useQuery({ queryKey: ['order', orderId], queryFn: () => fetchOrderById(orderId) });
  const payMutation = useMutation({
    mutationFn: () => payOrder(orderId),
    onSuccess: async order => {
      await Promise.all([
        queryClient.setQueryData(['order', orderId], order),
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
      ]);
    },
  });

  if (orderQuery.isLoading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
  if (!orderQuery.data) return <View style={styles.center}><Typography variant="body2">Không tìm thấy đơn hàng.</Typography></View>;

  const order = orderQuery.data;
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="small" color={COLORS.textLight}>MÃ ĐƠN</Typography>
      <Typography variant="h2" style={styles.id}>{order.id}</Typography>
      <View style={[styles.statusLine, { borderColor: colors.border }]}>
        <Typography variant="body2" color={order.status === 'PAID' ? COLORS.success : COLORS.secondary} style={styles.status}>{order.status}</Typography>
        <Typography variant="small" color={COLORS.textLight}>{new Date(order.createdAt).toLocaleString('vi-VN')}</Typography>
      </View>
      <Typography variant="h3" style={styles.section}>Sản phẩm</Typography>
      {order.items.map(item => (
        <View key={item.id} style={[styles.item, { borderColor: colors.border }]}>
          <Typography variant="body2" style={styles.itemName}>{item.name} × {item.quantity}</Typography>
          <Typography variant="body2">{formatCurrency(item.price * item.quantity)}</Typography>
        </View>
      ))}
      <View style={styles.total}>
        <Typography variant="body2" color={COLORS.textLight}>Tổng thanh toán</Typography>
        <Typography variant="h2" color={COLORS.primary}>{formatCurrency(order.total)}</Typography>
      </View>
      {payMutation.isError ? <Typography variant="small" color={COLORS.error} style={styles.error}>Thanh toán thất bại. Đơn vẫn ở trạng thái chờ.</Typography> : null}
      {order.status === 'PENDING' ? (
        <ShopButton title="Thanh toán giả lập" onPress={() => payMutation.mutate()} loading={payMutation.isPending} style={styles.pay} />
      ) : <Typography variant="body2" color={COLORS.success} style={styles.paid}>Đơn hàng đã thanh toán.</Typography>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: SIZES.padding, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  id: { marginTop: 4 },
  statusLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingBottom: 18, borderBottomWidth: 1, borderColor: COLORS.border },
  status: { fontWeight: '800' },
  section: { marginTop: 22, marginBottom: 10 },
  item: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: COLORS.border },
  itemName: { flex: 1 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  pay: { marginTop: 22 },
  error: { marginTop: 16 },
  paid: { marginTop: 22, textAlign: 'center', fontWeight: '700' },
});

export default OrderDetailScreen;
