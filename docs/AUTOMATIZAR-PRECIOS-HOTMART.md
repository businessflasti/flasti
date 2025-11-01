# 🤖 Automatizar Actualización de Precios Hotmart

## 🎯 Objetivo
Eliminar el trabajo manual de actualizar precios 2 veces al día.

---

## ✅ Solución Recomendada: Script Python + Cron

### Paso 1: Instalar Dependencias

```bash
# Instalar Python (si no lo tienes)
brew install python3  # macOS
# o descarga desde python.org

# Instalar librerías
pip3 install selenium requests

# Instalar ChromeDriver
brew install chromedriver  # macOS
```

### Paso 2: Configurar el Script

1. Abre `scripts/hotmart-price-updater.py`
2. Reemplaza `TU_SERVICE_ROLE_KEY_AQUI` con tu service role key de Supabase
3. **IMPORTANTE**: Debes inspeccionar el HTML de Hotmart para completar la función `extract_price_from_hotmart()`

### Paso 3: Inspeccionar Hotmart

1. Abre https://pay.hotmart.com/5h87lps7 en Chrome
2. Presiona F12 (DevTools)
3. Busca:
   - El selector del dropdown de país
   - El selector del elemento que muestra el precio
4. Actualiza el script con los selectores correctos

Ejemplo:
```python
# Si el precio está en un elemento con clase "checkout-price"
price_element = driver.find_element(By.CLASS_NAME, "checkout-price")
price_text = price_element.text  # Ej: "$50.000 COP"

# Limpiar y convertir
price = float(price_text.replace('$', '').replace('.', '').replace(',', '.'))
```

### Paso 4: Probar el Script

```bash
cd scripts
python3 hotmart-price-updater.py
```

### Paso 5: Automatizar con Cron (macOS/Linux)

```bash
# Editar crontab
crontab -e

# Agregar estas líneas (ejecutar a las 9am y 6pm)
0 9 * * * cd /ruta/a/tu/proyecto/scripts && python3 hotmart-price-updater.py >> /tmp/hotmart-prices.log 2>&1
0 18 * * * cd /ruta/a/tu/proyecto/scripts && python3 hotmart-price-updater.py >> /tmp/hotmart-prices.log 2>&1
```

---

## 🚀 Solución Alternativa: Extensión de Chrome

Si prefieres algo más visual, puedo crear una extensión de Chrome que:

1. Detecta cuando estás en `/dashboard/admin/country-prices`
2. Agrega un botón "🤖 Auto-Rellenar desde Hotmart"
3. Click → Abre Hotmart en segundo plano
4. Extrae todos los precios automáticamente
5. Los rellena en los inputs
6. Listo en 30 segundos

### Ventajas:
- ✅ No necesitas servidor
- ✅ Interfaz visual
- ✅ Un solo click
- ✅ Puedes ver qué está haciendo

### Desventajas:
- ❌ Debes estar en la computadora
- ❌ No es 100% automático

---

## 📝 Solución Temporal: Formato Rápido

Mientras implementas la automatización completa, usa el botón "📝 Pegar Rápido":

1. Abre Hotmart en otra pestaña
2. Anota los precios en este formato:
   ```
   AR:5000, CO:50000, PE:35, MX:200, ES:10, PA:10, GT:80, DO:600, PY:75000, CR:5500, CL:9500, UY:400, BO:70, HN:250
   ```
3. Click en "📝 Pegar Rápido"
4. Pega la lista
5. Click en "Guardar"

Esto reduce el trabajo de 14 copias/pegas individuales a 1 sola.

---

## 🤔 ¿Qué Solución Prefieres?

1. **Script Python** (100% automático, corre solo 2 veces al día)
2. **Extensión Chrome** (semi-automático, 1 click cuando quieras)
3. **Formato Rápido** (manual pero más rápido que ahora)

Dime cuál prefieres y te ayudo a implementarla completamente.
