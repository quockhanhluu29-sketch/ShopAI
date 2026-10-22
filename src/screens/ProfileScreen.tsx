import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n/index';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { APP_VERSION } from '@constants/env';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import type { MainTabParamList } from '@navigation/MainTabNavigator';
import type { RootStackParamList } from '@navigation/RootStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

const ProfileScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1">{t('account.title')}</Typography>
      <View style={[styles.profile, { backgroundColor: colors.surface }]}>
        <Typography variant="h3">{user?.name ?? 'Khách hàng'}</Typography>
        <Typography variant="body2" color={COLORS.textLight}>{user?.email ?? 'Chưa đăng nhập'}</Typography>
      </View>
      <Typography variant="h3" style={styles.sectionTitle}>Cài đặt và công cụ</Typography>
      <ShopButton
        title={t('account.language')}
        variant="outline"
        onPress={() => void i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
        style={styles.action}
      />
      <ShopButton title="Hỏi trợ lý ShopAI" variant="outline" onPress={() => navigation.navigate('HomeTab', { screen: 'AIChat' })} style={styles.action} />
      <ShopButton title="Bài thực hành Redux Toolkit" variant="outline" onPress={() => navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('ReduxDemo')} style={styles.action} />
      <ShopButton title="Đăng xuất" variant="secondary" onPress={() => void logout()} style={styles.action} />
      <Typography variant="small" color={COLORS.textLight} style={styles.version}>ShopAI {APP_VERSION}</Typography>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: SIZES.padding, backgroundColor: COLORS.background },
  profile: { backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 18, marginTop: 20 },
  sectionTitle: { marginTop: 28, marginBottom: 12 },
  action: { marginTop: 10 },
  version: { marginTop: 28, textAlign: 'center' },
});

export default ProfileScreen;
