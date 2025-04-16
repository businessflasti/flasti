# Instrucciones para configurar Flasti AI

Este documento contiene las instrucciones para configurar correctamente Flasti AI con Supabase para la autenticación y Hotmart para los pagos.

## 1. Configuración de Supabase

### Crear una cuenta en Supabase
1. Ve a [Supabase](https://supabase.com/) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave pública de anon/public (la necesitarás más adelante)

### Configurar la base de datos
1. Ve a la sección "SQL Editor" en el panel de Supabase
2. Crea una nueva consulta
3. Copia y pega el contenido del archivo `supabase/schema.sql`
4. Ejecuta la consulta para crear las tablas y funciones necesarias

### Configurar autenticación
1. Ve a la sección "Authentication" > "Settings"
2. Habilita el proveedor "Email"
3. Configura el dominio de tu sitio web en "Site URL"
4. Personaliza los correos electrónicos de confirmación si lo deseas

## 2. Actualizar la configuración en el código

Abre los siguientes archivos y actualiza las variables de configuración de Supabase:

### En `script.js`
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_KEY = 'tu-clave-publica-de-supabase';
```

### En `auth.js`
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_KEY = 'tu-clave-publica-de-supabase';
```

### En `dashboard.js`
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_KEY = 'tu-clave-publica-de-supabase';
```

## 3. Configuración de Hotmart

### Crear una cuenta en Hotmart
1. Ve a [Hotmart](https://hotmart.com/) y crea una cuenta
2. Crea un nuevo producto
3. Configura el precio y la información del producto

### Configurar el formulario de pago
1. En el panel de Hotmart, ve a la sección "Ventas" > "Checkout"
2. Personaliza el formulario de pago según tus necesidades
3. Copia el código de integración del formulario

### Configurar la redirección después del pago
1. En el panel de Hotmart, ve a la sección "Ventas" > "Checkout" > "Agradecimiento"
2. Configura la URL de redirección después del pago a: `https://flasti.com/images/register.html?premium=true`

### Integrar el formulario de Hotmart
1. Abre el archivo `checkout.html`
2. Busca la sección con el comentario `<!-- Aquí se insertará el formulario de Hotmart -->`
3. Reemplaza el contenido del div `hotmart-form` con el código de integración que copiaste de Hotmart

## 4. Pruebas

Una vez configurado todo, deberías probar:

1. El registro de usuarios
2. El inicio de sesión
3. El límite de 2 imágenes gratuitas
4. El popup de premium
5. El proceso de pago con Hotmart
6. La redirección después del pago
7. El acceso ilimitado para usuarios premium

## 5. Despliegue

Para desplegar el sitio:

1. Sube todos los archivos a tu servidor web
2. Asegúrate de que la URL del sitio coincida con la configurada en Supabase
3. Verifica que todas las redirecciones funcionen correctamente

## Notas adicionales

- El sistema está configurado para permitir 2 imágenes gratuitas por navegador (usando localStorage)
- Los usuarios premium pueden generar imágenes ilimitadas
- Todas las imágenes generadas por usuarios registrados se guardan en su cuenta
- El panel de usuario permite ver y gestionar las imágenes guardadas
