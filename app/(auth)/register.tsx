import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/presentation/components/Card';
import Input from '@/presentation/components/Input';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cedula: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, phone, cedula, password, confirmPassword } = formData;

    if (!name || !email || !phone || !cedula || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, cedula, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flexGrow: 1,
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a BusApp hoy</Text>
        </View>

        <Card style={styles.card}>
          <Input
            label="Nombre Completo"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="Juan Pérez"
            required
          />

          <Input
            label="Cédula o Pasaporte"
            value={formData.cedula}
            onChangeText={(value) => updateField('cedula', value)}
            placeholder="8-123-456"
            required
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <Input
            label="Teléfono"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="+507 6123-4567"
            keyboardType="phone-pad"
            required
          />

          <Input
            label="Contraseña"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            required
          />

          <Input
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Repite tu contraseña"
            secureTextEntry
            required
          />

          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            // loading={loading}
            // style={{ marginTop: theme.spacing.md }}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.textSecondary }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/(auth)/login">
              <Text style={styles.linkText}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}