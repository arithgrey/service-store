<template>
  <div class="min-h-screen bg-gray-900">


    <!-- Hero Section -->
    <section class="relative pt-20 pb-20 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Side - Product Title -->
          <div class="text-center lg:text-left">
            <h1 class="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Paga
              <br>
              al rebicir
            </h1>
          </div>
          
          <!-- Center - Product Image with Orange Accent -->
          <div class="relative flex justify-center">
            <div class="relative">
              <!-- Background Text -->
              <div class="absolute inset-0 flex items-center justify-center opacity-10">
                <span class="text-8xl font-bold text-gray-600">Blvck Tumbler</span>
              </div>
              
              <!-- Main Product Image -->
              <div class="relative z-10 w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-700">
                <div class="w-64 h-64 bg-gray-900 rounded-full flex items-center justify-center">
                  <div class="w-48 h-48 bg-black rounded-full flex items-center justify-center border-2 border-gray-600">
                    <div class="text-center text-white">
                      <div class="text-sm font-bold mb-2">PASA AL</div>
                      <div class="text-xs">SIGUIENTE</div>
                      <div class="text-xs text-gray-400 mt-1">NIVEL YA!</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Orange Accent Circle -->
              <div class="absolute -right-8 top-1/2 transform -translate-y-1/2 w-32 h-32 border-8 border-orange-500 rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Arrow -->
        <div class="flex justify-end mt-16">
          <div class="text-white cursor-pointer">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Lower Content Sections -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-16">
          <!-- Left Section -->
          <div class="text-white">
            

            
           
            <!-- Product Reference Info -->
            <div v-if="productName && productImage" class="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h3 class="text-lg font-bold text-white mb-4">Producto que te interesa:</h3>
              
              <!-- Loading State -->
              <div v-if="productLoading" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span class="ml-3 text-gray-300">Cargando información del producto...</span>
              </div>
              
              <!-- Product Card - Solo mostrar si hay producto real -->
              <div v-else-if="productName && productImage" class="flex items-start space-x-4">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img 
                    :src="productImage" 
                    :alt="productName"
                    class="w-24 h-24 object-cover rounded-lg border border-gray-600"
                  />
                </div>
                
                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-lg mb-2">{{ productName }}</h4>
                  <p class="text-gray-300 text-sm mb-2">{{ productCategory }}</p>
                  
                  <!-- Price -->
                  <div class="flex items-center mb-3">
                    <span class="text-orange-400 font-bold text-xl">{{ formatPrice(productPrice) }}</span>
                    <span v-if="productOriginalPrice && productOriginalPrice > productPrice" class="text-gray-500 line-through ml-2">{{ formatPrice(productOriginalPrice) }}</span>
                  </div>
                  
                  <!-- Rating -->
                  <div class="flex items-center mb-3">
                    <div class="flex text-yellow-400">
                      <svg v-for="star in 5" :key="star" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="text-gray-300 text-sm ml-2">4.8 (120 reseñas)</span>
                  </div>
                  
                  <!-- Features -->
                  <div v-if="productFeatures && productFeatures.length > 0" class="mb-3">
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="feature in productFeatures" 
                        :key="feature"
                        class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                      >
                        {{ feature }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Stock Status -->
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span class="text-green-400 text-sm font-medium">En stock</span>
                  </div>
                </div>
              </div>
              

            </div>
            
            <button 
              v-if="productName"
              @click="showForm = true"
              class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-bold transition-colors"
            >
              Agregar al Carrito
            </button>
          </div>
          
          <!-- Right Section - Timeline del Proceso -->
          <div class="text-white">
            <h2 class="text-3xl font-bold mb-6">¿Cual es el proceso?</h2>
            <p class="text-lg text-gray-300 leading-relaxed mb-8">
              Tú eliges, nosotros entregamos, tú pagas cuando recibes. 
            </p>
            
            <!-- Timeline en Forma de Árbol -->
            <div class="relative">
              <!-- Línea de conexión horizontal central -->
              <div class="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300"></div>
              
              <!-- Paso 1 -->
              <div class="relative flex items-center mb-8">
                <div class="flex-1 pr-8 text-right">
                  <div class="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div class="flex items-center justify-end mb-2">
                      <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">PASO 1</span>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">Elige tu producto</h3>
                    
                  </div>
                </div>
                
                <!-- Círculo del paso -->
                <div class="relative z-10 flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                  <span class="text-white text-sm font-bold">1</span>
                </div>
                
                <div class="flex-1 pl-8">
                  <!-- Espacio para balance visual -->
                </div>
              </div>

              <!-- Paso 2 -->
              <div class="relative flex items-center mb-8">
                <div class="flex-1 pr-8">
                  <!-- Espacio para balance visual -->
                </div>
                
                <!-- Círculo del paso -->
                <div class="relative z-10 flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                  <span class="text-white text-sm font-bold">2</span>
                </div>
                
                <div class="flex-1 pl-8">
                  <div class="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div class="flex items-center mb-2">
                      <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">PASO 2</span>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">Registra tus datos</h3>
                    <p class="text-gray-300 text-sm">
                      Completa el formulario con tu información de contacto y dirección.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Paso 3 -->
              <div class="relative flex items-center mb-8">
                <div class="flex-1 pr-8 text-right">
                  <div class="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div class="flex items-center justify-end mb-2">
                      <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">PASO 3</span>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">Preparamos tu pedido</h3>
                    <p class="text-gray-300 text-sm">
                        Te avisamos con una llamada en cuanto vayamos de camino a tu entrega                    </p>
                  </div>
                </div>
                
                <!-- Círculo del paso -->
                <div class="relative z-10 flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                  <span class="text-white text-sm font-bold">3</span>
                </div>
                
                <div class="flex-1 pl-8">
                  <!-- Espacio para balance visual -->
                </div>
              </div>

              <!-- Paso 4 -->
              <div class="relative flex items-center mb-8">
                <div class="flex-1 pr-8">
                  <!-- Espacio para balance visual -->
                </div>
                
                <!-- Círculo del paso -->
                <div class="relative z-10 flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                  <span class="text-white text-sm font-bold">4</span>
                </div>
                
                <div class="flex-1 pl-8">
                  <div class="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div class="flex items-center mb-2">
                      <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">PASO 4</span>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">Recibes y pagas</h3>
                    <p class="text-gray-300 text-sm">
                      Te entregamos en tu puerta y pagas en ese momento.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Paso 5 -->
              <div class="relative flex items-center">
                <div class="flex-1 pr-8 text-right">
                  <div class="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div class="flex items-center justify-end mb-2">
                      <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">PASO 5</span>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">¡Disfruta tu kit!</h3>
                    
                  </div>
                </div>
                
                <!-- Círculo del paso -->
                <div class="relative z-10 flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-800">
                  <span class="text-white text-sm font-bold">5</span>
                </div>
                
                <div class="flex-1 pl-8">
                  <!-- Espacio para balance visual -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>





    <!-- Modal del Formulario -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <!-- Header del modal -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-white">
            Registra tus datos para recibir información exclusiva
          </h3>
          <button 
            @click="closeForm"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-gray-300 mb-6">
          Solo usaremos estos datos para enviarte información sobre nuestros kits premium
        </p>
        
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Nombre -->
          <div>
            <input
              v-model="form.name"
              @input="formatName"
              type="text"
              name="name"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white placeholder-gray-400"
              placeholder="Nombre completo *"
              required
            />
            <span class="text-red-400 text-sm" v-if="errors.name">
              {{ formatError(errors.name) }}
            </span>
            <span class="text-red-400 text-sm" v-if="v$?.form.name.$error">
              {{ v$?.form.name.$errors[0].$message }}
            </span>
          </div>

          <!-- Teléfono -->
          <div>
            <input
              v-model="form.phone_number"
              @input="formatPhoneNumber"
              type="tel"
              name="phone_number"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white placeholder-gray-400"
              placeholder="Teléfono *"
              required
            />
            <span class="text-red-400 text-sm" v-if="errors.phone_number">
              {{ formatError(errors.phone_number) }}
            </span>
            <span class="text-red-400 text-sm" v-if="v$?.form.phone_number.$error">
              {{ v$?.form.phone_number.$errors[0].$message }}
            </span>
          </div>

          <!-- Dirección -->
          <div>
            <AddressAutocomplete
              v-if="addressComponentLoaded"
              v-model="form.street"
              name="street"
              placeholder="Escribe tu dirección completa*"
              :input-class="'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-white placeholder-gray-400'"
              @address-selected="handleAddressSelected"
            />
            
            <!-- Placeholder mientras carga -->
            <div v-else class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
              <div class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-3"></div>
                Cargando autocompletado de direcciones...
              </div>
            </div>
            
            <span class="text-red-400 text-sm" v-if="errors.street">
              {{ formatError(errors.street) }}
            </span>
            <span class="text-red-400 text-sm" v-if="v$?.form.street.$error">
              {{ v$?.form.street.$errors[0].$message }}
            </span>
          </div>

          <!-- Botón de envío -->
          <button
            :disabled="loading"
            type="submit"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
            <span v-else>Registrar y Recibir Información</span>
          </button>
        </form>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-300 font-medium">{{ successMessage }}</span>
          </div>
          
          <!-- Botón de redirección manual -->
          <div v-if="showRedirectButton" class="mt-4 text-center">
            <button
              @click="manualRedirect"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver mi orden
            </button>
          </div>
        </div>

        <!-- Mensaje de error general -->
        <div v-if="errors.general" class="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-300 font-medium">{{ errors.general }}</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { rules } from "@/rules/checkout/paymentOnDeliveryValidator.js";
import * as utilities from "@/rules/utilities.js";
import AddressAutocomplete from "@/components/Cart/AddressAutocomplete.vue";

export default {
  name: 'KitsLandingPage',
  components: {
    AddressAutocomplete
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      showForm: false,
      productSlug: null,
      categorySlug: null,
      productName: null,
      productCategory: null,
      productPrice: null,
      productOriginalPrice: null,
      productImage: null,
      productFeatures: [],
      form: {
        name: "",
        phone_number: "",
        street: "",
        product_slug: "",
        product_name: "",
        product_category: "",
        products: [], // Campo que usa el endpoint del checkout
      },
      errors: {
        name: "",
        phone_number: "",
        street: "",
      },
      loading: false,
      productLoading: false,
      productId: null, // ID numérico del producto
      successMessage: "",
      showRedirectButton: false,
      addressComponentLoaded: false, // Control de carga del componente de direcciones
    };
  },
  validations() {
    return {
      form: rules,
    };
  },
  
  watch: {
    // Watcher para detectar cambios en la ruta
    '$route'(to, from) {
      if (to.query.product !== from.query.product || to.query.category !== from.query.category) {
        this.processUrlParams();
      }
    },
    
    // Watcher específico para los slugs del producto
    productSlug: {
      handler(newSlug, oldSlug) {
        if (newSlug && newSlug !== oldSlug) {
          if (this.categorySlug) {
            this.loadProductInfoBySlugs(newSlug, this.categorySlug);
          }
        }
      },
      immediate: true
    },
    
    categorySlug: {
      handler(newSlug, oldSlug) {
        if (newSlug && newSlug !== oldSlug) {
          if (this.productSlug) {
            this.loadProductInfoBySlugs(this.productSlug, newSlug);
          }
        }
      },
      immediate: true
    },
    
    // Watcher para optimizar la carga del modal
    showForm: {
      handler(newVal) {
        if (newVal) {
          // Cuando se abre el modal, optimizar la carga
          this.$nextTick(() => {
            this.optimizeAddressComponent();
          });
        }
      },
      immediate: false
    }
  },
  
  mounted() {
    // Procesar parámetros de la URL
    this.processUrlParams();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },
  methods: {
    ...utilities,
    
    async submitForm() {
      try {
        this.loading = true;
        this.successMessage = "";
        this.errors = {};
        
        const isValid = await this.validateForm();
        if (!isValid) return;

        // Primero agregar el producto al carrito (se guarda en localStorage)
        this.addProductToCart();
        
        // Limpiar errores como hace el checkout
        this.cleanErrors();
        
        // Agregar productos del carrito al formulario como hace el checkout
        this.form.products = this.$store.getters.getProductsFromCart;
        
        // Enviar datos al mismo endpoint que el checkout de pago contra entrega
        const response = await this.$axios.post("enid/order-payment-on-delivery/pod/", this.form);
        
        if (response.data && response.data.id) {
          // Limpiar el carrito después del envío exitoso como hace el checkout
          await this.$store.commit("clearCart");
          
          // Redirigir a la página de detalle de la orden como hace el checkout
          this.$router.push({ name: "order-detail", params: { id: response.data.id } });
        } else {
          // Fallback: mostrar mensaje de éxito y cerrar modal
          this.successMessage = "¡Gracias! Hemos recibido tus datos. Te contactaremos pronto con información sobre nuestros kits premium.";
          this.clearForm();
          
          // Agregar botón de redirección manual
          this.showRedirectButton = true;
          
          // Cerrar el modal después de 5 segundos
          setTimeout(() => {
            this.closeForm();
          }, 5000);
        }
        
      } catch (error) {
        console.error("Error durante el envío del formulario:", error);
        if (error.response && error.response.data) {
          this.errors = error.response.data;
        } else {
          this.errors = { general: "Ha ocurrido un error. Por favor, intenta nuevamente." };
        }
      } finally {
        this.loading = false;
      }
    },

    async validateForm() {
      const result = await this.v$.$validate();
      if (!result) {
        this.cleanErrors();
        return false;
      }
      return true;
    },



    clearForm() {
      this.form = {
        name: "",
        phone_number: "",
        street: "",
        product_slug: this.productSlug || "",
        product_name: this.productName || "",
        product_category: this.productCategory || ""
      };
      this.v$?.$reset();
    },

    processUrlParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const productSlug = urlParams.get('product');
      const categorySlug = urlParams.get('category');
      
      if (productSlug && categorySlug) {
        this.productSlug = productSlug;
        this.categorySlug = categorySlug;
        this.form.product_slug = productSlug;
        // Cargar información del producto dinámicamente usando slugs
        this.loadProductInfoBySlugs(productSlug, categorySlug);
      }
    },
    
        async loadProductInfoBySlugs(productSlug, categorySlug) {
      try {
        this.productLoading = true;
        
        // Usar la misma API que ProductDetail.vue
        const response = await this.$axios.get(`enid/productos/${categorySlug}/${productSlug}/`);
        
        if (response.data) {
          const product = response.data;
          
          // Actualizar datos del producto usando la misma estructura que ProductDetail
          this.productId = product.id; // ID numérico real del producto
          this.productName = product.name || product.specific_name || 'Producto';
          this.productCategory = product.category?.name || 'Categoría';
          this.productPrice = product.price || 0;
          this.productOriginalPrice = product.original_price || product.price || 0;
          this.productImage = this.getMainImage(product);
          
          // Actualizar características del producto
          this.productFeatures = product.features || product.tags || [];
          
          // Actualizar formulario
          this.form.product_name = this.productName;
          this.form.product_category = this.productCategory;
          
          // Pre-cargar el componente de direcciones para mejor UX
          this.$nextTick(() => {
            this.optimizeAddressComponent();
          });
        } else {
          throw new Error('No se recibieron datos del producto');
        }
        
      } catch (error) {
        console.error('Error al cargar información del producto:', error);
        this.setDefaultProductData();
      } finally {
        this.productLoading = false;
      }
    },
    
    setDefaultProductData() {
      // No mostrar nada si no hay producto real
      this.productId = null;
      this.productName = '';
      this.productCategory = '';
      this.productPrice = 0;
      this.productImage = '';
      this.productFeatures = [];
      
      // Limpiar formulario
      this.form.product_name = '';
      this.form.product_category = '';
    },

    closeForm() {
      this.showForm = false;
      this.clearForm();
      this.cleanErrors();
    },

    cleanErrors() {
      this.errors = {};
    },
    

    
    getMainImage(product) {
      if (!product.images || !Array.isArray(product.images)) {
        return "https://enidservice.com/public/images/04.jpg";
      }
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "https://enidservice.com/public/images/04.jpg";
    },
    
    formatPrice(price) {
      if (!price || isNaN(price)) return "$0.00";
      return price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      });
    },
    

    
    addProductToCart() {
      if (this.productSlug && this.productName) {
        // Crear objeto producto con la estructura que espera el store
        const productForCart = {
          id: this.productId || this.productSlug, // Usar ID real del producto si está disponible
          name: this.productName,
          specific_name: this.productName,
          price: this.productPrice,
          formatted_price: this.formatPrice(this.productPrice),
          image: this.productImage,
          category: {
            name: this.productCategory,
            slug: this.categorySlug
          },
          slug: this.productSlug,
          quantity: 1
        };
        
        // Agregar al carrito usando la mutación del store
        // Esto automáticamente se guarda en localStorage
        this.$store.commit("addToCart", productForCart);
      }
    },
    
    manualRedirect() {
      if (this.productId) {
        window.location.href = `/orden-compra/${this.productId}`;
      } else {
        window.location.href = '/orden-compra/1';
      }
    },
    
    // Manejar dirección seleccionada del componente AddressAutocomplete
    handleAddressSelected(addressData) {
      console.log('Dirección seleccionada:', addressData);
      // Aquí puedes agregar lógica adicional si es necesario
    },
    
    // Optimizar la carga del componente de direcciones
    optimizeAddressComponent() {
      // Lazy load del componente de direcciones
      if (!this.addressComponentLoaded) {
        this.addressComponentLoaded = true;
        // Forzar re-render del componente
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    },
    
    showNotification(message, type = 'info') {
      // Usar el sistema de notificaciones global si está disponible
      if (this.$notify) {
        this.$notify({
          type: type,
          title: 'Notificación',
          text: message
        });
      } else {
        console.log(message);
      }
    },
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 