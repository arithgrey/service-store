# 🔐 Autenticación con Google - Documentación

## 📋 Descripción General

Este módulo implementa autenticación con Google OAuth 2.0 en el sistema de login, permitiendo a los usuarios iniciar sesión o registrarse usando su cuenta de Google.

## 🏗️ Arquitectura

### Componentes Creados

1. **`GoogleAuth.vue`** - Componente principal de autenticación con Google
2. **`GoogleOAuth.js`** - Helper con utilidades para manejar OAuth de Google
3. **`google.js`** - Archivo de configuración

### Flujo de Autenticación

```
Usuario → Click "Continuar con Google" 
    ↓
Google OAuth Popup
    ↓
Validación de Token JWT
    ↓
Envío al Backend (/oauth/login/google/)
    ↓
Recepción de Token + User
    ↓
Guardado en Vuex Store
    ↓
Redirección según perfil
```

## 🚀 Configuración Inicial

### 1. Obtener Google Client ID

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Google+ API**
4. Ve a **Credenciales** → **Crear Credenciales** → **ID de cliente OAuth 2.0**
5. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **Orígenes autorizados**: 
     - `http://localhost:5173` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **URIs de redirección autorizados**:
     - `http://localhost:5173/auth/google/callback`
     - `https://tu-dominio.com/auth/google/callback`

### 2. Configurar Variables de Entorno

**⚠️ IMPORTANTE**: Según nuestros estándares, las variables de entorno se configuran en `docker-compose.yml`

Ya están configuradas en el archivo, solo necesitas establecer los valores en tu sistema:

```bash
# Exportar variables de entorno en el host
export VITE_GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
export VITE_GOOGLE_REDIRECT_URI="http://localhost:5173/auth/google/callback"
```

O crear un archivo `.env` en la raíz del proyecto:

```bash
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 3. Reiniciar el Contenedor

```bash
cd /home/arithgrey/enid_service/services/service-store
docker-compose restart frontend
```

## 📦 Dependencias Instaladas

```json
{
  "vue3-google-login": "^2.x.x"
}
```

Instalada con:
```bash
docker-compose exec frontend npm install vue3-google-login --legacy-peer-deps
```

## 🔧 Uso del Componente

### Implementación Básica

El componente ya está integrado en `Login.vue`:

```vue
<template>
  <div>
    <!-- Formulario de email/password -->
    <form @submit.prevent="submitForm">
      <!-- ... campos ... -->
    </form>
    
    <!-- Autenticación con Google -->
    <GoogleAuth @google-auth-success="handleGoogleAuthSuccess" />
  </div>
</template>

<script>
import GoogleAuth from '@/components/Login/GoogleAuth.vue';

export default {
  components: {
    GoogleAuth
  },
  methods: {
    handleGoogleAuthSuccess(user) {
      console.log('Usuario autenticado:', user);
    }
  }
}
</script>
```

### Eventos Emitidos

- `@google-auth-success`: Se emite cuando la autenticación es exitosa
  - Payload: `{ user }` - Información del usuario

## 🛠️ API Backend Requerida

El frontend espera un endpoint en el backend:

### `POST /oauth/login/google/`

**Request Body:**
```json
{
  "email": "usuario@gmail.com",
  "name": "Nombre Usuario",
  "google_id": "102938475639201847563",
  "picture": "https://lh3.googleusercontent.com/...",
  "email_verified": true,
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response (200/201):**
```json
{
  "token": "jwt-token",
  "refresh_token": "refresh-token",
  "user": {
    "id": 1,
    "email": "usuario@gmail.com",
    "name": "Nombre Usuario",
    "profile": "ecommerce"
  }
}
```

**Response Error (400/401):**
```json
{
  "error": "Mensaje de error descriptivo"
}
```

## 🎨 Personalización

### Cambiar Estilo del Botón

Edita `GoogleAuth.vue`:

```vue
<style scoped>
.google-auth-button {
  /* Personaliza aquí */
  background-color: white;
  border: 1px solid #d1d5db;
  /* ... */
}
</style>
```

### Cambiar Configuración del Botón

Edita `src/config/google.js`:

```javascript
export const GOOGLE_CONFIG = {
  buttonConfig: {
    theme: 'filled_blue',  // 'outline', 'filled_blue', 'filled_black'
    size: 'large',          // 'small', 'medium', 'large'
    text: 'signin_with',    // 'signin_with', 'signup_with', 'continue_with'
    shape: 'pill'           // 'rectangular', 'pill', 'circle', 'square'
  }
};
```

## 🧪 Testing

### Verificar Configuración

Abre la consola del navegador al cargar la aplicación:

```javascript
// Si ves este warning, la configuración está incompleta:
⚠️ Configuración de Google OAuth incompleta:
  - VITE_GOOGLE_CLIENT_ID no está configurado en las variables de entorno
```

### Probar Autenticación

1. Abre `http://localhost:5173`
2. Ve a Login
3. Haz click en "Continuar con Google"
4. Debería abrir popup de Google
5. Selecciona una cuenta
6. Verifica en Network que se llame a `/oauth/login/google/`
7. Verifica que se guarden tokens en Vuex Store

## 🔍 Debugging

### El botón de Google no aparece

1. Verifica que `VITE_GOOGLE_CLIENT_ID` esté configurado
2. Revisa la consola del navegador
3. Verifica que el contenedor tenga las variables:
   ```bash
   docker-compose exec frontend env | grep VITE_GOOGLE
   ```

### Error: "Invalid Client ID"

1. Verifica que el Client ID sea correcto
2. Verifica que el origen esté autorizado en Google Console
3. Verifica que no haya espacios o caracteres extras

### El popup se cierra sin autenticar

1. Verifica que los URIs de redirección estén correctos en Google Console
2. Verifica que las cookies de terceros estén habilitadas
3. Prueba en modo incógnito

## 📚 Helper GoogleOAuth.js

### Métodos Disponibles

```javascript
import GoogleOAuthHelper from '@/helpers/GoogleOAuth';

// Decodificar JWT de Google
const userInfo = GoogleOAuthHelper.parseJwt(credential);

// Validar token
const isValid = GoogleOAuthHelper.isValidGoogleToken(token);

// Extraer información del usuario
const userData = GoogleOAuthHelper.extractUserInfo(credential);

// Obtener ruta de redirección según perfil
const route = GoogleOAuthHelper.getRedirectRoute('ecommerce');

// Formatear errores
const errorMsg = GoogleOAuthHelper.formatError(error);
```

## 🚨 Consideraciones de Seguridad

1. **Validación Backend**: El backend DEBE validar el token de Google
2. **HTTPS en Producción**: Google requiere HTTPS para OAuth en producción
3. **Client ID Público**: El Client ID es público, pero NUNCA compartas el Client Secret
4. **Validación de Email**: Verifica `email_verified: true` en el backend

## 📝 Notas Importantes

- ✅ Cumple con estándares: Todo ejecuta en Docker
- ✅ Variables de entorno en docker-compose.yml
- ✅ Sin archivos .sh ni Makefiles
- ✅ Componente reutilizable y modular
- ✅ Manejo de errores robusto
- ✅ Validación de configuración en tiempo de ejecución

## 🔄 Próximos Pasos (Backend)

Para completar la implementación, el backend debe:

1. Crear endpoint `POST /oauth/login/google/`
2. Validar el token de Google con la API de Google
3. Crear o actualizar usuario en la base de datos
4. Generar JWT propio del sistema
5. Retornar tokens y datos del usuario

### Ejemplo de validación en Backend (Django):

```python
from google.oauth2 import id_token
from google.auth.transport import requests

def verify_google_token(credential):
    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
        return idinfo
    except ValueError:
        raise Exception("Token inválido")
```

## 📞 Soporte

Para problemas o dudas:
1. Revisa la documentación de [vue3-google-login](https://www.npmjs.com/package/vue3-google-login)
2. Consulta la [documentación de Google OAuth](https://developers.google.com/identity/protocols/oauth2)
3. Revisa los logs del contenedor: `docker-compose logs -f frontend`

