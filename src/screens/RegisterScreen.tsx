import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { registerAccount } from '@services/authService';
import { useTheme } from '@contexts/ThemeContext';

const RegisterScreen = ({ onLogin }: { onLogin: () => void }) => {
  const login = useAuthStore(state => state.login);
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (name.trim().length < 2 || !email.includes('@') || password.length < 6 || password !== confirmation) {
      setError('Kiểm tra họ tên, email và mật khẩu xác nhận.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await registerAccount(name.trim(), email.trim(), password);
      await login(response.accessToken, response.user);
    } catch {
      setError('Không thể tạo tài khoản. Email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Typography variant="small" color={COLORS.primary} style={styles.eyebrow}>SHOPAI / NEW MEMBER</Typography>
        <Typography variant="h1" style={styles.title}>Tạo tài khoản</Typography>
        <Typography variant="body2" color={COLORS.textLight} style={styles.subtitle}>Bắt đầu hành trình mua sắm thông minh.</Typography>
        <ShopInput label="Họ tên" placeholder="Nguyễn Văn A" value={name} onChangeText={setName} autoComplete="name" />
        <ShopInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <ShopInput label="Mật khẩu" placeholder="Ít nhất 6 ký tự" value={password} onChangeText={setPassword} secureTextEntry />
        <ShopInput label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" value={confirmation} onChangeText={setConfirmation} secureTextEntry />
        {error ? <Typography variant="small" color={COLORS.error} style={styles.error}>{error}</Typography> : null}
        <ShopButton title="Đăng ký ngay" onPress={() => void submit()} loading={loading} />
        <ShopButton title="Đã có tài khoản? Đăng nhập" variant="outline" onPress={onLogin} style={styles.login} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: SIZES.padding, paddingVertical: 32 },
  eyebrow: { fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 22 },
  error: { marginBottom: 12 },
  login: { marginTop: 10 },
});

export default RegisterScreen;
