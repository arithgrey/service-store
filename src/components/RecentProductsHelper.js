import { ref, computed } from 'vue';
import LocalStorageHelper from '@/helpers/localStorageHelper';

/**
 * Helper para manejar productos recientemente vistos
 * Versión simplificada para mantener estructura existente
 */
export function useRecentProducts() {
  const recentProducts = ref([]);
  const maxProducts = ref(10); // Configurable - máximo 10 productos
  const isInitialized = ref(false);

  const initialize = () => {
    if (isInitialized.value) return;
    
    if (LocalStorageHelper.isAvailable()) {
      const stored = LocalStorageHelper.getItem(
        LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS, 
        []
      );
      recentProducts.value = Array.isArray(stored) ? stored : [];
    }
    isInitialized.value = true;
  };

  const addProduct = (product) => {
    if (!product || !product.id) {
      console.warn('Producto inválido para agregar a recientes');
      return;
    }

    // Remover si ya existe
    recentProducts.value = recentProducts.value.filter(p => p.id !== product.id);
    
    // Agregar al inicio con timestamp
    const productWithTimestamp = {
      ...product,
      viewedAt: new Date().toISOString(),
      viewCount: 1
    };
    
    recentProducts.value.unshift(productWithTimestamp);
    
    // Mantener solo el máximo de productos
    if (recentProducts.value.length > maxProducts.value) {
      recentProducts.value = recentProducts.value.slice(0, maxProducts.value);
    }
    
    // Guardar en localStorage
    LocalStorageHelper.setItem(
      LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS, 
      recentProducts.value
    );
  };

  const updateViewCount = (productId) => {
    const product = recentProducts.value.find(p => p.id === productId);
    if (product) {
      product.viewCount = (product.viewCount || 0) + 1;
      product.viewedAt = new Date().toISOString();
      
      // Reordenar por fecha de vista más reciente
      recentProducts.value.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
      
      LocalStorageHelper.setItem(
        LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS, 
        recentProducts.value
      );
    }
  };

  const removeProduct = (productId) => {
    recentProducts.value = recentProducts.value.filter(p => p.id !== productId);
    LocalStorageHelper.setItem(
      LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS, 
      recentProducts.value
    );
  };

  const clearRecentProducts = () => {
    recentProducts.value = [];
    LocalStorageHelper.removeItem(LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS);
  };

  const getRecentProducts = (limit = null) => {
    const products = limit 
      ? recentProducts.value.slice(0, limit)
      : recentProducts.value;
    
    return products.map(product => ({
      ...product,
      name: product.name || product.short_name || 'Producto sin nombre',
      price: product.price || 0,
      formatted_price: product.formatted_price || `$${product.price || 0}`,
      slug: product.slug || '',
      category: product.category || { slug: '' }
    }));
  };

  const isProductRecent = (productId) => {
    return recentProducts.value.some(p => p.id === productId);
  };

  const getRecentProductsStats = computed(() => {
    const total = recentProducts.value.length;
    const uniqueCategories = new Set(
      recentProducts.value.map(p => p.category?.name || 'Sin categoría')
    ).size;
    
    const mostViewed = recentProducts.value
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
    
    return {
      total,
      uniqueCategories,
      mostViewed,
      hasProducts: total > 0
    };
  });

  const setMaxProducts = (max) => {
    if (max > 0 && max <= 100) {
      maxProducts.value = max;
      if (recentProducts.value.length > max) {
        recentProducts.value = recentProducts.value.slice(0, max);
        LocalStorageHelper.setItem(
          LocalStorageHelper.STORAGE_KEYS.RECENT_PRODUCTS, 
          recentProducts.value
        );
      }
    }
  };

  return {
    recentProducts: computed(() => recentProducts.value),
    isInitialized: computed(() => isInitialized.value),
    initialize,
    addProduct,
    updateViewCount,
    removeProduct,
    clearRecentProducts,
    getRecentProducts,
    isProductRecent,
    setMaxProducts,
    stats: getRecentProductsStats
  };
} 