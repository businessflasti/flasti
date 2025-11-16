# ✅ Checklist de Configuración - Sistema de Inversiones Flasti Capital

## 📋 Pre-requisitos
- [ ] Node.js 18+ instalado
- [ ] Base de datos PostgreSQL (Supabase recomendado)
- [ ] Git instalado

## 🔧 Paso 1: Configuración Inicial

### 1.1 Instalar Dependencias
```bash
npm install @prisma/client next-auth bcryptjs
npm install -D prisma @types/bcryptjs
```

### 1.2 Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` y configura:
- [ ] `DATABASE_URL` - URL de tu base de datos PostgreSQL
- [ ] `NEXTAUTH_SECRET` - Genera uno con: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - URL de tu aplicación

## 🗄️ Paso 2: Base de Datos

### 2.1 Generar Cliente de Prisma
```bash
npx prisma generate
```

### 2.2 Ejecutar Migración
```bash
npx prisma migrate dev --name init_investment_system
```

### 2.3 Verificar Tablas Creadas
```bash
npx prisma studio
```

Verifica que existan estas 7 tablas:
- [ ] users
- [ ] investment_config
- [ ] investment_periods
- [ ] investments
- [ ] chart_data_points
- [ ] investment_faqs
- [ ] withdrawal_requests

### 2.4 Inicializar Datos (Opcional)
Ejecuta el SQL en `MIGRATION_INSTRUCTIONS.md` para crear datos iniciales.

## 👤 Paso 3: Crear Usuario Administrador

```bash
npx ts-node scripts/create-admin.ts admin@flasti.com tu-password-segura
```

O manualmente en Supabase:
```sql
INSERT INTO users (id, email, password, name, role, balance, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@flasti.com',
  '$2a$10$hash-aqui', -- Genera con bcrypt
  'Administrador',
  'ADMIN',
  10000,
  NOW(),
  NOW()
);
```

## 🚀 Paso 4: Iniciar Aplicación

```bash
npm run dev
```

## ✅ Paso 5: Verificar Funcionalidad

### 5.1 Páginas Públicas
- [ ] `/dashboard/investments` - Landing page funciona
- [ ] Botón "Descubre más" redirige correctamente

### 5.2 Páginas de Usuario (requiere login)
- [ ] `/dashboard/investments/invest` - Dashboard de inversión
- [ ] `/dashboard/investments/my-investments` - Historial de inversiones
- [ ] Puede crear una inversión de prueba
- [ ] Ve el progreso de inversiones activas

### 5.3 Panel de Administración (requiere rol ADMIN)
- [ ] `/dashboard/admin/investments-control` - Panel de control
- [ ] Puede cambiar valor del activo
- [ ] Puede editar tasas de interés
- [ ] Puede modificar el gráfico
- [ ] Puede editar FAQs
- [ ] Switch de bloqueo funciona

### 5.4 APIs
Prueba con curl o Postman:

```bash
# Configuración
curl http://localhost:3000/api/investments/config

# Períodos
curl http://localhost:3000/api/investments/periods

# FAQs
curl http://localhost:3000/api/investments/faqs

# Gráfico
curl http://localhost:3000/api/investments/chart
```

## 🎨 Paso 6: Personalización

### 6.1 Imágenes
Agrega estas imágenes en `/public/images/investments/`:
- [ ] `hero-background.jpg` - Fondo de landing page
- [ ] `logo.png` - Logo de Flasti Capital
- [ ] `dashboard-hero.jpg` - Imagen del dashboard (opcional)

### 6.2 Colores y Branding
Edita los colores en:
- [ ] `tailwind.config.js` - Colores globales
- [ ] Componentes individuales según necesites

## 🧪 Paso 7: Testing

### 7.1 Flujo Completo de Inversión
1. [ ] Usuario se registra/login
2. [ ] Navega a `/dashboard/investments`
3. [ ] Click en "Descubre más"
4. [ ] Elige período de inversión
5. [ ] Ingresa monto válido ($5 - $10,000)
6. [ ] Confirma inversión
7. [ ] Ve inversión en "Mis Inversiones"
8. [ ] Espera a que venza (o modifica fecha en DB)
9. [ ] Retira fondos
10. [ ] Verifica que el balance se actualizó

### 7.2 Flujo de Administración
1. [ ] Login como admin
2. [ ] Accede a panel de control
3. [ ] Modifica valor del activo
4. [ ] Cambia tasa de interés
5. [ ] Edita gráfico
6. [ ] Actualiza FAQs
7. [ ] Bloquea/desbloquea sistema
8. [ ] Verifica cambios en frontend

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

### Error: "Table already exists"
```bash
npx prisma migrate reset
# ⚠️ Esto borrará todos los datos
```

### Error: "NEXTAUTH_SECRET is not defined"
```bash
# Genera un secret
openssl rand -base64 32
# Agrégalo a .env
```

### Error: "Cannot connect to database"
- [ ] Verifica DATABASE_URL en .env
- [ ] Verifica que la base de datos existe
- [ ] Verifica credenciales
- [ ] Verifica firewall/IP whitelist en Supabase

## 📊 Métricas de Éxito

Al finalizar, deberías tener:
- [ ] ✅ 7 tablas creadas en la base de datos
- [ ] ✅ 11 endpoints de API funcionando
- [ ] ✅ 4 páginas renderizando correctamente
- [ ] ✅ Sistema de autenticación funcionando
- [ ] ✅ Flujo completo de inversión operativo
- [ ] ✅ Panel de administración accesible
- [ ] ✅ Datos iniciales cargados

## 🎉 ¡Sistema Listo!

Si todos los checkboxes están marcados, tu sistema de inversiones está 100% funcional.

### Próximos Pasos Opcionales:
- [ ] Agregar notificaciones por email
- [ ] Implementar sistema de referidos
- [ ] Agregar más métodos de pago
- [ ] Crear reportes en PDF
- [ ] Agregar gráficos avanzados
- [ ] Implementar 2FA
- [ ] Agregar logs de auditoría

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs de la consola
2. Verifica los logs de Prisma
3. Revisa la conexión a la base de datos
4. Verifica que todas las dependencias estén instaladas
5. Consulta `MIGRATION_INSTRUCTIONS.md` para más detalles
