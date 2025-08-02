export default {
  methods: {
    // Trackear vista de producto
    trackProductView(productId, productName, category) {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackProductView(productId, productName, category)
      }
    },
    
    // Trackear agregar al carrito
    trackAddToCart(productId, productName, quantity, price) {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackAddToCart(productId, productName, quantity, price)
      }
    },
    
    // Trackear inicio de checkout
    trackBeginCheckout() {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackBeginCheckout()
      }
    },
    
    // Trackear compra completada
    trackPurchase(orderId, total, currency = 'MXN') {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackPurchase(orderId, total, currency)
      }
    },
    
    // Trackear búsqueda
    trackSearch(query, resultsCount) {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackSearch(query, resultsCount)
      }
    },
    
    // Trackear evento personalizado
    trackEvent(eventType, data = {}) {
      if (this.$analyticsTracker) {
        this.$analyticsTracker.trackEvent(eventType, data)
      }
    },
    
    // Trackear clic en botón
    trackButtonClick(buttonName, section = null) {
      this.trackEvent('button_click', {
        button_name: buttonName,
        section: section || this.getCurrentSection(),
        page_url: this.$route.path
      })
    },
    
    // Trackear formulario enviado
    trackFormSubmit(formName, data = {}) {
      this.trackEvent('form_submit', {
        form_name: formName,
        form_data: data,
        page_url: this.$route.path
      })
    },
    
    // Trackear filtro aplicado
    trackFilterApplied(filterType, filterValue) {
      this.trackEvent('filter_applied', {
        filter_type: filterType,
        filter_value: filterValue,
        page_url: this.$route.path
      })
    },
    
    // Trackear ordenamiento
    trackSortApplied(sortBy, sortOrder) {
      this.trackEvent('sort_applied', {
        sort_by: sortBy,
        sort_order: sortOrder,
        page_url: this.$route.path
      })
    },
    
    // Trackear paginación
    trackPagination(pageNumber, totalPages) {
      this.trackEvent('pagination', {
        page_number: pageNumber,
        total_pages: totalPages,
        page_url: this.$route.path
      })
    },
    
    // Obtener sección actual
    getCurrentSection() {
      const path = this.$route.path
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
    }
  }
} 