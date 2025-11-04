# Dónde se Reflejan los $0.75 del Bono de Bienvenida

## 📊 Resumen Ejecutivo

Cuando el usuario completa la tarea de bienvenida y se le acreditan los **$0.75**, estos se reflejan en **11 lugares diferentes** del sistema.

---

## 🎯 Lugares Donde se Reflejan los $0.75

### 1. **Balance Principal** ✅
**Ubicación:** Dashboard principal - Bloque de balance superior
**Componente:** `UserBalanceDisplay.tsx`
**Campo DB:** `user_profiles.balance`

**Qué muestra:**
- Balance actual del usuario
- Se incrementa de $0.00 a $0.75

**Ruta:** `/dashboard`

---

### 2. **Estadística "Hoy"** ✅
**Ubicación:** Dashboard principal - Tarjeta de estadísticas
**Componente:** `src/app/dashboard/page.tsx`
**Campo calculado:** `cpalead_stats.today_earnings`

**Qué muestra:**
- Ganancias del día actual
- Muestra $0.75 si se reclamó hoy

**Ruta:** `/dashboard`
**Tarjeta:** "Ganancias de Hoy"

---

### 3. **Estadística "Esta Semana"** ✅
**Ubicación:** Dashboard principal - Tarjeta de estadísticas
**Componente:** `src/app/dashboard/page.tsx`
**Campo calculado:** `cpalead_stats.week_earnings`

**Qué muestra:**
- Ganancias de la semana actual
- Muestra $0.75 si se reclamó esta semana

**Ruta:** `/dashboard`
**Tarjeta:** "Semana"

---

### 4. **Estadística "Total Ganado"** ✅
**Ubicación:** Dashboard principal - Tarjeta de estadísticas
**Componente:** `src/app/dashboard/page.tsx`
**Campo calculado:** `cpalead_stats.total_earnings`
**Campo DB:** `user_profiles.total_earnings`

**Qué muestra:**
- Total de ganancias acumuladas
- Se incrementa en $0.75

**Ruta:** `/dashboard`
**Tarjeta:** "Total"

---

### 5. **Estadística "Completadas"** ✅
**Ubicación:** Dashboard principal - Tarjeta de estadísticas
**Componente:** `src/app/dashboard/page.tsx`
**Campo calculado:** `cpalead_stats.total_transactions`

**Qué muestra:**
- Número de tareas completadas
- Se incrementa de 0 a 1

**Ruta:** `/dashboard`
**Tarjeta:** "Completas"

---

### 6. **Balance - Total Ganado** ✅
**Ubicación:** Bloque de balance en dashboard
**Componente:** `UserBalanceDisplay.tsx`
**Campo DB:** `user_profiles.total_earnings`

**Qué muestra:**
- Total ganado histórico
- Aparece en el desglose del balance

**Ruta:** `/dashboard`
**Sección:** Dentro del componente de balance

---

### 7. **Página Withdrawals - Saldo Disponible** ✅
**Ubicación:** Página de retiros
**Componente:** `src/app/dashboard/withdrawals/page.tsx`
**Campo DB:** `user_profiles.balance`

**Qué muestra:**
- Saldo disponible para retirar
- Muestra $0.75

**Ruta:** `/dashboard/withdrawals`
**Tarjeta:** "Saldo Disponible"

---

### 8. **Página Withdrawals - Total Ganado** ✅
**Ubicación:** Página de retiros
**Componente:** `src/app/dashboard/withdrawals/page.tsx`
**Campo DB:** `user_profiles.total_earnings`

**Qué muestra:**
- Total ganado acumulado
- Muestra $0.75

**Ruta:** `/dashboard/withdrawals`
**Tarjeta:** "Total Ganado"

---

### 9. **Página Rewards History - Total Ganado** ✅
**Ubicación:** Historial de recompensas
**Componente:** `src/app/dashboard/rewards-history/page.tsx`
**Campo calculado:** `summary.total_earnings`

**Qué muestra:**
- Total de ganancias en el historial
- Muestra $0.75

**Ruta:** `/dashboard/rewards-history`
**Tarjeta:** "Total Ganado"

---

### 10. **Página Rewards History - Aprobadas** ✅
**Ubicación:** Historial de recompensas
**Componente:** `src/app/dashboard/rewards-history/page.tsx`
**Campo calculado:** `summary.approved_count`

**Qué muestra:**
- Número de transacciones aprobadas
- Se incrementa a 1

**Ruta:** `/dashboard/rewards-history`
**Tarjeta:** "Aprobadas"

---

### 11. **Página Rewards History - Tabla de Transacciones** ✅
**Ubicación:** Historial de recompensas - Tabla
**Componente:** `src/app/dashboard/rewards-history/page.tsx`
**Tabla:** `cpalead_transactions`

**Qué muestra:**
- Fila con la transacción del bono
- Detalles:
  - Fecha: Fecha de reclamo
  - Tarea: "Tarea de bienvenida"
  - Descripción: "Tarea de bienvenida"
  - Monto: +$0.75
  - Estado: "Aprobado"
  - ID Transacción: `welcome_[user_id]_[timestamp]`

**Ruta:** `/dashboard/rewards-history`
**Sección:** Tabla "Historial Completo"

---

## 🗄️ Base de Datos

### Tablas Afectadas:

#### 1. **user_profiles**
```sql
UPDATE user_profiles SET
  balance = balance + 0.75,
  total_earnings = total_earnings + 0.75,
  welcome_bonus_claimed = true
WHERE user_id = [user_id];
```

**Campos actualizados:**
- `balance`: +$0.75
- `total_earnings`: +$0.75
- `welcome_bonus_claimed`: true

#### 2. **cpalead_transactions**
```sql
INSERT INTO cpalead_transactions (
  user_id,
  transaction_id,
  offer_id,
  amount,
  currency,
  type,
  status,
  metadata,
  created_at
) VALUES (
  [user_id],
  'welcome_[user_id]_[timestamp]',
  'welcome_bonus',
  0.75,
  'USD',
  'reward',
  'approved',
  {
    "offer_name": "Tarea de bienvenida",
    "description": "Tarea de bienvenida",
    "campaign_name": "Tarea de bienvenida"
  },
  NOW()
);
```

**Registro creado:**
- Nueva fila en la tabla de transacciones
- Tipo: 'reward'
- Estado: 'approved'
- Monto: 0.75

---

## 📍 Endpoints API Involucrados

### 1. **GET /api/user/profile**
**Archivo:** `src/app/api/user/profile/route.ts`

**Retorna:**
```json
{
  "profile": {
    "balance": 0.75,
    "total_earnings": 0.75,
    "welcome_bonus_claimed": true
  },
  "cpalead_stats": {
    "total_earnings": 0.75,
    "total_transactions": 1,
    "today_earnings": 0.75,
    "week_earnings": 0.75,
    "today_transactions": 1,
    "week_transactions": 1
  }
}
```

**Usado en:**
- Dashboard principal
- Página de withdrawals
- Componente de balance

---

### 2. **GET /api/rewards-history**
**Archivo:** `src/app/api/rewards-history/route.ts`

**Retorna:**
```json
{
  "rewards": [
    {
      "id": "...",
      "created_at": "2024-11-03T...",
      "transaction_id": "welcome_[user_id]_[timestamp]",
      "offer_name": "Tarea de bienvenida",
      "program_name": "CPALead",
      "goal_name": "Tarea de bienvenida",
      "payout": 0.75,
      "currency": "USD",
      "status": "aprobado",
      "source": "CPALead",
      "type": "ganancia"
    }
  ],
  "summary": {
    "total_earnings": 0.75,
    "total_reversals": 0,
    "approved_count": 1,
    "reversed_count": 0
  }
}
```

**Usado en:**
- Página de rewards-history

---

## 🔄 Flujo Completo

### Paso 1: Usuario Completa la Tarea
```
Usuario → Completa palabra "AVANZA33" → Hace clic en completar
```

### Paso 2: Backend Procesa
```typescript
// WelcomeBonus.tsx - claimBonus()

1. Obtener balance actual
2. Calcular nuevo balance: balance + 0.75
3. Calcular nuevo total_earnings: total_earnings + 0.75
4. Actualizar user_profiles:
   - balance = nuevo balance
   - total_earnings = nuevo total_earnings
   - welcome_bonus_claimed = true
5. Insertar en cpalead_transactions:
   - amount = 0.75
   - status = 'approved'
   - metadata con detalles
```

### Paso 3: Actualización en Tiempo Real
```
Supabase Realtime → Detecta cambio en user_profiles
                  → Detecta INSERT en cpalead_transactions
                  → Notifica a componentes suscritos
                  → Componentes recargan datos
```

### Paso 4: Usuario Ve los Cambios
```
✅ Balance: $0.75
✅ Hoy: $0.75
✅ Semana: $0.75
✅ Total: $0.75
✅ Completadas: 1
✅ Historial: 1 transacción
```

---

## 🧪 Cómo Verificar

### Verificación Manual:

1. **Crear usuario de prueba**
2. **Acceder al dashboard**
3. **Completar tarea de bienvenida**
4. **Verificar cada ubicación:**

```bash
# Dashboard principal
✓ Balance muestra $0.75
✓ Hoy muestra $0.75
✓ Semana muestra $0.75
✓ Total muestra $0.75
✓ Completadas muestra 1

# Página de withdrawals
✓ Saldo Disponible: $0.75
✓ Total Ganado: $0.75

# Página de rewards-history
✓ Total Ganado: $0.75
✓ Aprobadas: 1
✓ Tabla muestra 1 transacción
```

### Verificación en Base de Datos:

```sql
-- Verificar user_profiles
SELECT 
  user_id,
  balance,
  total_earnings,
  welcome_bonus_claimed
FROM user_profiles
WHERE user_id = '[user_id]';

-- Resultado esperado:
-- balance: 0.75
-- total_earnings: 0.75
-- welcome_bonus_claimed: true

-- Verificar cpalead_transactions
SELECT 
  transaction_id,
  offer_id,
  amount,
  status,
  metadata
FROM cpalead_transactions
WHERE user_id = '[user_id]'
AND offer_id = 'welcome_bonus';

-- Resultado esperado:
-- 1 fila con amount = 0.75, status = 'approved'
```

---

## 📊 Resumen Visual

```
Bono de Bienvenida ($0.75)
│
├─ Dashboard Principal
│  ├─ Balance: $0.75
│  ├─ Hoy: $0.75
│  ├─ Semana: $0.75
│  ├─ Total: $0.75
│  └─ Completadas: 1
│
├─ Página Withdrawals
│  ├─ Saldo Disponible: $0.75
│  └─ Total Ganado: $0.75
│
└─ Página Rewards History
   ├─ Total Ganado: $0.75
   ├─ Aprobadas: 1
   └─ Tabla: 1 transacción
```

---

## ✅ Conclusión

Los **$0.75** se reflejan en **11 lugares diferentes**:

1. Balance principal
2. Estadística "Hoy"
3. Estadística "Esta Semana"
4. Estadística "Total Ganado"
5. Estadística "Completadas"
6. Balance - Total Ganado
7. Withdrawals - Saldo Disponible
8. Withdrawals - Total Ganado
9. Rewards History - Total Ganado
10. Rewards History - Aprobadas
11. Rewards History - Tabla de transacciones

**Todos los lugares están implementados y funcionando correctamente.** ✅
