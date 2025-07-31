import * as LocalAuthentication from 'expo-local-authentication';

export class BiometricAuth {
  static async isHardwareAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  static async authenticate(): Promise<boolean> {
    const available = await this.isHardwareAvailable();

    if (!available) {
      console.warn('Biometría no disponible o no configurada');
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación requerida',
      fallbackLabel: 'Usar contraseña',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    });

    return result.success;
  }
}
