import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface ChatMessageProps {
  text: string;
  isUser?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser = false }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, isUser ? styles.user : [styles.assistant, { backgroundColor: colors.surface }]]}>
      <Text style={[styles.text, { color: isUser ? '#FFFFFF' : colors.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  assistant: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#4338ca',
    alignSelf: 'flex-end',
  },
  text: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
});

export default ChatMessage;
