# Sistema de Recuperación de Ventas por Correo

## 📋 Resumen del Sistema

Sistema robusto y eficiente para enviar correos de recuperación de ventas a usuarios registrados, con seguimiento en tiempo real y plantillas personalizables.

## 🎯 Características

1. **Badge de 3 Botones** en cada usuario:
   - 🔵 Botón 1: Primer correo de recuperación
   - 🟠 Botón 2: Segundo correo de recuperación (con descuento)
   - 🟢 Botón 3: Correo de bienvenida/agradecimiento

2. **Seguimiento en Tiempo Real**:
   - Los botones se deshabilitan después de enviar
   - Muestra cuántos días han pasado desde el envío
   - Registro completo en base de datos

3. **Editor de Plantillas**:
   - Página dedicada para personalizar correos
   - Vista previa en tiempo real
   - Variables dinámicas ({{user_name}}, {{user_email}})
   - Código HTML completamente personalizable

## 🚀 Instalación

### 1. Ejecutar SQL en Supabase

Ve a tu proyecto en Supabase > SQL Editor y ejecuta:

\`\`\`sql
-- Tabla para almacenar las plantillas de correos
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para registrar los correos enviados a cada usuario
CREATE TABLE IF NOT EXISTS user_email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  template_key TEXT REFERENCES email_templates(template_key),
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_email_logs_user_id ON user_email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_email_logs_email_type ON user_email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_user_email_logs_sent_at ON user_email_logs(sent_at);

-- Insertar plantillas por defecto (ver SQL completo arriba)
\`\`\`

### 2. Instalar Nodemailer

\`\`\`bash
npm install nodemailer
npm install --save-dev @types/nodemailer
\`\`\`

### 3. Configurar Variables de Entorno

Crea o actualiza tu archivo \`.env.local\`:

#### Para Gmail:

\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
\`\`\`

**Importante para Gmail:**
1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación" en: https://myaccount.google.com/apppasswords
4. Usa esa contraseña en SMTP_PASS

#### Para Zoho Mail:

\`\`\`env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=tu-email@zohomail.com
SMTP_PASS=tu-password
\`\`\`

## 📧 Uso del Sistema

### En la Lista de Usuarios

1. Ve a **Dashboard Admin** > **Lista de Usuarios**
2. Cada usuario tiene 3 botones de correo al lado de las acciones
3. Haz clic en un botón para enviar el correo correspondiente
4. El botón se deshabilitará y mostrará los días transcurridos

### Personalizar Plantillas

1. Ve a **Dashboard Admin** > **Correos** (botón morado)
2. Selecciona la plantilla que deseas editar (Correo 1, 2 o Bienvenida)
3. Edita el asunto, descripción y contenido HTML
4. Usa la vista previa para ver los cambios en tiempo real
5. Haz clic en **Guardar**

### Variables Disponibles

En las plantillas HTML puedes usar:
- \`{{user_name}}\` - Se reemplaza con el nombre del usuario
- \`{{user_email}}\` - Se reemplaza con el email del usuario

## 🎨 Estructura de Archivos Creados

\`\`\`
src/
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── send-recovery-email/
│   │       │   └── route.ts          # API para enviar correos
│   │       └── email-logs/
│   │           └── route.ts          # API para obtener logs
│   └── dashboard/
│       └── admin/
│           └── email-templates/
│               └── page.tsx          # Página de edición de plantillas
└── components/
    └── admin/
        └── EmailRecoveryBadge.tsx    # Badge de 3 botones
\`\`\`

## 🔒 Seguridad

- Solo administradores pueden enviar correos
- Todas las peticiones requieren autenticación
- Los logs se guardan en la base de datos
- Las plantillas están protegidas en Supabase

## 📊 Seguimiento

El sistema registra automáticamente:
- Fecha y hora de envío
- Tipo de correo enviado
- Usuario destinatario
- Estado del envío

## 🎯 Flujo Recomendado

1. **Día 0**: Usuario se registra pero no compra
2. **Día 1-2**: Enviar Correo 1 (recordatorio)
3. **Día 3-5**: Enviar Correo 2 (con descuento)
4. **Al comprar**: Enviar Correo de Bienvenida

## 🐛 Solución de Problemas

### Los correos no se envían

1. Verifica las credenciales SMTP en .env.local
2. Para Gmail, asegúrate de usar una "Contraseña de aplicación"
3. Revisa los logs en la consola del servidor

### Los botones no se deshabilitan

1. Verifica que las tablas estén creadas en Supabase
2. Revisa los permisos RLS en Supabase
3. Comprueba la consola del navegador

### Las plantillas no se guardan

1. Verifica que la tabla email_templates exista
2. Comprueba los permisos de escritura en Supabase

## 📝 Notas Adicionales

- Los correos se envían de forma asíncrona
- El sistema es escalable y puede manejar múltiples envíos
- Las plantillas HTML son responsive y se ven bien en móviles
- Puedes agregar más plantillas según necesites

## 🎉 ¡Listo!

El sistema está completamente funcional y listo para usar. Personaliza las plantillas según tu marca y comienza a recuperar ventas.
