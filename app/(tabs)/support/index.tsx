import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/presentation/components/Card';
import Input from '@/presentation/components/Input';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, MessageCircle, MessageCircleIcon, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SupportScreen() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<
    'contact' | 'report' | 'faq'
  >('contact');
  const [reportData, setReportData] = useState({
    type: '',
    subject: '',
    description: '',
  });

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Chat en vivo',
      description: 'Habla con nuestro equipo de soporte',
      action: () => router.push('/(tabs)/support/chat'),
    },
    {
      icon: Phone,
      title: 'Llamar',
      description: '+507 6724-8070',
      action: () => Linking.openURL('tel:+50767248070'),
    },
    {
      icon: MessageCircleIcon,
      title: 'WhatsApp',
      description: '+507 6837-5569',
      action: () => Linking.openURL('https://wa.me/50768375569'),
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'soporte@busapp.com',
      action: () => Alert.alert('Email', 'Abriendo aplicación de email...'),
    },
  ];

  const faqItems = [
    {
      question: '¿Cómo puedo cancelar mi boleto?',
      answer:
        'Puedes cancelar tu boleto hasta 2 horas antes de la salida desde la sección "Mis Boletos".',
    },
    {
      question: '¿Qué hago si pierdo mi boleto digital?',
      answer:
        'Tu boleto digital está guardado en tu cuenta. Puedes acceder a él desde "Mis Boletos" en cualquier momento.',
    },
    {
      question: '¿Los precios incluyen todos los impuestos?',
      answer:
        'Sí, todos los precios mostrados incluyen impuestos y tasas aplicables.',
    },
    {
      question: '¿Puedo cambiar la fecha de mi viaje?',
      answer:
        'Sí, puedes cambiar la fecha hasta 24 horas antes del viaje, sujeto a disponibilidad.',
    },
  ];

  const handleSubmitReport = () => {
    if (!reportData.type || !reportData.subject || !reportData.description) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    Alert.alert(
      'Reporte enviado',
      'Tu reporte ha sido enviado. Te contactaremos pronto.',
      [
        {
          text: 'OK',
          onPress: () =>
            setReportData({ type: '', subject: '', description: '' }),
        },
      ]
    );
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
      fontSize: 12,
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
    contactOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    contactIcon: {
      marginRight: theme.spacing.md,
    },
    contactText: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    contactDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    reportCard: {
      marginBottom: theme.spacing.lg,
    },
    pickerContainer: {
      marginBottom: theme.spacing.md,
    },
    pickerLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    picker: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    pickerText: {
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    faqItem: {
      marginBottom: theme.spacing.md,
    },
    question: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    answer: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Soporte</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              activeSection === 'contact' && styles.activeTab,
            ]}
            onPress={() => setActiveSection('contact')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'contact' && styles.activeTabText,
              ]}
            >
              Contacto
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeSection === 'report' && styles.activeTab]}
            onPress={() => setActiveSection('report')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'report' && styles.activeTabText,
              ]}
            >
              Reportar
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeSection === 'faq' && styles.activeTab]}
            onPress={() => setActiveSection('faq')}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === 'faq' && styles.activeTabText,
              ]}
            >
              FAQ
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'contact' && (
          <>
            {contactOptions.map((option, index) => (
              <Pressable key={index} onPress={option.action}>
                <Card style={styles.contactOption}>
                  <option.icon
                    size={24}
                    color={theme.colors.primary}
                    style={styles.contactIcon}
                  />
                  <View style={styles.contactText}>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactDescription}>
                      {option.description}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            ))}
          </>
        )}

        {activeSection === 'report' && (
          <Card style={styles.reportCard}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Tipo de reporte</Text>
              <Pressable style={styles.picker}>
                <Text style={styles.pickerText}>
                  {reportData.type || 'Seleccionar tipo...'}
                </Text>
              </Pressable>
            </View>

            <Input
              label="Asunto"
              value={reportData.subject}
              onChangeText={(value) =>
                setReportData((prev) => ({ ...prev, subject: value }))
              }
              placeholder="Describe brevemente el problema"
              required
            />

            <Input
              label="Descripción detallada"
              value={reportData.description}
              onChangeText={(value) =>
                setReportData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Proporciona todos los detalles posibles..."
              multiline
              style={styles.textArea}
              required
            />

            <Button title="Enviar Reporte" onPress={handleSubmitReport} />
          </Card>
        )}

        {activeSection === 'faq' && (
          <>
            {faqItems.map((item, index) => (
              <Card key={index} style={styles.faqItem}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.answer}>{item.answer}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
