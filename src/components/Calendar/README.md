# 📅 Componentes de Calendario

## 🏗️ Arquitectura Refactorizada

El calendario ha sido refactorizado siguiendo los principios de **componentes granulares** y **separación de responsabilidades** para mejorar la mantenibilidad y reutilización.

## 📁 Estructura de Componentes

### 🎯 **CalendarContainer.vue** - Componente Principal
- **Responsabilidad**: Orquestación general y gestión de estado
- **Funciones**:
  - Manejo del estado global del calendario
  - Carga de estadísticas de entregas
  - Coordinación entre componentes hijos

### 📋 **CalendarHeader.vue** - Encabezado
- **Responsabilidad**: Mostrar título y subtítulo
- **Props**: `title`, `subtitle`
- **Reutilizable**: Sí, para cualquier tipo de calendario

### 🧭 **CalendarNavigation.vue** - Navegación
- **Responsabilidad**: Controles de navegación (anterior, siguiente, hoy)
- **Props**: `currentMonth`
- **Emits**: `previous-month`, `next-month`, `go-to-today`

### ⏳ **CalendarLoading.vue** - Estado de Carga
- **Responsabilidad**: Mostrar estado de carga
- **Props**: `message` (opcional)
- **Reutilizable**: Sí, para cualquier componente con estado de carga

### 📅 **CalendarMonth.vue** - Mes del Calendario
- **Responsabilidad**: Renderizar un mes específico
- **Props**: `monthDate`, `deliveryStats`, `selectedDate`
- **Emits**: `date-selected`

### 📊 **CalendarDaysHeader.vue** - Encabezado de Días
- **Responsabilidad**: Mostrar días de la semana (Dom, Lun, Mar...)
- **Datos**: Array estático de días
- **Reutilizable**: Sí, para cualquier calendario

### 🔢 **CalendarDay.vue** - Día Individual
- **Responsabilidad**: Renderizar un día específico
- **Props**: `day`, `isSelected`
- **Emits**: `click`

### 📈 **CalendarDayDeliveryCount.vue** - Contador de Entregas
- **Responsabilidad**: Mostrar cantidad de entregas
- **Props**: `count`
- **Lógica**: Pluralización automática (entrega/entregas)

### ℹ️ **CalendarDateInfo.vue** - Información de Fecha
- **Responsabilidad**: Mostrar detalles de fecha seleccionada
- **Props**: `selectedDate`
- **Funciones**: Formateo de fechas

## 🎯 Principios Aplicados

### ✅ **Principio de Responsabilidad Única (SRP)**
- Cada componente tiene una única responsabilidad específica
- Separación clara entre UI, lógica y estado

### ✅ **Principio Abierto/Cerrado (OCP)**
- Componentes extensibles sin modificación
- Props configurables para diferentes casos de uso

### ✅ **Composición sobre Herencia**
- Componentes pequeños que se combinan
- Fácil reutilización y testing

### ✅ **Inversión de Dependencias**
- Componentes dependen de abstracciones (props/emits)
- No hay acoplamiento directo entre componentes

## 🚀 Beneficios del Refactor

### 📈 **Mantenibilidad**
- **Antes**: 280+ líneas en un solo archivo
- **Después**: 8 componentes especializados (20-80 líneas cada uno)

### 🔄 **Reutilización**
- Componentes pueden usarse independientemente
- Fácil creación de nuevos tipos de calendarios

### 🧪 **Testing**
- Cada componente puede testearse por separado
- Mocks más simples y específicos

### 🎨 **Flexibilidad**
- Fácil personalización de estilos por componente
- Props configurables para diferentes contextos

### 👥 **Colaboración**
- Múltiples desarrolladores pueden trabajar en paralelo
- Menos conflictos de merge

## 📝 Ejemplos de Uso

### Uso Básico
```vue
<template>
  <CalendarContainer />
</template>

<script>
import CalendarContainer from '@/components/Calendar/CalendarContainer.vue';

export default {
  components: { CalendarContainer }
};
</script>
```

### Uso Personalizado
```vue
<template>
  <CalendarMonth 
    :month-date="currentMonth"
    :delivery-stats="stats"
    @date-selected="handleDateSelection"
  />
</template>
```

### Componente de Loading Reutilizable
```vue
<template>
  <CalendarLoading message="Cargando eventos..." />
</template>
```

## 🔧 Configuración

### Variables de Entorno
- Las estadísticas se cargan desde `/enid/orden/delivery-stats/`
- Configurado en `DeliveryStatsHelper.js`

### Dependencias
- `moment.js` - Manejo de fechas
- `Tailwind CSS` - Estilos
- `Vue 3 Composition API` - Reactividad

## 🚀 Próximos Pasos

1. **Testing**: Crear tests unitarios para cada componente
2. **Storybook**: Documentar componentes con Storybook
3. **Optimización**: Implementar lazy loading para meses no visibles
4. **Accesibilidad**: Mejorar navegación por teclado
5. **Internacionalización**: Soporte para múltiples idiomas

## 📚 Referencias

- [Vue 3 Component Design Patterns](https://vuejs.org/guide/reusability/composables.html)
- [SOLID Principles in Vue.js](https://vuejs.org/guide/reusability/composables.html)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
