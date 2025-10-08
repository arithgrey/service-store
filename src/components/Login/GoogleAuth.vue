<template>
  <div class="google-auth-container">
    <div class="divider-container my-4">
      <div class="divider-line"></div>
      <span class="divider-text">o</span>
      <div class="divider-line"></div>
    </div>

    <div id="google-button-container"></div>

    <div v-if="error" class="error-message mt-3">
      <span class="text-red-500 text-sm">{{ error }}</span>
    </div>
  </div>
</template>

<script>
import GOOGLE_CONFIG from '@/config/google';

export default {
  name: 'GoogleAuth',
  components: {},
  data() {
    return {
      isLoading: false,
      error: null
    };
  },
  mounted() {
    this.initializeGoogleSignIn();
  },
  methods: {
    initializeGoogleSignIn() {
      // Cargar el script de Google Identity Services
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.renderGoogleButton();
        document.head.appendChild(script);
      } else {
        this.renderGoogleButton();
      }
    },

    renderGoogleButton() {
      const clientId = GOOGLE_CONFIG.clientId;
      
      if (!clientId) {
        console.error('Google Client ID no configurado');
        this.error = 'Configuración de Google no disponible';
        return;
      }

      // Inicializar Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Renderizar el botón
      window.google.accounts.id.renderButton(
        document.getElementById('google-button-container'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    },

    async handleGoogleResponse(response) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Respuesta de Google recibida:', response);
        
        // Verificar que la respuesta tenga el credential
        if (!response || !response.credential) {
          throw new Error('No se recibió credencial de Google');
        }

        console.log('Credential recibido (primeros 50 chars):', response.credential.substring(0, 50));
        
        // Decodificar el JWT de Google para obtener la información del usuario
        const credential = this.parseJwt(response.credential);
        console.log('Credential decodificado:', credential);
        
        // Crear objeto con los datos del usuario de Google
        const googleUser = {
          email: credential.email,
          name: credential.name,
          google_id: credential.sub,
          picture: credential.picture,
          email_verified: credential.email_verified,
          credential: response.credential
        };

        console.log('Datos del usuario de Google:', googleUser);

        // Enviar al backend para autenticación/registro
        await this.authenticateWithGoogle(googleUser);

      } catch (error) {
        console.error('Error en autenticación de Google:', error);
        console.error('Stack trace:', error.stack);
        this.error = 'Error al iniciar sesión con Google. Por favor intenta de nuevo.';
        this.isLoading = false;
      }
    },

    async authenticateWithGoogle(googleUser) {
      try {
        // Endpoint del backend para autenticación con Google
        const response = await this.$axios.post('oauth/login/google/', googleUser);
        
        if (response.status === 200 || response.status === 201) {
          // Guardar tokens y datos del usuario en el store
          const token = response.data.token;
          const refresh_token = response.data.refresh_token;
          const user = response.data.user;

          this.$store.commit('setUser', user);
          this.$store.commit('setToken', token);
          this.$store.commit('setRefreshToken', refresh_token);
          this.$store.commit('setProfile', user.profile);

          // Emitir evento de éxito para que el componente padre maneje la lógica
          this.$emit('google-auth-success', user);
          
          // Resetear estado de carga
          this.isLoading = false;
          
          // Nota: No redirigimos automáticamente aquí
          // El componente padre (Login.vue) puede manejar la redirección si es necesario
        }
      } catch (error) {
        console.error('Error en el backend:', error);
        
        if (error.response && error.response.data) {
          this.error = error.response.data.error || 
                      'Error al procesar la autenticación con Google.';
        } else {
          this.error = 'Error de conexión. Por favor verifica tu internet.';
        }
        
        this.isLoading = false;
      }
    },

    parseJwt(token) {
      try {
        console.log('parseJwt - Token recibido (tipo):', typeof token);
        console.log('parseJwt - Token length:', token ? token.length : 'null');
        
        if (!token || typeof token !== 'string') {
          throw new Error('Token no es una cadena válida');
        }
        
        const parts = token.split('.');
        console.log('parseJwt - Partes del token:', parts.length);
        
        if (parts.length !== 3) {
          throw new Error('El token no tiene el formato JWT válido (debe tener 3 partes)');
        }
        
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const parsed = JSON.parse(jsonPayload);
        console.log('parseJwt - Token decodificado exitosamente');
        return parsed;
      } catch (error) {
        console.error('Error al decodificar JWT:', error.message);
        console.error('Error completo:', error);
        throw new Error('Token inválido: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.google-auth-container {
  width: 100%;
}

.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider-text {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

#google-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  text-align: center;
}
</style>

