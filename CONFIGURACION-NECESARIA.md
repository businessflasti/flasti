# ⚙️ Configuración Necesaria para Balance y Contraseña

## ✅ Código Ya Actualizado

El código ya está listo y funcionando. El API ahora devuelve:
- ✅ `balance` (de user_profiles)
- ✅ `games_balance` (de games_balance)
- ✅ `password` (placeholder con parte del email)

## 🗄️ Verificar Tablas en Supabase

### 1. Tabla `user_profiles` debe tener columna `balance`

**Verificar si existe:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'balance';
```

**Si NO existe, crear:**
```sql
ALTER TABLE user_profiles 
ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.00;
```

### 2. Tabla `games_balance` debe existir

**Verificar si existe:**
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'games_balance'
);
```

**Si NO existe, crear:**
```sql
CREATE TABLE games_balance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  chips INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawals DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_games_balance_user_id ON games_balance(user_id);

-- RLS (Row Level Security)
ALTER TABLE games_balance ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean solo su balance
CREATE POLICY "Users can view own games balance"
  ON games_balance FOR SELECT
  USING (auth.uid() = user_id);

-- Política para que usuarios actualicen solo su balance
CREATE POLICY "Users can update own games balance"
  ON games_balance FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para admins (ver todo)
CREATE POLICY "Admins can view all games balances"
  ON games_balance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );
```

---

## 🔑 Sobre las Contraseñas

### ⚠️ Importante:

**NO es posible obtener las contraseñas reales** de los usuarios porque:
- Supabase/Auth las almacena encriptadas (hash)
- Por seguridad, nunca se pueden recuperar en texto plano
- Es una práctica estándar de seguridad

### 💡 Solución Actual:

El código muestra un **placeholder** basado en el email:
```tsx
password: u.email?.split('@')[0] || 'N/A'
```

**Ejemplo:**
- Email: `usuario@gmail.com`
- Muestra: `usuario`

### 🎯 Alternativas:

**Opción 1: Mostrar parte del email (actual)**
```
Email: user@gmail.com
Contraseña: user
```

**Opción 2: Mostrar "No disponible"**
```
Contraseña: ••••••••
```

**Opción 3: Botón "Resetear Contraseña"**
- Envía email al usuario para que cree nueva contraseña
- Más seguro y profesional

**Opción 4: Generar contraseña temporal**
- Admin puede generar contraseña temporal
- Usuario debe cambiarla en primer login

---

## 🚀 Pasos para Activar

### 1. Ejecutar SQL en Supabase

Ve a Supabase → SQL Editor → Ejecuta:

```sql
-- 1. Verificar/Agregar columna balance en user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0.00;

-- 2. Crear tabla games_balance si no existe
CREATE TABLE IF NOT EXISTS games_balance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  chips INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawals DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Crear índice
CREATE INDEX IF NOT EXISTS idx_games_balance_user_id ON games_balance(user_id);

-- 4. Habilitar RLS
ALTER TABLE games_balance ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de seguridad
DROP POLICY IF EXISTS "Users can view own games balance" ON games_balance;
CREATE POLICY "Users can view own games balance"
  ON games_balance FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own games balance" ON games_balance;
CREATE POLICY "Users can update own games balance"
  ON games_balance FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all games balances" ON games_balance;
CREATE POLICY "Admins can view all games balances"
  ON games_balance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND is_admin = true
    )
  );
```

### 2. Reiniciar el Servidor

```bash
# Detener servidor
Ctrl + C

# Iniciar de nuevo
npm run dev
```

### 3. Probar

Ve a: `http://localhost:3000/dashboard/admin`

Deberías ver:
- ✅ Balance de cada usuario
- ✅ Placeholder de contraseña (parte del email)

---

## 📊 Verificar que Funciona

### En Supabase:

```sql
-- Ver usuarios con balance
SELECT 
  up.user_id,
  up.balance as work_balance,
  gb.balance as games_balance
FROM user_profiles up
LEFT JOIN games_balance gb ON up.user_id = gb.user_id
LIMIT 10;
```

### En la Aplicación:

1. Ve al dashboard admin
2. Sección Juegos
3. Deberías ver columnas:
   - Email
   - Contraseña (parte del email)
   - Balance ($0.00 o el valor real)

---

## ⚠️ Notas Importantes

### Balance:
- ✅ Se muestra el balance real de la base de datos
- ✅ Formato: `$XX.XX`
- ✅ Valor por defecto: `$0.00`

### Contraseña:
- ⚠️ NO es la contraseña real (imposible obtenerla)
- ✅ Muestra parte del email como referencia
- 💡 Considera implementar "Resetear Contraseña" en lugar de mostrar

### Games Balance:
- ✅ Se obtiene de la tabla `games_balance`
- ✅ Si el usuario no tiene registro, muestra `$0.00`
- ✅ Se crea automáticamente cuando el usuario juega

---

## 🎯 Resumen

**¿Necesitas ejecutar SQL?**
✅ **SÍ** - Para asegurar que las tablas y columnas existan

**¿Qué SQL ejecutar?**
El bloque completo del Paso 1 arriba

**¿Funcionará después?**
✅ **SÍ** - El código ya está listo

**¿Qué pasa con las contraseñas?**
⚠️ Solo se muestra un placeholder (parte del email)
💡 Considera agregar botón "Resetear Contraseña" en el futuro

---

¿Quieres que modifique algo sobre cómo se muestran las contraseñas?
