# Sistema de Analytics de Páginas

## 🎯 **Descripción**

Sistema de tracking granular tipo Facebook que captura eventos específicos de ecommerce y comportamiento de usuario en tiempo real.

## 🚀 **Características**

### ✅ **Tracking Automático**
- **Cambios de ruta**: Se trackea cada página/sección individualmente
- **Tiempo en página**: Medición precisa del tiempo de permanencia
- **Scroll depth**: Profundidad de scroll en cada página
- **Interacciones**: Clicks y eventos de usuario
- **Dispositivo y navegador**: Información técnica del usuario

### 🛒 **Eventos de Ecommerce**
- **Vista de producto**: `trackProductView(productId, name, category)`
- **Agregar al carrito**: `trackAddToCart(productId, name, quantity, price)`
- **Inicio de checkout**: `trackBeginCheckout()`
- **Compra completada**: `trackPurchase(orderId, total, currency)`
- **Búsqueda**: `trackSearch(query, resultsCount)`

### 🎨 **Eventos Personalizados**
- **Clicks en botones**: `trackButtonClick(buttonName)`
- **Formularios**: `trackFormSubmit(formName, data)`
- **Filtros**: `trackFilterApplied(filterType, value)`
- **Ordenamiento**: `trackSortApplied(sortBy, order)`
- **Paginación**: `trackPagination(pageNumber, totalPages)`

## 📋 **Cómo Usar**

### 1. **En cualquier componente Vue:**

```javascript
export default {
  methods: {
    // Tracking automático disponible en todos los componentes
    handleAddToCart() {
      this.trackAddToCart('PROD-123', 'Pesas 10kg', 1, 299.99)
      // Lógica del carrito...
    },
    
    handleSearch() {
      this.trackSearch('pesas', 25)
      // Lógica de búsqueda...
    },
    
    handleButtonClick() {
      this.trackButtonClick('add_to_cart_button')
    }
  }
}
```

### 2. **Eventos disponibles:**

```javascript
// Ecommerce
this.trackProductView(productId, name, category)
this.trackAddToCart(productId, name, quantity, price)
this.trackBeginCheckout()
this.trackPurchase(orderId, total, 'MXN')
this.trackSearch(query, resultsCount)

// Personalizados
this.trackEvent('custom_event', { data: 'value' })
this.trackButtonClick('button_name')
this.trackFormSubmit('contact_form', { email: 'user@example.com' })
this.trackFilterApplied('category', 'fitness')
this.trackSortApplied('price', 'asc')
this.trackPagination(2, 10)
```

## 🏗️ **Arquitectura**

### **Componentes:**

1. **`PageAnalyticsTracker.vue`**: Componente invisible que maneja el tracking
2. **`AnalyticsMixin.js`**: Mixin que proporciona métodos de tracking
3. **`PageAnalyticsDashboard.vue`**: Dashboard para visualizar métricas

### **Flujo de datos:**

```
Usuario interactúa → Evento capturado → Enviado al backend → Dashboard actualizado
```

### **Secciones detectadas automáticamente:**

- `homepage`: Página principal
- `product_detail`: Detalle de producto
- `checkout`: Proceso de compra
- `shopping_cart`: Carrito de compras
- `search_results`: Resultados de búsqueda
- `category_browse`: Navegación por categorías
- `user_account`: Área de usuario
- `leads_management`: Gestión de leads
- `analytics_dashboard`: Dashboard de analytics

## 📊 **Datos Capturados**

### **Información de página:**
- URL y título
- Sección específica
- Tiempo de permanencia
- Profundidad de scroll
- Número de interacciones

### **Información del usuario:**
- Dispositivo (mobile/desktop/tablet)
- Navegador y sistema operativo
- Resolución de pantalla
- Idioma y zona horaria
- ID de usuario (si está autenticado)

### **Información de marketing:**
- Parámetros UTM (source, medium, campaign)
- Página de origen (referrer)
- ID de sesión único

## 🔧 **Configuración**

### **1. El tracker se registra automáticamente en MainLayout**

### **2. Disponible globalmente como `this.$analyticsTracker`**

### **3. Métodos disponibles en todos los componentes vía mixin**

## 📈 **Dashboard**

El dashboard muestra:
- **KPIs principales**: Vistas, visitantes únicos, tiempo promedio, tasa de rebote
- **Páginas más visitadas**: Ranking de páginas por vistas
- **Distribución por dispositivo**: Mobile vs desktop vs tablet
- **Tendencias**: Últimos 7 días con métricas diarias
- **Secciones más visitadas**: Engagement por sección

## 🎯 **Casos de Uso**

### **Ecommerce:**
```javascript
// Vista de producto
this.trackProductView('PROD-123', 'Pesas 10kg', 'Fitness')

// Agregar al carrito
this.trackAddToCart('PROD-123', 'Pesas 10kg', 1, 299.99)

// Comprar
this.trackPurchase('ORDER-456', 599.98, 'MXN')
```

### **Búsqueda:**
```javascript
// Búsqueda de productos
this.trackSearch('pesas fitness', 15)

// Aplicar filtro
this.trackFilterApplied('price_range', '100-500')

// Ordenar resultados
this.trackSortApplied('price', 'asc')
```

### **Formularios:**
```javascript
// Enviar formulario de contacto
this.trackFormSubmit('contact_form', {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  message: 'Consulta sobre productos'
})
```

## 🚀 **Ventajas**

1. **Granular**: Tracking por página/sección específica
2. **Automático**: No requiere configuración manual
3. **Escalable**: Funciona en toda la aplicación
4. **Tipo Facebook**: Eventos específicos de ecommerce
5. **Tiempo real**: Datos actualizados constantemente
6. **No intrusivo**: No afecta la experiencia del usuario

## 📝 **Notas**

- El tracker es invisible y no interfiere con la UI
- Los datos se envían de forma asíncrona
- Errores de tracking no afectan la funcionalidad
- Compatible con el sistema de reverse proxy existente 