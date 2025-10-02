# Sistema de Asignación Manual de Países

## Descripción

Sistema que permite controlar manualmente qué ofertas de CPALead se muestran a los usuarios según su país de origen.

## Características

- ✅ Control manual total desde el panel de administración
- ✅ Asignar ofertas de cualquier país a usuarios de otro país
- ✅ Activar/desactivar asignaciones sin eliminarlas
- ✅ Notas para documentar por qué se hizo cada asignación
- ✅ Interfaz visual intuitiva con códigos ISO y nombres de países
- ✅ Cambios aplicados en tiempo real sin reiniciar

## Cómo Funciona

### 1. Detección Automática
El sistema detecta automáticamente el país del usuario mediante:
- API de geolocalización (ipapi/ipinfo)
- Almacenamiento en localStorage
- Código ISO de 2 letras (ej: AR, ES, MX)

### 2. Asignación Manual
El administrador puede configurar:
- **País del Usuario**: De dónde es el usuario (ej: AR - Argentina)
- **Mostrar Ofertas De**: Qué país de ofertas mostrarle (ej: ES - España)
- **Notas**: Razón de la asignación (opcional)
- **Estado**: Activo/Inactivo

### 3. Prioridad del Sistema
1. Si existe una asignación **activa** para el país del usuario → Mostrar ofertas del país asignado
2. Si NO existe asignación o está **inactiva** → Mostrar ofertas del país real del usuario
3. Si el usuario es **premium** → Siempre mostrar ofertas reales (sin asignaciones)

## Acceso al Panel

### URL
```
/dashboard/admin/country-assignments
```

### Requisitos
- Usuario con rol `admin` en la tabla `user_profiles`
- Sesión activa en Supabase

## Uso del Panel

### Crear Nueva Asignación

1. Ir a `/dashboard/admin/country-assignments`
2. En el formulario "Nueva Asignación":
   - **País del Usuario**: Ingresar código ISO (ej: `AR`)
   - **Mostrar Ofertas De**: Ingresar código ISO (ej: `ES`)
   - **Notas**: Agregar razón (opcional)
3. Click en "Guardar Asignación"

### Gestionar Asignaciones Existentes

- **✓ (verde)**: Asignación activa
- **✗ (gris)**: Asignación inactiva
- **🗑️ (rojo)**: Eliminar asignación

### Ejemplos de Uso

#### Ejemplo 1: Argentina → España
```
País del Usuario: AR
Mostrar Ofertas De: ES
Notas: Argentina tiene pocas ofertas, mostrar España
```

#### Ejemplo 2: Perú → Colombia
```
País del Usuario: PE
Mostrar Ofertas De: CO
Notas: Ofertas de Colombia tienen mejor conversión
```

#### Ejemplo 3: México → México (sin cambio)
```
País del Usuario: MX
Mostrar Ofertas De: MX
Notas: México tiene suficientes ofertas propias
```

## Base de Datos

### Tabla: `country_offer_mappings`

```sql
CREATE TABLE country_offer_mappings (
  id UUID PRIMARY KEY,
  user_country VARCHAR(2) NOT NULL,    -- País del usuario
  offer_country VARCHAR(2) NOT NULL,   -- País de ofertas a mostrar
  is_active BOOLEAN DEFAULT true,      -- Activo/Inactivo
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID,                     -- Admin que creó
  notes TEXT,                          -- Notas opcionales
  UNIQUE(user_country)                 -- Solo una asignación por país
);
```

## API Endpoints

### GET `/api/admin/country-mappings`
Obtener todas las asignaciones

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_country": "AR",
      "offer_country": "ES",
      "is_active": true,
      "notes": "Argentina tiene pocas ofertas"
    }
  ],
  "count": 1
}
```

### POST `/api/admin/country-mappings`
Crear o actualizar asignación

**Request:**
```json
{
  "user_country": "AR",
  "offer_country": "ES",
  "is_active": true,
  "notes": "Razón de la asignación"
}
```

### DELETE `/api/admin/country-mappings?id=uuid`
Eliminar asignación

## Migración

Para aplicar la tabla en Supabase:

```bash
# Ejecutar el archivo de migración
supabase/migrations/create_country_offer_mappings.sql
```

O ejecutar manualmente en el SQL Editor de Supabase.

## Seguridad

- ✅ Row Level Security (RLS) habilitado
- ✅ Solo admins pueden modificar asignaciones
- ✅ Todos pueden leer asignaciones activas
- ✅ Service Role Key para operaciones admin

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Ventajas del Sistema

1. **Control Total**: Decides exactamente qué ve cada país
2. **Flexibilidad**: Cambia asignaciones cuando quieras
3. **Optimización**: Asigna ofertas con mejor conversión
4. **Documentación**: Notas para recordar por qué se hizo cada cambio
5. **Reversible**: Desactiva sin eliminar para probar
6. **Sin Código**: Todo desde la interfaz visual

## Diferencias con el Sistema Anterior

### Antes (Automático)
- Si país tiene ≤10 ofertas → Mostrar España automáticamente
- Sin control manual
- Lógica fija en el código

### Ahora (Manual)
- Tú decides qué mostrar a cada país
- Control total desde admin panel
- Lógica configurable sin tocar código

## Soporte

Para dudas o problemas:
1. Revisar logs en la consola del navegador
2. Verificar permisos de admin en `user_profiles`
3. Confirmar que la tabla existe en Supabase
4. Verificar variables de entorno

## Roadmap Futuro

- [ ] Asignaciones múltiples (prioridad 1, 2, 3)
- [ ] Programar cambios automáticos por fecha
- [ ] Estadísticas de conversión por asignación
- [ ] A/B testing de asignaciones
- [ ] Exportar/importar configuraciones
