import React, { memo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { COLORS, SIZES } from '@constants/theme';
import Typography from './Typography';
import { useTheme } from '@contexts/ThemeContext';

interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const ShopInput = ({ label, error, containerStyle, style, ...rest }: ShopInputProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Typography variant="body2" style={styles.label}>{label}</Typography> : null}
      <TextInput
        placeholderTextColor={colors.textLight}
        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }, error ? styles.inputError : null, style]}
        accessibilityLabel={label ?? rest.placeholder}
        {...rest}
      />
      {error ? <Typography variant="small" color={COLORS.error}>{error}</Typography> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: SIZES.padding },
  label: { marginBottom: 6 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: SIZES.body1,
  },
  inputError: { borderColor: COLORS.error },
});

export default memo(ShopInput);
