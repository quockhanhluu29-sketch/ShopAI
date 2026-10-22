import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { fetchProductById } from '@services/productApi';
import { useCartStore } from '@store/useCartStore';
import { formatCurrency } from '@utils/formatCurrency';
import type { Product } from '../types/product.schema';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route }: Props) => {
  const queryClient = useQueryClient();
  const addItem = useCartStore(state => state.addItem);
  const { colors } = useTheme();
  const productId = route.params.productId;
  const cachedProduct = queryClient
    .getQueryData<{ pages: Array<{ items: Product[] }> }>(['products'])
    ?.pages.flatMap(page => page.items)
    .find(product => product.id === productId);
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    placeholderData: cachedProduct,
  });

  if (productQuery.isPending && !productQuery.data) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Typography variant="h3">Không tải được sản phẩm</Typography>
        <Typography variant="body2" color={COLORS.textLight} style={styles.error}>{productQuery.error?.message}</Typography>
        <ShopButton title="Thử lại" onPress={() => void productQuery.refetch()} />
      </View>
    );
  }

  const product = productQuery.data;
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: product.image }} style={[styles.image, { backgroundColor: colors.surface }]} />
      <Typography variant="small" color={COLORS.primary} style={styles.category}>{product.category}</Typography>
      <Typography variant="h1">{product.name}</Typography>
      <Typography variant="h2" color={COLORS.primary} style={styles.price}>{formatCurrency(product.price)}</Typography>
      <Typography variant="body2" color={COLORS.textLight} style={styles.rating}>★ {product.rating.toFixed(1)} · {product.inventory} còn hàng</Typography>
      <Typography variant="body1" style={styles.description}>{product.description}</Typography>
      <ShopButton title="Thêm vào giỏ hàng" onPress={() => addItem(product)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: SIZES.padding, paddingBottom: 32, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  image: { width: '100%', height: 300, borderRadius: SIZES.radius, backgroundColor: COLORS.border },
  category: { marginTop: 18, marginBottom: 6, fontWeight: '700' },
  price: { marginTop: 10 },
  rating: { marginTop: 8 },
  description: { marginTop: 18, marginBottom: 24, lineHeight: 24 },
  error: { textAlign: 'center' },
});

export default ProductDetailScreen;
