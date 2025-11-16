# 📋 Instrucciones de Migración - Sistema de Inversiones

## ✅ Paso 1: Verificar Configuración de Base de Datos

Asegúrate de tener tu `DATABASE_URL` configurada en `.env`:

```bash
DATABASE_URL="postgresql://usuario:password@host:puerto/database?schema=public"
```

## ✅ Paso 2: Instalar Dependencias de Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

## ✅ Paso 3: Generar Cliente de Prisma

```bash
npx prisma generate
```

## ✅ Paso 4: Crear Migración

```bash
npx prisma migrate dev --name add_investment_system
```

Este comando:
- ✅ Creará todas las tablas necesarias
- ✅ Generará el cliente de Prisma actualizado
- ✅ Aplicará la migración a tu base de datos

## ✅ Paso 5: Verificar Tablas Creadas

Ejecuta este comando para ver las tablas:

```bash
npx prisma studio
```

O conéctate a Supabase y verifica que existan estas tablas:

### Tablas Creadas:
1. ✅ `users` - Usuarios del sistema
2. ✅ `investment_config` - Configuración global
3. ✅ `investment_periods` - Períodos de inversión (30, 45, 90 días)
4. ✅ `investments` - Inversiones de usuarios
5. ✅ `chart_data_points` - Datos del gráfico
6. ✅ `investment_faqs` - Preguntas frecuentes
7. ✅ `withdrawal_requests` - Solicitudes de retiro

## 🔧 Paso 6: Inicializar Datos por Defecto (Opcional)

Si quieres crear datos iniciales, ejecuta este script SQL en Supabase:

```sql
-- Insertar configuración por defecto
INSERT INTO investment_config (id, "currentValue", "dailyChange", "minInvestment", "maxInvestment", "isSystemLocked", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  132.25,
  2.5,
  5,
  10000,
  false,
  NOW(),
  NOW()
);

-- Insertar períodos de inversión
INSERT INTO investment_periods (id, days, "rateAnnual", enabled, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 30, 5.0, true, NOW(), NOW()),
  (gen_random_uuid()::text, 45, 7.5, true, NOW(), NOW()),
  (gen_random_uuid()::text, 90, 12.0, true, NOW(), NOW());

-- Insertar datos del gráfico
INSERT INTO chart_data_points (id, month, value, "order", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Ene', 120, 1, NOW(), NOW()),
  (gen_random_uuid()::text, 'Feb', 125, 2, NOW(), NOW()),
  (gen_random_uuid()::text, 'Mar', 122, 3, NOW(), NOW()),
  (gen_random_uuid()::text, 'Abr', 128, 4, NOW(), NOW()),
  (gen_random_uuid()::text, 'May', 130, 5, NOW(), NOW()),
  (gen_random_uuid()::text, 'Jun', 132.25, 6, NOW(), NOW());

-- Insertar FAQs
INSERT INTO investment_faqs (id, question, answer, "order", enabled, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, '¿Cómo se calculan los intereses?', 'Los intereses se calculan de forma proporcional según el período elegido y se acreditan automáticamente al finalizar el período de bloqueo.', 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, '¿Puedo retirar antes del período?', 'No, los fondos quedan bloqueados durante el período seleccionado. Esto garantiza la estabilidad del sistema y los rendimientos prometidos.', 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, '¿Es segura mi inversión?', 'Sí, Flasti Capital opera con total transparencia. Tus fondos se destinan al crecimiento real de la plataforma.', 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, '¿Cuánto puedo invertir?', 'La inversión mínima es de $5 USD y la máxima es de $10,000 USD por usuario.', 4, true, NOW(), NOW());
```

## 🚨 Solución de Problemas

### Error: "Table already exists"
Si ya tienes tablas con estos nombres, puedes:

1. **Opción A - Eliminar tablas existentes:**
```sql
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investment_faqs CASCADE;
DROP TABLE IF EXISTS chart_data_points CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_periods CASCADE;
DROP TABLE IF EXISTS investment_config CASCADE;
```

2. **Opción B - Usar reset:**
```bash
npx prisma migrate reset
```
⚠️ **ADVERTENCIA**: Esto eliminará TODOS los datos de tu base de datos.

### Error: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

### Error de conexión a base de datos
Verifica tu `DATABASE_URL` en `.env` y asegúrate de que:
- ✅ El host es correcto
- ✅ El puerto es correcto (usualmente 5432)
- ✅ Las credenciales son correctas
- ✅ La base de datos existe

## ✅ Paso 7: Verificar que Todo Funciona

1. **Inicia tu aplicación:**
```bash
npm run dev
```

2. **Prueba las rutas:**
- `/dashboard/investments` - Landing page
- `/dashboard/investments/invest` - Dashboard de inversión
- `/dashboard/investments/my-investments` - Mis inversiones
- `/dashboard/admin/investments-control` - Panel admin

3. **Prueba las APIs:**
```bash
# Obtener configuración
curl http://localhost:3000/api/investments/config

# Obtener períodos
curl http://localhost:3000/api/investments/periods

# Obtener FAQs
curl http://localhost:3000/api/investments/faqs
```

## 📊 Estructura Final de Base de Datos

```
users
├── investments (1:N)
└── withdrawal_requests (1:N)

investment_periods
└── investments (1:N)

investment_config (singleton)
chart_data_points (ordered list)
investment_faqs (ordered list)
```

## 🎉 ¡Listo!

Si todos los pasos se completaron sin errores, tu sistema de inversiones está completamente funcional.

### Próximos Pasos:
1. ✅ Crear un usuario admin
2. ✅ Acceder al panel de control
3. ✅ Configurar valores iniciales
4. ✅ Probar crear una inversión
5. ✅ Verificar el flujo completo

## 📞 Soporte

Si encuentras algún error durante la migración:
1. Revisa los logs de Prisma
2. Verifica la conexión a Supabase
3. Asegúrate de que todas las dependencias estén instaladas
4. Revisa que el schema.prisma esté correcto
