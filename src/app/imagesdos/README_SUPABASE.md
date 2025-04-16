# Configuración de Supabase para Flasti AI

Este documento contiene las instrucciones para configurar correctamente Supabase para la aplicación Flasti AI.

## Requisitos

- Cuenta en Supabase (https://supabase.com)
- Proyecto creado en Supabase
- Credenciales de acceso al proyecto (URL y API Key)

## Pasos para la configuración

### 1. Ejecutar el esquema SQL

1. Accede a tu proyecto en Supabase
2. Ve a la sección "SQL Editor"
3. Crea un nuevo query
4. Copia y pega el contenido del archivo `esquema_completo.sql`
5. Ejecuta el query

Este script creará:
- Tabla `profiles` para almacenar información de los usuarios
- Tabla `images` para almacenar las imágenes generadas
- Función y trigger para crear automáticamente un perfil cuando se registra un usuario
- Políticas de seguridad (RLS) para proteger los datos

### 2. Verificar la configuración

1. Abre el archivo `verificar_supabase_fixed.html` en tu navegador
2. Haz clic en el botón "Verificar Configuración"
3. Revisa los resultados en el log

Si todo está configurado correctamente, deberías ver mensajes de éxito para:
- Conexión a Supabase
- Acceso a la tabla `profiles`
- Acceso a la tabla `images`
- Creación de usuario de prueba
- Creación automática de perfil

### 3. Configurar los archivos de la aplicación

1. Reemplaza los archivos originales por los nuevos:
   - `auth.js` → `auth_fixed.js`
   - `login.html` → `login_fixed.html`
   - `register.html` → `register_fixed.html`
   - `dashboard.js` → `dashboard_fixed.js`
   - `dashboard.html` → `dashboard_fixed.html`

2. O simplemente renombra los archivos nuevos para usar los nombres originales.

## Solución de problemas

### Error: "Database error saving new user"

Este error ocurre cuando el trigger para crear el perfil de usuario no está funcionando correctamente. Posibles soluciones:

1. Verifica que hayas ejecutado el esquema SQL completo
2. Asegúrate de que las políticas de seguridad (RLS) estén configuradas correctamente
3. Verifica que la función `handle_new_user` esté definida correctamente
4. Comprueba que el trigger `on_auth_user_created` esté activo

### Error: "Error al obtener perfil"

Este error ocurre cuando no se puede acceder a la tabla `profiles`. Posibles soluciones:

1. Verifica que la tabla `profiles` exista
2. Asegúrate de que las políticas de seguridad (RLS) permitan el acceso
3. Comprueba que el usuario tenga permisos para acceder a la tabla

### Error: "Error al guardar imagen"

Este error ocurre cuando no se puede guardar una imagen en la tabla `images`. Posibles soluciones:

1. Verifica que la tabla `images` exista
2. Asegúrate de que las políticas de seguridad (RLS) permitan la inserción
3. Comprueba que el usuario tenga permisos para insertar en la tabla

## Estructura de la base de datos

### Tabla `profiles`

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    image_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `images`

```sql
CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT,
    image_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Contacto

Si tienes problemas con la configuración, contacta al equipo de desarrollo.
