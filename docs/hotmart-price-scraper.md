# 🤖 Automatización de Precios Hotmart

## Problema
Tienes que copiar manualmente los precios de Hotmart 2 veces al día para 14 países.

## Solución 1: Bookmarklet (Más Rápido)

### Paso 1: Crear el Bookmarklet
1. Crea un nuevo marcador en tu navegador
2. Nómbralo: "📋 Copiar Precios Hotmart"
3. En la URL, pega esto:

```javascript
javascript:(function(){
  const prices = [];
  const iframe = document.querySelector('#inline_checkout iframe');
  if (!iframe) {
    alert('No se encontró el formulario de Hotmart');
    return;
  }
  
  // Intentar leer precios del iframe
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const priceElements = iframeDoc.querySelectorAll('[data-price], .price, .amount');
    
    priceElements.forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/[\d.,]+/);
      if (match) {
        prices.push(match[0]);
      }
    });
    
    if (prices.length > 0) {
      navigator.clipboard.writeText(prices.join('\n'));
      alert('✅ Precios copiados: ' + prices.length);
    } else {
      alert('⚠️ No se encontraron precios');
    }
  } catch (e) {
    alert('❌ Error: El iframe está bloqueado por CORS');
  }
})();
```

### Paso 2: Usar el Bookmarklet
1. Abre la página de country-prices
2. Click en el bookmarklet
3. Los precios se copian automáticamente

---

## Solución 2: Script de Consola

Abre la consola del navegador (F12) y pega esto:

```javascript
// Script para extraer precios de Hotmart
const extractHotmartPrices = () => {
  const iframe = document.querySelector('#inline_checkout iframe');
  if (!iframe) {
    console.error('No se encontró el iframe de Hotmart');
    return;
  }
  
  console.log('Iframe encontrado:', iframe);
  console.log('Intenta inspeccionar manualmente el iframe para ver los selectores de precios');
};

extractHotmartPrices();
```

---

## Solución 3: Extensión de Chrome (Más Avanzada)

Si quieres, puedo crear una extensión de Chrome que:
1. Detecta cuando estás en la página de country-prices
2. Lee automáticamente los precios de Hotmart
3. Los rellena en los inputs
4. Te avisa cuando termina

---

## Solución 4: Formato Rápido de Pegado

En la página ya agregué un botón "📝 Pegar Rápido" que acepta este formato:

```
CO:50000, AR:5000, MX:200, PE:35, ES:10
```

### Flujo:
1. Abres Hotmart en otra pestaña
2. Cambias país manualmente y copias el precio
3. Creas una lista: `CO:50000, AR:5000, ...`
4. Click en "📝 Pegar Rápido"
5. Pegas la lista
6. ¡Listo! Todos los precios se actualizan

---

## ⚠️ Limitación de CORS

Hotmart usa un iframe con restricciones de seguridad (CORS), lo que impide leer su contenido directamente desde JavaScript. 

### Alternativas:
1. **Extensión de Chrome**: Puede bypassear CORS
2. **Puppeteer/Playwright**: Script que abre Hotmart y extrae precios
3. **Formato rápido**: Copias manualmente pero pegas todo de una vez

---

## 🚀 ¿Qué prefieres?

1. ✅ **Extensión de Chrome** (100% automático, 0 trabajo manual)
2. ✅ **Script Puppeteer** (corre en servidor, actualiza automáticamente 2 veces al día)
3. ✅ **Formato rápido** (copias manualmente pero pegas todo junto)

Dime cuál prefieres y lo implemento.
