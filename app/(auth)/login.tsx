import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/presentation/components/Card';
import Input from '@/presentation/components/Input';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setGoogleLoading(true);
  //   try {
  //     await promptAsync();
  //     router.replace('/(tabs)');
  //   } catch (error) {
  //     Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
    },
    title: {
      fontSize: 32,
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
    loginButton: {
      marginTop: theme.spacing.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border || theme.colors.textSecondary,
      opacity: 0.3,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: theme.colors.border || '#ddd',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: theme.spacing.md,
    },
    googleButtonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
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
          <Text style={styles.title}>BusApp <Bus/></Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
        </View>

        <Card style={styles.card}>
          {/* Botón de Google */}
          <TouchableOpacity 
            style={styles.googleButton} 
            // onPress={() => googleLogin()}
            disabled={googleLoading || loading}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.googleButtonText}>
              {googleLoading ? 'Iniciando...' : 'Continuar con Google'}
            </Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <Input
            label="Email o Teléfono"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            secureTextEntry
            required
          />

          <View style={styles.loginButton}>
            <Button
              title={loading ? 'Iniciando...' : 'Iniciar Sesión'}
              onPress={handleLogin}
              disabled={loading || googleLoading}
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Link href="/(auth)/forgot-password">
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </Link>

          <View style={{ marginTop: theme.spacing.md }}>
            <Text style={{ color: theme.colors.textSecondary }}>
              ¿No tienes cuenta?{' '}
              <Link href="/(auth)/register">
                <Text style={styles.linkText}>Regístrate</Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}