import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    };

    const variantStyles = {
      default: {
        ...theme.shadows.sm,
      },
      elevated: {
        ...theme.shadows.lg,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    };

    return [baseStyle, variantStyles[variant]];
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}