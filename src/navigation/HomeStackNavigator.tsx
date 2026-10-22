import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AIChatScreen from '@screens/AIChatScreen';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import ScannerScreen from '@screens/ScannerScreen';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  Scanner: undefined;
  AIChat: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />
    <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Quét mã sản phẩm', headerShown: false }} />
    <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: 'Trợ lý ShopAI' }} />
  </Stack.Navigator>
);

export default HomeStackNavigator;