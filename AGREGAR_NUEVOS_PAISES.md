# 🌎 Agregar Nuevos Países a Country Prices

## 📋 Países a Agregar

Se agregarán 5 nuevos países:

1. 🇺🇸 **Estados Unidos** (US) - USD $3.90
2. 🇻🇪 **Venezuela** (VE) - USD $3.90
3. 🇸🇻 **El Salvador** (SV) - USD $3.90
4. 🇪🇨 **Ecuador** (EC) - USD $3.90
5. 🇵🇷 **Puerto Rico** (PR) - USD $3.90

---

## 💡 Nota sobre las Monedas

Todos estos países usan **USD (Dólar Estadounidense)**:

- **Estados Unidos**: Moneda oficial
- **Venezuela**: Dolarización de facto por crisis económica
- **El Salvador**: Adoptó USD oficialmente en 2001
- **Ecuador**: Adoptó USD oficialmente en 2000
- **Puerto Rico**: Territorio de USA, usa USD

---

## 🚀 Cómo Ejecutar la Migración

### **Opción 1: Dashboard de Supabase (Recomendado)**

1. Ve a https://supabase.com
2. Abre tu proyecto
3. Click en **"SQL Editor"** (menú izquierdo)
4. Click en **"New Query"**
5. Abre el archivo: `supabase/migrations/add_new_countries.sql`
6. **Copia TODO** el contenido (Ctrl+A, Ctrl+C)
7. **Pega** en Supabase (Ctrl+V)
8. Click en **"Run"** o presiona `Ctrl+Enter`

**Resultado esperado:**
```
✅ 5 filas insertadas/actualizadas
✅ Tabla con los 5 nuevos países
✅ Total de países: 19 (14 anteriores + 5 nuevos)
```

---

### **Opción 2: Supabase CLI**

```bash
# Si tienes Supabase CLI instalado
supabase db push
```

---

## ✅ Verificar que Funcionó

### **1. En Supabase**

Ve a **Table Editor** → **country_prices**

Deberías ver los nuevos países:

```
US | Estados Unidos    | 3.90 | USD | $ | false
VE | Venezuela         | 3.90 | USD | $ | false
SV | El Salvador       | 3.90 | USD | $ | false
EC | Ecuador           | 3.90 | USD | $ | false
PR | Puerto Rico       | 3.90 | USD | $ | false
```

### **2. En la Aplicación**

1. Ve a: `/dashboard/admin/country-prices`
2. Haz scroll hacia abajo
3. Deberías ver los 5 nuevos países en la lista
4. Cada uno con:
   - 🇺🇸 Bandera
   - Nombre del país
   - Código USD
   - Símbolo $
   - Input con precio 3.90
   - Candado desbloqueado 🔓

---

## 🎯 Después de Agregar

### **Ajustar Precios (Opcional)**

Si quieres precios diferentes para cada país:

1. Ve a `/dashboard/admin/country-prices`
2. Busca el país
3. Edita el precio
4. Click en "Guardar" (en el header)

**Ejemplo:**
```
Estados Unidos: $3.90 (mantener)
Venezuela: $2.50 (ajustar por economía)
El Salvador: $3.50 (ajustar)
Ecuador: $3.50 (ajustar)
Puerto Rico: $3.90 (mantener igual que USA)
```

### **Bloquear Precios (Opcional)**

Para proteger precios importantes:

1. Click en el candado 🔓 del país
2. Cambia a 🔒
3. Click en "Guardar"
4. El precio queda protegido

---

## 📊 Información Técnica

### **Estructura de Datos**

```sql
country_code: TEXT    -- Código ISO de 2 letras
country_name: TEXT    -- Nombre completo
price: DECIMAL        -- Precio en moneda local
currency_code: TEXT   -- Código de moneda (USD)
currency_symbol: TEXT -- Símbolo ($)
is_locked: BOOLEAN    -- Si está bloqueado
```

### **Códigos ISO**

- 🇺🇸 US - Estados Unidos
- 🇻🇪 VE - Venezuela
- 🇸🇻 SV - El Salvador
- 🇪🇨 EC - Ecuador
- 🇵🇷 PR - Puerto Rico

---

## 🔧 Troubleshooting

### **Problema: "Duplicate key value"**

**Causa:** Los países ya existen en la base de datos

**Solución:** El script usa `ON CONFLICT DO UPDATE`, así que actualizará los existentes

### **Problema: "Column is_locked does not exist"**

**Causa:** La columna `is_locked` no existe en tu tabla

**Solución:** El script la crea automáticamente con:
```sql
ALTER TABLE country_prices ADD COLUMN is_locked BOOLEAN DEFAULT false;
```

### **Problema: No veo los países en la app**

**Solución:**
1. Recarga la página con Ctrl+Shift+R
2. Verifica en Supabase que los países existen
3. Revisa la consola por errores

---

## 📈 Estadísticas

### **Antes:**
- Total de países: 14

### **Después:**
- Total de países: 19
- Nuevos países: 5
- Todos usan USD

### **Distribución por Moneda:**
```
USD: 5 países (US, VE, SV, EC, PR)
ARS: 1 país (Argentina)
COP: 1 país (Colombia)
MXN: 1 país (México)
... (otros)
```

---

## 🎓 Resumen

**Archivo a ejecutar:** `supabase/migrations/add_new_countries.sql`

**Qué hace:**
1. ✅ Verifica/crea columna `is_locked`
2. ✅ Inserta 5 nuevos países
3. ✅ Si ya existen, los actualiza
4. ✅ Muestra los países insertados
5. ✅ Muestra el total de países

**Resultado:**
- 5 nuevos países disponibles
- Todos con precio inicial $3.90 USD
- Listos para editar en `/dashboard/admin/country-prices`

---

## 🚀 Próximos Pasos

1. **Ejecutar la migración** (ver arriba)
2. **Verificar en Supabase** que los países existen
3. **Abrir la app** y ver los nuevos países
4. **(Opcional)** Ajustar precios según tu estrategia
5. **(Opcional)** Bloquear precios importantes

---

## 📞 Si Necesitas Ayuda

Proporciona:
1. Screenshot del error en Supabase
2. Resultado de esta query:
   ```sql
   SELECT * FROM country_prices WHERE country_code IN ('US', 'VE', 'SV', 'EC', 'PR');
   ```
3. Screenshot de la página country-prices

---

¡Listo! Ahora tendrás 19 países en total. 🎉
