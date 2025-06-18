# Configuración del Webhook de Mercado Pago

## 📋 Información General

**URL del Webhook:** `https://flasti.com/api/mercadopago/webhook`

**Credenciales Configuradas:**
- **Client ID:** `1617533183479702`
- **Access Token:** `APP_USR-1617533183479702-120313-16aa8293896b850ec41b7f267dac332e-224528502`
- **Webhook Secret:** `6e25dc951cfd1a447372ed020a4714cfaf1dde4033d521cc1ca01301041e9d16`
- **Entorno:** `production`

## 🔧 Configuración en Mercado Pago

### 1. Acceso al Panel de Mercado Pago
1. Ingresar al panel de desarrolladores de Mercado Pago
2. Ir a **"Tus integraciones"** > **"Tu aplicación"**
3. Seleccionar **"Webhooks"** en el menú lateral

### 2. Configuración del Webhook
```
URL: https://flasti.com/api/mercadopago/webhook
Eventos: payment
Método: POST
Estado: Activo
```

### 3. Autenticación
- **Webhook Secret:** `6e25dc951cfd1a447372ed020a4714cfaf1dde4033d521cc1ca01301041e9d16`
- **Validación:** HMAC SHA256
- **Header:** `X-Signature`

## 📡 Estructura del Payload

### Notificación de Pago
```json
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2024-01-15T10:30:00.000Z",
  "application_id": "1617533183479702",
  "user_id": "224528502",
  "version": 1,
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "PAYMENT_ID_123456"
  }
}
```

### Respuesta de la API de Pagos
```json
{
  "id": 123456,
  "status": "approved",
  "transaction_amount": 97.00,
  "currency_id": "ARS",
  "payment_method_id": "visa",
  "payment_type_id": "credit_card",
  "date_approved": "2024-01-15T10:30:00.000Z",
  "payer": {
    "email": "comprador@email.com",
    "first_name": "Juan",
    "last_name": "Pérez"
  }
}
```

## 🔄 Flujo de Procesamiento

### 1. Recepción del Webhook
1. **Validación:** Verificar firma HMAC SHA256
2. **Tipo:** Confirmar que es tipo "payment"
3. **ID:** Extraer ID del pago del payload

### 2. Consulta a la API
1. **Request:** GET a `/v1/payments/{payment_id}`
2. **Headers:** Authorization con Access Token
3. **Respuesta:** Detalles completos del pago

### 3. Procesamiento del Pago
1. **Estado:** Verificar que status = "approved"
2. **Matching:** Buscar lead por monto y método de pago
3. **Actualización:** Actualizar lead con transaction_id
4. **Email:** Enviar email de bienvenida automáticamente

## 🎯 Lógica de Matching

### Búsqueda de Lead
```sql
SELECT * FROM checkout_leads 
WHERE payment_method = 'mercadopago' 
  AND status = 'form_submitted'
  AND ABS(amount - payment_amount) < 100
ORDER BY created_at DESC
LIMIT 10
```

### Criterios de Matching
- **Método de pago:** `mercadopago`
- **Estado:** `form_submitted`
- **Tolerancia de monto:** ±100 ARS
- **Orden:** Más reciente primero

## 📧 Envío de Email

### Cuando se Envía
- ✅ **Pago aprobado:** status = "approved"
- ✅ **Lead encontrado:** Matching exitoso
- ✅ **Actualización exitosa:** Lead actualizado en BD

### Datos del Email
```json
{
  "email": "lead.email",
  "fullName": "lead.full_name", 
  "transactionId": "payment_id"
}
```

## 🧪 Testing

### Endpoint de Prueba
**URL:** `https://flasti.com/api/test-mercadopago-webhook`

### Prueba Básica
```bash
curl -X POST https://flasti.com/api/test-mercadopago-webhook \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Prueba Personalizada
```bash
curl -X POST https://flasti.com/api/test-mercadopago-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "TEST_PAYMENT_123",
    "status": "approved",
    "amount": 97.00,
    "email": "test@example.com"
  }'
```

### Verificar Configuración
```bash
curl https://flasti.com/api/test-mercadopago-webhook
```

## 📊 Monitoreo y Logs

### Logs del Webhook
- **Recepción:** Timestamp y headers
- **Validación:** Resultado de verificación de firma
- **API Call:** Request y response de Mercado Pago
- **Matching:** Leads encontrados y seleccionados
- **Email:** Resultado del envío

### Verificación de Funcionamiento
1. **Panel de Mercado Pago:** Ver webhooks enviados
2. **Logs del servidor:** Verificar recepción y procesamiento
3. **Base de datos:** Confirmar actualización de leads
4. **Emails:** Verificar envío de bienvenida

## 🚨 Troubleshooting

### Problemas Comunes

1. **Webhook no llega:**
   - Verificar URL en panel de Mercado Pago
   - Confirmar que el webhook está activo
   - Revisar logs de firewall

2. **Firma inválida:**
   - Verificar webhook secret
   - Confirmar formato de la firma
   - Revisar algoritmo HMAC SHA256

3. **Lead no encontrado:**
   - Verificar que el lead existe con status 'form_submitted'
   - Confirmar que payment_method = 'mercadopago'
   - Revisar tolerancia de monto (±100 ARS)

4. **Error en API de Mercado Pago:**
   - Verificar Access Token
   - Confirmar que el payment_id existe
   - Revisar permisos de la aplicación

### Códigos de Respuesta
- **200:** Webhook procesado correctamente
- **401:** Firma inválida
- **404:** Pago no encontrado
- **500:** Error interno del servidor

## 📞 Configuración Manual Requerida

### En el Panel de Mercado Pago:
1. **Ir a:** Tus integraciones > Tu aplicación > Webhooks
2. **Agregar webhook:**
   - URL: `https://flasti.com/api/mercadopago/webhook`
   - Eventos: `payment`
   - Estado: Activo
3. **Guardar configuración**

### Verificación:
- El webhook debería aparecer en la lista
- Estado: Activo
- Eventos: payment
- URL correcta

¡Una vez configurado, los emails automáticos funcionarán para pagos de Mercado Pago!
