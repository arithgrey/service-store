import { createStore } from 'vuex';

// Función helper para parsear el carrito de forma segura
function getCartFromStorage() {
  try {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    
    const parsed = JSON.parse(cartData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    localStorage.removeItem('cart'); // Limpiar datos corruptos
    return [];
  }
}

// Función helper para parsear el usuario de forma segura
function getUserFromStorage() {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const parsed = JSON.parse(userData);
    return parsed;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user'); // Limpiar datos corruptos
    return null;
  }
}

export default createStore({
  state: {    
    user: getUserFromStorage(),
    token: localStorage.getItem('token') || null,
    refresh_token: localStorage.getItem('refresh_token') || null,
    profile: localStorage.getItem('profile') || null,
    storeId:1,
    cart: getCartFromStorage(),
    showDialog: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setRefreshToken(state, refresh_token) {
      state.refresh_token = refresh_token;
      localStorage.setItem('refresh_token', refresh_token);
    },
    setProfile(state, profile) {
      state.profile = profile;
      localStorage.setItem('profile', profile);
    },
    clearToken(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    addToCart(state, product) {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cart.push({ product: product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));

      if (typeof fbq === 'function') {
        fbq('track', 'AddToWishlist');
      }
    },
    removeFromCart(state, product) {
      state.cart = state.cart.filter(item => item.product.id !== product.id);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity(state, { productId, quantity }) {
      const item = state.cart.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem('cart');
    },
  },
  getters: {
    storeId(state){
      return state.storeId;
    },
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.token !== null;
    },
    totalItemsInCart: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    getProductsFromCart: (state) => {
      const products = state.cart.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      return products;
    },
  },
  actions: {

  },
});
