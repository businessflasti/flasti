# Sistema de Inversiones Flasti Capital

## 📋 Resumen del Sistema

Sistema completo de inversiones con control administrativo, gestión de períodos, retiros automáticos y tracking en tiempo real.

## 🗄️ Base de Datos

### Modelos Creados:
1. **InvestmentConfig** - Configuración global del sistema
2. **InvestmentPeriod** - Períodos de inversión (30, 45, 90 días)
3. **Investment** - Inversiones de usuarios
4. **ChartDataPoint** - Datos del gráfico de valor
5. **InvestmentFAQ** - Preguntas frecuentes
6. **WithdrawalRequest** - Solicitudes de retiro

### Migración:
```bash
# 1. Copiar el contenido de prisma/schema-investments.prisma al schema.prisma principal
# 2. Ejecutar migración
npx prisma migrate dev --name add_investment_system
npx prisma generate
```

## 🔌 APIs Creadas

### Configuración
- `GET /api/investments/config` - Obtener configuración
- `PUT /api/investments/config` - Actualizar configuración (admin)

### Períodos
- `GET /api/investments/periods` - Listar períodos
- `POST /api/investments/periods` - Crear período (admin)
- `PUT /api/investments/periods/[id]` - Actualizar período (admin)
- `DELETE /api/investments/periods/[id]` - Eliminar período (admin)

### Inversiones
- `POST /api/investments/create` - Crear inversión
- `GET /api/investments/my-investments` - Mis inversiones
- `POST /api/investments/withdraw` - Retirar fondos

### Gráfico
- `GET /api/investments/chart` - Obtener datos del gráfico
- `POST /api/investments/chart` - Actualizar gráfico (admin)

### FAQs
- `GET /api/investments/faqs` - Obtener FAQs
- `POST /api/investments/faqs` - Actualizar FAQs (admin)

## 📱 Páginas Creadas

### Usuario
1. `/dashboard/investments` - Landing page cinematográfica
2. `/dashboard/investments/invest` - Dashboard de inversión
3. `/dashboard/investments/my-investments` - Historial de inversiones

### Admin
1. `/dashboard/admin/investments-control` - Panel de control completo

## 🎯 Funcionalidades Implementadas

### Para Usuarios:
✅ Ver información del activo digital
✅ Elegir período de inversión (30, 45, 90 días)
✅ Invertir desde $5 hasta $10,000
✅ Ver progreso de inversiones activas
✅ Retirar fondos automáticamente al vencer
✅ Ver historial completo
✅ Calculadora de ganancias
✅ FAQs interactivas

### Para Administradores:
✅ Controlar valor del activo en tiempo real
✅ Ajustar tasas de interés por período
✅ Activar/desactivar períodos
✅ Editar gráfico de fluctuación
✅ Gestionar FAQs
✅ Ver todos los inversores
✅ Bloquear/desbloquear sistema completo
✅ Configurar límites de inversión

## 🔐 Seguridad

- ✅ Autenticación requerida para todas las operaciones
- ✅ Verificación de rol ADMIN para operaciones administrativas
- ✅ Validación de montos (min/max)
- ✅ Verificación de saldo antes de invertir
- ✅ Transacciones atómicas en base de datos
- ✅ Validación de períodos vencidos antes de retiro

## 💰 Flujo de Inversión

1. Usuario ve landing page → Click "Descubre más"
2. Elige período de inversión (30, 45 o 90 días)
3. Ingresa monto (validado contra saldo)
4. Sistema descuenta del saldo y crea inversión
5. Usuario ve progreso en tiempo real
6. Al vencer, puede retirar capital + intereses
7. Fondos se acreditan automáticamente

## 📊 Cálculo de Intereses

```javascript
// Fórmula
intereses = capital * (tasa_anual / 100) * (días / 365)

// Ejemplo: $1,000 al 12% por 90 días
intereses = 1000 * (12 / 100) * (90 / 365) = $29.59
total = $1,029.59
```

## 🎨 Destino de Fondos (Transparencia)

- 40% Infraestructura & Hosting
- 30% Marketing & Adquisición
- 20% Desarrollo Tecnológico
- 10% Reservas de Liquidez

## 🚀 Próximos Pasos Opcionales

1. **Notificaciones**:
   - Email cuando inversión vence
   - Recordatorios de retiro disponible

2. **Reportes**:
   - Exportar historial en PDF
   - Certificados de inversión

3. **Gamificación**:
   - Badges por montos invertidos
   - Programa de referidos

4. **Análisis**:
   - Dashboard de métricas para admin
   - Gráficos de crecimiento

## 📝 Notas Importantes

- Los períodos se crean automáticamente si no existen
- Las FAQs se generan por defecto
- El gráfico tiene datos de ejemplo iniciales
- El sistema puede bloquearse globalmente desde admin
- Los retiros son automáticos (no requieren aprobación manual)

## 🐛 Testing

```bash
# Probar creación de inversión
curl -X POST http://localhost:3000/api/investments/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "periodId": "xxx"}'

# Probar obtención de configuración
curl http://localhost:3000/api/investments/config

# Probar mis inversiones
curl http://localhost:3000/api/investments/my-investments
```

## 📞 Soporte

Para cualquier duda sobre la implementación, revisar:
- Modelos en `prisma/schema-investments.prisma`
- APIs en `src/app/api/investments/`
- Páginas en `src/app/dashboard/investments/`
- Panel admin en `src/app/dashboard/admin/investments-control/`
