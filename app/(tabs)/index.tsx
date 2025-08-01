import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/presentation/components/Card';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Clock, MapPin, Search, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const popularRoutes = [
    { id: '1', origin: 'Ciudad de Panamá', destination: 'David', price: 15, duration: '5h 30m' },
    { id: '2', origin: 'Colón', destination: 'Santiago', price: 12, duration: '3h 45m' },
    { id: '3', origin: 'Chitré', destination: 'Las Tablas', price: 8, duration: '1h 15m' },
  ];

  const recentTrips = [
    { id: '1', destination: 'David', date: '2024-01-15', status: 'Completado' },
    { id: '2', destination: 'Santiago', date: '2024-01-10', status: 'Completado' },
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
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textInverse,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
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
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    quickActions: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    actionCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.lg,
      marginHorizontal: 5,
    },
    actionIcon: {
      marginBottom: theme.spacing.sm,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
    },
    routeCard: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    routeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    routePath: {
      flex: 1,
    },
    cityText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    arrowText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginVertical: theme.spacing.xs,
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    routeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    infoText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    tripCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    tripInfo: {
      flex: 1,
    },
    tripDestination: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    tripDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.success,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>
          ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}!
        </Text>
        <Text style={styles.subtitle}>
          ¿Listo para tu próximo viaje?
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <ScrollView horizontal={true} style={styles.quickActions}>
            <Pressable onPress={() => router.push('/(tabs)/search')}>
              <Card style={styles.actionCard}>
                <Search size={32} color={theme.colors.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Buscar Rutas</Text>
              </Card>
            </Pressable>
            
            <Pressable onPress={() => router.push('/(tabs)/tickets')}>
              <Card style={styles.actionCard}>
                <Clock size={32} color={theme.colors.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Mis Boletos</Text>
              </Card>
            </Pressable>
            
            <Pressable>
              <Card style={styles.actionCard}>
                <MapPin size={32} color={theme.colors.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Terminales</Text>
              </Card>
            </Pressable>
          </ScrollView>
        </View>

        {/* Popular Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rutas Populares</Text>
          {popularRoutes.map((route) => (
            <Pressable key={route.id} onPress={() => router.push('/(tabs)/search')}>
              <Card style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routePath}>
                    <Text style={styles.cityText}>{route.origin}</Text>
                    <Text style={styles.arrowText}>↓</Text>
                    <Text style={styles.cityText}>{route.destination}</Text>
                  </View>
                  <Text style={styles.priceText}>${route.price}</Text>
                </View>
                <View style={styles.routeInfo}>
                  <View style={styles.infoItem}>
                    <Clock size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.infoText}>{route.duration}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Star size={16} color={theme.colors.accent} />
                    <Text style={styles.infoText}>4.8</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Viajes Recientes</Text>
            {recentTrips.map((trip) => (
              <Card key={trip.id} style={styles.tripCard}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                </View>
                <Text style={styles.statusText}>{trip.status}</Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}