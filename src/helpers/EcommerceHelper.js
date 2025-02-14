import { ECOMMERCES } from '@/config/ecommerce';

export default {
  computed: {
    storeName() {
      const store_id = import.meta.env.VITE_STORE;
      return ECOMMERCES[store_id] || 'Enid Service';
    },
    storeBoldPart() {
      return this.storeName.split(' ')[0] || '';
    },
    storeNormalPart() {
      const parts = this.storeName.split(' ');
      return parts.slice(1).join(' ');
    }
  }
};
