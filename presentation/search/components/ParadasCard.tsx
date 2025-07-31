import { useTheme } from '@/contexts/ThemeContext';
import { Ruta } from '@/core/entities/Ruta';
import Card from '@/presentation/components/Card';
import { Clock, DoorOpen, MapPin } from 'lucide-react-native';
import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  ruta: Ruta;
  onSelect?: (ruta: Ruta) => void;
}

const ParadasCard = ({ ruta, onSelect }: Props) => {
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
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      flexShrink: 1,
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    distanceText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    timeBlock: {
      alignItems: 'center',
      flex: 1,
    },
    timeText: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text,
    },
    labelText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    andenContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    andenText: {
      marginLeft: 6,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    selectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    selectButtonText: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: 16,
    },
  });

  const handleSelect = (event: GestureResponderEvent) => {
    if (onSelect) {
      onSelect(ruta);
    }
  };

  return (
    <Card style={styles.card} key={ruta.id}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {ruta.nombreTo} {'\u2013'} {ruta.nombreTd}
        </Text>
        <View style={styles.distanceContainer}>
          <MapPin size={16} color={theme.colors.primary} />
          <Text style={styles.distanceText}>{ruta.distancia} km</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Clock size={24} color={theme.colors.primary} />
          <Text style={styles.timeText}>{ruta.horaEntrada}</Text>
          <Text style={styles.labelText}>Entrada</Text>
        </View>

        <View style={styles.andenContainer}>
          <DoorOpen size={28} color={theme.colors.textSecondary} />
          <Text style={styles.andenText}>{ruta.anden}</Text>
        </View>

        <View style={styles.timeBlock}>
          <Clock size={24} color={theme.colors.primary} />
          <Text style={styles.timeText}>{ruta.horaSalida}</Text>
          <Text style={styles.labelText}>Salida</Text>
        </View>
      </View>

      <Pressable style={styles.selectButton} onPress={handleSelect}>
        <Text style={styles.timeText}>Seleccionar</Text>
      </Pressable>
    </Card>
  );
};

export default ParadasCard;
