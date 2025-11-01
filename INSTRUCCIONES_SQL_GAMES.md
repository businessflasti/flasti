# 📋 Instrucciones para Ejecutar SQL de Games en Supabase

## ✅ VERIFICACIÓN PREVIA

### Separación Total Confirmada:

**Microtareas (NO se toca):**
- ✅ `user_profiles` (balance en USD)
- ✅ `withdrawals` (retiros de microtareas)
- ✅ `cpalead_transactions`
- ✅ `affiliate_activity_logs`

**Games (NUEVO - Se va a crear):**
- ✅ `games_balance` (fichas)
- ✅ `games_withdrawals` (retiros de games)
- ✅ `games_transactions`
- ✅ `games_history`
- ✅ `games_achievements`
- ✅ `games_activity_logs`

**Única conexión:** Ambas usan `auth.users(id)` para identificar usuarios (esto es normal y correcto).

---

## 🚀 PASOS PARA EJECUTAR EL SQL

### 1. Abrir Supabase SQL Editor

```
1. Ve a tu proyecto en Supabase
2. Click en "SQL Editor" en el menú lateral
3. Click en "New query"
```

### 2. Copiar el SQL

```
Archivo: sql/create_games_tables.sql
```

**Contenido del archivo:**
- 6 tablas nuevas para games
- Índices para rendimiento
- Políticas de seguridad (RLS)
- Funciones y triggers
- Comentarios en las tablas

### 3. Ejecutar el SQL

```
1. Pega todo el contenido del archivo en el editor
2. Click en "Run" o presiona Ctrl+Enter
3. Espera a que termine (puede tomar 10-30 segundos)
```

### 4. Verificar que se crearon las tablas

```sql
-- Ejecuta esta query para verificar:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'games_%'
ORDER BY table_name;
```

**Deberías ver:**
```
games_achievements
games_activity_logs
games_balance
games_history
games_transactions
games_withdrawals
```

---

## ✅ VERIFICACIÓN POST-EJECUCIÓN

### Verificar Tablas Creadas:

```sql
-- Ver estructura de games_balance
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'games_balance';
```

### Verificar Políticas RLS:

```sql
-- Ver políticas de seguridad
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE 'games_%';
```

### Verificar Índices:

```sql
-- Ver índices creados
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename LIKE 'games_%';
```

---

## 🔍 TABLAS CREADAS EN DETALLE

### 1. `games_balance`
```sql
- id (UUID)
- user_id (UUID) → auth.users
- chips (DECIMAL) → Fichas del usuario
- total_wins (DECIMAL)
- total_losses (DECIMAL)
- total_games_played (INTEGER)
- total_withdrawals (DECIMAL)
- created_at, updated_at
```

### 2. `games_transactions`
```sql
- id (UUID)
- user_id (UUID)
- type (VARCHAR) → 'purchase', 'win', 'loss', 'withdrawal', 'admin_credit', 'bonus'
- amount (DECIMAL)
- game (VARCHAR)
- description (TEXT)
- admin_id (UUID) → Para auditoría
- created_at
```

### 3. `games_history`
```sql
- id (UUID)
- user_id (UUID)
- game (VARCHAR) → 'slots', 'blackjack'
- bet (DECIMAL)
- result (DECIMAL)
- profit (DECIMAL)
- won (BOOLEAN)
- game_data (JSONB) → Datos específicos del juego
- created_at
```

### 4. `games_withdrawals`
```sql
- id (UUID)
- user_id (UUID)
- amount (DECIMAL)
- payment_method (VARCHAR)
- payment_details (JSONB)
- status (VARCHAR) → 'pending', 'approved', 'completed', 'rejected'
- created_at
- processed_at
- processed_by (UUID)
```

### 5. `games_achievements`
```sql
- id (UUID)
- user_id (UUID)
- achievement_type (VARCHAR)
- achievement_data (JSONB)
- unlocked_at
```

### 6. `games_activity_logs`
```sql
- id (UUID)
- user_id (UUID)
- activity_type (VARCHAR)
- details (JSONB)
- created_at
```

---

## 🔐 SEGURIDAD (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado:

### Políticas Aplicadas:
- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ Los usuarios solo pueden insertar sus propios registros
- ✅ Los usuarios solo pueden actualizar sus propios datos
- ✅ Los admins tienen acceso completo (se valida en las APIs)

---

## ⚠️ IMPORTANTE

### NO Afecta a Microtareas:

El SQL **NO modifica, NO toca, NO afecta** ninguna tabla existente:
- ❌ NO modifica `user_profiles`
- ❌ NO modifica `withdrawals`
- ❌ NO modifica `cpalead_transactions`
- ❌ NO modifica ninguna tabla de microtareas

### Solo Crea Tablas Nuevas:

- ✅ Crea 6 tablas nuevas con prefijo `games_`
- ✅ Crea índices para estas tablas
- ✅ Crea políticas RLS para estas tablas
- ✅ Crea funciones específicas para games

---

## 🧪 PRUEBA DESPUÉS DE EJECUTAR

### 1. Crear un Balance de Prueba:

```sql
-- Inserta un balance de prueba (reemplaza USER_ID con tu UUID)
INSERT INTO games_balance (user_id, chips)
VALUES ('TU_USER_ID_AQUI', 1000);
```

### 2. Verificar que se creó:

```sql
SELECT * FROM games_balance WHERE user_id = 'TU_USER_ID_AQUI';
```

### 3. Probar la Función de Estadísticas:

```sql
SELECT * FROM get_games_stats('TU_USER_ID_AQUI');
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "relation already exists"
```
Significa que las tablas ya existen.
Solución: Está bien, el SQL usa "IF NOT EXISTS"
```

### Error: "permission denied"
```
Significa que no tienes permisos de admin en Supabase.
Solución: Asegúrate de estar logueado como owner del proyecto
```

### Error: "function uuid_generate_v4() does not exist"
```
Significa que falta la extensión uuid-ossp.
Solución: Ejecuta primero:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## ✅ CHECKLIST FINAL

Después de ejecutar el SQL, verifica:

- [ ] 6 tablas creadas con prefijo `games_`
- [ ] Índices creados (9 índices)
- [ ] Políticas RLS habilitadas (18 políticas)
- [ ] Funciones creadas (2 funciones)
- [ ] Triggers creados (1 trigger)
- [ ] Sin errores en la consola
- [ ] Tablas de microtareas intactas

---

## 🎯 DESPUÉS DE EJECUTAR

Una vez ejecutado el SQL exitosamente:

1. ✅ Las APIs de games funcionarán correctamente
2. ✅ Los usuarios podrán solicitar retiros de fichas
3. ✅ El admin podrá aprobar/rechazar retiros
4. ✅ El admin podrá agregar fichas manualmente
5. ✅ Todo quedará registrado en logs de auditoría

---

## 📞 SI ALGO SALE MAL

Si encuentras algún error:

1. Copia el mensaje de error completo
2. Verifica que estés en el proyecto correcto de Supabase
3. Verifica que tengas permisos de admin
4. Intenta ejecutar el SQL por partes (tabla por tabla)

---

**¡Listo para ejecutar! El SQL está verificado y no afectará a microtareas.** 🚀
