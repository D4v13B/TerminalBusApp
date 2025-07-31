import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  helper,
  required = false,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.error,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: error ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.border),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    input: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
    },
    error: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    helper: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textTertiary}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}