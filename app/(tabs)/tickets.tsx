import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Boleto } from '@/core/entities/Boleto';
import { API_URL } from '@/core/services/auth/auth-client';
import { getBoletosByUser } from '@/infrastructure/boletos/getBoletosByUser';
import Card from '@/presentation/components/Card';
import { StatusBar } from 'expo-status-bar';
import { Calendar, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TicketsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [boletos, setBoletos] = useState<Boleto[]>();
  const { user } = useAuth();

  // Estados para el modal QR
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Boleto | null>(null);

  const [activeBoletos, setActiveBoletos] = useState<Boleto[]>();

  useEffect(() => {
    const fetchBoletos = async () => {
      const data = await getBoletosByUser(user?.id as string);

      if (data) {
        setBoletos(data);
      }
    };

    fetchBoletos();
  }, []);

  // Función para abrir el modal QR
  const openQRModal = (ticket: Boleto) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  // Función para cerrar el modal QR
  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedTicket(null);
  };

  const activeTickets = [
    {
      id: '1',
      origin: 'Ciudad de Panamá',
      destination: 'David',
      date: '2024-01-20',
      departureTime: '08:00',
      arrivalTime: '13:30',
      seatNumber: 'A12',
      passengerName: 'Juan Pérez',
      company: 'Express Panamá',
      price: 15,
      qrCode: 'QR123456789',
      status: 'active' as const,
    },
    {
      id: '2',
      origin: 'Colón',
      destination: 'Santiago',
      date: '2024-01-25',
      departureTime: '14:00',
      arrivalTime: '17:45',
      seatNumber: 'B08',
      passengerName: 'Juan Pérez',
      company: 'Buses Costarricenses',
      price: 12,
      qrCode: 'QR987654321',
      status: 'active' as const,
    },
  ];

  const ticketHistory = [
    {
      id: '3',
      origin: 'David',
      destination: 'Ciudad de Panamá',
      date: '2024-01-15',
      departureTime: '09:00',
      arrivalTime: '14:30',
      seatNumber: 'C15',
      passengerName: 'Juan Pérez',
      company: 'TransRápido',
      price: 18,
      qrCode: 'QR456789123',
      status: 'used' as const,
    },
  ];

  const currentTickets = activeTab === 'active' ? activeTickets : ticketHistory;

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
      marginBottom: theme.spacing.md,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.textInverse,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    ticketCard: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    ticketHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    routeInfo: {
      flex: 1,
    },
    routeText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    companyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    activeStatus: {
      backgroundColor: theme.colors.success,
    },
    usedStatus: {
      backgroundColor: theme.colors.textTertiary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.textInverse,
    },
    ticketDetails: {
      marginBottom: theme.spacing.lg,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    qrSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.md,
    },
    qrIcon: {
      marginBottom: theme.spacing.sm,
    },
    qrText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    // Estilos para el modal QR
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    qrContainer: {
      backgroundColor: '#FFFFFF',
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    modalQrIcon: {
      marginBottom: theme.spacing.md,
    },
    ticketInfo: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    ticketRoute: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    ticketDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    modalInstructions: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Mis Boletos</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && styles.activeTabText,
              ]}
            >
              Activos
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.activeTabText,
              ]}
            >
              Historial
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {boletos?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>
              {activeTab === 'active'
                ? 'No tienes boletos activos'
                : 'No hay boletos en el historial'}
            </Text>
          </View>
        ) : (
          boletos?.map((ticket) => (
            <Card key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeText}>
                    {ticket.paradaRuta.ruta.to.nombre} →{' '}
                    {ticket.paradaRuta.parada.nombre}
                  </Text>
                  {/* <Text style={styles.companyText}>{ticket.company}</Text> */}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    ticket.valido === true
                      ? styles.activeStatus
                      : styles.usedStatus,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {ticket.valido === true ? 'Activo' : 'Usado'}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>
                    {new Date(ticket.fechaUso).toLocaleString('es-PA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false, // Cambia a formato 24h
                    })}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Salida desde</Text>
                  <Text style={styles.detailValue}>
                    {ticket.paradaRuta.ruta.horaEntrada}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hasta</Text>
                  <Text style={styles.detailValue}>
                    {ticket.paradaRuta.parada.nombre}
                  </Text>
                </View>
                {/* <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Asiento</Text>
                  <Text style={styles.detailValue}>{ticket.seatNumber}</Text>
                </View> */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pasajero</Text>
                  <Text style={styles.detailValue}>{ticket.user.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Precio</Text>
                  <Text style={styles.detailValue}>
                    ${ticket.paradaRuta.precio}
                  </Text>
                </View>
              </View>

              {ticket.valido === true && (
                <View style={styles.qrSection}>
                  <QRCode
                    value={`${API_URL}/boletos/view/${ticket.tokenBoleto}`}
                    size={64}
                    color={theme.colors.primary}
                    backgroundColor="transparent"
                  />
                  <Text style={styles.qrText}>
                    Código QR para validación en terminal
                  </Text>
                </View>
              )}

              <View style={styles.actions}>
                <Button
                  title="Descargar"
                  onPress={() => {}}
                  // style={{ flex: 1 }}
                />
                {ticket.valido === true && (
                  <Button
                    title="Ver QR"
                    onPress={() => openQRModal(ticket)}
                    // style={{ flex: 1 }}
                  />
                )}
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal para mostrar el QR */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeQRModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Código QR</Text>
              <Pressable style={styles.closeButton} onPress={closeQRModal}>
                <X size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            {selectedTicket && (
              <>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={`http://localhost:3000/boletos/view/${selectedTicket.tokenBoleto}`}
                    size={200}
                    color={theme.colors.primary}
                    backgroundColor="#FFFFFF"
                    logoSize={30}
                    logoBackgroundColor="transparent"
                  />
                </View>

                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketRoute}>
                    {selectedTicket.paradaRuta.ruta.to.nombre} →{' '}
                    {selectedTicket.paradaRuta.parada.nombre}
                  </Text>
                  <Text style={styles.ticketDate}>
                    {new Date(selectedTicket.fechaUso).toLocaleString('es-PA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false, // Cambia a formato 24h
                    })}
                  </Text>
                </View>

                <Text style={styles.modalInstructions}>
                  Muestra este código QR al conductor o en la terminal para
                  validar tu boleto de viaje.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
