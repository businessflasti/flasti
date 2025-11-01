# Sistema de Control de Visibilidad de Elementos

## 📋 Descripción
Sistema completo para controlar la visibilidad de bloques y elementos en las páginas Dashboard y Premium desde el panel de administración.

## 🎯 Características

### 1. **Control Centralizado**
- Panel de administración con interruptores ON/OFF para cada elemento
- Cambios en tiempo real sin necesidad de recargar
- Interfaz intuitiva separada por páginas

### 2. **Elementos Controlables**

#### **Header - Global (6 elementos)**
1. Logo / Avatar
2. Título de Página
3. Display de Balance (Header)
4. Badge de País/Ubicación
5. Historias/Testimonios
6. Botón de Menú (Móvil)

#### **Dashboard (8 elementos)**
1. Bono de Bienvenida
2. Display de Balance
3. Video Tutorial
4. Tarjeta: Ganancias de Hoy
5. Tarjeta: Esta Semana
6. Tarjeta: Total Ganado
7. Tarjeta: Completadas
8. Sección de Microtareas

#### **Premium (7 elementos)**
1. Bloque de Imagen Dashboard
2. Tarjeta de Pricing
3. Bloque de Testimonios
4. FAQ: ¿Cuánto dinero puedo ganar?
5. FAQ: ¿Por qué debo hacer un pago único?
6. FAQ: ¿Puedo empezar desde mi ubicación?
7. FAQ: ¿Cómo me respalda la garantía?

**Total: 21 elementos controlables**

### 3. **Reacomodo Automático (Estilo Tetris)**
- Cuando un elemento se desactiva, desaparece completamente
- Los elementos restantes se reacomodan automáticamente
- No quedan espacios vacíos
- El diseño se mantiene limpio y elegante

## 🗄️ Estructura de Base de Datos

### Tabla: `element_visibility`
```sql
- id: UUID (PK)
- page_name: TEXT ('dashboard' | 'premium')
- element_key: TEXT (identificador único)
- element_name: TEXT (nombre descriptivo)
- is_visible: BOOLEAN (estado de visibilidad)
- display_order: INTEGER (orden de visualización)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Políticas de Seguridad (RLS)
- ✅ Lectura: Todos los usuarios autenticados
- ✅ Escritura: Solo administradores (flasti.finanzas@gmail.com)

## 📁 Archivos Creados

### 1. **Migración de Base de Datos**
```
supabase/migrations/create_element_visibility_table.sql
```
- Crea la tabla `element_visibility`
- Inserta elementos por defecto
- Configura políticas RLS
- Agrega triggers para updated_at

### 2. **Hook Personalizado**
```
src/hooks/useElementVisibility.ts
```
- Hook React para consultar visibilidad
- Suscripción en tiempo real a cambios
- Función `isVisible(elementKey)` para verificar estado

### 3. **Página de Control**
```
src/app/dashboard/admin/visibility-control/page.tsx
```
- Interfaz de administración
- Interruptores ON/OFF por elemento
- Separación por páginas (Dashboard/Premium)
- Botones de guardar/descartar cambios

### 4. **Componente Switch**
```
src/components/ui/switch.tsx
```
- Componente de interruptor basado en Radix UI
- Estilo personalizado
- Accesible y responsive

### 5. **Actualización Admin**
```
src/app/dashboard/admin/page.tsx
```
- Nuevo botón "Visibilidad" en el menú
- Navegación al panel de control

## 🚀 Cómo Usar

### Para Administradores:

1. **Acceder al Panel**
   ```
   Dashboard → Admin → Botón "Visibilidad"
   ```

2. **Controlar Elementos**
   - Activar/Desactivar con los interruptores
   - Los cambios se marcan automáticamente
   - Click en "Guardar Cambios" para aplicar

3. **Ver Cambios en Tiempo Real**
   - Los usuarios verán los cambios inmediatamente
   - No necesitan recargar la página

### Para Desarrolladores:

1. **Ejecutar Migración**
   ```bash
   # Aplicar la migración en Supabase
   supabase db push
   ```

2. **Usar el Hook en Componentes**
   ```typescript
   import { useElementVisibility } from '@/hooks/useElementVisibility';
   
   // Para una sola página
   function MyComponent() {
     const { isVisible } = useElementVisibility('dashboard');
     
     return (
       <>
         {isVisible('welcome_bonus') && <WelcomeBonus />}
         {isVisible('balance_display') && <BalanceDisplay />}
       </>
     );
   }
   
   // Para múltiples páginas (ej: Header que aparece en todas las páginas)
   function HeaderComponent() {
     const { isVisible } = useElementVisibility(['header', 'dashboard']);
     
     return (
       <>
         {isVisible('logo') && <Logo />}
         {isVisible('country_badge') && <CountryBadge />}
         {isVisible('stories') && <Stories />}
       </>
     );
   }
   ```

3. **Agregar Nuevos Elementos**
   ```sql
   INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order)
   VALUES ('dashboard', 'new_element', 'Nuevo Elemento', true, 9);
   ```

## 🎨 Comportamiento del Reacomodo

### Grid Automático
Los elementos usan CSS Grid con `auto-fit` y `minmax`:
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### Ventajas:
- ✅ Reacomodo automático cuando un elemento desaparece
- ✅ Responsive en todos los tamaños de pantalla
- ✅ Sin espacios vacíos
- ✅ Mantiene proporciones elegantes

## 🔄 Flujo de Datos

```
Admin Panel
    ↓
Cambia Switch
    ↓
Actualiza DB (element_visibility)
    ↓
Trigger Realtime
    ↓
Hook detecta cambio
    ↓
Componente se re-renderiza
    ↓
Elemento aparece/desaparece
    ↓
Grid se reacomoda automáticamente
```

## 🔐 Seguridad

- ✅ Solo admins pueden modificar visibilidad
- ✅ RLS activado en la tabla
- ✅ Validación de permisos en el backend
- ✅ Todos los usuarios pueden leer (para mostrar elementos)

## 📊 Próximos Pasos (Opcional)

1. **Drag & Drop Manual**
   - Permitir reordenar elementos arrastrando
   - Actualizar `display_order` dinámicamente

2. **Historial de Cambios**
   - Registrar quién cambió qué y cuándo
   - Tabla de auditoría

3. **Previsualización**
   - Ver cómo se verá la página antes de guardar
   - Modo "preview" para admins

4. **Programación de Visibilidad**
   - Activar/desactivar elementos en fechas específicas
   - Útil para promociones temporales

## ✅ Estado Actual

- [x] Migración de base de datos creada
- [x] Hook de visibilidad implementado
- [x] Página de control creada
- [x] Botón en admin agregado
- [x] Componente Switch instalado
- [ ] Integrar hook en Dashboard page
- [ ] Integrar hook en Premium page
- [ ] Probar en producción

## 🎯 Resultado Final

Un sistema completo y profesional que permite:
- Control total sobre qué se muestra en cada página
- Cambios instantáneos sin código
- Interfaz limpia y automática
- Perfecto para A/B testing y optimización de conversión
