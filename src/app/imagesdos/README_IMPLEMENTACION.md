# Implementación de Flasti AI - Sistema Freemium

Este documento explica la implementación del sistema freemium en Flasti AI, que permite a los usuarios generar 2 imágenes gratuitas y luego los invita a pagar por acceso ilimitado.

## Estructura del Proyecto

El proyecto consta de los siguientes archivos principales:

- `index.html`: Página principal con el generador de imágenes
- `script.js`: Lógica principal de la aplicación
- `styles.css`: Estilos de la aplicación
- `login.html` y `register.html`: Páginas de autenticación
- `dashboard.html`: Panel de usuario para usuarios registrados
- `checkout.html`: Página de pago para acceso premium
- `auth.js`: Lógica de autenticación con Supabase
- `dashboard.js`: Lógica del panel de usuario
- `checkout.js`: Lógica de la página de pago
- `supabase/schema.sql`: Esquema de la base de datos para Supabase

## Flujo de Usuario

1. **Primer Acceso**:
   - El usuario accede a la página principal
   - Se muestra un popup de bienvenida explicando las características
   - El usuario cierra el popup y puede comenzar a generar imágenes

2. **Generación de Imágenes Gratuitas**:
   - El usuario puede generar hasta 2 imágenes de forma gratuita
   - El contador de imágenes se almacena en localStorage

3. **Límite Alcanzado**:
   - Después de generar 2 imágenes, se muestra el popup premium
   - El usuario tiene dos opciones:
     - Pagar por acceso premium
     - Cerrar el popup (pero no podrá generar más imágenes)

4. **Proceso de Pago**:
   - Si el usuario elige pagar, es redirigido a la página de checkout
   - En la página de checkout se muestra el formulario de Hotmart
   - Después del pago, Hotmart redirige al usuario a la página de registro

5. **Registro y Acceso**:
   - El usuario se registra y su cuenta se marca como premium
   - El usuario puede acceder a su panel donde puede generar imágenes ilimitadas

## Configuración Necesaria

### 1. Supabase

Para configurar Supabase:

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ejecuta el script SQL en `supabase/schema.sql` para crear las tablas necesarias
4. Actualiza las variables `SUPABASE_URL` y `SUPABASE_KEY` en:
   - `script.js`
   - `auth.js`
   - `dashboard.js`

### 2. Hotmart

Para configurar Hotmart:

1. Crea una cuenta en [Hotmart](https://hotmart.com/)
2. Crea un nuevo producto con el precio de $5
3. Configura la URL de redirección después del pago a: `https://flasti.com/images/register.html?premium=true`
4. Copia el código de integración del formulario de pago y reemplázalo en `checkout.html`

## Personalización

Puedes personalizar varios aspectos del sistema:

- **Precio**: Cambia el valor en `index.html` y `checkout.html`
- **Número de imágenes gratuitas**: Modifica la condición en `script.js` (función `canGenerateMoreImages()`)
- **Textos y mensajes**: Edita los textos en los archivos HTML
- **Estilos**: Modifica `styles.css`, `auth.css`, `dashboard.css` y `checkout.css`

## Pruebas

Para probar el sistema completo:

1. Ejecuta `npx http-server` para iniciar un servidor local
2. Abre `http://localhost:8000` en tu navegador
3. Genera 2 imágenes y verifica que aparezca el popup premium
4. Prueba el flujo de registro y login
5. Verifica que los usuarios premium puedan generar imágenes ilimitadas

## Solución de Problemas

- **Error en la autenticación**: Verifica las credenciales de Supabase
- **El contador no funciona**: Comprueba el localStorage en las herramientas de desarrollo
- **El popup no aparece**: Verifica los IDs de los elementos en HTML y JavaScript
- **Problemas con el formulario de Hotmart**: Asegúrate de haber copiado correctamente el código de integración

## Notas Adicionales

- El sistema está diseñado para ser fácilmente integrable con cualquier proveedor de pagos
- La base de datos está estructurada para permitir futuras expansiones
- El panel de usuario puede ampliarse con más funcionalidades según sea necesario
