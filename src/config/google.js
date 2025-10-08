/**
 * Configuración de Google OAuth
 * 
 * Este archivo contiene la configuración necesaria para la autenticación con Google
 */

export const GOOGLE_CONFIG = {
  // Google Client ID - Se debe configurar en las variables de entorno
  // Para obtener tu Client ID: https://console.cloud.google.com/apis/credentials
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Scopes que se solicitan a Google
  scopes: [
    'email',
    'profile',
    'openid'
  ],
  
  // Configuración del botón de Google
  buttonConfig: {
    theme: 'outline',
    size: 'large',
    width: '100%',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left'
  },

  // Configuración de popup
  popupType: 'popup', // 'popup' o 'redirect'
  
  // URL de callback (solo si usas redirect)
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin + '/auth/google/callback',
};

/**
 * Valida que la configuración de Google esté completa
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateGoogleConfig() {
  const errors = [];

  if (!GOOGLE_CONFIG.clientId) {
    errors.push('VITE_GOOGLE_CLIENT_ID no está configurado en las variables de entorno');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Obtiene la configuración de Google para el componente GoogleLogin
 * @returns {Object} - Configuración para vue3-google-login
 */
export function getGoogleLoginConfig() {
  return {
    clientId: GOOGLE_CONFIG.clientId,
    scope: GOOGLE_CONFIG.scopes.join(' '),
    prompt: 'select_account',
    auto_select: false
  };
}

export default GOOGLE_CONFIG;

