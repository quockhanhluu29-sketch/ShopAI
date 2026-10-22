import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { fetchOrders } from '@services/orderApi';
import { formatCurrency } from '@utils/formatCurrency';
import type { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

const OrdersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const query = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
  const { colors } = useTheme();
  const orders = query.data ?? [];

  if (query.isLoading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1" style={styles.title}>Đơn hàng</Typography>
      {query.isError ? (
        <View style={[styles.notice, { borderColor: colors.border }]}>
          <Typography variant="small" color={COLORS.error}>Không thể đồng bộ đơn hàng với máy chủ.</Typography>
          <ShopButton title="Thử lại" variant="outline" onPress={() => void query.refetch()} style={styles.retry} />
        </View>
      ) : null}
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<Typography variant="body2" color={COLORS.textLight}>Chưa có đơn hàng nào.</Typography>}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} style={[styles.order, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Typography variant="body2" style={styles.orderId}>{item.id}</Typography>
              <Typography variant="small" color={item.status === 'PAID' ? COLORS.success : COLORS.secondary} style={styles.status}>{item.status}</Typography>
            </View>
            <Typography variant="body2" color={COLORS.textLight}>{item.items.length} sản phẩm · {new Date(item.createdAt).toLocaleDateString('vi-VN')}</Typography>
            <Typography variant="h3" style={styles.total}>{formatCurrency(item.total)}</Typography>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.padding, backgroundColor: COLORS.background },
  title: { marginBottom: 18 },
  list: { gap: 12, paddingBottom: 20 },
  emptyList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  order: { padding: 16, borderRadius: SIZES.radius, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { fontWeight: '700' },
  status: { fontWeight: '800' },
  total: { marginTop: 12 },
  notice: { padding: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, marginBottom: 12, gap: 8 },
  retry: { minWidth: 100, alignSelf: 'flex-start' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default OrdersScreen;
