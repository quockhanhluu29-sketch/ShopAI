export const COLORS = {
  primary: '#087E78',
  secondary: '#E6B34A',
  background: '#F4F6F4',
  surface: '#FFFFFF',
  text: '#192B2A',
  textLight: '#71817E',
  border: '#DDE5E1',
  error: '#C44436',
  success: '#287A4B',
  overlay: 'rgba(18, 35, 33, 0.58)',
} as const;

export const SIZES = {
  padding: 18,
  radius: 14,
  h1: 30,
  h2: 23,
  h3: 18,
  body1: 16,
  body2: 14,
  small: 12,
} as const;

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '800' as const },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const },
  h3: { fontSize: SIZES.h3, fontWeight: '700' as const },
  body1: { fontSize: SIZES.body1, fontWeight: '400' as const },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const },
  small: { fontSize: SIZES.small, fontWeight: '400' as const },
} as const;