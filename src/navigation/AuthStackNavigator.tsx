import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';

export type AuthStackParamList = { Login: undefined; Register: undefined };

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login">
        {({ navigation }) => <LoginScreen onRegister={() => navigation.navigate('Register')} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {({ navigation }) => <RegisterScreen onLogin={() => navigation.navigate('Login')} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;