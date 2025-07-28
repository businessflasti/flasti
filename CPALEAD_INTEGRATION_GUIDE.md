# Guía de Integración CPALead - Flasti.com

## Resumen de la Integración

Esta integración completa de CPALead en Flasti.com incluye:

1. **Obtención y visualización de ofertas** desde la API de CPALead
2. **Postback Server-to-Server (S2S)** para acreditación automática de conversiones
3. **Monitoreo de reversiones** para gestión de calidad
4. **Contador de saldo en tiempo real** en el dashboard
5. **Base de datos individualizada** por usuario con Supabase

## Configuración Inicial

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```bash
# CPALead Configuration
CPALEAD_API_KEY=22ac92e230e74a1ea5152eaa3258fecd
CPALEAD_SECRET_KEY=flasti_cpalead_secret_2024
CPALEAD_ID=1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
```

### 2. Base de Datos

Ejecuta el archivo `cpalead_database_schema.sql` en el SQL Editor de Supabase para crear:

- Tabla `cpalead_transactions` - Conversiones exitosas
- Tabla `cpalead_reversals` - Reversiones de conversiones
- Tabla `cpalead_offer_stats` - Estadísticas de ofertas
- Funciones SQL para estadísticas y procesamiento
- Políticas RLS para seguridad
- Triggers automáticos para estadísticas

### 3. Configuración en CPALead

**IMPORTANTE**: Después del despliegue, configura en tu panel de CPALead:

1. **URL de Postback S2S**: `https://flasti.com/api/cpalead/postback`
2. **Método**: POST
3. **Parámetros requeridos**:
   - `subid` = ID del usuario de Supabase (`{user_id}`)
   - `amount` = Monto de la conversión (`{amount}`)
   - `offer_id` = ID de la oferta (`{offer_id}`)
   - `currency` = Moneda (`{currency}`)
   - `transaction_id` = ID único de transacción (`{transaction_id}`)

## Estructura de Archivos Creados

```
src/
├── lib/
│   └── cpa-lead-api.ts                    # API client para CPALead
├── components/
│   └── cpalead/
│       ├── OffersList.tsx                 # Lista de ofertas
│       └── UserBalanceDisplay.tsx         # Contador de saldo
├── app/
│   ├── api/
│   │   ├── cpalead/
│   │   │   └── postback/
│   │   │       └── route.ts               # Endpoint S2S postback
│   │   └── admin/
│   │       └── cpalead/
│   │           └── reversals/
│   │               └── route.ts           # Endpoint admin reversiones
│   └── dashboard/
│       └── page.tsx                       # Dashboard integrado
└── cpalead_database_schema.sql            # Esquema de BD
```

## Funcionalidades Implementadas

### 1. Obtención de Ofertas

**Función**: `getOffersFromCpaLead()`
- Obtiene hasta 50 ofertas de CPALead
- Adapta ofertas al país y dispositivo del usuario
- Manejo robusto de errores
- Timeout de 10 segundos

**Uso**:
```typescript
import { getOffersFromCpaLead } from '@/lib/cpa-lead-api';

const offers = await getOffersFromCpaLead();
```

### 2. Visualización de Ofertas

**Componente**: `OffersList`
- Diseño responsivo con Tailwind CSS
- Integración con Radix UI
- Imágenes optimizadas con Next.js Image
- Tooltips para información adicional
- Enlaces de tracking de CPALead

### 3. Postback Server-to-Server

**Endpoint**: `POST /api/cpalead/postback`

**Funcionalidades**:
- Validación de seguridad por IP (configurable)
- Prevención de transacciones duplicadas
- Actualización atómica de saldos
- Registro completo de transacciones
- Log de actividad del usuario
- Respuestas HTTP apropiadas para CPALead

**Datos esperados**:
```json
{
  "subid": "uuid-del-usuario-supabase",
  "amount": "1.50",
  "offer_id": "12345",
  "currency": "USD",
  "transaction_id": "unique-transaction-id",
  "ip": "192.168.1.1",
  "status": "completed"
}
```

### 4. Monitoreo de Reversiones

**Función**: `getReversalsFromCpaLead(startDate, endDate)`
- Consulta reversiones por rango de fechas
- Máximo 31 días de diferencia
- Validación de formato de fechas

**Endpoint Admin**: `GET /api/admin/cpalead/reversals`
- Requiere autenticación de administrador
- Parámetros: `start`, `end`, `process`
- Procesamiento automático opcional

### 5. Contador de Saldo en Tiempo Real

**Componente**: `UserBalanceDisplay`
- Suscripción en tiempo real con Supabase
- Estadísticas detalladas (hoy, semana, total)
- Controles de visibilidad
- Actualización manual
- Notificaciones de cambios

## Seguridad Implementada

### 1. Row Level Security (RLS)
- Usuarios solo ven sus propias transacciones
- Políticas específicas por tabla
- Acceso controlado a estadísticas

### 2. Validación de Postbacks
- Verificación de IP de origen
- Clave secreta compartida
- Validación de datos requeridos
- Prevención de duplicados

### 3. Autenticación de Admin
- Token JWT de Supabase
- Verificación de rol de administrador
- Acceso restringido a endpoints sensibles

## Funciones SQL Útiles

### Obtener estadísticas de usuario:
```sql
SELECT get_user_cpalead_stats('user-uuid-here');
```

### Procesar postback de forma segura:
```sql
SELECT process_cpalead_postback(
  'user-uuid',
  'transaction-id',
  'offer-id',
  1.50,
  'USD',
  '192.168.1.1',
  '{"extra": "data"}'::jsonb
);
```

### Top ofertas más exitosas:
```sql
SELECT * FROM get_top_cpalead_offers(10);
```

## Testing y Desarrollo

### 1. Endpoint de Testing
`GET /api/cpalead/postback` (solo en desarrollo)
- Información sobre el endpoint
- Campos esperados
- Ejemplos de uso

### 2. Datos de Prueba
El esquema SQL incluye datos de ejemplo comentados para testing.

### 3. Logs Detallados
Todos los procesos incluyen logging detallado para debugging.

## Monitoreo y Mantenimiento

### 1. Logs a Revisar
- Errores de API de CPALead
- Postbacks fallidos
- Transacciones duplicadas
- Problemas de saldo

### 2. Métricas Importantes
- Tasa de conversión por oferta
- Volumen de reversiones
- Tiempo de respuesta de API
- Errores de postback

### 3. Tareas de Mantenimiento
- Limpieza de logs antiguos
- Actualización de estadísticas
- Verificación de saldos
- Monitoreo de reversiones

## Solución de Problemas

### Postbacks no llegan:
1. Verificar URL en panel CPALead
2. Revisar logs del servidor
3. Validar configuración de IP
4. Comprobar formato de datos

### Saldos incorrectos:
1. Revisar transacciones duplicadas
2. Verificar reversiones no procesadas
3. Comprobar cálculos de saldo
4. Validar triggers de BD

### Ofertas no cargan:
1. Verificar API Key de CPALead
2. Comprobar conectividad
3. Revisar límites de rate
4. Validar formato de respuesta

## Contacto y Soporte

Para problemas técnicos:
1. Revisar logs de la aplicación
2. Verificar configuración de Supabase
3. Comprobar estado de API CPALead
4. Contactar soporte técnico si es necesario

---

**Nota**: Esta integración está diseñada para ser robusta y escalable, con manejo completo de errores y logging detallado para facilitar el mantenimiento y debugging.