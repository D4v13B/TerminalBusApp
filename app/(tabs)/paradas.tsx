import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Parada, ParadaRuta } from '@/core/entities/Parada';
import { saveBoleto } from '@/infrastructure/boletos/saveBoleto';
import { getAllParadas } from '@/infrastructure/paradas/getAllParadas';
import { getAllParadasRutas } from '@/infrastructure/paradas/getAllParadasRutas';
import ParadaRutaCard from '@/presentation/search/components/ParadaRutaCard';
import { BiometricAuth } from '@/utils/BiometricAuth';
import {
  ArrowBigLeftDashIcon,
  Bell,
  BusFront,
  Calendar,
  Check,
  Locate,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

// Constantes para la configuración del mapa
const INITIAL_REGION: Region = {
  latitude: 8.9824,
  longitude: -79.5199,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Interfaz para el estado de carga
interface LoadingState {
  paradas: boolean;
  paradasRutas: boolean;
}

export default function App() {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Estados principales
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [paradaSeleccionada, setParadaSeleccionada] = useState<Parada | null>(
    null
  );
  const [paradaRutaSeleccionada, setParadaRutaSeleccionada] =
    useState<ParadaRuta | null>(null);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [paradasRutas, setParadasRutas] = useState<ParadaRuta[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    paradas: true,
    paradasRutas: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Crear estilos dinámicos basados en el tema
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Memorizar las paradas filtradas que tienen rutas asociadas
  const paradasConRutas = useMemo(() => {
    return paradas.filter((parada) =>
      paradasRutas.some((paradaRuta) => paradaRuta.paradaId === parada.id)
    );
  }, [paradas, paradasRutas]);

  // Memorizar las rutas filtradas de la parada seleccionada
  const paradasRutasFiltradas = useMemo(() => {
    if (!paradaSeleccionada) return [];
    return paradasRutas.filter((pr) => pr.paradaId === paradaSeleccionada.id);
  }, [paradasRutas, paradaSeleccionada]);

  // Región del mapa para confirmación
  const confirmationMapRegion: Region = useMemo(() => {
    if (!paradaSeleccionada) return INITIAL_REGION;
    return {
      latitude: Number(paradaSeleccionada.lat),
      longitude: Number(paradaSeleccionada.long),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }, [paradaSeleccionada]);

  // Función para manejar la selección de marcador optimizada
  const handleMarkerPress = useCallback((parada: Parada) => {
    setParadaSeleccionada(parada);
    setModalVisible(true);
  }, []);

  // Función para seleccionar una ruta específica y mostrar confirmación
  const onSelectParadaRuta = useCallback((paradaRuta: ParadaRuta) => {
    console.log('ParadaRuta seleccionada:', paradaRuta);
    setParadaRutaSeleccionada(paradaRuta);
    setModalVisible(false);
    // Pequeño delay para suavizar la transición entre modales
    setTimeout(() => {
      setConfirmationModalVisible(true);
    }, 300);
  }, []);

  // Función para cerrar el modal de selección
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setParadaSeleccionada(null);
  }, []);

  // Función para cerrar el modal de confirmación
  const closeConfirmationModal = useCallback(() => {
    setConfirmationModalVisible(false);
    setParadaRutaSeleccionada(null);
    setParadaSeleccionada(null);
  }, []);

  // Función para confirmar la selección final
  const handleConfirmSelection = useCallback(
    async (parada: Parada, paradaRuta: ParadaRuta) => {
      try {
        setIsConfirming(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        const isAuthenticated = await BiometricAuth.authenticate();

        if (!isAuthenticated) {
          Alert.alert('Error', 'Autenticación fallida');
          return;
        }

        // Aquí puedes agregar la lógica para guardar la selección
        // console.log('Selección confirmada:', { parada, paradaRuta });

        const data = await saveBoleto(paradaRuta.id, user?.id as string);

        // Simular una operación async
        await new Promise((resolve) => setTimeout(resolve, 1500));

        Alert.alert(
          'Selección Confirmada',
          `Has seleccionado la parada "${
            paradaRuta.nombreRuta
          }" en la ruta "${paradaRuta.nombreRuta || paradaRuta.nombreRuta}".`,
          [{ text: 'OK', onPress: closeConfirmationModal }]
        );
      } catch (error) {
        console.error('Error al confirmar selección:', error);
        Alert.alert(
          'Error',
          'No se pudo confirmar la selección. Intenta nuevamente.'
        );
      } finally {
        setIsConfirming(false);
      }
    },
    [closeConfirmationModal]
  );

  // Función para cancelar confirmación y volver al modal anterior
  const handleCancelConfirmation = useCallback(() => {
    Alert.alert(
      'Cancelar selección',
      '¿Quieres volver a seleccionar otra ruta o cancelar completamente?',
      [
        {
          text: 'Volver a rutas',
          onPress: () => {
            setConfirmationModalVisible(false);
            setTimeout(() => setModalVisible(true), 300);
          },
        },
        {
          text: 'Cancelar todo',
          onPress: closeConfirmationModal,
          style: 'destructive',
        },
      ]
    );
  }, [closeConfirmationModal]);

  // Función para manejar errores de manera consistente
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Error en ${context}:`, error);
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    setError(`Error al cargar ${context}: ${message}`);
  }, []);

  // Función para cargar datos con manejo de errores mejorado
  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // Cargar paradas
      setLoading((prev) => ({ ...prev, paradas: true }));
      const paradasData = await getAllParadas();

      if (paradasData) {
        setParadas(paradasData);
      } else {
        throw new Error('No se pudieron cargar las paradas');
      }

      setLoading((prev) => ({ ...prev, paradas: false }));

      // Cargar relaciones paradas-rutas
      setLoading((prev) => ({ ...prev, paradasRutas: true }));
      const paradasRutasData = await getAllParadasRutas();

      if (paradasRutasData) {
        setParadasRutas(paradasRutasData);
      } else {
        throw new Error('No se pudieron cargar las rutas de paradas');
      }

      setLoading((prev) => ({ ...prev, paradasRutas: false }));
    } catch (error) {
      handleError(error, 'datos');
      setLoading({ paradas: false, paradasRutas: false });
    }
  }, [handleError]);

  // Función para reintentar carga de datos
  const retryLoadData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para mostrar alertas de error
  const showErrorAlert = useCallback(() => {
    Alert.alert('Error', error || 'Ha ocurrido un error inesperado', [
      { text: 'Reintentar', onPress: retryLoadData },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [error, retryLoadData]);

  // Efecto para mostrar alertas de error
  useEffect(() => {
    if (error) {
      showErrorAlert();
    }
  }, [error, showErrorAlert]);

  // Verificar si está cargando
  const isLoading = loading.paradas || loading.paradasRutas;

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando paradas...</Text>
      </View>
    );
  }

  // Renderizar error si no hay datos
  if (paradasConRutas.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay paradas disponibles</Text>
        <Text style={styles.emptySubtitle}>
          Verifica tu conexión e intenta nuevamente
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoadData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={INITIAL_REGION}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        pitchEnabled
        rotateEnabled
        scrollEnabled
        zoomEnabled
        provider="google"
      >
        {paradasConRutas.map((parada) => (
          <Marker
            key={parada.id}
            coordinate={{
              latitude: Number(parada.lat),
              longitude: Number(parada.long),
            }}
            title={parada.nombre}
            description={parada.nombre}
            onPress={() => handleMarkerPress(parada)}
          />
        ))}
      </MapView>

      {/* Modal de selección de rutas */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {paradaSeleccionada?.nombre || 'Parada'}
              </Text>
              {paradaSeleccionada?.nombre && (
                <Text style={styles.modalSubtitle}>Selecciona una ruta</Text>
              )}
            </View>

            {/* Contenido del modal */}
            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {paradasRutasFiltradas.length > 0 ? (
                <>
                  <Text style={styles.routesTitle}>
                    Rutas disponibles ({paradasRutasFiltradas.length})
                  </Text>
                  {paradasRutasFiltradas.map((paradaRuta) => (
                    <ParadaRutaCard
                      key={paradaRuta.id}
                      paradaRuta={paradaRuta}
                      onSelect={onSelectParadaRuta}
                    />
                  ))}
                </>
              ) : (
                <View style={styles.noRoutesContainer}>
                  <Text style={styles.noRoutesText}>
                    No hay rutas disponibles para esta parada.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Footer del modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación */}
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelConfirmation}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: '80%' }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleCancelConfirmation}
                style={{ marginRight: theme.spacing.md }}
              >
                <ArrowBigLeftDashIcon size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Confirmar Selección</Text>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Mapa de vista previa */}
              {paradaSeleccionada && (
                <View
                  style={{
                    height: 180,
                    borderRadius: theme.borderRadius.lg,
                    overflow: 'hidden',
                    marginBottom: theme.spacing.lg,
                    ...theme.shadows.md,
                  }}
                >
                  <MapView
                    style={{ width: '100%', height: '100%' }}
                    region={confirmationMapRegion}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: Number(paradaSeleccionada.lat),
                        longitude: Number(paradaSeleccionada.long),
                      }}
                      title={paradaSeleccionada.nombre}
                    />
                  </MapView>
                </View>
              )}

              {/* Información de la parada */}
              {paradaSeleccionada && (
                <View
                  style={{
                    backgroundColor: theme.colors.surface,
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: theme.spacing.md,
                    ...theme.shadows.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    <Locate size={24} color={theme.colors.primary} />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: theme.colors.text,
                        marginLeft: theme.spacing.md,
                        flex: 1,
                      }}
                    >
                      {paradaSeleccionada.nombre}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.colors.textSecondary,
                        marginRight: theme.spacing.sm,
                      }}
                    >
                      Ubicación:
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.colors.text,
                        fontFamily: 'monospace',
                      }}
                    >
                      {Number(paradaSeleccionada.lat).toFixed(6)},{' '}
                      {Number(paradaSeleccionada.long).toFixed(6)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Información de la ruta */}
              {paradaRutaSeleccionada && (
                <View
                  style={{
                    backgroundColor: theme.colors.surface,
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: theme.spacing.md,
                    ...theme.shadows.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    <BusFront size={24} color={theme.colors.secondary} />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: theme.colors.text,
                        marginLeft: theme.spacing.md,
                      }}
                    >
                      Ruta Seleccionada
                    </Text>
                  </View>

                  <View style={{ gap: theme.spacing.sm }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Número:
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.text,
                        }}
                      >
                        {paradaRutaSeleccionada.nombreRuta || 'N/A'}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Nombre:
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.colors.text,
                          textAlign: 'right',
                          flex: 1,
                          marginLeft: theme.spacing.md,
                        }}
                      >
                        {paradaRutaSeleccionada.nombreRuta || 'Sin nombre'}
                      </Text>
                    </View>

                    {/* {paradaRutaSeleccionada.orden && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: theme.colors.textSecondary,
                        }}>
                          Orden en ruta:
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: theme.colors.text,
                        }}>
                          #{paradaRutaSeleccionada.anden}
                        </Text>
                      </View>
                    )} */}
                  </View>
                </View>
              )}

              {/* Información adicional */}
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  marginBottom: theme.spacing.lg,
                  ...theme.shadows.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  Información importante
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <Calendar size={16} color={theme.colors.textSecondary} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginLeft: theme.spacing.sm,
                      flex: 1,
                      lineHeight: 18,
                    }}
                  >
                    Los horarios pueden variar según el día y condiciones del
                    tráfico
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                >
                  <Bell size={16} color={theme.colors.textSecondary} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginLeft: theme.spacing.sm,
                      flex: 1,
                      lineHeight: 18,
                    }}
                  >
                    Recibirás notificaciones sobre el estado de tu ruta
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Botones de acción */}
            <View
              style={[
                styles.modalFooter,
                { flexDirection: 'row', gap: theme.spacing.md },
              ]}
            >
              <TouchableOpacity
                style={[styles.closeButton, { flex: 1 }]}
                onPress={handleCancelConfirmation}
                disabled={isConfirming}
              >
                <Text style={styles.closeButtonText}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  {
                    flex: 2,
                    backgroundColor: isConfirming
                      ? theme.colors.interactiveDisabled
                      : theme.colors.primary,
                    paddingVertical: theme.spacing.md,
                    borderRadius: theme.borderRadius.lg,
                    alignItems: 'center',
                    ...theme.shadows.sm,
                  },
                ]}
                onPress={() =>
                  paradaSeleccionada &&
                  paradaRutaSeleccionada &&
                  handleConfirmSelection(
                    paradaSeleccionada,
                    paradaRutaSeleccionada
                  )
                }
                disabled={isConfirming}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isConfirming ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.textInverse}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: theme.colors.textInverse,
                          marginLeft: theme.spacing.sm,
                        }}
                      >
                        Confirmando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Check size={20} color={theme.colors.textInverse} />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: theme.colors.textInverse,
                          marginLeft: theme.spacing.sm,
                        }}
                      >
                        Confirmar Selección
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Función para crear estilos dinámicos basados en el tema
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
    retryButtonText: {
      color: theme.colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalBackground,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '80%',
      minHeight: '80%',
      ...theme.shadows.lg,
    },
    modalHeader: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    modalSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    modalScrollView: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    routesTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    noRoutesContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
    },
    noRoutesText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalFooter: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    closeButton: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
  });
