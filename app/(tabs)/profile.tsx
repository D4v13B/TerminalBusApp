import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/presentation/components/Button';
import Card from '@/presentation/components/Card';
import { StatusBar } from 'expo-status-bar';
import { Bell, ChevronRight, CreditCard, CreditCard as Edit, Moon, Shield, Sun, User, Users } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      icon: Edit,
      title: 'Editar perfil',
      onPress: () => {},
    },
    {
      icon: CreditCard,
      title: 'Métodos de pago',
      subtitle: '2 métodos guardados',
      onPress: () => {},
    },
    {
      icon: Users,
      title: 'Pasajeros frecuentes',
      subtitle: '3 pasajeros',
      onPress: () => {},
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      onPress: () => {},
    },
    {
      icon: Shield,
      title: 'Seguridad',
      onPress: () => {},
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingTop: 50,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    profileSection: {
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      backgroundColor: theme.colors.primaryLight,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textInverse,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textInverse,
      opacity: 0.9,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    menuIcon: {
      marginRight: theme.spacing.md,
    },
    menuText: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    menuSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    themeText: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    themeTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    switch: {
      padding: theme.spacing.sm,
      backgroundColor: isDark ? theme.colors.primary : theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.full,
    },
    logoutButton: {
      marginTop: theme.spacing.lg,
    },
    verificationBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.sm,
    },
    verificationText: {
      fontSize: 12,
      color: theme.colors.textInverse,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <User size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.isVerified && (
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationText}>Verificado</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          {menuItems.map((item, index) => (
            <Pressable key={index} onPress={item.onPress}>
              <Card style={styles.menuItem}>
                <item.icon size={24} color={theme.colors.primary} style={styles.menuIcon} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <ChevronRight size={20} color={theme.colors.textTertiary} />
              </Card>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <Card style={styles.themeToggle}>
            {isDark ? (
              <Moon size={24} color={theme.colors.primary} />
            ) : (
              <Sun size={24} color={theme.colors.primary} />
            )}
            <View style={styles.themeText}>
              <Text style={styles.themeTitle}>
                {isDark ? 'Tema oscuro' : 'Tema claro'}
              </Text>
            </View>
            <Pressable style={styles.switch} onPress={toggleTheme}>
              {isDark ? (
                <Sun size={20} color={theme.colors.textInverse} />
              ) : (
                <Moon size={20} color={theme.colors.text} />
              )}
            </Pressable>
          </Card>
        </View>

        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
}