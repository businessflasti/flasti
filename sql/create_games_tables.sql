-- ============================================
-- TABLAS DE GAMES FLASTI
-- Sistema de fichas, juegos y retiros
-- ============================================

-- Tabla de balance de fichas de games
CREATE TABLE IF NOT EXISTS games_balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chips DECIMAL(12,2) DEFAULT 0 NOT NULL,
  total_wins DECIMAL(12,2) DEFAULT 0,
  total_losses DECIMAL(12,2) DEFAULT 0,
  total_games_played INTEGER DEFAULT 0,
  total_withdrawals DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla de transacciones de games
CREATE TABLE IF NOT EXISTS games_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'purchase', 'win', 'loss', 'withdrawal', 'admin_credit', 'bonus'
  amount DECIMAL(12,2) NOT NULL,
  game VARCHAR(100), -- Nombre del juego (si aplica)
  description TEXT,
  admin_id UUID REFERENCES auth.users(id), -- Si fue una acción de admin
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de historial de juegos
CREATE TABLE IF NOT EXISTS games_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game VARCHAR(100) NOT NULL, -- 'slots', 'blackjack', etc.
  bet DECIMAL(12,2) NOT NULL,
  result DECIMAL(12,2) NOT NULL,
  profit DECIMAL(12,2) NOT NULL, -- Puede ser negativo
  won BOOLEAN NOT NULL,
  game_data JSONB, -- Datos específicos del juego (símbolos, cartas, etc.)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de retiros de games
CREATE TABLE IF NOT EXISTS games_withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_details JSONB,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by UUID REFERENCES auth.users(id)
);

-- Tabla de logros de games
CREATE TABLE IF NOT EXISTS games_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type VARCHAR(100) NOT NULL, -- 'first_win', 'big_win', 'streak_5', etc.
  achievement_data JSONB,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Tabla de logs de actividad de games
CREATE TABLE IF NOT EXISTS games_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_games_balance_user_id ON games_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_games_transactions_user_id ON games_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_games_transactions_type ON games_transactions(type);
CREATE INDEX IF NOT EXISTS idx_games_history_user_id ON games_history(user_id);
CREATE INDEX IF NOT EXISTS idx_games_history_game ON games_history(game);
CREATE INDEX IF NOT EXISTS idx_games_withdrawals_user_id ON games_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_games_withdrawals_status ON games_withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_games_achievements_user_id ON games_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_games_activity_logs_user_id ON games_activity_logs(user_id);

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE games_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para games_balance
CREATE POLICY "Users can view their own games balance"
  ON games_balance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own games balance"
  ON games_balance FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games balance"
  ON games_balance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para games_transactions
CREATE POLICY "Users can view their own games transactions"
  ON games_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games transactions"
  ON games_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para games_history
CREATE POLICY "Users can view their own games history"
  ON games_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games history"
  ON games_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para games_withdrawals
CREATE POLICY "Users can view their own games withdrawals"
  ON games_withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games withdrawals"
  ON games_withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para games_achievements
CREATE POLICY "Users can view their own games achievements"
  ON games_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games achievements"
  ON games_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para games_activity_logs
CREATE POLICY "Users can view their own games activity logs"
  ON games_activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games activity logs"
  ON games_activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_games_balance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_games_balance_timestamp
  BEFORE UPDATE ON games_balance
  FOR EACH ROW
  EXECUTE FUNCTION update_games_balance_updated_at();

-- Función para obtener estadísticas de games de un usuario
CREATE OR REPLACE FUNCTION get_games_stats(p_user_id UUID)
RETURNS TABLE (
  total_games INTEGER,
  total_wins INTEGER,
  total_losses INTEGER,
  win_rate DECIMAL,
  total_bet DECIMAL,
  total_won DECIMAL,
  biggest_win DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_games,
    COUNT(*) FILTER (WHERE won = true)::INTEGER as total_wins,
    COUNT(*) FILTER (WHERE won = false)::INTEGER as total_losses,
    CASE 
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE won = true)::DECIMAL / COUNT(*)::DECIMAL * 100)
      ELSE 0
    END as win_rate,
    COALESCE(SUM(bet), 0) as total_bet,
    COALESCE(SUM(result), 0) as total_won,
    COALESCE(MAX(profit), 0) as biggest_win
  FROM games_history
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS EN LAS TABLAS
-- ============================================

COMMENT ON TABLE games_balance IS 'Balance de fichas y estadísticas de games por usuario';
COMMENT ON TABLE games_transactions IS 'Historial de todas las transacciones de fichas';
COMMENT ON TABLE games_history IS 'Historial completo de partidas jugadas';
COMMENT ON TABLE games_withdrawals IS 'Solicitudes de retiro de ganancias de games';
COMMENT ON TABLE games_achievements IS 'Logros desbloqueados por los usuarios';
COMMENT ON TABLE games_activity_logs IS 'Logs de actividad para auditoría';

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar logros predefinidos (opcional)
-- Estos se pueden usar como referencia para el sistema de logros
/*
INSERT INTO casino_achievements_types (type, name, description, icon) VALUES
  ('first_win', 'Primera Victoria', 'Gana tu primera partida', '🎉'),
  ('big_win', 'Gran Victoria', 'Gana más de 1000 fichas en una partida', '💰'),
  ('streak_5', 'Racha de 5', 'Gana 5 partidas seguidas', '🔥'),
  ('high_roller', 'Apostador Alto', 'Apuesta más de 500 fichas en una partida', '👑'),
  ('lucky_7', 'Suerte 7', 'Juega 7 días consecutivos', '🍀')
ON CONFLICT DO NOTHING;
*/
