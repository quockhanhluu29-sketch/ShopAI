import React, { useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ScanLine } from 'lucide-react-native';

import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { COLORS } from '@constants/theme';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import { hapticSuccess } from '@utils/haptics';
import { useTheme } from '@contexts/ThemeContext';

type ScannerNavigation = NativeStackNavigationProp<HomeStackParamList, 'Scanner'>;

const ScannerScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<ScannerNavigation>();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const scanLocked = useRef(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128'],
    onCodeScanned: codes => {
      if (scanLocked.current) return;
      const value = codes.find(code => code.value)?.value;
      if (!value) return;
      scanLocked.current = true;
      hapticSuccess();
      setMessage(`Đã đọc mã ${value}`);
      navigation.navigate('ProductDetail', { productId: value });
    },
  });

  const askPermission = async () => {
    setRequesting(true);
    try {
      const granted = await requestPermission();
      if (!granted) setMessage('Cần quyền camera để quét mã sản phẩm.');
    } catch {
      setMessage('Không thể yêu cầu quyền camera. Hãy kiểm tra Cài đặt.');
    } finally {
      setRequesting(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={[styles.permission, { backgroundColor: colors.background }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={() => navigation.goBack()} style={styles.back}>
        <ArrowLeft color={colors.text} />
        </Pressable>
        <ScanLine color={COLORS.primary} size={44} />
        <Typography variant="h2" style={styles.permissionTitle}>Quét mã sản phẩm</Typography>
        <Typography variant="body2" color={COLORS.textLight} style={styles.permissionCopy}>ShopAI chỉ dùng camera khi bạn mở chức năng quét mã.</Typography>
        {message ? <Typography variant="small" color={COLORS.error} style={styles.permissionCopy}>{message}</Typography> : null}
        <ShopButton title="Cho phép camera" onPress={() => void askPermission()} loading={requesting} />
        <ShopButton title="Mở Cài đặt" variant="outline" onPress={() => void Linking.openSettings()} style={styles.settings} />
      </View>
    );
  }

  if (!device) return <View style={styles.permission}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.cameraScreen}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={isFocused && hasPermission} codeScanner={codeScanner} />
      <View style={styles.scrimTop} />
      <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={() => navigation.goBack()} style={styles.cameraBack}>
        <ArrowLeft color="#FFFFFF" />
      </Pressable>
      <View style={styles.scanFrame} />
      <Typography variant="body2" color="#FFFFFF" style={styles.scanHint}>Đưa mã QR hoặc mã vạch vào khung</Typography>
      {message ? <Typography variant="small" color="#FFFFFF" style={styles.scanHint}>{message}</Typography> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  permission: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLORS.background, gap: 16 },
  back: { position: 'absolute', top: 18, left: 18, width: 42, height: 42, justifyContent: 'center' },
  permissionTitle: { marginTop: 8 },
  permissionCopy: { lineHeight: 21 },
  settings: { marginTop: -4 },
  cameraScreen: { flex: 1, backgroundColor: '#06110F', alignItems: 'center', justifyContent: 'center' },
  scrimTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 90, backgroundColor: 'rgba(0,0,0,0.28)' },
  cameraBack: { position: 'absolute', top: 26, left: 20, zIndex: 2, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 18, backgroundColor: 'transparent' },
  scanHint: { marginTop: 24, textAlign: 'center', paddingHorizontal: 24 },
});

export default ScannerScreen;
