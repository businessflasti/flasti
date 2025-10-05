# ✅ MERCADO PAGO ACTUALIZADO - NUEVA CUENTA

## 🎉 CREDENCIALES ACTUALIZADAS

### Nueva Configuración:

| Dato | Valor |
|------|-------|
| **Client ID** | `8400251779300797` |
| **Access Token** | `APP_USR-8400251779300797-100517-207f2ff90eec04a47316d5974b5474ce-1068552659` |
| **Public Key** | `APP_USR-ff10bd60-45b9-4de9-a524-fde1163da058` |
| **Client Secret** | `0QywhqZU7niOxKbK3U0LSrQcbUBk70H8` |
| **User ID** | `1068552659` |

---

## 📁 ARCHIVOS ACTUALIZADOS

### ✅ 1. `.env.production`
```env
MERCADOPAGO_CLIENT_ID=8400251779300797
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8400251779300797-100517-207f2ff90eec04a47316d5974b5474ce-1068552659
MERCADOPAGO_PUBLIC_KEY=APP_USR-ff10bd60-45b9-4de9-a524-fde1163da058
MERCADOPAGO_CLIENT_SECRET=0QywhqZU7niOxKbK3U0LSrQcbUBk70H8
```

### ✅ 2. `src/app/api/mercadopago/route.ts`
- Access Token actualizado
- Client ID actualizado
- Ahora usa variables de entorno primero

### ✅ 3. `src/app/api/mercadopago/webhook/route.ts`
- Access Token actualizado
- User ID actualizado

### ✅ 4. `src/app/api/test-mercadopago-webhook/route.ts`
- Client ID actualizado
- User ID actualizado

---

## 🚀 PRÓXIMOS PASOS

### 1. Si usas Vercel/Netlify/otro hosting:

Actualiza las variables de entorno en tu panel:

**Vercel:**
1. Ve a: https://vercel.com/[tu-proyecto]/settings/environment-variables
2. Actualiza:
   - `MERCADOPAGO_CLIENT_ID` → `8400251779300797`
   - `MERCADOPAGO_ACCESS_TOKEN` → `APP_USR-8400251779300797-100517-207f2ff90eec04a47316d5974b5474ce-1068552659`
   - `MERCADOPAGO_PUBLIC_KEY` → `APP_USR-ff10bd60-45b9-4de9-a524-fde1163da058`
   - `MERCADOPAGO_CLIENT_SECRET` → `0QywhqZU7niOxKbK3U0LSrQcbUBk70H8`

**Netlify:**
1. Ve a: Site settings → Environment variables
2. Actualiza las mismas variables

### 2. Rebuild y Deploy:

```bash
# Local
npm run build

# Deploy (según tu plataforma)
vercel --prod
# o
netlify deploy --prod
```

### 3. Configurar Webhook en Mercado Pago (IMPORTANTE):

1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Selecciona tu aplicación
3. Ve a "Webhooks"
4. Configura:
   - **URL:** `https://flasti.com/api/mercadopago/webhook`
   - **Eventos:** `payment` (Pagos)
   - **Modo:** Producción
5. Guarda

---

## ✅ VERIFICAR QUE FUNCIONA

### Test 1: Verificar configuración

```bash
# Visita en tu navegador:
https://flasti.com/api/test-mercadopago-webhook
```

Deberías ver:
```json
{
  "message": "Endpoint para probar webhook de Mercado Pago",
  "configuration": {
    "client_id": "8400251779300797",
    "access_token": "configurado",
    "webhook_secret": "configurado"
  }
}
```

### Test 2: Hacer un pago de prueba

1. Ve a: `https://flasti.com/dashboard/checkout`
2. Selecciona Mercado Pago
3. Completa el formulario
4. Haz un pago de prueba
5. Verifica que:
   - ✅ Se crea la preferencia de pago
   - ✅ Redirige a Mercado Pago
   - ✅ El pago se procesa
   - ✅ Recibes confirmación
   - ✅ El usuario se activa como premium

### Test 3: Verificar webhook

Después de hacer un pago:

1. Ve a Supabase
2. Tabla: `webhook_logs`
3. Busca el último registro con `provider = 'mercadopago'`
4. Verifica que `status = 'processed'`

---

## 🔐 SEGURIDAD

### ⚠️ IMPORTANTE:

1. **NO subas `.env.production` a Git**
   - Ya está en `.gitignore`
   - Verifica: `git status` no debe mostrar `.env.production`

2. **Guarda las credenciales en un lugar seguro**
   - Password manager (1Password, LastPass, etc.)
   - Documento encriptado

3. **Configura variables de entorno en producción**
   - Vercel/Netlify/etc.
   - No dependas solo del archivo `.env.production`

---

## 📊 COMPARACIÓN

### Antes (Cuenta Antigua):
```
Client ID: 1617533183479702
User ID: 224528502
```

### Ahora (Cuenta Nueva):
```
Client ID: 8400251779300797
User ID: 1068552659
```

---

## 🎯 CHECKLIST FINAL

- [x] Credenciales actualizadas en `.env.production`
- [x] Credenciales actualizadas en `route.ts`
- [x] Credenciales actualizadas en `webhook/route.ts`
- [x] Credenciales actualizadas en `test-mercadopago-webhook/route.ts`
- [ ] Variables de entorno actualizadas en hosting (Vercel/Netlify)
- [ ] Rebuild y deploy realizado
- [ ] Webhook configurado en panel de Mercado Pago
- [ ] Test de configuración realizado
- [ ] Pago de prueba realizado
- [ ] Webhook verificado en Supabase

---

## 🆘 SI ALGO NO FUNCIONA

### Problema: "Error al crear preferencia"

**Solución:**
1. Verifica que el Access Token sea correcto
2. Verifica que las variables de entorno estén actualizadas en tu hosting
3. Haz rebuild y redeploy

### Problema: "Webhook no recibe notificaciones"

**Solución:**
1. Configura el webhook en el panel de Mercado Pago
2. URL: `https://flasti.com/api/mercadopago/webhook`
3. Eventos: `payment`
4. Modo: Producción

### Problema: "Pagos no activan premium"

**Solución:**
1. Revisa logs en Supabase: tabla `webhook_logs`
2. Verifica que el email del pago coincida con el del lead
3. Verifica que el estado sea "approved"

---

## 📞 CONTACTO

Si necesitas ayuda:
1. Revisa los logs en Supabase
2. Prueba el endpoint de test
3. Verifica la configuración en Mercado Pago

---

## 🎉 ¡LISTO!

Todos los archivos están actualizados con las credenciales de tu nueva cuenta.

**Ahora solo necesitas:**
1. Actualizar variables de entorno en tu hosting (si aplica)
2. Rebuild y deploy
3. Configurar webhook en Mercado Pago
4. Probar con un pago real

**Los pagos ahora caerán en tu nueva cuenta de Mercado Pago.** 💰

---

**Fecha de actualización:** 10 de Mayo, 2025
