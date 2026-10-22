import React, { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COLORS, SIZES } from '@constants/theme';
import Typography from '@components/ui/Typography';

type Variant = 'primary' | 'secondary' | 'outline';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const ShopButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ShopButtonProps) => {
  const isDisabled = disabled || loading;
  const textColor = variant === 'outline' ? COLORS.primary : COLORS.surface;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography variant="body2" color={textColor} style={styles.label}>
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.82 },
  label: { fontWeight: '700' },
});

export default memo(ShopButton);