# 🚨 CONFIGURACIÓN OBLIGATORIA EN CPALEAD

## Pasos a seguir DESPUÉS del despliegue:

### 1. **Configurar Postback URL en CPALead:**
- Ve a tu panel de CPALead
- Busca la sección "Postback" o "Server-to-Server Postback" o "Webhooks"
- Configura esta URL: `https://flasti.com/api/cpalead/postback`
- Método: **POST**

### 2. **Configurar Parámetros del Postback:**
Asegúrate de que CPALead envíe estos parámetros:

```
subid = {USER_ID_DE_SUPABASE}  ← MUY IMPORTANTE
amount = {AMOUNT}
offer_id = {OFFER_ID}
currency = {CURRENCY}
transaction_id = {TRANSACTION_ID}
ip = {USER_IP}
status = completed
```

### 3. **Modificar Enlaces de Ofertas:**
Cuando los usuarios hagan clic en las ofertas, el enlace debe incluir el `subid`:

```
https://oferta-cpalead.com?subid=UUID_DEL_USUARIO_SUPABASE
```

### 4. **Testing del Postback:**
- Puedes probar el endpoint en desarrollo: `GET http://localhost:3000/api/cpalead/postback`
- Debería mostrar información sobre los campos esperados

## ⚠️ SIN ESTA CONFIGURACIÓN, LAS GANANCIAS NO SE ACREDITARÁN AUTOMÁTICAMENTE