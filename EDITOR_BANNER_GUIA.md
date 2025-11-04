# Guía del Editor de Banner - Texto con Formato

## 🎨 Funcionalidades del Editor

El editor de texto del banner ahora soporta:
- ✅ **Negrita** - Resaltar texto importante
- ✅ **Color personalizado** - Selector de color libre
- ✅ **Colores rápidos** - 5 colores predefinidos

---

## 📝 Cómo Usar

### 1. **Aplicar Negrita**

**Pasos:**
1. Escribe tu texto en el editor
2. Selecciona la parte que quieres en negrita
3. Haz clic en el botón **"B Negrita"**
4. El texto se envuelve en `<strong></strong>`

**Ejemplo:**
```
Texto original: ¡Bienvenido a Flasti! Gana dinero hoy
Seleccionar: "Gana dinero"
Resultado: ¡Bienvenido a Flasti! <strong>Gana dinero</strong> hoy
```

**Vista en banner:**
¡Bienvenido a Flasti! **Gana dinero** hoy

---

### 2. **Aplicar Color Personalizado**

**Pasos:**
1. Haz clic en el selector de color (cuadro de color)
2. Elige el color que desees
3. Selecciona el texto que quieres colorear
4. Haz clic en el botón **"🎨 Color"**
5. El texto se envuelve en `<span style="color:#COLOR"></span>`

**Ejemplo:**
```
Texto original: ¡Cierra octubre ganando más!
Seleccionar: "ganando más"
Elegir color: #FFD700 (amarillo)
Resultado: ¡Cierra octubre <span style="color:#FFD700">ganando más</span>!
```

**Vista en banner:**
¡Cierra octubre <span style="color:#FFD700">ganando más</span>!

---

### 3. **Usar Colores Rápidos**

**Colores Predefinidos:**
- 🟡 **Amarillo** - `#FFD700`
- 🟠 **Naranja** - `#FF6B35`
- 🌸 **Rosa** - `#FF1493`
- 🔵 **Cyan** - `#2DE2E6`
- 🟢 **Verde** - `#10B981`

**Pasos:**
1. Selecciona el texto que quieres colorear
2. Haz clic en uno de los círculos de color
3. El color se aplica automáticamente

**Ejemplo:**
```
Texto original: Descubrí las novedades
Seleccionar: "novedades"
Clic en círculo rosa
Resultado: Descubrí las <span style="color:#FF1493">novedades</span>
```

---

## 🎯 Ejemplos Completos

### Ejemplo 1: Texto Simple con Negrita
```html
¡Bienvenido a Flasti! <strong>Gana dinero</strong> completando microtareas
```
**Vista:** ¡Bienvenido a Flasti! **Gana dinero** completando microtareas

---

### Ejemplo 2: Texto con Color
```html
¡Cierra octubre <span style="color:#FFD700">ganando más</span>! Descubrí las novedades
```
**Vista:** ¡Cierra octubre <span style="color:#FFD700">ganando más</span>! Descubrí las novedades

---

### Ejemplo 3: Negrita + Color
```html
<strong><span style="color:#FF1493">¡Oferta especial!</span></strong> Gana hasta $100 hoy
```
**Vista:** <strong><span style="color:#FF1493">¡Oferta especial!</span></strong> Gana hasta $100 hoy

---

### Ejemplo 4: Múltiples Colores
```html
¡<span style="color:#FFD700">Cierra octubre</span> <span style="color:#FF1493">ganando más</span>! Descubrí las <span style="color:#2DE2E6">novedades</span>
```
**Vista:** ¡<span style="color:#FFD700">Cierra octubre</span> <span style="color:#FF1493">ganando más</span>! Descubrí las <span style="color:#2DE2E6">novedades</span>

---

### Ejemplo 5: Estilo Flashween (Referencia)
```html
<strong>¡Cierra octubre ganando más!</strong> Descubrí las novedades y aprovechá al <span style="color:#FFD700">máximo</span>
```
**Vista:** **¡Cierra octubre ganando más!** Descubrí las novedades y aprovechá al <span style="color:#FFD700">máximo</span>

---

## 🎨 Paleta de Colores Recomendada

### Colores que Funcionan Bien en Banner:

#### Colores Cálidos:
- `#FFD700` - Amarillo dorado (llamativo)
- `#FF6B35` - Naranja (energético)
- `#FF1493` - Rosa intenso (vibrante)
- `#FF4500` - Naranja rojizo (urgente)

#### Colores Fríos:
- `#2DE2E6` - Cyan brillante (moderno)
- `#10B981` - Verde esmeralda (positivo)
- `#3B82F6` - Azul brillante (confiable)
- `#8B5CF6` - Morado (premium)

#### Colores Neutros:
- `#FFFFFF` - Blanco (por defecto)
- `#F3F4F6` - Gris claro (sutil)
- `#FEF3C7` - Amarillo pastel (suave)

---

## 💡 Consejos de Uso

### ✅ Buenas Prácticas:

1. **No abuses del color**
   - Usa 1-2 colores máximo por banner
   - Demasiados colores distraen

2. **Contraste es clave**
   - Asegúrate de que el texto sea legible
   - Prueba en diferentes fondos (imagen/degradado)

3. **Negrita para énfasis**
   - Usa negrita en palabras clave
   - No pongas todo en negrita

4. **Colores para llamar la atención**
   - Amarillo/Naranja para ofertas
   - Rosa/Cyan para novedades
   - Verde para éxito/ganancias

5. **Mantén la coherencia**
   - Usa los mismos colores para el mismo tipo de mensaje
   - Crea tu propia paleta de marca

### ❌ Evita:

1. ❌ Texto completamente en color oscuro (no se verá)
2. ❌ Más de 3 colores diferentes
3. ❌ Todo el texto en negrita
4. ❌ Colores muy similares al fondo
5. ❌ Texto muy largo con formato

---

## 🔧 Edición Manual (Avanzado)

Si prefieres escribir el HTML directamente:

### Negrita:
```html
<strong>texto</strong>
```

### Color:
```html
<span style="color:#FFD700">texto</span>
```

### Negrita + Color:
```html
<strong><span style="color:#FF1493">texto</span></strong>
```
o
```html
<span style="color:#FF1493"><strong>texto</strong></span>
```

### Múltiples Estilos:
```html
<span style="color:#FFD700; font-weight:bold;">texto</span>
```

---

## 📊 Vista Previa

La vista previa en admin muestra **exactamente** cómo se verá el banner:
- ✅ Colores renderizados
- ✅ Negrita aplicada
- ✅ Tamaño de fuente correcto
- ✅ Alineación a la izquierda
- ✅ Logo y separador (si aplica)

**Siempre revisa la vista previa antes de guardar.**

---

## 🎯 Casos de Uso Comunes

### 1. Promoción/Oferta:
```html
<strong><span style="color:#FFD700">¡Oferta especial!</span></strong> Gana hasta $100 hoy
```

### 2. Urgencia:
```html
<span style="color:#FF6B35">¡Últimas horas!</span> Aprovecha las <strong>mejores ofertas</strong>
```

### 3. Novedad:
```html
<span style="color:#2DE2E6">Nuevo:</span> Descubrí las últimas <strong>microtareas</strong>
```

### 4. Bienvenida:
```html
¡Bienvenido a Flasti! <strong>Gana dinero</strong> completando <span style="color:#10B981">tareas simples</span>
```

### 5. Temporada:
```html
<strong>¡Cierra octubre ganando más!</strong> Descubrí las <span style="color:#FF1493">novedades</span>
```

---

## 🚀 Resultado Final

Con el editor mejorado puedes crear banners:
- ✅ Profesionales
- ✅ Llamativos
- ✅ Personalizados
- ✅ Sin tocar código
- ✅ Con vista previa en tiempo real

**¡Experimenta y crea banners únicos para tu plataforma!** 🎨
