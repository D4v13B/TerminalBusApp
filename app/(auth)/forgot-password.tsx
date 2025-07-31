import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/presentation/components/Card';
import Input from '@/presentation/components/Input';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';


export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'Éxito',
        'Se ha enviado un enlace de recuperación a tu email',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    card: {
      marginBottom: theme.spacing.lg,
    },
    footer: {
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña
        </Text>
      </View>

      <Card style={styles.card}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <Button
          title="Enviar Enlace"
          onPress={handleResetPassword}
          // loading={loading}
          // style={{ marginTop: theme.spacing.md }}
        />
      </Card>

      <View style={styles.footer}>
        <Link href="/(auth)/login">
          <Text style={styles.linkText}>Volver al login</Text>
        </Link>
      </View>
    </View>
  );
}