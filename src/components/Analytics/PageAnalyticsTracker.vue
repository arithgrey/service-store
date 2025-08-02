<template>
  <div class="page-analytics-tracker">
    <!-- Este componente es invisible y solo captura datos -->
  </div>
</template>

<script>
export default {
  name: 'PageAnalyticsTracker',
  data() {
    return {
      sessionId: this.generateSessionId(),
      currentPageData: null,
      pageStartTime: Date.now(),
      interactions: 0,
      scrollDepth: 0,
      isTracking: false
    }
  },
  methods: {
    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    
    getDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/mobile|android|iphone|ipad|phone/.test(userAgent)) {
        return 'mobile'
      } else if (/tablet|ipad/.test(userAgent)) {
        return 'tablet'
      }
      return 'desktop'
    },
    
    getBrowser() {
      const userAgent = navigator.userAgent
      if (userAgent.includes('Chrome')) return 'Chrome'
      if (userAgent.includes('Firefox')) return 'Firefox'
      if (userAgent.includes('Safari')) return 'Safari'
      if (userAgent.includes('Edge')) return 'Edge'
      if (userAgent.includes('Opera')) return 'Opera'
      return 'Unknown'
    },
    
    getOS() {
      const userAgent = navigator.userAgent
      if (userAgent.includes('Windows')) return 'Windows'
      if (userAgent.includes('Mac')) return 'macOS'
      if (userAgent.includes('Linux')) return 'Linux'
      if (userAgent.includes('Android')) return 'Android'
      if (userAgent.includes('iOS')) return 'iOS'
      return 'Unknown'
    },
    
    getUTMParameter(name) {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(name) || ''
    },
    
    getUserId() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          return payload.user_id || ''
        } catch (e) {
          return ''
        }
      }
      return ''
    },
    
    // Determinar la sección específica basada en la ruta
    getPageSection() {
      const route = this.$route
      const path = route.path
      
      // Secciones específicas
      if (path.includes('/product-detail')) return 'product_detail'
      if (path.includes('/checkout')) return 'checkout'
      if (path.includes('/cart')) return 'shopping_cart'
      if (path.includes('/search')) return 'search_results'
      if (path.includes('/category')) return 'category_browse'
      if (path.includes('/account')) return 'user_account'
      if (path.includes('/search-leads')) return 'leads_management'
      if (path.includes('/page-analytics')) return 'analytics_dashboard'
      if (path === '/') return 'homepage'
      
      return 'other'
    },
    
    // Trackear eventos específicos de ecommerce
    trackEcommerceEvent(eventType, data = {}) {
      if (!this.currentPageData) return
      
      const eventData = {
        ...this.currentPageData,
        metadata: {
          ...this.currentPageData.metadata,
          event_type: eventType,
          ecommerce_data: data
        }
      }
      
      this.sendAnalyticsData(eventData, '/lead/page-analytics/page-access/')
    },
    
    // Trackear vista de producto
    trackProductView(productId, productName, category) {
      this.trackEcommerceEvent('product_view', {
        product_id: productId,
        product_name: productName,
        category: category,
        price: this.getProductPrice(productId)
      })
    },
    
    // Trackear agregar al carrito
    trackAddToCart(productId, productName, quantity, price) {
      this.trackEcommerceEvent('add_to_cart', {
        product_id: productId,
        product_name: productName,
        quantity: quantity,
        price: price
      })
    },
    
    // Trackear inicio de checkout
    trackBeginCheckout() {
      this.trackEcommerceEvent('begin_checkout', {
        cart_total: this.getCartTotal(),
        cart_items: this.getCartItems()
      })
    },
    
    // Trackear compra completada
    trackPurchase(orderId, total, currency = 'MXN') {
      this.trackEcommerceEvent('purchase', {
        order_id: orderId,
        total: total,
        currency: currency,
        items: this.getCartItems()
      })
    },
    
    // Trackear búsqueda
    trackSearch(query, resultsCount) {
      this.trackEcommerceEvent('search', {
        query: query,
        results_count: resultsCount
      })
    },
    
    getProductPrice(productId) {
      // Intentar obtener el precio del producto de la página
      const priceElement = document.querySelector(`[data-price][data-product-id="${productId}"], .price[data-product-id="${productId}"], .product-price[data-product-id="${productId}"]`)
      if (priceElement) {
        const priceText = priceElement.textContent
        return parseFloat(priceText.replace(/[^\d.]/g, '')) || 0
      }
      return 0
    },

    getCartTotal() {
      const cartItems = this.getCartItems();
      if (!cartItems || cartItems.length === 0) return 0;
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCartItems() {
      const cartItems = [];
      document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.dataset.productId;
        const productName = item.querySelector('.product-name').textContent;
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const price = parseFloat(item.querySelector('.price').textContent.replace(/[^\d.]/g, ''));
        cartItems.push({
          product_id: productId,
          product_name: productName,
          quantity: quantity,
          price: price
        });
      });
      return cartItems;
    },
    
    trackPageAccess() {
      if (this.isTracking) return
      
      this.isTracking = true
      
      const analyticsData = {
        page_url: window.location.pathname,
        page_title: document.title,
        section: this.getPageSection(),
        user_agent: navigator.userAgent,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || '',
        utm_source: this.getUTMParameter('utm_source'),
        utm_medium: this.getUTMParameter('utm_medium'),
        utm_campaign: this.getUTMParameter('utm_campaign'),
        session_id: this.sessionId,
        user_id: this.getUserId(),
        time_on_page: 0,
        scroll_depth: this.scrollDepth,
        interactions: this.interactions,
        metadata: {
          screen_resolution: `${screen.width}x${screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          route_name: this.$route.name,
          route_params: this.$route.params
        }
      }
      
      this.sendAnalyticsData(analyticsData)
    },
    
    async sendAnalyticsData(data, endpoint = '/lead/page-analytics/page-access/') {
      try {
        await this.$axios.post(endpoint, data)
      } catch (error) {
        console.warn('Error enviando analytics:', error)
      }
    },
    
    trackInteraction() {
      this.interactions++
    },
    
    trackScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > this.scrollDepth) {
        this.scrollDepth = scrollPercent
      }
    },
    
    trackTimeOnPage() {
      const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
      return timeOnPage
    },
    
    setupEventListeners() {
      // Track clicks
      document.addEventListener('click', this.trackInteraction)
      
      // Track scroll
      document.addEventListener('scroll', this.trackScroll)
      
      // Track before unload
      window.addEventListener('beforeunload', () => {
        const timeOnPage = this.trackTimeOnPage()
        this.currentPageData.time_on_page = timeOnPage
        this.trackPageAccess()
      })
      
      // Track visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const timeOnPage = this.trackTimeOnPage()
          this.currentPageData.time_on_page = timeOnPage
          this.trackPageAccess()
        }
      })
    },
    
    removeEventListeners() {
      document.removeEventListener('click', this.trackInteraction)
      document.removeEventListener('scroll', this.trackScroll)
    },
    
    // Método público para trackear eventos desde otros componentes
    trackEvent(eventType, data = {}) {
      this.trackEcommerceEvent(eventType, data)
    }
  },
  
  watch: {
    // Escuchar cambios de ruta para trackear cada página
    '$route'(to, from) {
      // Finalizar tracking de la página anterior
      if (from.path !== to.path) {
        const timeOnPage = this.trackTimeOnPage()
        if (this.currentPageData) {
          this.currentPageData.time_on_page = timeOnPage
          this.sendAnalyticsData(this.currentPageData)
        }
      }
      
      // Inicializar tracking de la nueva página
      this.pageStartTime = Date.now()
      this.interactions = 0
      this.scrollDepth = 0
      this.isTracking = false
      
      this.currentPageData = {
        page_url: to.path,
        page_title: document.title,
        section: this.getPageSection(),
        user_agent: navigator.userAgent,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: from.path,
        utm_source: this.getUTMParameter('utm_source'),
        utm_medium: this.getUTMParameter('utm_medium'),
        utm_campaign: this.getUTMParameter('utm_campaign'),
        session_id: this.sessionId,
        user_id: this.getUserId(),
        time_on_page: 0,
        scroll_depth: 0,
        interactions: 0,
        metadata: {
          screen_resolution: `${screen.width}x${screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          route_name: to.name,
          route_params: to.params,
          previous_route: from.path
        }
      }
      
      // Trackear acceso a la nueva página después de un delay
      setTimeout(() => {
        this.trackPageAccess()
      }, 1000)
    }
  },
  
  mounted() {
    this.setupEventListeners()
    
    // Inicializar datos de la página actual
    this.currentPageData = {
      page_url: this.$route.path,
      page_title: document.title,
      section: this.getPageSection(),
      user_agent: navigator.userAgent,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || '',
      utm_source: this.getUTMParameter('utm_source'),
      utm_medium: this.getUTMParameter('utm_medium'),
      utm_campaign: this.getUTMParameter('utm_campaign'),
      session_id: this.sessionId,
      user_id: this.getUserId(),
      time_on_page: 0,
      scroll_depth: 0,
      interactions: 0,
      metadata: {
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        route_name: this.$route.name,
        route_params: this.$route.params
      }
    }
    
    // Trackear acceso inicial después de un delay
    setTimeout(() => {
      this.trackPageAccess()
    }, 1000)
  },
  
  beforeUnmount() {
    this.removeEventListeners()
    const timeOnPage = this.trackTimeOnPage()
    if (this.currentPageData) {
      this.currentPageData.time_on_page = timeOnPage
      this.sendAnalyticsData(this.currentPageData)
    }
  }
}
</script>

<style scoped>
.page-analytics-tracker {
  position: fixed;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}
</style> 