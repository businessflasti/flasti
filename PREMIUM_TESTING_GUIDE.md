# 🧪 Guía de Testing del Sistema Premium

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de premium que incluye:

### ✅ Componentes Implementados:
1. **Campo premium en base de datos** (`is_premium`, `premium_activated_at`, `premium_payment_method`)
2. **Endpoint API** `/api/user/premium-status` para verificar estado premium
3. **Hook actualizado** `usePremiumStatus` que usa la API real
4. **Servicio premium** `premium-service.ts` para activar premium
5. **Webhooks actualizados** para activar premium automáticamente después del pago
6. **Asociación usuario-pago** mejorada en checkout
7. **Endpoint admin** para activar premium manualmente

## 🗄️ Scripts SQL a Ejecutar

### 1. Script Principal
Ejecutar en Supabase SQL Editor:
```sql
-- Contenido del archivo: add_premium_field.sql
```

### 2. Script de Verificación
Ejecutar para verificar que todo funciona:
```sql
-- Contenido del archivo: sql_verification.sql
```

## 🧪 Cómo Probar el Sistema

### Prueba 1: Verificar Estado Premium (Usuario Gratuito)
1. Ir a `/dashboard`
2. Las microtareas deben aparecer bloqueadas con overlay
3. Hacer clic en "Desbloquear" → debe ir a `/dashboard/premium`

### Prueba 2: Activar Premium Manualmente
```bash
# Activar premium por email
curl -X POST http://localhost:3000/api/admin/activate-premium \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "paymentMethod": "manual"}'

# Verificar estado premium
curl "http://localhost:3000/api/admin/activate-premium?email=tu-email@ejemplo.com"
```

### Prueba 3: Flujo Completo de Pago
1. Ir a `/dashboard/premium`
2. Hacer clic en "QUIERO DESBLOQUEAR YA"
3. Completar formulario de pago
4. Simular webhook de pago exitoso
5. Verificar que las microtareas se desbloquean

### Prueba 4: Verificar Webhooks

#### PayPal Webhook Test:
```bash
curl -X POST http://localhost:3000/api/paypal-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_transaction_123",
    "status": "COMPLETED",
    "payer": {
      "email_address": "tu-email@ejemplo.com",
      "name": {
        "given_name": "Test",
        "surname": "User"
      }
    },
    "purchase_units": [{
      "amount": {
        "value": "7.00",
        "currency_code": "USD"
      }
    }]
  }'
```

#### Mercado Pago Webhook Test:
```bash
curl -X POST http://localhost:3000/api/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  }'
```

## 🔍 Verificaciones en Base de Datos

### Verificar Usuario Premium:
```sql
SELECT 
  user_id,
  is_premium,
  premium_activated_at,
  premium_payment_method
FROM public.user_profiles 
WHERE user_id = 'tu-user-id';
```

### Ver Estadísticas Premium:
```sql
SELECT * FROM premium_users_stats;
```

### Ver Leads de Checkout:
```sql
SELECT 
  email,
  full_name,
  payment_method,
  status,
  user_id,
  created_at
FROM public.checkout_leads 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚨 Troubleshooting

### Problema: Las microtareas siguen bloqueadas después del pago
**Solución:**
1. Verificar que el webhook se ejecutó correctamente
2. Verificar que el usuario tiene `is_premium = true` en la base de datos
3. Verificar que el hook `usePremiumStatus` está funcionando
4. Refrescar la página o hacer logout/login

### Problema: Error en webhook
**Solución:**
1. Verificar logs del servidor
2. Verificar que las funciones SQL existen
3. Verificar que el email del pago coincide con un usuario registrado

### Problema: API premium-status devuelve error
**Solución:**
1. Verificar que el usuario está autenticado
2. Verificar que existe el perfil en `user_profiles`
3. Verificar permisos RLS

## 📊 Monitoreo

### Logs Importantes:
- `🎯 Activando premium para usuario`
- `✅ Premium activado exitosamente`
- `❌ Error activando premium`

### Métricas a Monitorear:
- Conversión premium (vista `premium_users_stats`)
- Errores en webhooks
- Tiempo de activación premium después del pago

## 🔄 Flujo Completo Esperado

1. **Usuario gratuito** → Ve microtareas bloqueadas
2. **Hace clic en desbloquear** → Va a página premium
3. **Hace clic en "QUIERO DESBLOQUEAR YA"** → Va a checkout
4. **Completa pago** → Se guarda lead con `user_id`
5. **Webhook recibe confirmación** → Activa premium automáticamente
6. **Usuario regresa al dashboard** → Ve microtareas desbloqueadas

## ⚡ Comandos Rápidos

```bash
# Activar premium para testing
curl -X POST http://localhost:3000/api/admin/activate-premium \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "paymentMethod": "manual"}'

# Verificar estado
curl "http://localhost:3000/api/admin/activate-premium?email=test@example.com"

# Ver logs en tiempo real
tail -f .next/server.log | grep -E "(premium|webhook|payment)"
```

## 🎯 Resultado Esperado

Después de implementar todo:
- ✅ Usuario gratuito ve microtareas bloqueadas
- ✅ Usuario premium ve microtareas desbloqueadas
- ✅ Pago automáticamente activa premium
- ✅ Sistema funciona con PayPal, Mercado Pago y Hotmart
- ✅ No requiere intervención manual