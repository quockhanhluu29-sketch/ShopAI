import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Camera, Moon, Search, SlidersHorizontal, Sun } from 'lucide-react-native';

import LocationBadge from '@components/LocationBadge';
import ProductCard from '@components/ProductCard';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { useDebounce } from '@hooks/useDebounce';
import { useProducts } from '@hooks/useProducts';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import { useTheme } from '@contexts/ThemeContext';
import { triggerDevelopmentCrash } from '@services/crashReporter';
import { APP_VERSION } from '@constants/env';

const CATEGORIES = ['Tất cả', 'Thời trang', 'Điện tử', 'Nhà cửa', 'Sức khỏe', 'Nội thất'];
type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigation>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const { products, loading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [filterOpen, setFilterOpen] = useState(false);
  const [underMillion, setUnderMillion] = useState(false);
  const deferredSearch = useDebounce(search.trim().toLocaleLowerCase('vi-VN'));
  const filteredProducts = products.filter(product => {
    const matchesSearch = `${product.name} ${product.category}`.toLocaleLowerCase('vi-VN').includes(deferredSearch);
    const matchesCategory = category === 'Tất cả' || product.category === category;
    return matchesSearch && matchesCategory && (!underMillion || product.price <= 1000000);
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Typography variant="h1" color={colors.text}>{t('home.title')}</Typography>
            <Typography variant="small" color={colors.textLight}>{t('home.subtitle')}</Typography>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel={isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối'} onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {isDark ? <Sun color={COLORS.secondary} size={19} /> : <Moon color={COLORS.primary} size={19} />}
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Quét mã sản phẩm" onPress={() => navigation.navigate('Scanner')} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Camera color={COLORS.primary} size={19} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Mở trợ lý ShopAI" onPress={() => navigation.navigate('AIChat')} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Bot color={COLORS.primary} size={19} />
            </Pressable>
          </View>
        </View>
        <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.textLight} size={18} />
          <ShopInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('home.search')}
            accessibilityLabel={t('home.search')}
            containerStyle={styles.searchContainer}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Bộ lọc" onPress={() => setFilterOpen(true)} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SlidersHorizontal color={colors.text} size={18} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {CATEGORIES.map(item => {
            const active = category === item;
            return (
              <Pressable key={item} onPress={() => setCategory(item)} style={[styles.categoryChip, { backgroundColor: colors.surface, borderColor: colors.border }, active && styles.categoryActive]}>
                <Typography variant="small" color={active ? COLORS.surface : colors.textLight} style={styles.categoryLabel}>{item}</Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlashList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
        )}
        contentContainerStyle={styles.grid}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={COLORS.primary} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=85' }} style={styles.bannerImage} />
              <View style={styles.bannerCopy}>
                <Typography variant="small" color="#F0C96B" style={styles.bannerEyebrow}>SHOPAI SELECT</Typography>
                <Typography variant="h2" color="#FFFFFF">Công nghệ cho{ '\n' }nhịp sống mới</Typography>
              </View>
            </View>
            <LocationBadge />
            <View style={styles.sectionHeading}>
              <Typography variant="h3">{t('home.featured')}</Typography>
              <Typography variant="small" color={COLORS.textLight}>{filteredProducts.length} món</Typography>
            </View>
            {isError ? (
              <View style={styles.stateBox}>
                <Typography variant="body2" color={COLORS.error}>Không tải được sản phẩm. Kiểm tra kết nối máy chủ.</Typography>
                <ShopButton title="Thử tải lại" variant="outline" onPress={() => void refetch()} style={styles.retry} />
              </View>
            ) : null}
            {loading ? <ActivityIndicator color={COLORS.primary} style={styles.loading} /> : null}
          </>
        }
        ListEmptyComponent={
          !loading && !isError ? (
            <View style={styles.stateBox}>
              <Typography variant="body2" color={COLORS.textLight}>Không có sản phẩm phù hợp.</Typography>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View>
            {isFetchingNextPage ? <ActivityIndicator color={COLORS.primary} style={styles.loading} /> : null}
            {__DEV__ ? (
              <Pressable onLongPress={triggerDevelopmentCrash} delayLongPress={2000} style={styles.devFooter}>
                <Typography variant="small" color={COLORS.textLight}>ShopAI {APP_VERSION} · giữ để test crash</Typography>
              </Pressable>
            ) : null}
          </View>
        }
      />

      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setFilterOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.background }]} onPress={event => event.stopPropagation()}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Typography variant="h2">Bộ lọc</Typography>
            <Pressable style={styles.filterChoice} onPress={() => setUnderMillion(value => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: underMillion }}>
              <View style={[styles.checkbox, underMillion && styles.checkboxActive]} />
              <Typography variant="body2">Giá dưới 1.000.000 đ</Typography>
            </Pressable>
            <ShopButton title="Áp dụng bộ lọc" onPress={() => setFilterOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingTop: 12, paddingHorizontal: SIZES.padding },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, marginTop: 18, paddingLeft: 14, paddingRight: 6, borderRadius: 14, borderWidth: 1 },
  searchContainer: { flex: 1, marginBottom: 0 },
  searchInput: { minHeight: 48, borderWidth: 0, paddingHorizontal: 0, backgroundColor: 'transparent' },
  categories: { gap: 8, paddingVertical: 16 },
  categoryChip: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 9, borderWidth: 1 },
  categoryActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryLabel: { fontWeight: '700' },
  grid: { paddingHorizontal: SIZES.padding, paddingBottom: 26 },
  banner: { height: 168, overflow: 'hidden', borderRadius: SIZES.radius, marginBottom: 14, backgroundColor: '#173C38' },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerCopy: { flex: 1, justifyContent: 'center', padding: 18, backgroundColor: 'rgba(15, 38, 35, 0.47)' },
  bannerEyebrow: { fontWeight: '800', marginBottom: 6 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 },
  stateBox: { paddingVertical: 18, alignItems: 'center', gap: 12 },
  retry: { minWidth: 150 },
  loading: { paddingVertical: 20 },
  devFooter: { alignItems: 'center', paddingVertical: 12 },
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: COLORS.overlay },
  sheet: { padding: 22, paddingBottom: 34, borderTopLeftRadius: 22, borderTopRightRadius: 22, gap: 18 },
  sheetHandle: { width: 38, height: 4, alignSelf: 'center', borderRadius: 2 },
  filterChoice: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: COLORS.textLight },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
});

export default HomeScreen;
