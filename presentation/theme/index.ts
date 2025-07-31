export const lightTheme = {
  colors: {
    // Primary - Turquesa
    primary: '#14B8A6',
    primaryLight: '#5EEAD4',
    primaryDark: '#0F766E',
    
    // Secondary
    secondary: '#0891B2',
    secondaryLight: '#67E8F9',
    secondaryDark: '#155E75',
    
    // Accent
    accent: '#F59E0B',
    accentLight: '#FDE68A',
    accentDark: '#D97706',
    
    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutrals
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Text
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Interactive
    interactive: '#14B8A6',
    interactiveHover: '#0F766E',
    interactivePressed: '#0D9488',
    interactiveDisabled: '#CBD5E1',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    modalBackground: 'rgba(0, 0, 0, 0.6)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Primary stays the same for brand consistency
    primary: '#14B8A6',
    primaryLight: '#5EEAD4',
    primaryDark: '#0F766E',
    
    // Backgrounds
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    border: '#475569',
    borderLight: '#64748B',
    
    // Text
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textInverse: '#1E293B',
    
    // Interactive
    interactive: '#14B8A6',
    interactiveHover: '#5EEAD4',
    interactivePressed: '#0F766E',
    interactiveDisabled: '#475569',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    modalBackground: 'rgba(0, 0, 0, 0.8)',
  },
};

export type Theme = typeof lightTheme;