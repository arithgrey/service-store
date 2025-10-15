# 🔍 Guía de Uso: Búsqueda de Usuarios

## 📍 Acceso Rápido

**URL:** `/search-users/`

```
http://localhost/search-users/
```

> ⚠️ **Requiere Autenticación:** Solo usuarios autenticados pueden acceder

---

## 🎯 Funcionalidades

### 1️⃣ **Búsqueda Inteligente**

Busca usuarios por:
- ✉️ **Email** - `arithgrey@gmail.com`
- 👤 **Username** - `arithgrey`
- 📝 **Nombre** - `Jonathan`
- 📝 **Apellido** - `Medrano`

### 2️⃣ **Filtros de Estado**

| Filtro | Descripción |
|--------|-------------|
| **Todos** | Muestra todos los usuarios |
| **Activos** | Solo usuarios activos |
| **Inactivos** | Solo usuarios inactivos |

### 3️⃣ **Visualización de Datos**

**Información visible:**
- Avatar con inicial
- Email y nombre de usuario
- Estado (activo/inactivo)
- Tiempo desde registro
- Roles (Staff, Superusuario)
- Grupos del usuario
- Fechas de registro y último login

---

## 🖥️ Interfaz de Usuario

### Layout

```
┌────────────────────────────────────────────────────┐
│  [🔍 Buscar Usuarios] [📊 Estadísticas]            │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐  ┌─────────────────────────────┐│
│  │              │  │                             ││
│  │   LISTA DE   │  │      DETALLE COMPLETO       ││
│  │   USUARIOS   │  │      DEL USUARIO            ││
│  │   (1/4)      │  │      SELECCIONADO           ││
│  │              │  │      (3/4)                  ││
│  └──────────────┘  └─────────────────────────────┘│
│                                                    │
└────────────────────────────────────────────────────┘
```

### Tabs Disponibles

#### 🔍 Tab "Buscar Usuarios"
- **Formulario de búsqueda** con filtros
- **Lista de resultados** en el lado izquierdo
- **Detalle del usuario** en el lado derecho

#### 📊 Tab "Estadísticas"
- Próximamente: Métricas y gráficas

---

## 🚀 Ejemplos de Uso

### Ejemplo 1: Buscar por Email
```
1. Ir a /search-users/
2. En el campo de búsqueda escribir: "gmail"
3. Automáticamente muestra todos los usuarios con gmail
```

### Ejemplo 2: Filtrar Solo Activos
```
1. Seleccionar filtro "Activos"
2. Automáticamente actualiza la lista
3. Solo muestra usuarios con is_active=true
```

### Ejemplo 3: Ver Detalle de Usuario
```
1. Buscar usuario
2. Click en una tarjeta de usuario
3. El detalle aparece en el panel derecho
4. Scroll automático al detalle
```

---

## 🎨 Indicadores Visuales

### Estados de Usuario

| Indicador | Significado | Color |
|-----------|-------------|-------|
| ● Activo | Usuario activo | 🟢 Verde |
| ● Inactivo | Usuario inactivo | 🔴 Rojo |

### Badges de Roles

| Badge | Descripción | Color |
|-------|-------------|-------|
| **Staff** | Usuario con permisos de staff | 🔵 Azul |
| **Superusuario** | Usuario con todos los permisos | 🟣 Púrpura |
| **Usuario Regular** | Usuario sin permisos especiales | ⚪ Gris |

### Avatars

```
┌─────┐
│  J  │  ← Inicial del username o email
└─────┘
Degradado azul-cyan
```

---

## 🔌 API Endpoint

### Request
```http
GET /api/oauth/user/user-search/?q=gmail&is_active=true
Authorization: Bearer {token}
```

### Response
```json
[
  {
    "id": 5,
    "username": "arithgrey@gmail.com",
    "email": "arithgrey@gmail.com",
    "first_name": "Jonathan Medrano",
    "last_name": "",
    "is_active": true,
    "is_staff": false,
    "is_superuser": false,
    "date_joined": "2025-10-08T20:03:07.548956Z",
    "last_login": null,
    "groups": ["ecommerce"]
  }
]
```

---

## ⌨️ Atajos y Tips

### 💡 Tips de Búsqueda

1. **Búsqueda vacía** → Muestra todos los usuarios
2. **Cambiar filtro** → Búsqueda automática
3. **Click en usuario** → Scroll automático al detalle
4. **Búsqueda case-insensitive** → No importan mayúsculas

### 🎯 Casos de Uso

#### Administrador
```
✅ Encontrar usuario específico por email
✅ Ver todos los usuarios activos
✅ Identificar superusuarios
✅ Revisar última fecha de login
```

#### Soporte
```
✅ Buscar usuario que reporta problema
✅ Verificar estado de cuenta
✅ Revisar grupos y permisos
✅ Validar fecha de registro
```

---

## 🔐 Permisos Necesarios

| Acción | Permiso Requerido |
|--------|-------------------|
| Acceder a /search-users/ | ✅ Autenticado |
| Ver lista de usuarios | ✅ Autenticado |
| Ver detalle de usuario | ✅ Autenticado |

> 📝 **Nota:** La ruta está protegida con `requiresAuth: true`

---

## 🐛 Troubleshooting

### Problema: No aparecen usuarios
**Solución:**
1. Verificar que estás autenticado
2. Verificar token válido en localStorage
3. Revisar console del navegador

### Problema: Error 401 Unauthorized
**Solución:**
1. Iniciar sesión nuevamente
2. Verificar que el token no haya expirado
3. Verificar permisos del usuario

### Problema: Búsqueda no funciona
**Solución:**
1. Verificar que el servicio OAuth esté corriendo
2. Verificar nginx esté redirigiendo correctamente
3. Revisar logs del backend

---

## 📊 Estadísticas Disponibles

### Información del Usuario
- ✅ ID único
- ✅ Username
- ✅ Email
- ✅ Nombre completo
- ✅ Estado (activo/inactivo)
- ✅ Fecha de registro
- ✅ Último login
- ✅ Roles y permisos
- ✅ Grupos asignados

### Próximamente
- 📈 Número de pedidos
- 📈 Total gastado
- 📈 Productos favoritos
- 📈 Actividad reciente

---

## 🎬 Demo Rápido

### Paso a Paso

1. **Acceso**
   ```
   → Navegar a /search-users/
   → Verificar autenticación
   ```

2. **Búsqueda**
   ```
   → Escribir "gmail" en el campo de búsqueda
   → Presionar Enter o click en 🔍
   ```

3. **Filtrado**
   ```
   → Seleccionar "Activos" en el dropdown
   → Ver resultados actualizados
   ```

4. **Detalle**
   ```
   → Click en una tarjeta de usuario
   → Ver información completa
   → Revisar roles y permisos
   ```

---

## 📱 Responsive Design

### Desktop (> 768px)
```
┌────────────────────────────────────┐
│  Lista 1/4  │  Detalle 3/4        │
└────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────┐
│  Lista       │
│  (stack)     │
├──────────────┤
│  Detalle     │
│  (stack)     │
└──────────────┘
```

---

## ✨ Características Destacadas

- 🔍 **Búsqueda en tiempo real**
- 🎨 **UI moderna con Tailwind CSS**
- ⚡ **Respuesta rápida**
- 📱 **Diseño responsive**
- 🔐 **Seguro con autenticación JWT**
- 🎯 **Interfaz intuitiva**
- ♿ **Accesible**

---

## 📞 Contacto y Soporte

¿Necesitas ayuda?
- 📧 Revisa la documentación técnica en `USERS_SEARCH_IMPLEMENTATION.md`
- 🐛 Reporta bugs al equipo de desarrollo
- 💡 Sugiere mejoras

---

*Última actualización: 13 de Octubre, 2025*

