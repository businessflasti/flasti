# Configuración del Webhook de Hotmart

## 📋 Información General

**URL del Webhook:** `https://flasti.com/api/hotmart/webhook`

**Productos Configurados:**
- ID: `4962378` - Flasti Producto 1
- ID: `4968174` - Flasti Producto 2  
- ID: `4968671` - Flasti Producto 3

**Eventos Registrados:**
- `PURCHASE_COMPLETE` - Compra completada
- `PURCHASE_APPROVED` - Compra aprobada

## 🔧 Configuración en Hotmart

### 1. Acceso al Panel de Hotmart
1. Ingresar al panel de productor de Hotmart
2. Ir a **Configuraciones** > **Webhooks**
3. Agregar nuevo webhook

### 2. Configuración del Webhook
```
URL: https://flasti.com/api/hotmart/webhook
Método: POST
Eventos: PURCHASE_COMPLETE, PURCHASE_APPROVED
Productos: 4962378, 4968174, 4968671
```

### 3. Autenticación
- **Webhook Secret:** No proporcionado por Hotmart
- **Token:** No requerido
- **Validación:** Por estructura de payload y origen

## 📡 Estructura del Payload

### PURCHASE_COMPLETE
```json
{
  "event": "PURCHASE_COMPLETE",
  "version": "2.0.0",
  "data": {
    "buyer": {
      "email": "comprador@email.com",
      "name": "Juan",
      "surname": "Pérez",
      "ucode": "buyer_unique_code",
      "ip": "192.168.1.1"
    },
    "purchase": {
      "transaction": "HM_TRANSACTION_ID",
      "product": {
        "id": "4962378",
        "name": "Nombre del Producto"
      },
      "price": {
        "value": 97.00,
        "currency_code": "USD"
      },
      "buyer": {
        "email": "comprador@email.com",
        "name": "Juan",
        "surname": "Pérez"
      }
    }
  }
}
```

### PURCHASE_APPROVED (con afiliado)
```json
{
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "buyer": {
      "email": "comprador@email.com",
      "name": "María",
      "surname": "González",
      "ucode": "buyer_unique_code",
      "ip": "192.168.1.2"
    },
    "purchase": {
      "transaction": "HM_TRANSACTION_ID",
      "product": {
        "id": "4968174",
        "name": "Nombre del Producto"
      },
      "price": {
        "value": 197.00,
        "currency_code": "USD"
      },
      "buyer": {
        "email": "comprador@email.com",
        "name": "María",
        "surname": "González"
      },
      "affiliate": {
        "id": "AFFILIATE_HOTMART_ID"
      }
    }
  }
}
```

## 🔄 Flujo de Procesamiento

### 1. PURCHASE_COMPLETE
1. **Validación:** Verificar estructura del payload
2. **Producto:** Validar que el producto esté configurado
3. **Registro:** Crear usuario si no existe
4. **Email:** Enviar email de bienvenida
5. **Respuesta:** Confirmar procesamiento

### 2. PURCHASE_APPROVED
1. **Validación:** Verificar estructura del payload
2. **Producto:** Validar que el producto esté configurado
3. **Afiliado:** Buscar afiliado en base de datos
4. **Comisión:** Calcular comisión según nivel del afiliado
5. **Registro:** Registrar venta y comisión
6. **Balance:** Actualizar balance del afiliado
7. **Email:** Enviar email de bienvenida al comprador
8. **Respuesta:** Confirmar procesamiento

## 💰 Cálculo de Comisiones

### Comisión Base por Producto
- **Producto 4962378:** 50%
- **Producto 4968174:** 50%
- **Producto 4968671:** 50%

### Multiplicador por Nivel de Afiliado
- **Nivel 1:** 1.0x (100% de la comisión base)
- **Nivel 2:** 1.2x (120% de la comisión base)
- **Nivel 3:** 1.4x (140% de la comisión base)

### Ejemplo de Cálculo
```
Venta: $100 USD
Producto: 4962378 (50% comisión base)
Afiliado: Nivel 2 (1.2x multiplicador)

Comisión = $100 × 50% × 1.2 = $60 USD
```

## 🧪 Testing

### Endpoint de Prueba
**URL:** `https://flasti.com/api/test-hotmart-webhook`

### Prueba Básica
```bash
curl -X POST https://flasti.com/api/test-hotmart-webhook \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Prueba con Producto Específico
```bash
curl -X POST https://flasti.com/api/test-hotmart-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "4962378",
    "eventType": "PURCHASE_COMPLETE"
  }'
```

### Prueba con Afiliado
```bash
curl -X POST https://flasti.com/api/test-hotmart-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "4968174",
    "eventType": "PURCHASE_APPROVED",
    "affiliateId": "TEST_AFFILIATE_123"
  }'
```

## 📊 Monitoreo y Logs

### Logs del Webhook
- Todos los webhooks se registran en los logs del servidor
- Incluye timestamp, evento, producto y resultado
- Errores se registran con detalles completos

### Verificación de Funcionamiento
1. **Logs del servidor:** Verificar que los webhooks lleguen
2. **Base de datos:** Confirmar que las ventas se registren
3. **Emails:** Verificar que se envíen los emails de bienvenida
4. **Balances:** Confirmar que se actualicen los balances de afiliados

## 🚨 Troubleshooting

### Problemas Comunes

1. **Webhook no llega:**
   - Verificar URL en Hotmart
   - Verificar que el servidor esté funcionando
   - Revisar logs de firewall

2. **Producto no configurado:**
   - Verificar que el ID del producto esté en la lista
   - Revisar logs para ver el ID recibido

3. **Afiliado no encontrado:**
   - Verificar que el afiliado esté registrado
   - Confirmar que el hotmart_id coincida

4. **Comisión incorrecta:**
   - Verificar nivel del afiliado
   - Revisar configuración de comisiones

### Códigos de Respuesta
- **200:** Webhook procesado correctamente
- **400:** Error en el payload o datos
- **500:** Error interno del servidor

## 📞 Soporte

Para problemas con el webhook de Hotmart:
1. Revisar logs del servidor
2. Verificar configuración en Hotmart
3. Probar con el endpoint de testing
4. Contactar soporte técnico si persisten los problemas
