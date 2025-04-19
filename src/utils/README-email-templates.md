# Plantillas de Correo Electrónico para Flasti

Este directorio contiene utilidades para enviar correos electrónicos personalizados utilizando las plantillas HTML ubicadas en el directorio `email-templates`.

## Estructura de archivos

- `email-templates.ts`: Contiene las funciones para enviar correos electrónicos personalizados.
- `email-examples.ts`: Contiene ejemplos de cómo usar las funciones de envío de correos.

## Plantillas disponibles

1. **verification.html** - Verificación de correo electrónico / Confirmación de registro
2. **reset-password.html** - Restablecimiento de contraseña
3. **welcome.html** - Bienvenida a nuevos usuarios
4. **commission-received.html** - Notificación de comisión recibida
5. **withdrawal-processed.html** - Notificación de retiro procesado
6. **level-upgrade.html** - Actualización de nivel de afiliado

## Cómo usar las plantillas

### 1. Plantillas predeterminadas de Supabase

Las plantillas predeterminadas de Supabase (verificación, restablecimiento de contraseña, etc.) se configuran directamente en el panel de administración de Supabase. Estas plantillas ya están configuradas y no necesitan código adicional para funcionar.

### 2. Plantillas personalizadas

Para enviar correos electrónicos personalizados, puedes usar las funciones definidas en `email-templates.ts`:

```typescript
import { 
  sendWelcomeEmail, 
  sendCommissionEmail, 
  sendWithdrawalEmail, 
  sendLevelUpgradeEmail 
} from '@/utils/email-templates';

// Enviar correo de bienvenida
await sendWelcomeEmail('usuario@ejemplo.com', 'Juan Pérez');

// Enviar notificación de comisión
await sendCommissionEmail('usuario@ejemplo.com', {
  name: 'Juan Pérez',
  amount: '25.00',
  balance: '125.00',
  transactionId: 'TRX-12345',
  date: '15/08/2024',
  productName: 'Flasti Imágenes',
  saleAmount: '50.00',
  commissionRate: '50'
});

// Enviar notificación de retiro
await sendWithdrawalEmail('usuario@ejemplo.com', {
  name: 'Juan Pérez',
  amount: '100.00',
  balance: '25.00',
  transactionId: 'WTH-12345',
  requestDate: '14/08/2024',
  processDate: '15/08/2024',
  paymentMethod: 'PayPal'
});

// Enviar notificación de ascenso de nivel
await sendLevelUpgradeEmail('usuario@ejemplo.com', {
  name: 'Juan Pérez',
  level: 2,
  commissionRate: 60
});
```

### 3. Desde el frontend

Para enviar correos desde el frontend, puedes usar las funciones definidas en `email-examples.ts`:

```typescript
import { 
  sendWelcomeEmailExample, 
  sendCommissionEmailExample, 
  sendWithdrawalEmailExample, 
  sendLevelUpgradeEmailExample 
} from '@/utils/email-examples';

// Enviar correo de bienvenida
await sendWelcomeEmailExample('usuario@ejemplo.com', 'Juan Pérez');

// Enviar notificación de comisión
await sendCommissionEmailExample('usuario@ejemplo.com', {
  name: 'Juan Pérez',
  amount: '25.00',
  balance: '125.00',
  transactionId: 'TRX-12345',
  date: '15/08/2024',
  productName: 'Flasti Imágenes',
  saleAmount: '50.00',
  commissionRate: '50'
});

// ... y así sucesivamente para los demás tipos de correos
```

## Seguridad

Las funciones de envío de correos desde el frontend están protegidas por autenticación. Solo los usuarios con rol de administrador pueden enviar correos electrónicos.

## Personalización

Si necesitas modificar las plantillas, puedes editar los archivos HTML en el directorio `email-templates`. Las plantillas utilizan [Handlebars](https://handlebarsjs.com/) para la interpolación de variables.

## Solución de problemas

Si tienes problemas al enviar correos electrónicos, verifica lo siguiente:

1. Asegúrate de que las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` estén configuradas correctamente.
2. Verifica que las plantillas HTML estén disponibles en el directorio `email-templates` en el servidor.
3. Revisa los logs del servidor para ver si hay errores específicos.

## Notas importantes

- Las plantillas se copian automáticamente al directorio de compilación durante el proceso de construcción gracias al script `postbuild` definido en `package.json`.
- Si añades nuevas plantillas, asegúrate de actualizar el enum `EmailTemplate` en `email-templates.ts`.
