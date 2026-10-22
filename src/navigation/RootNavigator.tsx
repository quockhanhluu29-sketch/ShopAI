import React, { useEffect, type ReactNode } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, type LinkingOptions, type Theme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';

import AuthStackNavigator from '@navigation/AuthStackNavigator';
import RootStackNavigator, { type RootStackParamList } from '@navigation/RootStackNavigator';
import BiometricGateScreen from '@screens/BiometricGateScreen';
import { ThemeProvider } from '@contexts/ThemeContext';
import queryClient from '@api/queryClient';
import { reduxStore } from '@store/redux/store';
import { useAuthStore } from '@store/useAuthStore';
import { useAppLock } from '@hooks/useAppLock';
import { recordBreadcrumb } from '@services/crashReporter';
import { useTheme } from '@contexts/ThemeContext';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['shopai://'],
  config: {
    screens: {
      MainTabs: { screens: { HomeTab: { screens: { ProductDetail: 'product/:productId' } } } },
      Checkout: 'checkout',
      OrderDetail: 'order/:orderId',
    },
  },
};

const ThemedNavigationContainer = ({ children }: { children: ReactNode }) => {
  const { colors, isDark } = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
  };

  return <NavigationContainer linking={linking} theme={navigationTheme}>{children}</NavigationContainer>;
};

const HydrationScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
};

export const RootNavigator = () => {
  const isHydrated = useAuthStore(state => state.isHydrated);
  const token = useAuthStore(state => state.token);
  const isUnlocked = useAuthStore(state => state.isUnlocked);
  useAppLock();

  useEffect(() => {
    recordBreadcrumb('ShopAI app started');
    void useAuthStore.getState().hydrate().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={reduxStore}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {!isHydrated ? (
              <HydrationScreen />
            ) : token && !isUnlocked ? (
              <BiometricGateScreen />
            ) : (
              <ThemedNavigationContainer>
                {token ? <RootStackNavigator /> : <AuthStackNavigator />}
              </ThemedNavigationContainer>
            )}
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default RootNavigator;
