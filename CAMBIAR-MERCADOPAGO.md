# 🔐 CAMBIAR CREDENCIALES DE MERCADO PAGO

## 📋 CREDENCIALES ACTUALES

### Cuenta Actual Configurada:

**Client ID:** `1617533183479702`  
**Access Token:** `APP_USR-1617533183479702-120313-16aa8293896b850ec41b7f267dac332e-224528502`  
**Webhook Secret:** `6e25dc951cfd1a447372ed020a4714cfaf1dde4033d521cc1ca01301041e9d16`  
**Webhook URL:** `https://flasti.com/api/mercadopago/webhook`  
**Environment:** `production`

---

## 🎯 ARCHIVOS QUE DEBES ACTUALIZAR

Para cambiar a tu nueva cuenta de Mercado Pago, necesitas actualizar **3 archivos**:

### 1. `.env.production` ⚠️ PRINCIPAL

**Ubicación:** Raíz del proyecto

**Líneas a cambiar (28-32):**

```env
# Mercado Pago Configuration
MERCADOPAGO_CLIENT_ID=TU_NUEVO_CLIENT_ID
MERCADOPAGO_ACCESS_TOKEN=TU_NUEVO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET=TU_NUEVO_WEBHOOK_SECRET
MERCADOPAGO_WEBHOOK_URL=https://flasti.com/api/mercadopago/webhook
MERCADOPAGO_ENVIRONMENT=production
```

### 2. `src/app/api/mercadopago/route.ts`

**Ubicación:** `src/app/api/mercadopago/route.ts`

**Líneas a cambiar (4-5):**

```typescript
// Configuración de Mercado Pago
const ACCESS_TOKEN = 'TU_NUEVO_ACCESS_TOKEN';
const CLIENT_ID = 'TU_NUEVO_CLIENT_ID';
```

**NOTA:** Este archivo tiene las credenciales hardcodeadas como fallback. Es mejor usar variables de entorno.

### 3. `src/app/api/mercadopago/webhook/route.ts`

**Ubicación:** `src/app/api/mercadopago/webhook/route.ts`

**Línea a cambiar (7):**

```typescript
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TU_NUEVO_ACCESS_TOKEN';
```

**NOTA:** Este archivo ya usa variables de entorno, pero tiene un fallback hardcodeado.

---

## 🔑 CÓMO OBTENER TUS NUEVAS CREDENCIALES

### Paso 1: Acceder a tu cuenta de Mercado Pago

1. Ve a: https://www.mercadopago.com.ar/developers
2. Inicia sesión con tu nueva cuenta
3. Clic en "Tus integraciones"

### Paso 2: Crear o seleccionar una aplicación

1. Si no tienes una aplicación, clic en "Crear aplicación"
2. Nombre: "Flasti" (o el que prefieras)
3. Tipo: "Pagos online"
4. Clic en "Crear aplicación"

### Paso 3: Obtener credenciales de producción

1. En tu aplicación, ve a "Credenciales"
2. Selecciona "Credenciales de producción"
3. Copia los siguientes datos:

**Client ID:**
```
Ejemplo: 1234567890123456
```

**Access Token:**
```
Ejemplo: APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890-123456789
```

### Paso 4: Configurar Webhook

1. En tu aplicación, ve a "Webhooks"
2. Clic en "Configurar webhooks"
3. URL de notificación: `https://flasti.com/api/mercadopago/webhook`
4. Eventos a suscribir:
   - ✅ `payment` (Pagos)
5. Clic en "Guardar"

### Paso 5: Obtener Webhook Secret (Opcional pero recomendado)

1. En la configuración de webhooks
2. Copia el "Secret" que te proporciona Mercado Pago
3. Si no hay, puedes generar uno aleatorio:

```bash
# En tu terminal, genera un secret aleatorio:
openssl rand -hex 32
```

---

## 🔧 PASOS PARA ACTUALIZAR

### Opción A: Actualizar con Variables de Entorno (RECOMENDADO)

**1. Actualizar `.env.production`:**

```env
MERCADOPAGO_CLIENT_ID=TU_NUEVO_CLIENT_ID
MERCADOPAGO_ACCESS_TOKEN=TU_NUEVO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET=TU_NUEVO_WEBHOOK_SECRET
MERCADOPAGO_WEBHOOK_URL=https://flasti.com/api/mercadopago/webhook
MERCADOPAGO_ENVIRONMENT=production
```

**2. Si usas Vercel/Netlify/otro hosting:**

Ve a tu panel de hosting y actualiza las variables de entorno:
- `MERCADOPAGO_CLIENT_ID`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `MERCADOPAGO_WEBHOOK_URL`
- `MERCADOPAGO_ENVIRONMENT`

**3. Rebuild y redeploy:**

```bash
npm run build
# Subir a producción
```

### Opción B: Actualizar Hardcodeado (NO RECOMENDADO)

Si prefieres hardcodear (no recomendado por seguridad):

**1. Editar `src/app/api/mercadopago/route.ts`:**

```typescript
const ACCESS_TOKEN = 'TU_NUEVO_ACCESS_TOKEN';
const CLIENT_ID = 'TU_NUEVO_CLIENT_ID';
```

**2. Editar `src/app/api/mercadopago/webhook/route.ts`:**

```typescript
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TU_NUEVO_ACCESS_TOKEN';
```

**3. Rebuild y redeploy:**

```bash
npm run build
# Subir a producción
```

---

## ✅ VERIFICAR QUE FUNCIONA

### Test 1: Verificar configuración

1. Ve a: `https://flasti.com/api/test-mercadopago-webhook`
2. Deberías ver:
```json
{
  "message": "Endpoint para probar webhook de Mercado Pago",
  "webhook_url": "https://flasti.com/api/mercadopago/webhook",
  "configuration": {
    "client_id": "TU_NUEVO_CLIENT_ID",
    "access_token": "configurado",
    "webhook_secret": "configurado",
    "environment": "production"
  }
}
```

### Test 2: Hacer un pago de prueba

1. Ve a: `https://flasti.com/dashboard/checkout`
2. Selecciona Mercado Pago
3. Completa el pago con tu cuenta de prueba
4. Verifica que:
   - El pago se procesa correctamente
   - Recibes la confirmación
   - El usuario se activa como premium

### Test 3: Verificar webhook

1. Ve a tu panel de Mercado Pago
2. Sección "Webhooks"
3. Verifica que aparezcan las notificaciones enviadas
4. Estado debe ser: "Entregado" o "Delivered"

---

## 🚨 IMPORTANTE: CONFIGURAR WEBHOOK EN MERCADO PAGO

Después de cambiar las credenciales, **DEBES** configurar el webhook en tu cuenta de Mercado Pago:

### Pasos:

1. **Ve a tu aplicación en Mercado Pago:**
   - https://www.mercadopago.com.ar/developers/panel/app/[TU_APP_ID]/webhooks

2. **Configurar URL de notificación:**
   ```
   https://flasti.com/api/mercadopago/webhook
   ```

3. **Seleccionar eventos:**
   - ✅ `payment` (Pagos)

4. **Modo:**
   - ✅ Producción

5. **Guardar configuración**

### Verificar que el webhook está activo:

```bash
# Hacer una petición de prueba
curl -X POST https://flasti.com/api/test-mercadopago-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "test123",
    "status": "approved",
    "amount": 1000,
    "email": "test@example.com"
  }'
```

---

## 📊 CHECKLIST DE CAMBIO

- [ ] Obtener Client ID de la nueva cuenta
- [ ] Obtener Access Token de la nueva cuenta
- [ ] Generar o copiar Webhook Secret
- [ ] Actualizar `.env.production`
- [ ] Actualizar variables de entorno en hosting (si aplica)
- [ ] Actualizar `src/app/api/mercadopago/route.ts` (opcional)
- [ ] Actualizar `src/app/api/mercadopago/webhook/route.ts` (opcional)
- [ ] Configurar webhook en panel de Mercado Pago
- [ ] Rebuild y redeploy
- [ ] Verificar configuración con `/api/test-mercadopago-webhook`
- [ ] Hacer pago de prueba
- [ ] Verificar que webhook recibe notificaciones
- [ ] Verificar que usuarios se activan correctamente

---

## 🔐 SEGURIDAD

### Mejores Prácticas:

1. **NUNCA** subas credenciales a Git
   - Asegúrate de que `.env.production` esté en `.gitignore`

2. **USA variables de entorno** en producción
   - No hardcodees credenciales en el código

3. **Rota las credenciales** periódicamente
   - Cambia el Access Token cada 6-12 meses

4. **Usa Webhook Secret** para validar notificaciones
   - Evita que terceros envíen notificaciones falsas

5. **Monitorea los logs** de webhook
   - Revisa regularmente en Supabase: tabla `webhook_logs`

---

## 🆘 PROBLEMAS COMUNES

### Problema 1: "Error al crear preferencia"

**Causa:** Access Token inválido o expirado

**Solución:**
1. Verifica que el Access Token sea correcto
2. Verifica que sea de producción (no sandbox)
3. Regenera el Access Token en Mercado Pago

### Problema 2: "Webhook no recibe notificaciones"

**Causa:** URL de webhook no configurada en Mercado Pago

**Solución:**
1. Ve al panel de Mercado Pago
2. Configura la URL: `https://flasti.com/api/mercadopago/webhook`
3. Verifica que esté en modo "Producción"

### Problema 3: "Pagos no activan premium"

**Causa:** Webhook no está procesando correctamente

**Solución:**
1. Revisa los logs en Supabase: tabla `webhook_logs`
2. Verifica que el email del pago coincida con el del lead
3. Verifica que el estado del pago sea "approved"

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs:**
   - Supabase: tabla `webhook_logs`
   - Vercel/Netlify: logs de deployment

2. **Prueba el endpoint:**
   - `https://flasti.com/api/test-mercadopago-webhook`

3. **Verifica en Mercado Pago:**
   - Panel de webhooks
   - Historial de notificaciones

---

## 📝 RESUMEN RÁPIDO

**Para cambiar a tu nueva cuenta:**

1. Obtén credenciales de tu nueva cuenta de Mercado Pago
2. Actualiza `.env.production` con las nuevas credenciales
3. Configura webhook en panel de Mercado Pago
4. Rebuild y redeploy
5. Prueba con un pago real

**Archivos a editar:**
- `.env.production` (PRINCIPAL)
- `src/app/api/mercadopago/route.ts` (opcional)
- `src/app/api/mercadopago/webhook/route.ts` (opcional)

**URL del webhook:**
```
https://flasti.com/api/mercadopago/webhook
```

---

¿Necesitas ayuda con algún paso específico? ¡Pregúntame! 🚀
