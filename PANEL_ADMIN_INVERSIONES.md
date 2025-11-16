# 🎛️ Panel de Administración de Inversiones - Guía Completa

## 📍 Ubicación del Panel
**URL:** `/admin-access/investments`

## ✨ Características Principales

### 🎯 Control Total del Dashboard
El panel de administración te permite controlar **TODOS** los elementos que se muestran en el dashboard de inversiones en tiempo real.

---

## 📑 Secciones del Panel

### 1. ⚙️ Configuración General
Control de la información básica del sistema:

- **Nombre del Token** (ej: "Flasti Capital Token")
- **Descripción del Token** (ej: "Economía Digital Global")
- **Inversión Mínima** (USD)
- **Inversión Máxima** (USD)
- **Usuarios Activos** (texto mostrado, ej: "+100K")
- **Capital Total Invertido** (texto mostrado, ej: "$2.5M+")
- **Fecha de Lanzamiento**
- **Rating** (1-5 estrellas)
- **Título Hero** (banner principal)
- **Subtítulo Hero** (descripción del banner)

### 2. 💰 Valor del Token
Control completo del valor del token que se muestra en el dashboard:

- **Valor Actual (USD)** - El precio actual del token
- **Cambio Diario (USD)** - Cuánto subió/bajó en el día (puede ser negativo)
- **Cambio Diario (%)** - Porcentaje de cambio

**Vista Previa en Tiempo Real:**
```
Valor Actual del Token
$132.25
↑ $2.50 (+1.93%)
```

### 3. 📅 Períodos de Inversión
Gestiona los períodos disponibles para invertir:

**Para cada período puedes configurar:**
- Días del período (30, 45, 90, etc.)
- Tasa Anual (%)
- Etiqueta (ej: "Corto plazo")
- Descripción (ej: "Ideal para comenzar")
- Orden de visualización
- ✅ Activo/Inactivo
- ⭐ Marcar como Recomendado

**Ejemplo:**
- 30 días → 5.0% anual → "Corto plazo"
- 45 días → 7.5% anual → "Mediano plazo"
- 90 días → 12% anual → "Largo plazo" ⭐ RECOMENDADO

### 4. 📊 Métricas del Dashboard
Las 4 tarjetas superiores que se muestran en el dashboard:

**Métricas editables:**
1. Inversión Mínima → "$5"
2. Inversión Máxima → "$10,000"
3. Tasa Anual (90d) → "12%"
4. Usuarios Activos → "+100K"

Cada métrica tiene:
- Etiqueta (título)
- Valor (texto mostrado)
- Orden de visualización
- Estado activo/inactivo

### 5. 📈 Gráfico de Valor
Control total del gráfico con 4 períodos diferentes:

**Períodos disponibles:**
- 📅 **Diario** - Últimos 7 días (Lun, Mar, Mié, Jue, Vie, Sáb, Dom)
- 📊 **Semanal** - Últimas 8 semanas (S1, S2, S3, S4, S5, S6, S7, S8)
- 📆 **Mensual** - Últimos 6 meses (Ago, Sep, Oct, Nov, Dic, Ene)
- 🗓️ **Anual** - Últimos 5 años (2021, 2022, 2023, 2024, 2025)

**Para cada punto del gráfico:**
- Etiqueta (ej: "Lun", "Ene", "2024")
- Valor (USD) - El precio en ese momento
- Orden de visualización
- Estado activo/inactivo

**Vista Previa en Tiempo Real:**
El panel muestra una vista previa del gráfico mientras editas los valores.

### 6. 💼 Destino de Fondos
Configura a dónde van los fondos de inversión (debe sumar 100%):

**Ejemplo de configuración:**
1. Infraestructura & Hosting → 40%
2. Marketing & Adquisición → 30%
3. Desarrollo Tecnológico → 20%
4. Reservas de Liquidez → 10%

**Para cada destino:**
- Nombre
- Descripción
- Porcentaje (%)
- Orden de visualización
- Estado activo/inactivo

⚠️ **Validación:** El sistema verifica que la suma sea exactamente 100%

### 7. ❓ Preguntas Frecuentes (FAQs)
Gestiona las preguntas frecuentes del dashboard:

**Para cada FAQ:**
- Pregunta
- Respuesta (texto largo)
- Orden de visualización
- Estado activo/inactivo

---

## 🚀 Cómo Usar el Panel

### Paso 1: Ejecutar Migraciones
Ejecuta este script en Supabase SQL Editor:
```sql
-- Archivo: supabase/migrations/investment_system_complete.sql
```

### Paso 2: Acceder al Panel
1. Ve a: `http://localhost:3000/admin-access/investments`
2. Inicia sesión como administrador

### Paso 3: Editar Valores
1. Selecciona la pestaña que quieres editar
2. Modifica los valores
3. Haz clic en "💾 Guardar"
4. Los cambios se reflejan **inmediatamente** para todos los usuarios

---

## 🔄 Actualización en Tiempo Real

### ¿Cómo funciona?
1. **Admin edita** un valor en el panel
2. **Se guarda** en la base de datos (Supabase)
3. **Usuarios ven** el cambio inmediatamente al recargar

### Ejemplo de flujo:
```
Admin cambia: Valor del Token = $135.50
     ↓
Se guarda en investment_config
     ↓
Usuarios ven: $135.50 en el dashboard
```

---

## 📊 Estructura de la Base de Datos

### Tablas Principales:

1. **investment_config** - Configuración general y valor del token
2. **investment_periods** - Períodos de inversión (30, 45, 90 días)
3. **investment_metrics** - Las 4 métricas superiores
4. **chart_data_points** - Puntos del gráfico (diario, semanal, mensual, anual)
5. **fund_allocation** - Destino de fondos (40%, 30%, 20%, 10%)
6. **investment_faqs** - Preguntas frecuentes

---

## 🎨 Interfaz del Panel

### Características de UX:
- ✅ **Tabs organizados** por sección
- ✅ **Vista previa en tiempo real** (gráfico y valor del token)
- ✅ **Validaciones** (ej: fondos deben sumar 100%)
- ✅ **Mensajes de confirmación** (✅ Guardado / ❌ Error)
- ✅ **Diseño responsive** (funciona en móvil y desktop)
- ✅ **Iconos intuitivos** para cada sección

### Colores y Diseño:
- Fondo: Blanco limpio
- Acentos: Gradiente púrpura-azul
- Estados: Verde (éxito), Rojo (error), Amarillo (advertencia)

---

## 🔐 Seguridad

### Row Level Security (RLS):
- ✅ **Todos pueden leer** los datos (para mostrar en dashboard)
- ✅ **Solo admins pueden escribir** (editar valores)

### Validación de Usuario:
Todas las APIs verifican que el usuario esté autenticado antes de permitir cambios.

---

## 📱 APIs Creadas

### Endpoints del Admin:
```
GET  /api/investments/admin/config    - Obtener configuración
PUT  /api/investments/admin/config    - Actualizar configuración

GET  /api/investments/admin/periods   - Obtener períodos
PUT  /api/investments/admin/periods   - Actualizar períodos

GET  /api/investments/admin/metrics   - Obtener métricas
PUT  /api/investments/admin/metrics   - Actualizar métricas

GET  /api/investments/admin/chart     - Obtener datos del gráfico
PUT  /api/investments/admin/chart     - Actualizar gráfico

GET  /api/investments/admin/funds     - Obtener destino de fondos
PUT  /api/investments/admin/funds     - Actualizar fondos

GET  /api/investments/admin/faqs      - Obtener FAQs
PUT  /api/investments/admin/faqs      - Actualizar FAQs
```

---

## 🎯 Casos de Uso

### Caso 1: Actualizar el Valor del Token
1. Ve a la pestaña "💰 Valor del Token"
2. Cambia el valor actual a $135.50
3. Cambia el cambio diario a +$3.25
4. Cambia el porcentaje a +2.48%
5. Guarda
6. ✅ Todos los usuarios ven el nuevo valor

### Caso 2: Agregar un Nuevo Período
1. Ve a la pestaña "📅 Períodos"
2. Edita uno de los períodos existentes
3. Cambia días a 60
4. Cambia tasa a 9.5%
5. Marca como activo
6. Guarda
7. ✅ El nuevo período aparece en el dashboard

### Caso 3: Actualizar el Gráfico Mensual
1. Ve a la pestaña "📈 Gráfico"
2. Selecciona "📆 Mensual"
3. Edita los valores de cada mes
4. Guarda
5. ✅ El gráfico se actualiza para todos

---

## 🎉 Resultado Final

Con este panel de administración tienes:

✅ **Control total** de todos los datos del dashboard
✅ **Actualización en tiempo real** para todos los usuarios
✅ **Interfaz intuitiva** y fácil de usar
✅ **Validaciones** para evitar errores
✅ **Vista previa** de los cambios antes de guardar
✅ **Seguridad** con autenticación y RLS

**¡La mejor experiencia tanto para admins como para usuarios!** 🚀
