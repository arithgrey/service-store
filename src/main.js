import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router'; 
import axiosInstance from "@/axiosInstance";
import store from '@/store';
import EcommerceHelper from '@/helpers/EcommerceHelper';
import AnalyticsMixin from '@/helpers/AnalyticsMixin';
import Assistant from '@/components/Bot/Assistant.vue'

const app = createApp(App);

app.use(router);
app.use(store);
app.mixin(EcommerceHelper);
app.mixin(AnalyticsMixin);

app.config.globalProperties.$axios = axiosInstance;

// Registrar el analytics tracker globalmente
app.config.globalProperties.$analyticsTracker = null;

app.component('Assistant', Assistant)
app.mount('#app');
