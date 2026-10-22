import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ThemeProvider } from '../../contexts/ThemeContext';
import ShopButton from '../ShopButton';

describe('ShopButton', () => {
  it('shows its title and calls onPress', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <ThemeProvider>
        <ShopButton title="Đăng nhập ngay" onPress={onPress} />
      </ThemeProvider>,
    );

    await fireEvent.press(getByRole('button', { name: 'Đăng nhập ngay' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <ThemeProvider>
        <ShopButton title="Đang xử lý" onPress={onPress} disabled />
      </ThemeProvider>,
    );

    await fireEvent.press(getByRole('button', { name: 'Đang xử lý' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
