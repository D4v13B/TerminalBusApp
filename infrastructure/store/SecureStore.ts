import * as SecureStore from 'expo-secure-store';

export default class SecureStorage {
  /**
   * Guarda un valor de forma segura.
   * @param key La clave.
   * @param value El valor.
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error(`Error guardando ${key} en SecureStore:`, error);
    }
  }

  /**
   * Obtiene un valor de forma segura.
   * @param key La clave.
   * @returns El valor o null si no existe.
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error obteniendo ${key} de SecureStore:`, error);
      return null;
    }
  }

  /**
   * Elimina un valor seguro.
   * @param key La clave.
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error eliminando ${key} de SecureStore:`, error);
    }
  }

  /**
   * Verifica si el almacenamiento seguro está disponible.
   * @returns true si está disponible, false si no.
   */
  static async isAvailable(): Promise<boolean> {
    try {
      return await SecureStore.isAvailableAsync();
    } catch (error) {
      console.error('Error verificando disponibilidad de SecureStore:', error);
      return false;
    }
  }
}
