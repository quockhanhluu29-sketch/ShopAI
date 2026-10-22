import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import ChatMessage from '@components/ChatMessage';
import { AI_GREETING, AI_SUGGESTIONS } from '@constants/aiPrompt';
import { COLORS, SIZES } from '@constants/theme';
import { generateAiReply, type ChatTurn } from '@api/aiService';
import Typography from '@components/ui/Typography';
import { useTheme } from '@contexts/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  error?: boolean;
}

const toFriendlyError = (): string => 'Trợ lý đang bận hoặc mất kết nối. Bạn có thể thử lại.';

const AIChatScreen = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', role: 'model', text: AI_GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const lastSentAt = useRef(0);
  const listRef = useRef<FlatList<Message>>(null);

  const requestReply = async (question: string, history: Message[]) => {
    setIsTyping(true);
    try {
      const turns: ChatTurn[] = history
        .filter(message => message.id !== 'greeting' && !message.error)
        .map(message => ({ role: message.role, text: message.text }));
      const reply = await generateAiReply(question, turns);
      setMessages(current => [...current, { id: `reply-${Date.now()}`, role: 'model', text: reply }]);
    } catch {
      setMessages(current => [...current, { id: `error-${Date.now()}`, role: 'model', text: toFriendlyError(), error: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const send = async (suggestion?: string) => {
    const question = (suggestion ?? input).trim();
    if (!question || isTyping || Date.now() - lastSentAt.current < 1000) return;
    lastSentAt.current = Date.now();
    setLastQuestion(question);
    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', text: question };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    await requestReply(question, nextMessages);
  };

  const retry = async () => {
    if (!lastQuestion || isTyping) return;
    const cleanMessages = messages.filter(message => !message.error);
    setMessages(cleanMessages);
    await requestReply(lastQuestion, cleanMessages);
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={[styles.status, { borderColor: colors.border }]}>
        <View style={[styles.onlineDot, isTyping && styles.typingDot]} />
        <Typography variant="small" color={COLORS.textLight}>{isTyping ? 'Đang soạn tin...' : 'Nhân viên tư vấn công nghệ'}</Typography>
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View>
            <ChatMessage text={item.text} isUser={item.role === 'user'} />
            {item.error ? (
              <Pressable accessibilityRole="button" onPress={() => void retry()} style={styles.retry}>
                <Typography variant="small" color={COLORS.primary}>Thử gửi lại</Typography>
              </Pressable>
            ) : null}
          </View>
        )}
        ListFooterComponent={
          <>
            {messages.length === 1 ? (
              <View style={styles.suggestions}>
                <Typography variant="small" color={COLORS.textLight} style={styles.suggestionLabel}>Gợi ý cho bạn</Typography>
                {AI_SUGGESTIONS.map(question => (
                  <Pressable key={question} disabled={isTyping} onPress={() => void send(question)} style={[styles.suggestion, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                    <Typography variant="small" color={COLORS.primary}>{question}</Typography>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {isTyping ? (
              <View style={styles.typing}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Typography variant="small" color={COLORS.textLight}>Trợ lý đang trả lời</Typography>
              </View>
            ) : null}
          </>
        }
      />
      <View style={[styles.composer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Hỏi về sản phẩm công nghệ..."
          placeholderTextColor={colors.textLight}
          maxLength={500}
          multiline
          editable={!isTyping}
          returnKeyType="send"
          onSubmitEditing={() => void send()}
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          accessibilityLabel="Tin nhắn gửi trợ lý ShopAI"
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Gửi tin nhắn" disabled={!input.trim() || isTyping} onPress={() => void send()} style={[styles.send, (!input.trim() || isTyping) && styles.sendDisabled]}>
          <Typography variant="small" color={COLORS.surface} style={styles.sendLabel}>Gửi</Typography>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  status: { height: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: SIZES.padding, borderBottomWidth: 1, borderColor: COLORS.border },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  typingDot: { backgroundColor: COLORS.secondary },
  messages: { flexGrow: 1, padding: SIZES.padding, paddingBottom: 12 },
  suggestions: { marginTop: 10, gap: 8 },
  suggestionLabel: { fontWeight: '700', marginBottom: 2 },
  suggestion: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.surface },
  typing: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  retry: { alignSelf: 'flex-start', marginTop: -4, marginBottom: 12, marginLeft: 12, paddingVertical: 6 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, minHeight: 44, maxHeight: 104, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.background, color: COLORS.text, fontSize: SIZES.body2 },
  send: { height: 42, minWidth: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 10 },
  sendDisabled: { opacity: 0.45 },
  sendLabel: { fontWeight: '800' },
});

export default AIChatScreen;
