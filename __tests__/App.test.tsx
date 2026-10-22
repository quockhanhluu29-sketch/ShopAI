/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../src/navigation/RootNavigator', () => {
  const ReactRuntime = require('react');
  const { Text, View } = require('react-native');
  return {
    RootNavigator: () => ReactRuntime.createElement(View, null, ReactRuntime.createElement(Text, null, 'ShopAI')),
  };
});

test('mounts the application root', async () => {
  const { getByText } = await render(<App />);
  expect(getByText('ShopAI')).toBeTruthy();
});
