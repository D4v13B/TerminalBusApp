import { useTheme } from '@/contexts/ThemeContext';
import { Ruta } from '@/core/entities/Ruta';
import Card from '@/presentation/components/Card';
import { ArrowDown, ArrowRight, Clock, DoorOpen, MapPin } from 'lucide-react-native';
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
      padding: 0,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    routeTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 26,
      textAlign: "center"
    },
    routeSubtitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    distanceText: {
      marginLeft: 4,
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    timeContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeBlock: {
      alignItems: 'center',
      flex: 1,
    },
    timeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    timeText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 2,
    },
    labelText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontWeight: '500',
    },
    divider: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm,
    },
    arrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    andenInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border || theme.colors.textSecondary + '20',
    },
    andenText: {
      marginLeft: 6,
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    andenLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginLeft: 6,
    },
    selectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    selectButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 16,
      letterSpacing: 0.5,
    },
    selectButtonOutline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
      borderWidth: 2,
      shadowOpacity: 0,
      elevation: 0,
    },
    selectButtonTextOutline: {
      color: theme.colors.primary,
    },
  });

  const handleSelect = (event: GestureResponderEvent) => {
    if (onSelect) {
      onSelect(ruta);
    }
  };

  return (
    <Card style={styles.card} key={ruta.id}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.routeTitle} numberOfLines={2}>
            {ruta.nombreTo}
          </Text>
          <Text style={styles.routeTitle} numberOfLines={2}>
            <ArrowDown size={20} color={theme.colors.primary}/>
          </Text>
          <Text style={styles.routeTitle} numberOfLines={2}>
            {ruta.nombreTd}
          </Text>
          <View style={styles.routeSubtitle}>
            <View style={styles.distanceContainer}>
              <MapPin size={14} color={theme.colors.primary} />
              <Text style={styles.distanceText}>{ruta.distancia} km</Text>
            </View>
          </View>
        </View>

        {/* Time Information */}
        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <View style={styles.timeIconContainer}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.timeText}>{ruta.horaEntrada}</Text>
              <Text style={styles.labelText}>Entrada</Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.arrowContainer}>
                <View style={{ width: 30, height: 1, backgroundColor: theme.colors.textSecondary + '40' }} />
                <ArrowRight size={16} color={theme.colors.textSecondary} style={{ marginHorizontal: 4 }} />
                <View style={{ width: 30, height: 1, backgroundColor: theme.colors.textSecondary + '40' }} />
              </View>
            </View>

            <View style={styles.timeBlock}>
              <View style={styles.timeIconContainer}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.timeText}>{ruta.horaSalida}</Text>
              <Text style={styles.labelText}>Salida</Text>
            </View>
          </View>
        </View>

        {/* Platform Information */}
        <View style={styles.andenInfo}>
          <DoorOpen size={16} color={theme.colors.textSecondary} />
          <Text style={styles.andenLabel}>Andén</Text>
          <Text style={styles.andenText}>{ruta.anden}</Text>
        </View>

        {/* Action Button */}
        <Pressable 
          style={[styles.selectButton]} 
          onPress={handleSelect}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.selectButtonText}>Seleccionar Ruta</Text>
        </Pressable>
      </View>
    </Card>
  );
};

export default ParadasCard;