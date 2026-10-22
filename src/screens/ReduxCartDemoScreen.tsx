import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { useCartStore } from '@store/useCartStore';
import { addItem, removeItem } from '@store/redux/cartSlice';
import type { ReduxDispatch, ReduxRootState } from '@store/redux/store';
import { useTheme } from '@contexts/ThemeContext';

const demoProduct = {
  id: 'rtk-demo',
  name: 'Tai nghe Demo Redux',
  category: 'Điện tử',
  price: 350000,
  rating: 4.5,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  description: 'Sản phẩm dùng riêng cho bài tập Redux Toolkit.',
  inventory: 8,
};

const ReduxCartDemoScreen = () => {
  const items = useSelector((state: ReduxRootState) => state.cartRedux.items);
  const dispatch = useDispatch<ReduxDispatch>();
  const productionCartCount = useCartStore(state => state.totalQuantity());
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h2">Redux Toolkit Lab</Typography>
      <Typography variant="small" color="#71817E" style={styles.note}>
        Giỏ production Zustand: {productionCartCount} món
      </Typography>
      <ShopButton title="Thêm sản phẩm vào Redux" onPress={() => dispatch(addItem(demoProduct))} />
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Typography variant="body2">Redux cart trống</Typography>}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <Typography variant="body2" style={styles.item}>{item.name} x {item.quantity}</Typography>
            <ShopButton title="Xóa" variant="outline" onPress={() => dispatch(removeItem(item.id))} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  note: { marginBottom: 4 },
  list: { gap: 10, paddingTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  item: { flex: 1 },
});

export default ReduxCartDemoScreen;
