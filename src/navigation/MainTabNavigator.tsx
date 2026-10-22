import React from 'react';
import { createBottomTabNavigator, type BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Compass, Package, ShoppingBag, UserRound } from 'lucide-react-native';

import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { useCartStore } from '@store/useCartStore';
import type { HomeStackParamList } from './HomeStackNavigator';
import { useTheme } from '@contexts/ThemeContext';

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const CartTab = ({ navigation }: BottomTabScreenProps<MainTabParamList, 'Cart'>) => (
  <CartScreen onCheckout={() => navigation.getParent()?.navigate('Checkout' as never)} />
);

const MainTabNavigator = () => {
  const totalQuantity = useCartStore(state => state.totalQuantity());
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { height: 62, paddingBottom: 7, paddingTop: 6, borderTopColor: colors.border, backgroundColor: colors.surface },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{
        title: 'Khám phá',
        tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
      }} />
      <Tab.Screen name="Cart" component={CartTab} options={{
        title: 'Giỏ hàng',
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
      }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{
        title: 'Đơn hàng',
        tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        title: 'Tài khoản',
        tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
      }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
