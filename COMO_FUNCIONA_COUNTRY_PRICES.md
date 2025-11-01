# 📊 Cómo Funciona: Country Prices

## 🎯 Propósito

La página **Country Prices** permite al administrador gestionar los precios del producto premium para diferentes países, con precios personalizados según la moneda local de cada región.

---

## 📍 Ubicación

**Ruta:** `/dashboard/admin/country-prices`

**Archivo:** `src/app/dashboard/admin/country-prices/page.tsx`

**Servicio:** `src/lib/country-price-service.ts`

---

## 🏗️ Arquitectura

### 1. **Base de Datos**

**Tabla:** `country_prices`

```sql
CREATE TABLE country_prices (
  id UUID PRIMARY KEY,
  country_code TEXT UNIQUE,      -- Código ISO (ej: 'AR', 'MX', 'US')
  country_name TEXT,              -- Nombre del país
  price DECIMAL,                  -- Precio en moneda local
  currency_code TEXT,             -- Código de moneda (ej: 'ARS', 'MXN', 'USD')
  currency_symbol TEXT,           -- Símbolo (ej: '$', 'R$', '€')
  is_locked BOOLEAN DEFAULT false, -- Si el precio está bloqueado
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### 2. **Servicio (CountryPriceService)**

**Ubicación:** `src/lib/country-price-service.ts`

**Métodos:**

```typescript
// Obtener precio de un país específico
getCountryPrice(countryCode: string): Promise<CountryPrice | null>

// Obtener todos los precios
getAllCountryPrices(): Promise<CountryPrice[]>

// Actualizar precio de un país
updateCountryPrice(countryCode: string, price: number): Promise<boolean>

// Actualizar múltiples precios a la vez
updateMultipleCountryPrices(prices: Array<{...}>): Promise<boolean>
```

### 3. **Componente de Página**

**Ubicación:** `src/app/dashboard/admin/country-prices/page.tsx`

---

## 🔄 Flujo de Funcionamiento

### **Paso 1: Carga Inicial**

```typescript
useEffect(() => {
  loadPrices();
}, []);
```

1. Al montar el componente, se ejecuta `loadPrices()`
2. Llama a `CountryPriceService.getAllCountryPrices()`
3. Obtiene todos los precios de la base de datos
4. Carga los estados de bloqueo (`is_locked`)
5. Actualiza el estado local

**Resultado:** Lista de países con sus precios y estados de bloqueo

---

### **Paso 2: Renderizado de la Interfaz**

La página se divide en **2 columnas**:

#### **Columna Izquierda (2/3):** Lista de Precios

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
  {prices.map(price => (
    <div className="flex items-center gap-2">
      {/* Bandera */}
      <CountryFlag countryCode={price.country_code} />
      
      {/* Nombre del país */}
      <div className="w-[90px]">{shortName}</div>
      
      {/* Código de moneda */}
      <div className="w-[35px]">{price.currency_code}</div>
      
      {/* Símbolo */}
      <span className="w-[20px]">{price.currency_symbol}</span>
      
      {/* Input de precio */}
      <Input
        value={price.price}
        onChange={(e) => handlePriceChange(price.country_code, e.target.value)}
        disabled={isLocked}
      />
      
      {/* Botón de bloqueo */}
      <button onClick={() => toggleLock(price.country_code)}>
        {isLocked ? <LockIcon /> : <UnlockIcon />}
      </button>
    </div>
  ))}
</div>
```

**Características:**
- ✅ Grid de 2 columnas en desktop
- ✅ Anchos fijos para alineación perfecta
- ✅ Nombres abreviados si son muy largos
- ✅ Inputs deshabilitados si están bloqueados

#### **Columna Derecha (1/3):** Formulario de Hotmart

```tsx
<div className="sticky top-6">
  <div id="inline_checkout" />
</div>
```

**Características:**
- ✅ Sticky (se queda fijo al hacer scroll)
- ✅ Muestra el formulario de pago de Hotmart
- ✅ Permite ver los precios de Hotmart en tiempo real

---

### **Paso 3: Edición de Precios**

#### **Función:** `handlePriceChange()`

```typescript
const handlePriceChange = (countryCode: string, newPrice: string) => {
  // 1. Verificar si está bloqueado
  if (lockedPrices.has(countryCode)) {
    toast.error('Este precio está bloqueado');
    return;
  }
  
  // 2. Actualizar estado local
  setPrices(currentPrices =>
    currentPrices.map(price =>
      price.country_code === countryCode
        ? { ...price, price: Number(newPrice) }
        : price
    )
  );
};
```

**Flujo:**
1. Usuario escribe en el input
2. Se verifica si el precio está bloqueado
3. Si NO está bloqueado, actualiza el estado local
4. Si SÍ está bloqueado, muestra error

**Nota:** Los cambios NO se guardan automáticamente, solo actualizan el estado local.

---

### **Paso 4: Bloqueo/Desbloqueo**

#### **Función:** `toggleLock()`

```typescript
const toggleLock = (countryCode: string) => {
  // 1. Actualizar set de bloqueados
  setLockedPrices(prev => {
    const newSet = new Set(prev);
    if (newSet.has(countryCode)) {
      newSet.delete(countryCode);
      toast.success('Precio desbloqueado');
    } else {
      newSet.add(countryCode);
      toast.success('Precio bloqueado');
    }
    return newSet;
  });

  // 2. Actualizar array de precios
  setPrices(currentPrices =>
    currentPrices.map(price =>
      price.country_code === countryCode
        ? { ...price, is_locked: !lockedPrices.has(countryCode) }
        : price
    )
  );
};
```

**Flujo:**
1. Usuario hace click en el candado
2. Se alterna el estado de bloqueo
3. Se actualiza el estado local
4. Se muestra toast de confirmación

**Nota:** El bloqueo tampoco se guarda automáticamente.

---

### **Paso 5: Guardar Cambios**

#### **Botón en el Header**

El botón "Guardar" está en el **DashboardHeader**, no en la página:

```typescript
// En DashboardHeader.tsx
{isCountryPricesPage && (
  <button onClick={() => {
    const event = new CustomEvent('saveCountryPrices');
    window.dispatchEvent(event);
  }}>
    Guardar
  </button>
)}
```

#### **Listener en la Página**

```typescript
useEffect(() => {
  const handleSaveEvent = () => {
    handleSave();
  };

  window.addEventListener('saveCountryPrices', handleSaveEvent);
  return () => window.removeEventListener('saveCountryPrices', handleSaveEvent);
}, [prices, saving]);
```

#### **Función:** `handleSave()`

```typescript
const handleSave = async () => {
  setSaving(true);
  try {
    // 1. Llamar al servicio con todos los precios
    const success = await CountryPriceService.updateMultipleCountryPrices(
      prices.map(p => ({
        country_code: p.country_code,
        price: p.price,
        is_locked: p.is_locked || false
      }))
    );

    // 2. Mostrar resultado
    if (success) {
      toast.success('Precios y bloqueos actualizados correctamente');
      loadPrices(); // Recargar desde la BD
    } else {
      toast.error('Error al actualizar');
    }
  } catch (error) {
    toast.error('Error al guardar');
  } finally {
    setSaving(false);
  }
};
```

**Flujo:**
1. Usuario hace click en "Guardar" (en el header)
2. Se dispara un evento personalizado
3. La página escucha el evento
4. Se ejecuta `handleSave()`
5. Se actualizan TODOS los precios en la BD
6. Se recarga la lista desde la BD
7. Se muestra toast de éxito/error

---

## 🎨 Características Especiales

### 1. **Sticky Hotmart Form**

```tsx
<div className="sticky top-6">
  <div id="inline_checkout" />
</div>
```

- El formulario de Hotmart se queda fijo al hacer scroll
- Permite comparar precios mientras editas

### 2. **Bloqueo de Precios**

```typescript
const isLocked = lockedPrices.has(price.country_code);

<Input disabled={isLocked} />
```

- Previene edición accidental de precios importantes
- Visual: Input opaco cuando está bloqueado
- Funcional: No permite escribir si está bloqueado

### 3. **Anchos Fijos**

```tsx
<div className="w-[90px]">  {/* Nombre */}
<div className="w-[35px]">  {/* Código */}
<span className="w-[20px]"> {/* Símbolo */}
<Input className="w-[100px]"> {/* Precio */}
```

- Todos los inputs tienen el mismo ancho
- Alineación perfecta en columnas
- Diseño limpio y profesional

### 4. **Nombres Abreviados**

```typescript
const shortName = price.country_name.length > 12 
  ? price.country_name.substring(0, 12) + '...' 
  : price.country_name;
```

- Nombres largos se cortan a 12 caracteres
- Tooltip muestra el nombre completo
- Mantiene el diseño compacto

### 5. **Integración con Hotmart**

```tsx
<Script 
  src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"
  onLoad={() => setHotmartLoaded(true)}
/>

useEffect(() => {
  if (hotmartLoaded) {
    window.checkoutElements.init('inlineCheckout', {
      offer: '5h87lps7'
    }).mount('#inline_checkout');
  }
}, [hotmartLoaded]);
```

- Carga el script de Hotmart
- Inicializa el checkout inline
- Muestra el formulario de pago

---

## 🔄 Flujo Completo de Uso

### **Escenario: Actualizar precio de Argentina**

1. **Admin abre la página**
   - Se cargan todos los precios desde la BD
   - Se muestra la lista con Argentina incluida

2. **Admin busca Argentina 🇦🇷**
   - Scroll o búsqueda visual
   - Ve: `Argentina | ARS | $ | 3500.00 | 🔓`

3. **Admin edita el precio**
   - Click en el input
   - Escribe: `4000`
   - El estado local se actualiza
   - **NO se guarda aún en la BD**

4. **Admin bloquea el precio (opcional)**
   - Click en el candado 🔓
   - Cambia a 🔒
   - El input se deshabilita
   - **NO se guarda aún en la BD**

5. **Admin guarda los cambios**
   - Click en "Guardar" (en el header)
   - Se actualizan TODOS los precios en la BD
   - Se muestra: ✅ "Precios y bloqueos actualizados correctamente"
   - Se recarga la lista desde la BD

6. **Verificación**
   - El precio de Argentina ahora es $4000
   - El candado está cerrado 🔒
   - No se puede editar hasta desbloquearlo

---

## 🎯 Casos de Uso

### **Caso 1: Actualización Masiva**

**Escenario:** Hotmart cambió los precios de todos los países

**Proceso:**
1. Abrir Hotmart en otra pestaña
2. Ver los nuevos precios
3. Actualizar cada país en la página
4. Click en "Guardar"
5. Todos los precios se actualizan a la vez

### **Caso 2: Proteger Precios Importantes**

**Escenario:** No quieres cambiar accidentalmente el precio de USA

**Proceso:**
1. Buscar USA 🇺🇸
2. Click en el candado 🔓
3. Cambia a 🔒
4. Click en "Guardar"
5. El precio de USA está protegido

### **Caso 3: Ajuste por Inflación**

**Escenario:** Argentina tiene alta inflación, necesitas ajustar el precio

**Proceso:**
1. Buscar Argentina 🇦🇷
2. Si está bloqueado, desbloquearlo
3. Actualizar el precio
4. Volver a bloquearlo
5. Click en "Guardar"

---

## 🔧 Mantenimiento

### **Agregar un Nuevo País**

```sql
INSERT INTO country_prices (
  country_code,
  country_name,
  price,
  currency_code,
  currency_symbol,
  is_locked
) VALUES (
  'BR',
  'Brasil',
  19.90,
  'BRL',
  'R$',
  false
);
```

### **Cambiar el Offer ID de Hotmart**

```typescript
// En country-prices/page.tsx
elements.mount('#inline_checkout', {
  offer: 'NUEVO_OFFER_ID' // Cambiar aquí
});
```

---

## 📊 Datos Técnicos

### **Performance**

- ✅ Carga inicial: ~500ms
- ✅ Actualización de precio: Instantánea (estado local)
- ✅ Guardado: ~2-3 segundos (actualiza todos los países)
- ✅ Realtime: No implementado (requiere recargar para ver cambios de otros admins)

### **Limitaciones**

- ❌ No hay búsqueda/filtro de países
- ❌ No hay historial de cambios
- ❌ No hay validación de rangos de precios
- ❌ No hay confirmación antes de guardar
- ❌ No hay undo/redo

### **Mejoras Futuras**

- 🔮 Búsqueda de países
- 🔮 Historial de cambios con timestamps
- 🔮 Validación de precios (min/max)
- 🔮 Confirmación modal antes de guardar
- 🔮 Sincronización automática con Hotmart
- 🔮 Realtime updates entre admins
- 🔮 Exportar/Importar precios (CSV/JSON)

---

## 🎓 Resumen

**Country Prices** es una página de administración que permite:

1. ✅ Ver todos los precios por país
2. ✅ Editar precios individualmente
3. ✅ Bloquear/desbloquear precios
4. ✅ Guardar todos los cambios a la vez
5. ✅ Ver el formulario de Hotmart en paralelo

**Flujo simple:**
```
Cargar → Editar → Bloquear (opcional) → Guardar → Listo
```

**Tecnologías:**
- React (Next.js)
- Supabase (Base de datos)
- Hotmart (Checkout inline)
- Tailwind CSS (Estilos)
