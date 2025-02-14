import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router'; 
import axiosInstance from "@/axiosInstance";
import store from '@/store';
import EcommerceHelper from '@/helpers/EcommerceHelper';

const app = createApp(App);

app.use(router);
app.use(store);
app.mixin(EcommerceHelper);

app.config.globalProperties.$axios = axiosInstance;
app.mount('#app');
