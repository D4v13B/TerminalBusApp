import { useTheme } from '@/contexts/ThemeContext';
import { ParadaRuta } from '@/core/entities/Parada';
import Card from '@/presentation/components/Card';
import { DollarSign, DoorOpen, MapPin } from 'lucide-react-native';
import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  paradaRuta: ParadaRuta;
  onSelect?: (paradaRuta: ParadaRuta) => void;
}

const ParadaRutaCard = ({ paradaRuta, onSelect }: Props) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      flexShrink: 1,
    },
    subtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    priceText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.surface,
    },
    selectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    selectButtonText: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: 16,
    },
  });

  const handleSelect = (event: GestureResponderEvent) => {
    if (onSelect) {
      onSelect(paradaRuta);
    }
  };

  return (
    <Card style={styles.card} key={paradaRuta.id}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {paradaRuta.nombreParada}
        </Text>
        <View style={styles.priceContainer}>
          <DollarSign size={16} color={theme.colors.primary} />
          <Text style={styles.priceText}>${paradaRuta.precio}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.subtext}>Ruta: {paradaRuta.nombreRuta}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MapPin size={16} color={theme.colors.textSecondary} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.subtext}>Andén: {paradaRuta.anden}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DoorOpen size={16} color={theme.colors.textSecondary} />
        </View>
      </View>

      <Pressable style={styles.selectButton} onPress={handleSelect}>
        <Text style={styles.title}>Seleccionar</Text>
      </Pressable>
    </Card>
  );
};

export default ParadaRutaCard;
