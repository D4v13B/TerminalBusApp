import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ParadaRuta } from '@/core/entities/Parada';
import { Ruta } from '@/core/entities/Ruta';
import { saveBoleto } from '@/infrastructure/boletos/saveBoleto';
import { getAllParadasRutas } from '@/infrastructure/paradas/getAllParadasRutas';
import { getRutas } from '@/infrastructure/rutas/getRutas';
import Card from '@/presentation/components/Card';
import ParadasCard from '@/presentation/search/components/ParadasCard';
import { BiometricAuth } from '@/utils/BiometricAuth';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowRightLeft,
  ChevronDown,
  MapPin,
  Search,
  Users,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: '1',
  });

  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Estados para los selectores
  const [showOriginSelector, setShowOriginSelector] = useState(false);
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);

  // Estados para el modal de paradas
  const [showParadasModal, setShowParadasModal] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedParada, setSelectedParada] = useState<ParadaRuta | null>();
  const [isConfirming, setIsConfirming] = useState(false);
  const [paradas, setParadas] = useState<ParadaRuta[]>();

  useEffect(() => {
    const fetchParadasRutas = async () => {
      const paradasFind = await getAllParadasRutas();

      setParadas(paradasFind.filter((p) => p.id === selectedRuta?.id));
    };

    fetchParadasRutas();
  }, [selectedRuta]);

  // Función para normalizar texto (quitar acentos, convertir a minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Función para verificar si un texto coincide con la búsqueda
  const matchesSearch = (text: string, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);

    return normalizedText.includes(normalizedSearch);
  };

  // Filtrar rutas basándose en origen y destino
  const filteredRutas = useMemo(() => {
    if (!hasSearched) return [];

    const { origin, destination } = searchData;

    return rutas.filter((ruta) => {
      const originMatch = !origin || ruta.nombreTo === origin;
      const destinationMatch = !destination || ruta.nombreTd === destination;

      return originMatch && destinationMatch;
    });
  }, [rutas, searchData.origin, searchData.destination, hasSearched]);

  // Obtener terminales únicas para sugerencias
  const availableTerminals = useMemo(() => {
    const terminals = new Set<string>();
    rutas.forEach((ruta) => {
      terminals.add(ruta.nombreTo);
      terminals.add(ruta.nombreTd);
    });
    return Array.from(terminals).sort();
  }, [rutas]);

  const handleSearch = () => {
    const { origin, destination } = searchData;

    // Validaciones básicas
    if (!origin.trim()) {
      Alert.alert('Error', 'Por favor selecciona la terminal de origen');
      return;
    }

    if (!destination.trim()) {
      Alert.alert('Error', 'Por favor selecciona la terminal de destino');
      return;
    }

    if (origin === destination) {
      Alert.alert(
        'Error',
        'La terminal de origen y destino no pueden ser la misma'
      );
      return;
    }

    setSearching(true);
    setHasSearched(true);

    // Simular delay de búsqueda
    setTimeout(() => {
      setSearching(false);
    }, 500);

    console.log('Searching with:', searchData);
    console.log('Found routes:', filteredRutas.length);
  };

  const swapCities = () => {
    setSearchData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const clearSearch = () => {
    setSearchData({
      origin: '',
      destination: '',
      departureDate: '',
      passengers: '1',
    });
    setHasSearched(false);
  };

  // Función para manejar la selección de ruta
  const handleRutaSelect = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setShowParadasModal(true);
  };

  // Función para cerrar el modal de paradas
  const closeParadasModal = () => {
    setShowParadasModal(false);
    setSelectedRuta(null);
  };

  // Función para seleccionar una parada específica
  const handleParadaSelect = (parada: any) => {
    setSelectedParada(parada);
    setShowParadasModal(false);
    setTimeout(() => {
      setConfirmationModalVisible(true);
    }, 300);
  };

  // Función para cerrar el modal de confirmación
  const closeConfirmationModal = () => {
    setConfirmationModalVisible(false);
    setSelectedParada(null);
    setSelectedRuta(null);
  };

  // Función para confirmar la selección de parada
  const handleConfirmSelection = async () => {
    if (!selectedParada || !selectedRuta) return;

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

      const data = await saveBoleto(selectedParada.id, user?.id as string);

      // Simular una operación async
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Reserva Confirmada',
        `Has reservado un asiento en la ruta ${selectedRuta.nombreTo} - ${selectedRuta.nombreTd}.\n\nParada: ${selectedParada.nombreParada}\nPrecio: ${selectedParada.precio}`,
        [{ text: 'OK', onPress: closeConfirmationModal }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo confirmar la reserva');
    } finally {
      setIsConfirming(false);
    }
  };

  // Función para cancelar confirmación
  const handleCancelConfirmation = () => {
    Alert.alert(
      'Cancelar reserva',
      '¿Quieres volver a seleccionar otra parada o cancelar completamente?',
      [
        {
          text: 'Volver a paradas',
          onPress: () => {
            setConfirmationModalVisible(false);
            setTimeout(() => setShowParadasModal(true), 300);
          },
        },
        {
          text: 'Cancelar todo',
          onPress: closeConfirmationModal,
          style: 'destructive',
        },
      ]
    );
  };

  // Componente Selector personalizado
  const TerminalSelector = ({
    label,
    value,
    onSelect,
    placeholder,
    isVisible,
    setVisible,
    excludeValue,
  }: {
    label: string;
    value: string;
    onSelect: (terminal: string) => void;
    placeholder: string;
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    excludeValue?: string;
  }) => {
    const filteredTerminals = availableTerminals.filter(
      (terminal) => terminal !== excludeValue
    );

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Pressable
          style={[
            styles.selectorButton,
            value ? styles.selectorButtonSelected : null,
          ]}
          onPress={() => setVisible(true)}
        >
          <View style={styles.selectorContent}>
            <MapPin
              size={20}
              color={value ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.selectorText,
                value
                  ? styles.selectorTextSelected
                  : styles.selectorTextPlaceholder,
              ]}
            >
              {value || placeholder}
            </Text>
          </View>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </Pressable>

        <Modal
          visible={isVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar {label}</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={styles.modalCloseButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredTerminals}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.terminalOption,
                      item === value && styles.terminalOptionSelected,
                    ]}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <MapPin
                      size={18}
                      color={
                        item === value
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.terminalOptionText,
                        item === value && styles.terminalOptionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

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
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.textInverse,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textInverse + 'CC',
      fontWeight: '400',
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    searchCard: {
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.lg,
      elevation: 4,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    inputColumn: {
      flexDirection: 'column',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    swapButtonContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.xs,
    },
    swapButton: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    inputContainer: {
      flex: 1,
    },
    datePassengersRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    dateContainer: {
      flex: 2,
    },
    passengersContainer: {
      flex: 1,
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      elevation: 3,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    searchButtonText: {
      color: theme.colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    resultsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },
    resultsCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    clearButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    clearButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    searchingContainer: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    searchingText: {
      marginTop: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    noResultsContainer: {
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.md,
    },
    noResultsText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    noResultsSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    terminalsHint: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.borderRadius.sm,
    },
    terminalsHintText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    // Estilos para modales
    modalSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
    modalFooter: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border || theme.colors.textSecondary + '20',
      backgroundColor: theme.colors.background,
    },
    closeButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border || theme.colors.textSecondary + '30',
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    // Estilos para las tarjetas de paradas
    paradaCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    paradaCardContent: {
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    paradaInfo: {
      flex: 1,
    },
    paradaHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    paradaNombre: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    paradaDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paradaOrden: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    paradaPrecio: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    selectArrow: {
      marginLeft: theme.spacing.md,
    },
    selectArrowText: {
      fontSize: 20,
      color: theme.colors.textSecondary,
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
    // Estilos para modal de confirmación
    backButton: {
      fontSize: 24,
      color: theme.colors.text,
      fontWeight: '600',
    },
    confirmationCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    confirmationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    routeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    routeIconText: {
      fontSize: 20,
    },
    routeInfo: {
      flex: 1,
    },
    routeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    routeSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    priceLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    priceValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    timeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border || theme.colors.textSecondary + '20',
    },
    timeBlock: {
      flex: 1,
      alignItems: 'center',
    },
    timeLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    timeValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    timeDivider: {
      paddingHorizontal: theme.spacing.md,
    },
    timeDividerText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    priceBreakdown: {
      gap: theme.spacing.sm,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceRowLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    priceRowValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    totalRow: {
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border || theme.colors.textSecondary + '20',
      marginTop: theme.spacing.sm,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border || theme.colors.textSecondary + '20',
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    confirmationFooter: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border || theme.colors.textSecondary + '20',
      backgroundColor: theme.colors.background,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border || theme.colors.textSecondary + '30',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    confirmButton: {
      flex: 2,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    confirmButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    confirmButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textInverse,
    },
    // Estilos para el selector personalizado
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    selectorButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border || theme.colors.textSecondary + '40',
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      minHeight: 50,
    },
    selectorButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight + '10',
    },
    selectorContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    selectorText: {
      marginLeft: theme.spacing.sm,
      fontSize: 16,
      flex: 1,
    },
    selectorTextSelected: {
      color: theme.colors.text,
      fontWeight: '500',
    },
    selectorTextPlaceholder: {
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      width: '100%',
      maxHeight: '80%',
      minHeight: '80%',
      elevation: 5,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor:
        theme.colors.border || theme.colors.textSecondary + '20',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    modalCloseButton: {
      fontSize: 20,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      padding: theme.spacing.xs,
    },
    terminalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        theme.colors.border || theme.colors.textSecondary + '10',
    },
    terminalOptionSelected: {
      backgroundColor: theme.colors.primaryLight + '20',
    },
    terminalOptionText: {
      marginLeft: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.text,
    },
    terminalOptionTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        setLoading(true);
        const rutasData = await getRutas();

        if (rutasData) {
          setRutas(rutasData);
        }
      } catch (error) {
        console.error('Error fetching rutas:', error);
        Alert.alert('Error', 'No se pudieron cargar las rutas');
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>Buscar Rutas</Text>
          <Text style={styles.subtitle}>Encuentra tu viaje ideal</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando rutas disponibles...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Buscar Rutas</Text>
        <Text style={styles.subtitle}>Encuentra tu viaje ideal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.searchCard}>
          <View style={styles.inputColumn}>
            <TerminalSelector
              label="Terminal de Origen"
              value={searchData.origin}
              onSelect={(terminal) =>
                setSearchData((prev) => ({ ...prev, origin: terminal }))
              }
              placeholder="Selecciona origen"
              isVisible={showOriginSelector}
              setVisible={setShowOriginSelector}
              excludeValue={searchData.destination}
            />

            <View style={styles.swapButtonContainer}>
              <Pressable style={styles.swapButton} onPress={swapCities}>
                <ArrowRightLeft size={20} color={theme.colors.textInverse} />
              </Pressable>
            </View>

            <TerminalSelector
              label="Terminal de Destino"
              value={searchData.destination}
              onSelect={(terminal) =>
                setSearchData((prev) => ({ ...prev, destination: terminal }))
              }
              placeholder="Selecciona destino"
              isVisible={showDestinationSelector}
              setVisible={setShowDestinationSelector}
              excludeValue={searchData.origin}
            />
          </View>

          {/* <View style={styles.datePassengersRow}>
            <View style={styles.dateContainer}>
              <Input
                label="Fecha de Salida"
                value={searchData.departureDate}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, departureDate: value }))
                }
                placeholder="dd/mm/aaaa"
              />
            </View>
            <View style={styles.passengersContainer}>
              <Input
                label="Pasajeros"
                value={searchData.passengers}
                onChangeText={(value) =>
                  setSearchData((prev) => ({ ...prev, passengers: value }))
                }
                keyboardType="number-pad"
              />
            </View>
          </View> */}

          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <Search size={20} color={theme.colors.textInverse} />
            <Text style={styles.searchButtonText}>Buscar Rutas</Text>
          </Pressable>

          {availableTerminals.length > 0 && (
            <View style={styles.terminalsHint}>
              <Text style={styles.terminalsHintText}>
                📍 {availableTerminals.length} terminales disponibles
              </Text>
            </View>
          )}
        </Card>

        {/* Loading de búsqueda */}
        {searching && (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.searchingText}>Buscando rutas...</Text>
          </View>
        )}

        {/* Resultados */}
        {hasSearched && !searching && (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Resultados de búsqueda</Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: theme.spacing.sm,
                  alignItems: 'center',
                }}
              >
                <Text style={styles.resultsCount}>
                  {filteredRutas.length} ruta
                  {filteredRutas.length !== 1 ? 's' : ''}
                </Text>
                <Pressable style={styles.clearButton} onPress={clearSearch}>
                  <Text style={styles.clearButtonText}>Limpiar</Text>
                </Pressable>
              </View>
            </View>

            {filteredRutas.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No se encontraron rutas
                </Text>
                <Text style={styles.noResultsSubtext}>
                  No hay rutas disponibles entre {searchData.origin} y{' '}
                  {searchData.destination}.{'\n\n'}Verifica que los nombres de
                  las terminales sean correctos o intenta con otras ciudades.
                </Text>
              </View>
            ) : (
              filteredRutas.map((ruta) => (
                <ParadasCard
                  key={ruta.id}
                  ruta={ruta}
                  onSelect={handleRutaSelect}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Modal de Paradas */}
      <Modal
        visible={showParadasModal}
        transparent
        animationType="slide"
        onRequestClose={closeParadasModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRuta
                  ? `${selectedRuta.nombreTo} → ${selectedRuta.nombreTd}`
                  : 'Seleccionar Parada'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Elige tu parada de abordaje
              </Text>
            </View>

            {/* Lista de paradas */}
            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {Array.isArray(paradas) && paradas.length > 0 ? (
                <>
                  <Text style={styles.routesTitle}>
                    Paradas disponibles ({paradas.length})
                  </Text>
                  {paradas.map((paradaRuta, index) => (
                    <TouchableOpacity
                      key={paradaRuta.id}
                      style={styles.paradaCard}
                      onPress={() => handleParadaSelect(paradaRuta)}
                    >
                      <View style={styles.paradaCardContent}>
                        <View style={styles.paradaInfo}>
                          <View style={styles.paradaHeader}>
                            <MapPin size={20} color={theme.colors.primary} />
                            <Text style={styles.paradaNombre}>
                              {paradaRuta.nombreParada}
                            </Text>
                          </View>
                          <View style={styles.paradaDetails}>
                            <Text style={styles.paradaOrden}>
                              Parada #{index + 1}
                            </Text>
                            <Text style={styles.paradaPrecio}>
                              ${paradaRuta.precio}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.selectArrow}>
                          <Text style={styles.selectArrowText}>→</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View style={styles.noRoutesContainer}>
                  <Text style={styles.noRoutesText}>
                    No hay paradas disponibles para esta ruta.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Footer del modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeParadasModal}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelConfirmation}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleCancelConfirmation}
                style={{ marginRight: theme.spacing.md }}
              >
                <Text style={styles.backButton}>←</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Confirmar Reserva</Text>
                <Text style={styles.modalSubtitle}>
                  Revisa los detalles de tu viaje
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Información de la Ruta */}
              {selectedRuta && (
                <View style={styles.confirmationCard}>
                  <View style={styles.confirmationHeader}>
                    <View style={styles.routeIcon}>
                      <Text style={styles.routeIconText}>🚌</Text>
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeTitle}>
                        {selectedRuta.nombreTo} → {selectedRuta.nombreTd}
                      </Text>
                      <Text style={styles.routeSubtitle}>
                        {selectedRuta.distancia} km • Andén {selectedRuta.anden}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timeInfo}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Salida</Text>
                      <Text style={styles.timeValue}>
                        {selectedRuta.horaEntrada}
                      </Text>
                    </View>
                    <View style={styles.timeDivider}>
                      <Text style={styles.timeDividerText}>→</Text>
                    </View>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Llegada</Text>
                      <Text style={styles.timeValue}>
                        {selectedRuta.horaSalida}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Información de la Parada */}
              {selectedParada && (
                <View style={styles.confirmationCard}>
                  <View style={styles.confirmationHeader}>
                    <View
                      style={[
                        styles.routeIcon,
                        { backgroundColor: theme.colors.success + '20' },
                      ]}
                    >
                      <MapPin size={20} color={theme.colors.success} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeTitle}>
                        {selectedParada.nombreRuta}
                      </Text>
                      <Text style={styles.routeSubtitle}>
                        Parada de abordaje
                      </Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Precio</Text>
                      <Text style={styles.priceValue}>
                        ${selectedParada.precio}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Información de Pasajeros */}
              <View style={styles.confirmationCard}>
                <View style={styles.confirmationHeader}>
                  <View
                    style={[
                      styles.routeIcon,
                      { backgroundColor: theme.colors.secondary + '20' },
                    ]}
                  >
                    <Users size={20} color={theme.colors.secondary} />
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeTitle}>
                      {searchData.passengers} Pasajero
                      {searchData.passengers !== '1' ? 's' : ''}
                    </Text>
                    <Text style={styles.routeSubtitle}>
                      {searchData.departureDate || 'Fecha por confirmar'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Resumen de Precio */}
              {selectedParada && (
                <View
                  style={[
                    styles.confirmationCard,
                    { backgroundColor: theme.colors.primaryLight + '10' },
                  ]}
                >
                  <View style={styles.priceBreakdown}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceRowLabel}>
                        Precio por pasajero
                      </Text>
                      <Text style={styles.priceRowValue}>
                        ${selectedParada.precio}
                      </Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceRowLabel}>
                        Cantidad de pasajeros
                      </Text>
                      <Text style={styles.priceRowValue}>
                        {searchData.passengers}
                      </Text>
                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total a pagar</Text>
                      <Text style={styles.totalValue}>
                        ${selectedParada.precio}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Información importante */}
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>ℹ️ Información importante</Text>
                <Text style={styles.infoText}>
                  • Los horarios pueden variar según condiciones del tráfico
                  {'\n'}• Llega 15 minutos antes de la hora de salida{'\n'}•
                  Presenta tu documento de identidad al abordar{'\n'}• El pago
                  se realizará en el vehículo
                </Text>
              </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.confirmationFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelConfirmation}
                disabled={isConfirming}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isConfirming && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmSelection}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <View style={styles.confirmButtonContent}>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.textInverse}
                    />
                    <Text style={styles.confirmButtonText}>Procesando...</Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Confirmar Reserva
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
