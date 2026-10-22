import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@store/useAuthStore';

import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';
import { COLORS } from '@constants/theme';
import { loginWithPassword } from '@services/authService';
import { useTheme } from '@contexts/ThemeContext';

const LoginScreen = ({ onRegister }: { onRegister: () => void }) => {
  const login = useAuthStore(state => state.login);
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.includes('@') || password.length < 6) {
      setError('Nhập email hợp lệ và mật khẩu tối thiểu 6 ký tự.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await loginWithPassword(email.trim(), password);
      await login(response.accessToken, response.user);
    } catch {
      setError('Đăng nhập chưa thành công. Kiểm tra tài khoản hoặc máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}><Typography variant="h2" color={COLORS.surface}>S</Typography></View>
        <Typography variant="small" color={COLORS.primary} style={styles.eyebrow}>SHOPAI / MEMBER ACCESS</Typography>
        <Typography variant="h1" style={styles.title}>Mua sắm{ '\n' }có chọn lọc.</Typography>
        <Typography variant="body2" color={COLORS.textLight} style={styles.subtitle}>Đăng nhập để tiếp tục khám phá.</Typography>
        <ShopInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <ShopInput label="Mật khẩu" placeholder="Ít nhất 6 ký tự" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />
        {error ? <Typography variant="small" color={COLORS.error} style={styles.error}>{error}</Typography> : null}
        <ShopButton title="Đăng nhập ngay" onPress={() => void submit()} loading={loading} />
        <ShopButton title="Tạo tài khoản mới" variant="outline" onPress={onRegister} style={styles.register} />
        <Typography variant="small" color={COLORS.textLight} style={styles.footer}>Mật khẩu được xác thực an toàn qua ShopAI API.</Typography>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 26, paddingTop: 44 },
  brandMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  eyebrow: { fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  title: { lineHeight: 37, marginBottom: 10 },
  subtitle: { marginBottom: 28 },
  error: { marginBottom: 14 },
  register: { marginTop: 10 },
  footer: { marginTop: 26, textAlign: 'center' },
});

export default LoginScreen;
