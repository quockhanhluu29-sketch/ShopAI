import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface InputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  accessibilityLabel?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, accessibilityLabel }) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={accessibilityLabel ?? placeholder}
      style={styles.input}
      placeholderTextColor="#9ca3af"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
});

export default Input;
