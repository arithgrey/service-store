/**
 * GoogleOAuthHelper
 * 
 * Helper para manejar autenticación con Google OAuth
 * Proporciona métodos utilitarios para trabajar con tokens y respuestas de Google
 */

export default class GoogleOAuthHelper {
  constructor(store) {
    this.store = store;
  }

  /**
   * Decodifica un JWT de Google
   * @param {string} token - Token JWT de Google
   * @returns {Object} - Payload del token decodificado
   */
  static parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      throw new Error('Token inválido');
    }
  }

  /**
   * Valida que el token de Google tenga la estructura correcta
   * @param {string} token - Token JWT de Google
   * @returns {boolean} - True si el token es válido
   */
  static isValidGoogleToken(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      const payload = this.parseJwt(token);
      return !!(payload.email && payload.sub);
    } catch {
      return false;
    }
  }

  /**
   * Extrae información del usuario del token de Google
   * @param {string} credential - Credencial JWT de Google
   * @returns {Object} - Información del usuario
   */
  static extractUserInfo(credential) {
    const payload = this.parseJwt(credential);
    
    return {
      email: payload.email,
      name: payload.name,
      google_id: payload.sub,
      picture: payload.picture,
      email_verified: payload.email_verified,
      given_name: payload.given_name || '',
      family_name: payload.family_name || '',
      locale: payload.locale || 'es'
    };
  }

  /**
   * Guarda la información de autenticación en el store
   * @param {Object} authData - Datos de autenticación del backend
   */
  saveAuthData(authData) {
    if (!this.store) {
      throw new Error('Store no disponible');
    }

    const { token, refresh_token, user } = authData;

    this.store.commit('setUser', user);
    this.store.commit('setToken', token);
    this.store.commit('setRefreshToken', refresh_token);
    this.store.commit('setProfile', user.profile);
  }

  /**
   * Limpia la información de autenticación del store
   */
  clearAuthData() {
    if (!this.store) {
      throw new Error('Store no disponible');
    }

    this.store.commit('setUser', null);
    this.store.commit('setToken', null);
    this.store.commit('setRefreshToken', null);
    this.store.commit('setProfile', null);
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    if (!this.store) {
      return false;
    }
    return this.store.getters.isAuthenticated;
  }

  /**
   * Obtiene la URL de redirección según el perfil del usuario
   * @param {string} profile - Perfil del usuario
   * @returns {Object} - Objeto de ruta para Vue Router
   */
  static getRedirectRoute(profile) {
    const routes = {
      'ecommerce': { name: 'ecommerce-user' },
      'administrador': { name: 'admin-user' },
      'default': { name: 'product-list' }
    };

    return routes[profile] || routes.default;
  }

  /**
   * Formatea errores de Google OAuth para mostrar al usuario
   * @param {Error} error - Error de Google OAuth
   * @returns {string} - Mensaje de error formateado
   */
  static formatError(error) {
    const errorMessages = {
      'popup_closed_by_user': 'La ventana de Google se cerró. Por favor, intenta de nuevo.',
      'access_denied': 'Acceso denegado. Necesitas permitir el acceso para continuar.',
      'invalid_client': 'Configuración de Google inválida. Contacta al administrador.',
      'network_error': 'Error de conexión. Verifica tu internet.',
      'default': 'Error al iniciar sesión con Google. Por favor, intenta de nuevo.'
    };

    const errorType = error.error || error.type || 'default';
    return errorMessages[errorType] || errorMessages.default;
  }

  /**
   * Valida la respuesta del backend después de autenticación con Google
   * @param {Object} response - Respuesta del backend
   * @returns {boolean} - True si la respuesta es válida
   */
  static isValidBackendResponse(response) {
    if (!response || !response.data) {
      return false;
    }

    const { token, refresh_token, user } = response.data;
    return !!(token && refresh_token && user && user.email);
  }

  /**
   * Registra eventos de analytics para autenticación con Google
   * @param {string} event - Tipo de evento
   * @param {Object} data - Datos adicionales del evento
   */
  static trackAuthEvent(event, data = {}) {
    // Integración con sistema de analytics si existe
    if (window.gtag) {
      window.gtag('event', event, {
        event_category: 'authentication',
        event_label: 'google_oauth',
        ...data
      });
    }

    console.log(`[GoogleOAuth] ${event}`, data);
  }
}

