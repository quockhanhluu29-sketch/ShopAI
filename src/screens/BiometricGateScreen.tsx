import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Fingerprint } from 'lucide-react-native';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS } from '@constants/theme';
import { authenticateBiometric } from '@services/biometricService';
import { useAuthStore } from '@store/useAuthStore';
import { useTheme } from '@contexts/ThemeContext';

const BiometricGateScreen = () => {
  const unlock = useAuthStore(state => state.unlock);
  const logout = useAuthStore(state => state.logout);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setLoading(true);
    setError(null);
    try {
      if (await authenticateBiometric()) unlock();
      else setError('Xác thực chưa thành công. Thử lại hoặc đăng nhập lại.');
    } catch {
      setError('Không thể xác thực trên thiết bị này. Đăng nhập lại bằng mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.icon, { backgroundColor: colors.surface, borderColor: colors.border }]}><Fingerprint color={colors.primary} size={34} /></View>
      <Typography variant="small" color={COLORS.primary} style={styles.eyebrow}>SHOPAI / PROTECTED</Typography>
      <Typography variant="h1" style={styles.title}>Chào mừng{ '\n' }trở lại.</Typography>
      <Typography variant="body2" color={COLORS.textLight} style={styles.description}>Xác thực để bảo vệ tài khoản và đơn hàng của bạn.</Typography>
      {error ? <Typography variant="small" color={COLORS.error} style={styles.error}>{error}</Typography> : null}
      <ShopButton title="Mở khóa bằng sinh trắc học" onPress={() => void open()} loading={loading} />
      <ShopButton title="Đăng nhập bằng mật khẩu" variant="outline" onPress={() => void logout()} style={styles.secondary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 26, backgroundColor: COLORS.background },
  icon: { width: 66, height: 66, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  eyebrow: { fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  title: { lineHeight: 38 },
  description: { marginTop: 10, marginBottom: 24 },
  error: { marginBottom: 14 },
  secondary: { marginTop: 10 },
});

export default BiometricGateScreen;
