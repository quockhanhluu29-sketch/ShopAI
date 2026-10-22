module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@api': './src/api',
          '@components': './src/components',
          '@constants': './src/constants',
          '@contexts': './src/contexts',
          '@data': './src/data',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
    ['transform-inline-environment-variables', { include: ['APP_ENV', 'API_BASE_URL'] }],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin',
  ],
};
