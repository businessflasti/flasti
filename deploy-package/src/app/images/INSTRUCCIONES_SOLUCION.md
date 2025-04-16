# Solución al problema "Database error saving new user"

Hemos identificado que el problema está en el trigger que debería crear automáticamente un perfil cuando se registra un usuario en Supabase. Sigue estos pasos para solucionarlo:

## 1. Ejecutar el script SQL para corregir el trigger

1. Accede a tu proyecto en Supabase
2. Ve a la sección "SQL Editor"
3. Crea un nuevo query
4. Copia y pega el contenido del archivo `corregir_trigger.sql`
5. Ejecuta el query

Este script:
- Desactiva temporalmente las políticas de seguridad (RLS)
- Elimina el trigger y la función existentes
- Crea una nueva función mejorada con mejor manejo de errores
- Crea un nuevo trigger
- Crea políticas de seguridad más permisivas
- Vuelve a activar RLS

## 2. Probar el registro de usuarios

1. Abre el archivo `probar_registro.html` en tu navegador
2. Completa el formulario con datos de prueba
3. Haz clic en "Registrar Usuario"
4. Verifica en el log si el registro y la creación del perfil fueron exitosos

Si el registro es exitoso, verás mensajes como:
- "Usuario registrado correctamente"
- "Perfil creado correctamente por el trigger"

## 3. Verificar en Supabase

1. Accede a tu proyecto en Supabase
2. Ve a la sección "Authentication" > "Users"
3. Verifica que el usuario se haya creado correctamente
4. Ve a la sección "Table Editor" > "profiles"
5. Verifica que se haya creado un perfil para el usuario

## 4. Usar los archivos corregidos

Una vez que hayas verificado que el registro funciona correctamente, puedes usar los archivos corregidos:

1. Renombra los archivos originales (haz una copia de seguridad primero)
2. Renombra los archivos nuevos para usar los nombres originales:
   - `auth_fixed.js` → `auth.js`
   - `login_fixed.html` → `login.html`
   - `register_fixed.html` → `register.html`
   - `dashboard_fixed.js` → `dashboard.js`
   - `dashboard_fixed.html` → `dashboard.html`

## Explicación técnica del problema

El error "Database error saving new user" ocurre porque:

1. Cuando un usuario se registra, Supabase intenta ejecutar el trigger `on_auth_user_created`
2. Este trigger llama a la función `handle_new_user`
3. La función intenta insertar un registro en la tabla `profiles`
4. Pero algo falla en este proceso, posiblemente:
   - La función no maneja correctamente los valores nulos
   - Las políticas de seguridad (RLS) bloquean la inserción
   - La función no está definida correctamente

La solución que hemos implementado:

1. Mejora la función para manejar correctamente los valores nulos
2. Agrega manejo de errores para que el registro del usuario continúe incluso si hay un problema al crear el perfil
3. Crea políticas de seguridad más permisivas
4. Verifica que la función y el trigger existan

## Si sigues teniendo problemas

Si después de seguir estos pasos sigues teniendo problemas, puedes:

1. Usar la solución alternativa con localStorage (archivos `*_simple.html` y `dashboard_simple.js`)
2. Contactar al soporte de Supabase
3. Revisar los logs de Supabase para obtener más información sobre el error
