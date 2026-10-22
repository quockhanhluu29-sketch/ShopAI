import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@constants/theme';

const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Đang tải sản phẩm...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default Loading;
