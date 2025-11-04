# Solución: Error de Imagen en Next.js

## 🔴 Error

```
Failed to parse src "images/eventos/event-default.png" on next/image, 
if using relative image it must start with a leading slash "/" 
or be an absolute URL (http:// or https://)
```

---

## 🔍 Causa

Next.js `Image` component requiere que las rutas de imágenes:
- Empiecen con `/` (ruta relativa desde `/public`)
- O sean URLs absolutas (`http://` o `https://`)

**Incorrecto:** `images/eventos/event-default.png`  
**Correcto:** `/images/eventos/event-default.png`

---

## ✅ Solución Implementada

### **1. Validación en el Frontend**

Se agregó una función para corregir automáticamente las rutas:

#### **En `sticky-banner-demo.tsx`:**
```typescript
const fixImagePath = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

setBannerConfig({
  logoUrl: fixImagePath(data.logo_url) || '/logo.svg',
  backgroundImage: fixImagePath(data.background_image),
  // ...
});
```

#### **En `cta-news-bento-grid.tsx`:**
```typescript
const fixedData = data.map(item => ({
  ...item,
  image_url: item.image_url?.startsWith('http') 
    ? item.image_url 
    : item.image_url?.startsWith('/') 
      ? item.image_url 
      : `/${item.image_url}`
}));
```

---

### **2. Corrección en la Base de Datos**

Ejecuta este SQL en Supabase para corregir rutas existentes:

```sql
-- Corregir rutas en banner_config
UPDATE banner_config
SET logo_url = '/' || logo_url
WHERE logo_url NOT LIKE '/%' 
  AND logo_url NOT LIKE 'http%'
  AND logo_url IS NOT NULL;

UPDATE banner_config
SET background_image = '/' || background_image
WHERE background_image NOT LIKE '/%' 
  AND background_image NOT LIKE 'http%'
  AND background_image IS NOT NULL;

-- Corregir rutas en cta_news_blocks
UPDATE cta_news_blocks
SET image_url = '/' || image_url
WHERE image_url NOT LIKE '/%' 
  AND image_url NOT LIKE 'http%'
  AND image_url IS NOT NULL;

-- Corregir rutas en seasonal_themes
UPDATE seasonal_themes
SET background_image = '/' || background_image
WHERE background_image NOT LIKE '/%' 
  AND background_image NOT LIKE 'http%'
  AND background_image IS NOT NULL;

UPDATE seasonal_themes
SET event_logo_url = '/' || event_logo_url
WHERE event_logo_url NOT LIKE '/%' 
  AND event_logo_url NOT LIKE 'http%'
  AND event_logo_url IS NOT NULL;
```

---

## 📋 Formatos de Ruta Válidos

### **✅ Correcto:**

```typescript
// Ruta relativa desde /public
src="/logo.svg"
src="/images/banner.png"
src="/images/principal/banner1.png"

// URL absoluta
src="https://example.com/image.png"
src="http://example.com/image.png"
```

### **❌ Incorrecto:**

```typescript
// Sin barra inicial
src="logo.svg"
src="images/banner.png"
src="images/principal/banner1.png"

// Ruta relativa con ./
src="./logo.svg"
src="./images/banner.png"
```

---

## 🧪 Verificar la Solución

### **1. Verificar rutas en la base de datos:**

```sql
-- Ver todas las rutas de imágenes
SELECT 'banner_config' as tabla, logo_url as ruta FROM banner_config
UNION ALL
SELECT 'banner_config', background_image FROM banner_config WHERE background_image IS NOT NULL
UNION ALL
SELECT 'cta_news_blocks', image_url FROM cta_news_blocks
UNION ALL
SELECT 'seasonal_themes', background_image FROM seasonal_themes WHERE background_image IS NOT NULL
UNION ALL
SELECT 'seasonal_themes', event_logo_url FROM seasonal_themes WHERE event_logo_url IS NOT NULL;
```

Todas deben empezar con `/` o `http`.

### **2. Probar en la aplicación:**

1. Recargar la página del dashboard
2. Verificar que no aparece el error
3. Verificar que las imágenes se cargan correctamente

---

## 🔧 Prevención Futura

### **En el Editor de Admin:**

Cuando ingreses rutas de imágenes en `/dashboard/admin/banner-config`:

**Siempre usa:**
```
/logo.svg
/images/banner.png
/images/principal/banner1.png
```

**Nunca uses:**
```
logo.svg
images/banner.png
./images/banner.png
```

---

## 📝 Archivos Modificados

- `src/components/ui/sticky-banner-demo.tsx` - Validación de rutas
- `src/components/ui/cta-news-bento-grid.tsx` - Validación de rutas
- `supabase/migrations/fix_image_paths.sql` - Script de corrección

---

## ✅ Resultado

Después de aplicar la solución:

1. ✅ Las rutas se corrigen automáticamente en el frontend
2. ✅ Las rutas en la BD están corregidas
3. ✅ No más errores de Next.js Image
4. ✅ Las imágenes se cargan correctamente

---

## 🆘 Si el Error Persiste

### **Verificar consola del navegador:**
1. Abrir DevTools (F12)
2. Ver qué ruta exacta está causando el error
3. Buscar esa ruta en la base de datos
4. Corregirla manualmente si es necesario

### **Limpiar caché de Next.js:**
```bash
rm -rf .next
npm run dev
```

---

¡Error solucionado! 🎉
