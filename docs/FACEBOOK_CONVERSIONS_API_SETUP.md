# Configuración de Facebook Conversions API para Hotmart

## ¿Qué es Facebook Conversions API?

Facebook Conversions API permite enviar eventos de conversión directamente desde tu servidor a Facebook, lo cual es especialmente útil para:

- **Webhooks de Hotmart**: Los webhooks se ejecutan en el servidor, no en el navegador del usuario
- **Mejor tracking**: Datos más precisos y confiables
- **Bypass de bloqueadores**: Los eventos se envían desde el servidor, no desde el navegador

## Configuración Paso a Paso

### 1. Crear un Token de Acceso

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Selecciona tu aplicación o crea una nueva
3. Ve a **Herramientas** → **Explorador de API**
4. Selecciona tu aplicación
5. Genera un token con los siguientes permisos:
   - `ads_management`
   - `business_management`

### 2. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Facebook Pixel & Conversions API Configuration
FACEBOOK_PIXEL_ID=2198693197269102
FACEBOOK_CONVERSIONS_API_TOKEN=tu_token_aqui
```

### 3. Verificar Configuración

El sistema ya está configurado para:

- ✅ **Webhook de Hotmart** → Envía eventos automáticamente
- ✅ **PURCHASE_COMPLETE** → Evento de compra
- ✅ **PURCHASE_APPROVED** → Evento de registro completado
- ✅ **Datos hasheados** → Emails y nombres se hashean automáticamente

## Eventos que se Envían

### Para PURCHASE_COMPLETE
```javascript
{
  event_name: 'Purchase',
  custom_data: {
    value: precio_de_la_compra,
    currency: 'USD',
    content_ids: ['producto_id'],
    content_name: 'Acceso a Flasti',
    content_type: 'product',
    num_items: 1
  },
  user_data: {
    em: 'email_hasheado',
    fn: 'nombre_hasheado',
    ln: 'apellido_hasheado'
  }
}
```

### Para PURCHASE_APPROVED
```javascript
{
  event_name: 'CompleteRegistration',
  custom_data: {
    content_name: 'Flasti Registration',
    status: 'approved'
  },
  user_data: {
    em: 'email_hasheado',
    fn: 'nombre_hasheado',
    ln: 'apellido_hasheado'
  }
}
```

## Verificación

### 1. Logs del Servidor
Revisa los logs del webhook de Hotmart:
```
✅ Evento enviado a Facebook Conversions API: Purchase
✅ Tracking de compra de Hotmart completado
```

### 2. Facebook Events Manager
1. Ve a [Facebook Events Manager](https://www.facebook.com/events_manager2/)
2. Selecciona tu pixel
3. Ve a **Test Events** para ver eventos en tiempo real
4. Verifica que lleguen eventos con `action_source: 'website'`

### 3. Facebook Pixel Helper
Instala la extensión [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/) para Chrome y verifica eventos en el frontend.

## Troubleshooting

### Error: "Invalid Access Token"
- Verifica que el token tenga los permisos correctos
- Regenera el token si es necesario
- Asegúrate de que la aplicación tenga acceso al pixel

### Error: "Invalid Pixel ID"
- Verifica que el Pixel ID sea correcto: `2198693197269102`
- Asegúrate de que el pixel esté activo en Facebook

### No se ven eventos
- Verifica que `FACEBOOK_CONVERSIONS_API_TOKEN` esté configurado
- Revisa los logs del servidor para errores
- Usa Facebook Test Events para debugging

## Configuración de Hotmart

Asegúrate de que el webhook de Hotmart esté configurado:

- **URL**: `https://flasti.com/api/hotmart/webhook`
- **Eventos**: `PURCHASE_COMPLETE`, `PURCHASE_APPROVED`
- **Productos**: `4962378`, `4968174`, `4968671`

## Beneficios

✅ **Tracking completo**: Desde el checkout hasta la compra final
✅ **Datos precisos**: Server-side tracking más confiable
✅ **Optimización de anuncios**: Facebook puede optimizar mejor con datos precisos
✅ **Retargeting**: Audiencias más precisas para remarketing
✅ **Reportes**: Datos de conversión más completos

## Próximos Pasos

1. **Configurar el token** en las variables de entorno
2. **Probar con una compra real** de Hotmart
3. **Verificar eventos** en Facebook Events Manager
4. **Configurar audiencias** personalizadas en Facebook Ads
5. **Crear campañas** de retargeting basadas en los eventos

## Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Usa Facebook Test Events para debugging
4. Consulta la [documentación oficial](https://developers.facebook.com/docs/marketing-api/conversions-api/) de Facebook Conversions API
