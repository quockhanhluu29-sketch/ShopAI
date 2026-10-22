import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { COLORS, SIZES } from '@constants/theme';
import { formatCurrency } from '@utils/formatCurrency';
import Typography from './ui/Typography';
import { useTheme } from '@contexts/ThemeContext';

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  image: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ name, price, quantity, image, onIncrease, onDecrease }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.item, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Typography variant="body2" numberOfLines={2} style={styles.name}>{name}</Typography>
        <Typography variant="body2" color={COLORS.primary} style={styles.price}>{formatCurrency(price)}</Typography>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel="Giảm số lượng" onPress={onDecrease} style={[styles.stepper, { borderColor: colors.border }]}>
            <Typography variant="body1">-</Typography>
          </Pressable>
          <Typography variant="body2" style={styles.quantity}>{quantity}</Typography>
          <Pressable accessibilityRole="button" accessibilityLabel="Tăng số lượng" onPress={onIncrease} style={[styles.stepper, { borderColor: colors.border }]}>
            <Typography variant="body1">+</Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: '700',
  },
  price: {
    marginTop: 4,
    fontWeight: '600',
  },
  quantity: {
    marginTop: 4,
    color: COLORS.textLight,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  stepper: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
});

export default CartItem;
