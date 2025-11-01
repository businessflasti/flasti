# Guía de Estilo GitHub Moderno - Dashboard Flasti

## Colores Base
- **Fondo principal**: `bg-[#0B1017]` (ÚNICO Y SÓLIDO - Sin efectos de luces ni partículas)
- **Cards/Bloques**: `bg-[#161b22]/80 backdrop-blur-xl` (Efecto vidrio)
- **Header**: `bg-[#0B1017]`
- **Sidebar**: `bg-[#0B1017]`

## IMPORTANTE: Fondo Limpio
- **NO usar**: Gradientes, orbes de luz, partículas flotantes, patrones de cuadrícula
- **SÍ usar**: Solo `bg-[#0B1017]` sólido + bloques con efecto vidrio

## Reglas de Estilo

### 1. Cards y Contenedores
```tsx
// ❌ ANTES
<Card className="bg-card/60 backdrop-blur-md border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">

// ✅ DESPUÉS
<Card className="bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-2xl">
```

### 2. Divs con Fondo
```tsx
// ❌ ANTES
<div className="bg-card/60 backdrop-blur-md border border-white/20">

// ✅ DESPUÉS
<div className="bg-[#161b22]/80 backdrop-blur-xl border-0">
```

### 3. Íconos en Cards
```tsx
// ❌ ANTES
<div className="p-3 rounded-xl bg-gradient-to-br from-[#6E40FF]/20 to-[#6E40FF]/5 border border-[#6E40FF]/30 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(110,64,255,0.4)]">

// ✅ DESPUÉS
<div className="p-3 rounded-xl bg-gradient-to-br from-[#6E40FF]/20 to-[#6E40FF]/5 group-hover:scale-110">
```

### 4. Badges
```tsx
// ❌ ANTES
<Badge className="bg-blue-500/20 border-blue-500/30">

// ✅ DESPUÉS
<Badge className="bg-[#161b22]/80 backdrop-blur-xl border-0">
```

### 5. Inputs
```tsx
// ❌ ANTES
<Input className="bg-[#2a2a2a] border border-[#404040] focus:ring-2 focus:ring-[#8b5cf6]">

// ✅ DESPUÉS
<Input className="bg-[#0d1117] border border-[#30363d] focus:ring-1 focus:ring-[#6e40ff]/30 focus:border-[#6e40ff]/50 hover:border-[#8b949e]">
```

### 6. Botones
```tsx
// ❌ ANTES
<Button className="bg-white hover:bg-gray-100 text-black">

// ✅ DESPUÉS
<Button className="bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-[#238636]/20">
```

## Páginas a Actualizar

### Dashboard Interno
- [x] `/dashboard` - Principal
- [x] `/dashboard/withdrawals-history` - Historial de retiros
- [ ] `/dashboard/perfil` - Perfil
- [ ] `/dashboard/rewards-history` - Historial de recompensas
- [ ] `/dashboard/withdrawals` - Retiros
- [ ] `/dashboard/notifications` - Notificaciones
- [ ] `/dashboard/support` - Soporte

### Páginas Externas
- [ ] `/nosotros` - Sobre nosotros
- [ ] `/contacto` - Contacto
- [ ] `/informacion-legal` - Información legal
- [ ] `/terminos` - Términos y condiciones
- [ ] `/privacidad` - Política de privacidad

### Componentes
- [ ] Modal de Feedback (Footer)

## Notas Importantes
1. **Sin bordes de colores**: Todos los `border-[color]/30` deben ser `border-0`
2. **Sin sombras exageradas**: Eliminar `hover:shadow-lg hover:shadow-[color]/20`
3. **Glassmorphism sutil**: Usar `backdrop-blur-xl` en lugar de `backdrop-blur-md`
4. **Consistencia**: Todos los bloques deben usar `bg-[#161b22]/80`
5. **Íconos sin bordes**: Eliminar `border border-[color]/30` de contenedores de íconos


## Páginas Externas - Reemplazo Masivo

Para las páginas externas (nosotros, contacto, informacion-legal, terminos, privacidad), reemplazar:

```tsx
// ❌ ANTES
style={{backgroundColor: '#232323'}}

// ✅ DESPUÉS  
className="bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-2xl"
```

### Comando de búsqueda y reemplazo:
1. Buscar: `style={{backgroundColor: '#232323'}}`
2. Reemplazar con: `className="bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-2xl"`
3. Aplicar en:
   - src/app/nosotros/page.tsx
   - src/app/contacto/page.tsx
   - src/app/informacion-legal/page.tsx
   - src/app/terminos/page.tsx
   - src/app/privacidad/page.tsx

## Estado de Actualización

### ✅ Completadas
- Dashboard principal
- Header
- Sidebar
- Perfil
- Withdrawals
- Withdrawals-history
- Rewards-history
- Notifications
- Support

### ⏳ Pendientes (Reemplazo masivo requerido)
- Nosotros
- Contacto
- Información Legal
- Términos
- Privacidad
- Modal de Feedback (Footer)
