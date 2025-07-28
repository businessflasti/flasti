-- Esquema de base de datos para integración CPALead con Supabase
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- 1. Tabla para transacciones de CPALead
CREATE TABLE IF NOT EXISTS public.cpalead_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  offer_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed',
  ip_address TEXT,
  source TEXT DEFAULT 'cpalead',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla para reversiones de CPALead
CREATE TABLE IF NOT EXISTS public.cpalead_reversals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  offer_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  reversal_date TIMESTAMP WITH TIME ZONE,
  previous_balance DECIMAL(10, 2),
  new_balance DECIMAL(10, 2),
  source TEXT DEFAULT 'cpalead',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla para perfiles de usuario con saldo
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  total_withdrawals DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_user_id ON public.cpalead_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_created_at ON public.cpalead_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_status ON public.cpalead_transactions(status);
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_offer_id ON public.cpalead_transactions(offer_id);

CREATE INDEX IF NOT EXISTS idx_cpalead_reversals_user_id ON public.cpalead_reversals(user_id);
CREATE INDEX IF NOT EXISTS idx_cpalead_reversals_created_at ON public.cpalead_reversals(created_at);
CREATE INDEX IF NOT EXISTS idx_cpalead_reversals_transaction_id ON public.cpalead_reversals(transaction_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- 5. Políticas de seguridad RLS (Row Level Security)
ALTER TABLE public.cpalead_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpalead_reversals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para cpalead_transactions
CREATE POLICY "Usuarios pueden ver sus propias transacciones CPALead" ON public.cpalead_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Solo el sistema puede insertar transacciones CPALead" ON public.cpalead_transactions
  FOR INSERT WITH CHECK (true);

-- Políticas para cpalead_reversals
CREATE POLICY "Usuarios pueden ver sus propias reversiones CPALead" ON public.cpalead_reversals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Solo el sistema puede insertar reversiones CPALead" ON public.cpalead_reversals
  FOR INSERT WITH CHECK (true);

-- Políticas para user_profiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede insertar perfiles" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_cpalead_transactions_updated_at ON public.cpalead_transactions;
CREATE TRIGGER update_cpalead_transactions_updated_at
  BEFORE UPDATE ON public.cpalead_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Función para obtener estadísticas de CPALead del usuario
CREATE OR REPLACE FUNCTION get_user_cpalead_stats(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  today_start DATE;
  week_start DATE;
BEGIN
  -- Calcular fechas
  today_start := CURRENT_DATE;
  week_start := CURRENT_DATE - INTERVAL '7 days';

  -- Construir estadísticas
  WITH stats AS (
    SELECT
      COALESCE(SUM(amount), 0) as total_earnings,
      COUNT(*) as total_transactions,
      COALESCE(SUM(CASE WHEN created_at >= today_start THEN amount ELSE 0 END), 0) as today_earnings,
      COALESCE(SUM(CASE WHEN created_at >= week_start THEN amount ELSE 0 END), 0) as week_earnings,
      COUNT(CASE WHEN created_at >= today_start THEN 1 END) as today_transactions,
      COUNT(CASE WHEN created_at >= week_start THEN 1 END) as week_transactions
    FROM public.cpalead_transactions
    WHERE user_id = user_id_param AND status = 'completed'
  )
  SELECT jsonb_build_object(
    'total_earnings', total_earnings,
    'total_transactions', total_transactions,
    'today_earnings', today_earnings,
    'week_earnings', week_earnings,
    'today_transactions', today_transactions,
    'week_transactions', week_transactions,
    'last_updated', CURRENT_TIMESTAMP
  ) INTO result
  FROM stats;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Función para actualizar saldo del usuario
CREATE OR REPLACE FUNCTION update_user_balance(
  user_id_param UUID,
  amount_param DECIMAL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, balance, total_earnings)
  VALUES (user_id_param, amount_param, amount_param)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    balance = user_profiles.balance + amount_param,
    total_earnings = user_profiles.total_earnings + amount_param,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Función para obtener el historial de transacciones de un usuario
CREATE OR REPLACE FUNCTION get_user_cpalead_history(
  user_id_param UUID,
  limit_param INTEGER DEFAULT 50,
  offset_param INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  transaction_id TEXT,
  offer_id TEXT,
  amount DECIMAL,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  transaction_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.transaction_id,
    t.offer_id,
    t.amount,
    t.currency,
    t.status,
    t.created_at,
    'earning'::TEXT as transaction_type
  FROM public.cpalead_transactions t
  WHERE t.user_id = user_id_param
  
  UNION ALL
  
  SELECT 
    r.id,
    r.transaction_id,
    r.offer_id,
    -r.amount as amount,
    'USD'::TEXT as currency,
    'reversed'::TEXT as status,
    r.created_at,
    'reversal'::TEXT as transaction_type
  FROM public.cpalead_reversals r
  WHERE r.user_id = user_id_param
  
  ORDER BY created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Vista para estadísticas administrativas
CREATE OR REPLACE VIEW admin_cpalead_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_transactions,
  SUM(amount) as total_amount,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(amount) as avg_amount
FROM public.cpalead_transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- 12. Función para limpiar transacciones antiguas
CREATE OR REPLACE FUNCTION cleanup_old_cpalead_data(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
  cutoff_date := CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL;
  
  DELETE FROM public.cpalead_transactions 
  WHERE created_at < cutoff_date;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM public.cpalead_reversals 
  WHERE created_at < cutoff_date;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Comentarios para documentación
COMMENT ON TABLE public.cpalead_transactions IS 'Almacena todas las transacciones exitosas de CPALead';
COMMENT ON TABLE public.cpalead_reversals IS 'Almacena las reversiones de transacciones de CPALead';
COMMENT ON TABLE public.user_profiles IS 'Perfiles de usuario con saldo y estadísticas';
COMMENT ON FUNCTION get_user_cpalead_stats(UUID) IS 'Obtiene estadísticas de CPALead para un usuario específico';
COMMENT ON FUNCTION get_user_cpalead_history(UUID, INTEGER, INTEGER) IS 'Obtiene el historial de transacciones y reversiones de CPALead para un usuario';
COMMENT ON FUNCTION update_user_balance(UUID, DECIMAL) IS 'Actualiza el saldo de un usuario';

-- Verificar que las tablas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename IN ('cpalead_transactions', 'cpalead_reversals', 'user_profiles')
  AND schemaname = 'public';