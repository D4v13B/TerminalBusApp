import { useTheme } from '@/contexts/ThemeContext';
import { Ruta } from '@/core/entities/Ruta';
import { getRutas } from '@/infrastructure/rutas/getRutas';
import Card from '@/presentation/components/Card';
import Input from '@/presentation/components/Input';
import ParadasCard from '@/presentation/search/components/ParadasCard';
import { StatusBar } from 'expo-status-bar';
import { ArrowRightLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: '1',
  });

  const mockResults = [
    {
      id: '1',
      company: 'Express Panamá',
      departureTime: '08:00',
      arrivalTime: '13:30',
      duration: '5h 30m',
      price: 15,
      availableSeats: 12,
      busType: 'Express',
      amenities: ['WiFi', 'AC', 'Baño'],
    },
    {
      id: '2',
      company: 'Buses Costarricenses',
      departureTime: '14:00',
      arrivalTime: '19:45',
      duration: '5h 45m',
      price: 12,
      availableSeats: 8,
      busType: 'Económico',
      amenities: ['AC', 'Baño'],
    },
    {
      id: '3',
      company: 'TransRápido',
      departureTime: '20:00',
      arrivalTime: '01:15',
      duration: '5h 15m',
      price: 18,
      availableSeats: 20,
      busType: 'Premium',
      amenities: ['WiFi', 'AC', 'Baño', 'Asientos reclinables'],
    },
  ];

  const handleSearch = () => {
    // Mock search - in real app, this would call an API
    console.log('Searching with:', searchData);
  };

  const swapCities = () => {
    setSearchData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 50,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    searchCard: {
      marginBottom: theme.spacing.xl,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    swapButton: {
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
    },
    resultCard: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    busType: {
      fontSize: 12,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    timeInfo: {
      alignItems: 'center',
    },
    timeText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    durationContainer: {
      alignItems: 'center',
    },
    durationText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    priceText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    seatsText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    amenitiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    amenityTag: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    amenityText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    selectButton: {
      marginTop: theme.spacing.sm,
    },
  });

  const [rutas, setRutas] = useState<Ruta[]>([]);

  useEffect(() => {
    const fetchRutas = async () => {
      const rutas = await getRutas();

      if (rutas) {
        setRutas(rutas);
      }
    };

    fetchRutas();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Buscar Rutas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.searchCard}>
          <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="Origen"
                value={searchData.origin}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, origin: value }))
                }
                placeholder="Ciudad de origen"
              />
            </View>
            <Pressable style={styles.swapButton} onPress={swapCities}>
              <ArrowRightLeft size={20} color={theme.colors.textInverse} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Input
                label="Destino"
                value={searchData.destination}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, destination: value }))
                }
                placeholder="Ciudad de destino"
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <View style={{ flex: 2 }}>
              <Input
                label="Fecha de salida"
                value={searchData.departureDate}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, departureDate: value }))
                }
                placeholder="dd/mm/aaaa"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Pasajeros"
                value={searchData.passengers}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, passengers: value }))
                }
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Button
            title="Buscar"
            onPress={handleSearch}
            // style={{ marginTop: theme.spacing.md }}
          />
        </Card>

        {/* Mock Results */}
        {rutas.map((result, i) => (
          <ParadasCard key={i} ruta={result} />
        ))}
      </ScrollView>
    </View>
  );
}
