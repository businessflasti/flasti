# Plantillas de Correo Electrónico para Flasti

Este directorio contiene plantillas HTML responsivas y profesionales para los correos electrónicos enviados por la plataforma Flasti.

## Plantillas disponibles

1. **verification.html** - Verificación de correo electrónico / Confirmación de registro
2. **reset-password.html** - Restablecimiento de contraseña
3. **welcome.html** - Bienvenida a nuevos usuarios
4. **commission-received.html** - Notificación de comisión recibida
5. **withdrawal-processed.html** - Notificación de retiro procesado
6. **level-upgrade.html** - Actualización de nivel de afiliado

## Implementación en Supabase

Para implementar estas plantillas en Supabase, sigue estos pasos:

### 1. Accede al panel de administración de Supabase

1. Inicia sesión en [Supabase](https://app.supabase.io/)
2. Selecciona tu proyecto "Flasti plataforma"
3. Navega a "Authentication" en el menú lateral

### 2. Configura las plantillas de correo electrónico

1. En la sección de Authentication, haz clic en "Email Templates"
2. Para cada tipo de correo electrónico, haz clic en "Edit" y:
   - Actualiza el asunto del correo según corresponda
   - Copia y pega el código HTML de la plantilla correspondiente
   - Asegúrate de reemplazar las variables de plantilla (como `{{ .Name }}`, `{{ .Code }}`, etc.) con la sintaxis correcta de Supabase: `{{ .Name }}` o `{{ .Code }}`
   - Guarda los cambios

### 3. Tipos de correos y sus plantillas correspondientes

| Tipo de correo en Supabase | Archivo de plantilla |
|----------------------------|----------------------|
| Confirmación de registro   | verification.html    |
| Restablecimiento de contraseña | reset-password.html |
| Cambio de correo electrónico | verification.html (adaptar según sea necesario) |
| Invitación                 | welcome.html (adaptar según sea necesario) |

### 4. Implementación de plantillas personalizadas

Para los correos personalizados (comisiones, retiros, etc.) que no son parte de las plantillas predeterminadas de Supabase, debes:

1. Crear una función en tu backend que envíe estos correos
2. Utilizar la API de correo electrónico de Supabase o un servicio como SendGrid/Nodemailer
3. Cargar la plantilla HTML correspondiente y reemplazar las variables dinámicas antes de enviar

Ejemplo de código para enviar un correo personalizado:

```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function sendCustomEmail(to, templateName, variables) {
  try {
    // Cargar plantilla
    const templatePath = path.join(process.cwd(), 'email-templates', `${templateName}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    
    // Compilar plantilla con Handlebars
    const template = Handlebars.compile(templateSource);
    const html = template(variables);
    
    // Determinar asunto según el tipo de correo
    let subject = 'Notificación de Flasti';
    if (templateName === 'commission-received') {
      subject = '¡Has recibido una comisión! - Flasti';
    } else if (templateName === 'withdrawal-processed') {
      subject = 'Retiro procesado con éxito - Flasti';
    } else if (templateName === 'level-upgrade') {
      subject = `¡Felicidades por tu ascenso al Nivel ${variables.Level}! - Flasti`;
    }
    
    // Enviar correo usando la API de Supabase
    const { error } = await supabase.auth.admin.sendEmail(to, {
      subject,
      html,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error };
  }
}

// Ejemplo de uso
sendCustomEmail(
  'usuario@ejemplo.com',
  'commission-received',
  {
    Name: 'Juan Pérez',
    Amount: '25.00',
    Balance: '125.00',
    TransactionId: 'TRX-12345',
    Date: '15/08/2024',
    ProductName: 'Flasti Imágenes',
    SaleAmount: '50.00',
    CommissionRate: '50'
  }
);
```

## Variables de plantilla

Cada plantilla utiliza variables específicas que deben ser reemplazadas con datos reales:

### verification.html
- `{{ .Code }}` - Código de verificación
- `{{ .URL }}` - URL para verificar la cuenta

### reset-password.html
- `{{ .URL }}` - URL para restablecer la contraseña

### welcome.html
- `{{ .Name }}` - Nombre del usuario

### commission-received.html
- `{{ .Name }}` - Nombre del usuario
- `{{ .Amount }}` - Monto de la comisión
- `{{ .Balance }}` - Saldo actual
- `{{ .TransactionId }}` - ID de la transacción
- `{{ .Date }}` - Fecha de la transacción
- `{{ .ProductName }}` - Nombre del producto
- `{{ .SaleAmount }}` - Monto de la venta
- `{{ .CommissionRate }}` - Porcentaje de comisión

### withdrawal-processed.html
- `{{ .Name }}` - Nombre del usuario
- `{{ .Amount }}` - Monto del retiro
- `{{ .Balance }}` - Saldo actual
- `{{ .TransactionId }}` - ID de la transacción
- `{{ .RequestDate }}` - Fecha de solicitud
- `{{ .ProcessDate }}` - Fecha de procesamiento
- `{{ .PaymentMethod }}` - Método de pago

### level-upgrade.html
- `{{ .Name }}` - Nombre del usuario
- `{{ .Level }}` - Nuevo nivel alcanzado
- `{{ .CommissionRate }}` - Nueva tasa de comisión

## Personalización adicional

Estas plantillas están diseñadas para reflejar la identidad visual de Flasti, con:

- Colores principales: Degradado de morado (#9333ea) a rosa (#ec4899)
- Tipografía: Söhne, SF Pro Display, y fuentes de sistema
- Logo: "flasti" en minúscula con estilo de Silicon Valley
- Diseño responsivo para visualización óptima en dispositivos móviles

Si necesitas realizar cambios en el diseño, modifica los estilos CSS incluidos en cada plantilla.
