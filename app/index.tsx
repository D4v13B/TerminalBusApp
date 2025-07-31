import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
