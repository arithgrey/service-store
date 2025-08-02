/**
 * Helper para manejar localStorage de manera consistente
 */
export default class LocalStorageHelper {
  static STORAGE_KEYS = {
    RECENT_PRODUCTS: 'enid_recent_products',
    CART_ITEMS: 'enid_cart_items',
    USER_PREFERENCES: 'enid_user_preferences'
  };

  /**
   * Guarda datos en localStorage con manejo de errores
   * @param {string} key - Clave del localStorage
   * @param {any} data - Datos a guardar
   * @returns {boolean} - True si se guardó exitosamente
   */
  static setItem(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      return false;
    }
  }

  /**
   * Obtiene datos del localStorage con manejo de errores
   * @param {string} key - Clave del localStorage
   * @param {any} defaultValue - Valor por defecto si no existe
   * @returns {any} - Datos recuperados o valor por defecto
   */
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Elimina un item del localStorage
   * @param {string} key - Clave a eliminar
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  /**
   * Verifica si localStorage está disponible
   * @returns {boolean} - True si localStorage está disponible
   */
  static isAvailable() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
} 