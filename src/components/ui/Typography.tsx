import React, { memo } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { COLORS, FONTS } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';

type Variant = keyof typeof FONTS;

interface TypographyProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const Typography = ({
  children,
  variant = 'body1',
  color,
  style,
  numberOfLines,
}: TypographyProps) => {
  const { colors } = useTheme();
  const requestedColor = color ?? COLORS.text;
  const resolvedColor = requestedColor === COLORS.text
    ? colors.text
    : requestedColor === COLORS.textLight
      ? colors.textLight
      : requestedColor;

  return (
    <Text numberOfLines={numberOfLines} style={[FONTS[variant], { color: resolvedColor }, style]}>
      {children}
    </Text>
  );
};

export default memo(Typography);
