# Solución: Logo Borroso en el Banner

## 🔴 Problema

El logo en el banner se veía borroso/pixelado.

---

## 🔍 Causa

Next.js `Image` component optimiza automáticamente las imágenes, lo que puede causar:
- Blur mientras carga (placeholder blur)
- Reducción de calidad para optimizar tamaño
- Escalado que puede pixelar imágenes pequeñas

---

## ✅ Solución

Cambiar de `<Image>` de Next.js a `<img>` HTML normal.

### **Antes:**
```tsx
<Image
  src={bannerConfig.logoUrl}
  alt="Flasti Logo"
  width={48}
  height={48}
  className="w-auto h-5 sm:h-6 max-w-[80px] object-contain"
  quality={100}
  priority
/>
```

### **Ahora:**
```tsx
<img
  src={bannerConfig.logoUrl}
  alt="Flasti Logo"
  className="w-auto h-5 sm:h-6 max-w-[80px] object-contain"
  loading="eager"
/>
```

---

## 🎯 Beneficios del Cambio

### **Ventajas:**
- ✅ **Sin blur** - La imagen se muestra nítida desde el inicio
- ✅ **Sin optimización** - Se usa la imagen original sin procesamiento
- ✅ **Más rápido** - No hay procesamiento de Next.js
- ✅ **Mejor para SVG** - Los SVG se renderizan perfectamente

### **Desventajas (mínimas):**
- ⚠️ Sin lazy loading automático (pero usamos `loading="eager"` para carga inmediata)
- ⚠️ Sin optimización automática (pero el logo es pequeño, no importa)

---

## 📐 Dimensiones del Logo

### **Tamaños Actuales:**

| Dispositivo | Altura | Ancho | Máximo |
|-------------|--------|-------|--------|
| Móvil | 20px (`h-5`) | Auto | 80px |
| Desktop | 24px (`h-6`) | Auto | 80px |

### **Clases CSS:**
```css
w-auto          /* Ancho automático según proporción */
h-5 sm:h-6      /* Altura: 20px móvil, 24px desktop */
max-w-[80px]    /* Ancho máximo: 80px */
object-contain  /* Mantener proporción sin deformar */
```

---

## 🖼️ Recomendaciones para el Logo

### **Formato:**
- ✅ **SVG** - Mejor opción (escalable, nítido, ligero)
- ✅ **PNG** - Alta resolución (mínimo 2x: 160x48px)
- ⚠️ **JPG** - No recomendado (pierde calidad)

### **Dimensiones Recomendadas:**

**Para SVG:**
- Cualquier tamaño (es vectorial)
- Fondo transparente

**Para PNG:**
- Ancho: 160px (2x de 80px máximo)
- Alto: 48px (2x de 24px máximo)
- Resolución: 144 DPI o superior
- Fondo transparente

### **Peso:**
- SVG: < 10KB
- PNG: < 50KB

---

## 🧪 Probar el Cambio

### **1. Verificar que el logo se ve nítido:**
```
1. Ir a la página principal
2. Ver el banner superior
3. El logo debe verse nítido y claro
4. Hacer zoom (Cmd/Ctrl + +)
5. El logo debe mantener calidad
```

### **2. Probar en diferentes dispositivos:**
```
- Móvil: Logo 20px de alto
- Tablet: Logo 24px de alto
- Desktop: Logo 24px de alto
```

### **3. Probar con diferentes logos:**
```
1. Ir a /dashboard/admin/banner-config
2. Cambiar URL del logo
3. Guardar
4. Verificar que se ve nítido
```

---

## 🔄 Alternativa (Si Prefieres Next.js Image)

Si quieres seguir usando `Image` de Next.js:

```tsx
<Image
  src={bannerConfig.logoUrl}
  alt="Flasti Logo"
  width={160}  // 2x del tamaño real
  height={48}  // 2x del tamaño real
  className="w-auto h-5 sm:h-6 max-w-[80px] object-contain"
  quality={100}
  priority
  unoptimized  // Desactiva optimización
/>
```

**Nota:** Usar `unoptimized` desactiva todas las optimizaciones de Next.js, similar a usar `<img>`.

---

## 📝 Archivos Modificados

- `src/components/ui/sticky-banner-demo.tsx` - Cambiado `Image` a `img`

---

## ✅ Resultado

### **Antes:**
- ❌ Logo borroso/pixelado
- ❌ Blur mientras carga
- ❌ Calidad reducida

### **Ahora:**
- ✅ Logo nítido y claro
- ✅ Sin blur
- ✅ Calidad original
- ✅ Carga inmediata

---

## 💡 Tip: Usar SVG

Para mejor calidad, usa un logo en formato SVG:

```
/logo.svg          ✅ Mejor opción
/logo.png          ✅ Buena opción (alta resolución)
/logo.jpg          ⚠️ No recomendado
```

**Ventajas del SVG:**
- Escalable sin pérdida de calidad
- Peso muy ligero (< 10KB)
- Se ve perfecto en cualquier tamaño
- Soporta transparencia

---

¡Logo nítido y perfecto! 🎉
