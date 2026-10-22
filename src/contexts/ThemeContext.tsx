import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { StatusBar } from 'react-native';

import { COLORS } from '@constants/theme';

type ThemeColors = { [Key in keyof typeof COLORS]: string };

const DARK_COLORS: ThemeColors = {
  ...COLORS,
  background: '#000000',
  surface: '#121212',
  text: '#F5F5F5',
  textLight: '#A3A3A3',
  border: '#292929',
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const value = useMemo(
    () => ({
      colors: isDark ? DARK_COLORS : COLORS,
      isDark,
      toggleTheme: () => setIsDark(current => !current),
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
