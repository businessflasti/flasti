# Configuración del Sistema de Afiliados para Flasti Images

Este documento explica cómo configurar y utilizar el sistema de afiliados implementado en Flasti Images.

## Resumen del sistema

El sistema de afiliados permite rastrear las ventas generadas a través de enlaces de afiliados y atribuir comisiones a los afiliados correspondientes. El sistema funciona de la siguiente manera:

1. Un afiliado genera un enlace único con su ID: `https://flasti.com/images?ref=ID_DEL_AFILIADO`
2. Cuando un visitante hace clic en el enlace, el sistema guarda el ID del afiliado en localStorage y cookies
3. Si el visitante realiza una compra, el sistema atribuye la venta al afiliado y le asigna una comisión

## Archivos implementados

- `affiliate-tracking.js`: Script principal que maneja el seguimiento de afiliados
- Modificaciones en `index.html`: Para incluir el script de seguimiento
- Modificaciones en `checkout.html` y `checkout.js`: Para preservar la información del afiliado durante el proceso de compra
- Endpoint de webhook para Hotmart: Para recibir notificaciones de ventas y atribuirlas a los afiliados

## Configuración de Hotmart

Para que el sistema funcione correctamente con Hotmart, debes configurar lo siguiente:

### 1. Configurar el webhook en Hotmart

1. Inicia sesión en tu cuenta de Hotmart
2. Ve a "Configuraciones" > "Webhooks"
3. Haz clic en "Crear webhook"
4. Configura el webhook con la siguiente información:
   - URL: `https://tu-dominio.com/api/payment/hotmart-webhook`
   - Eventos: Selecciona "PURCHASE_APPROVED" y "PURCHASE_COMPLETE"
   - Formato: JSON
   - Versión: La más reciente disponible
5. Guarda la configuración

### 2. Obtener la clave secreta para verificar las notificaciones

1. En la configuración del webhook, Hotmart te proporcionará una clave secreta
2. Agrega esta clave como variable de entorno en tu servidor:
   ```
   HOTMART_WEBHOOK_SECRET=tu_clave_secreta
   ```

### 3. Actualizar el código de oferta en checkout.js

En el archivo `checkout.js`, asegúrate de que el código de oferta sea el correcto:

```javascript
const hotmartOptions = {
    offer: 'TU_CODIGO_DE_OFERTA', // Reemplaza con tu código real de Hotmart
    width: '100%',
    height: 'auto',
    responsive: true
};
```

## Prueba del sistema

Para probar el sistema, sigue estos pasos:

1. Genera un enlace de afiliado: `https://flasti.com/images?ref=ID_DE_PRUEBA`
2. Abre el enlace en una ventana de incógnito
3. Navega a la página de checkout (`https://flasti.com/images/checkout`)
4. Verifica en la consola del navegador que el ID del afiliado se haya capturado correctamente
5. Realiza una compra de prueba
6. Verifica en la base de datos que la venta se haya atribuido correctamente al afiliado

## Solución de problemas

Si el sistema no funciona correctamente, verifica lo siguiente:

1. Asegúrate de que el script `affiliate-tracking.js` se cargue correctamente en todas las páginas
2. Verifica que las cookies se estén estableciendo correctamente
3. Comprueba que el formulario de Hotmart esté recibiendo el parámetro `aff` con el ID del afiliado
4. Revisa los logs del servidor para ver si hay errores en el webhook

## Personalización

Puedes personalizar el sistema modificando los siguientes parámetros en `affiliate-tracking.js`:

- `AFFILIATE_EXPIRY_DAYS`: Duración de la atribución (por defecto: 7 días)
- `PRODUCT_ID`: ID del producto (por defecto: '1' para Flasti Images)

## Notas importantes

- El sistema utiliza localStorage y cookies para rastrear a los afiliados, lo que requiere que el usuario acepte las cookies
- La atribución de ventas tiene una duración de 7 días por defecto
- El sistema previene auto-compras verificando que el comprador no sea el mismo afiliado
- Las comisiones se calculan según el nivel del usuario (50%, 60% o 70%)
