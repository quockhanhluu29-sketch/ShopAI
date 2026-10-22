import React, { memo, useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { COLORS, SIZES } from '@constants/theme';
import { formatCurrency } from '@utils/formatCurrency';
import { useCartStore } from '@store/useCartStore';
import type { Product } from '../types/product.schema';
import ShopButton from './ShopButton';
import Typography from './ui/Typography';
import { useTheme } from '@contexts/ThemeContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const opacity = useSharedValue(0);
  const addItem = useCartStore(state => state.addItem);
  const { colors } = useTheme();
  const fadeIn = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.surface }, fadeIn]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Xem ${product.name}`} onPress={onPress}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Typography variant="small" color={COLORS.primary} style={styles.category}>
              {product.category}
            </Typography>
            <Typography variant="small" color={COLORS.secondary} style={styles.rating}>
              ★ {product.rating.toFixed(1)}
            </Typography>
          </View>

          <Typography variant="h3" numberOfLines={2} style={styles.name}>
            {product.name}
          </Typography>
          <Typography variant="small" color={COLORS.textLight} numberOfLines={2}>
            {product.description}
          </Typography>

          <View style={styles.footer}>
            <Typography variant="body2" color={COLORS.primary} style={styles.price}>
              {formatCurrency(product.price)}
            </Typography>
            <Typography variant="small" color={COLORS.textLight}>
              {product.inventory} còn
            </Typography>
          </View>
        </View>
      </Pressable>
      <ShopButton
        title="Thêm vào giỏ"
        variant="outline"
        onPress={() => addItem(product)}
        style={styles.button}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  rating: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 12,
  },
  name: {
    marginTop: 8,
  },
  description: {
    marginTop: 6,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  button: {
    minHeight: 38,
    marginTop: 12,
  },
});

export default memo(ProductCard);
