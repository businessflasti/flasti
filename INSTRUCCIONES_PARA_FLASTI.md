# Instrucciones de Despliegue para Flasti

## 🚀 Pasos para Aplicar los Cambios

### 1. Ejecutar Migraciones en Orden

Ejecuta estos comandos en tu terminal o en el SQL Editor de Supabase:

```bash
# Paso 1: Crear tabla de roles (si no existe)
supabase migration up --file ensure_user_roles_table.sql

# Paso 2: Agregar tu usuario como admin
supabase migration up --file add_flasti_admin.sql

# Paso 3: Crear tabla de configuración del banner
supabase migration up --file create_banner_config_table.sql

# Paso 4: Verificar estructura de transacciones
supabase migration up --file verify_cpalead_transactions_structure.sql
```

### 2. Verificar que Eres Admin

Ejecuta esta consulta en SQL Editor de Supabase:

```sql
SELECT 
  ur.role,
  au.email,
  ur.created_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'flasti.finanzas@gmail.com';
```

Deberías ver:
- **role:** super_admin
- **email:** flasti.finanzas@gmail.com

### 3. Acceder a la Configuración del Banner

1. Inicia sesión con tu cuenta: **flasti.finanzas@gmail.com**
2. Ve a: `/dashboard/admin/banner-config`
3. Deberías ver la página de configuración del banner

### 4. Configurar el Banner

En la página de configuración:

1. **Texto del Banner:** Escribe el mensaje que quieres mostrar
   - Ejemplo: "¡Bienvenido a Flasti! Gana dinero completando microtareas"
   
2. **URL del Logo:** Ruta del logo en tu proyecto
   - Ejemplo: `/logo.svg` o `/images/logo.png`
   
3. **Banner Activo:** Marca el checkbox para activarlo

4. Haz clic en **"Guardar Cambios"**

5. Abre la página principal `/` en otra pestaña para ver el banner

## 📊 Cambios Visuales Implementados

### Bloque de Asesora - Cambios Más Notorios

**Estado NO LEÍDO (Nuevo mensaje):**
- ✨ Avatar con borde azul brillante y sombra
- ✨ Etiqueta "Asesora" en blanco con sombra
- ✨ Burbuja con gradiente azul/cyan y sombra brillante
- ✨ Texto en blanco brillante (95% opacidad)
- ✨ Footer con fondo blanco y sombra
- ✨ Icono de campana animado

**Estado LEÍDO:**
- 🔘 Avatar en escala de grises con opacidad reducida
- 🔘 Borde gris del avatar
- 🔘 Etiqueta "Asesora" en gris con fondo oscuro
- 🔘 Burbuja con gradiente gris oscuro y sombra interior
- 🔘 Texto en gris claro (65% opacidad)
- 🔘 Footer con fondo gris y borde
- 🔘 Icono de check en gris

**Transiciones:**
- Todas las animaciones son suaves (300ms)
- El cambio de estado es muy notorio visualmente
- Efecto de grayscale en la imagen cuando está leído

## ✅ Verificaciones Post-Despliegue

### Banner
- [ ] El banner aparece en la página principal
- [ ] Puedes editarlo desde `/dashboard/admin/banner-config`
- [ ] Los cambios se reflejan en tiempo real
- [ ] El logo se muestra correctamente

### Bono de Bienvenida
- [ ] Aparece para usuarios nuevos
- [ ] Se puede completar la palabra "AVANZA33"
- [ ] Se acreditan $0.75 correctamente
- [ ] Aparece en todas las estadísticas
- [ ] No aparece después de reclamado (sin parpadeo)

### Asesora
- [ ] El mensaje nuevo se ve brillante y destacado
- [ ] El mensaje leído se ve claramente en gris
- [ ] La diferencia entre estados es muy notoria
- [ ] Las transiciones son suaves

### Withdrawals
- [ ] El mensaje de error es claro cuando intentas retirar < $1

## 🔧 Si Algo No Funciona

### No puedo acceder a /dashboard/admin/banner-config

**Solución 1:** Verificar que eres admin
```sql
SELECT * FROM user_roles 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'flasti.finanzas@gmail.com'
);
```

**Solución 2:** Agregar manualmente como admin
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'flasti.finanzas@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';
```

### El banner no aparece

1. Verifica que está activo en la configuración
2. Verifica que la tabla existe:
```sql
SELECT * FROM banner_config;
```

3. Si no existe, ejecuta de nuevo:
```bash
supabase migration up --file create_banner_config_table.sql
```

### Los $0.75 no se reflejan en estadísticas

1. Verifica que la migración se aplicó:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'cpalead_transactions' 
AND column_name IN ('metadata', 'transaction_id', 'currency');
```

2. Si faltan columnas, ejecuta:
```bash
supabase migration up --file verify_cpalead_transactions_structure.sql
```

## 📞 Comandos Útiles

```bash
# Ver estado de migraciones
supabase migration list

# Ver logs en tiempo real
supabase logs --follow

# Conectar a la base de datos
supabase db connect

# Resetear base de datos local (CUIDADO)
supabase db reset
```

## 🎯 Resumen de Mejoras

1. ✅ **Banner editable** - Ya no necesitas tocar código para cambiar el banner
2. ✅ **Bono de bienvenida** - Se refleja correctamente en todas las estadísticas
3. ✅ **Sin parpadeos** - El bloque de bienvenida no aparece si ya fue reclamado
4. ✅ **Asesora más notoria** - Diferencia muy clara entre leído/no leído
5. ✅ **Mensaje de error claro** - En withdrawals cuando no alcanza el mínimo

## 📝 Próximos Pasos

1. Aplicar las migraciones
2. Verificar que eres admin
3. Configurar el banner inicial
4. Probar con un usuario nuevo el bono de bienvenida
5. Verificar que todo se ve correctamente

## 💡 Tips

- El banner se actualiza en tiempo real, no necesitas recargar
- Puedes cambiar el logo y texto cuando quieras
- Los cambios en la asesora son automáticos, no necesitas configurar nada
- El sistema de admin usa tu email, así que siempre tendrás acceso

---

**¿Necesitas ayuda?**
- Revisa los logs de Supabase
- Verifica la consola del navegador
- Ejecuta las consultas de verificación arriba
