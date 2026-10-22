import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CheckoutScreen from '@screens/CheckoutScreen';
import MainTabNavigator from '@navigation/MainTabNavigator';
import OrderDetailScreen from '@screens/OrderDetailScreen';
import ReduxCartDemoScreen from '@screens/ReduxCartDemoScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  OrderDetail: { orderId: string };
  ReduxDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Xác nhận đơn hàng', presentation: 'modal' }} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Chi tiết hóa đơn' }} />
    <Stack.Screen name="ReduxDemo" component={ReduxCartDemoScreen} options={{ title: 'Redux Toolkit Lab' }} />
  </Stack.Navigator>
);

export default RootStackNavigator;