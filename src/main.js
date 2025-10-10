import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router'; 
import axiosInstance from "@/axiosInstance";
import store from '@/store';
import EcommerceHelper from '@/helpers/EcommerceHelper';
import AnalyticsMixin from '@/helpers/AnalyticsMixin';
import Assistant from '@/components/Bot/Assistant.vue';
import vue3GoogleLogin from 'vue3-google-login';
import { getGoogleLoginConfig, validateGoogleConfig } from '@/config/google';

const app = createApp(App);

// Validar configuración de Google antes de inicializar
const googleConfigValidation = validateGoogleConfig();
if (!googleConfigValidation.isValid) {
  console.warn('⚠️ Configuración de Google OAuth incompleta:');
  googleConfigValidation.errors.forEach(error => console.warn(`  - ${error}`));
  console.warn('La autenticación con Google no estará disponible hasta configurar las variables de entorno necesarias.');
}

app.use(router);
app.use(store);
app.mixin(EcommerceHelper);
app.mixin(AnalyticsMixin);

// Configurar Google OAuth
if (googleConfigValidation.isValid) {
  app.use(vue3GoogleLogin, getGoogleLoginConfig());
}

app.config.globalProperties.$axios = axiosInstance;

// Registrar el analytics tracker globalmente
app.config.globalProperties.$analyticsTracker = null;

app.component('Assistant', Assistant)
app.mount('#app');
