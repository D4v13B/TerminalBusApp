import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    const sizeStyles = {
      sm: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
      md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
      lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.interactiveDisabled : theme.colors.primary,
        ...theme.shadows.sm,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.interactiveDisabled : theme.colors.secondary,
        ...theme.shadows.sm,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.interactiveDisabled : theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    const sizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: theme.colors.textInverse },
      secondary: { color: theme.colors.textInverse },
      outline: { color: disabled ? theme.colors.interactiveDisabled : theme.colors.primary },
      ghost: { color: disabled ? theme.colors.interactiveDisabled : theme.colors.primary },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? theme.colors.textInverse : theme.colors.primary}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}