import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { useCartStore } from '@store/useCartStore';
import { formatCurrency } from '@utils/formatCurrency';
import CartItem from '../components/CartItem';
import { useTheme } from '@contexts/ThemeContext';

interface CartScreenProps {
  onCheckout: () => void;
}

const CartScreen: React.FC<CartScreenProps> = ({ onCheckout }) => {
  const cartItems = useCartStore(state => state.items);
  const setQuantity = useCartStore(state => state.setQuantity);
  const subtotal = useCartStore(state => state.totalPrice());
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1" style={styles.title}>Giỏ hàng</Typography>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        contentContainerStyle={cartItems.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Typography variant="h2">Giỏ hàng đang trống</Typography>
            <Typography variant="body2" color={COLORS.textLight}>Sản phẩm bạn chọn sẽ hiện ở đây.</Typography>
          </View>
        }
        renderItem={({ item }) => (
          <CartItem
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
            onIncrease={() => setQuantity(item.id, item.quantity + 1)}
            onDecrease={() => setQuantity(item.id, item.quantity - 1)}
          />
        )}
      />
      {cartItems.length > 0 ? (
        <View style={[styles.checkoutArea, { borderColor: colors.border }]}>
          <View style={styles.summary}>
            <Typography variant="body2" color={COLORS.textLight}>Tổng cộng</Typography>
            <Typography variant="h3" color={COLORS.primary}>{formatCurrency(subtotal)}</Typography>
          </View>
          <ShopButton title="Tiến hành thanh toán" onPress={onCheckout} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 18,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  list: { gap: 12, paddingBottom: 16 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 8 },
  checkoutArea: { borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 8 },
});

export default CartScreen;
