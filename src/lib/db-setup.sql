-- Función para obtener los puntos de logros de un usuario
CREATE OR REPLACE FUNCTION get_user_achievement_points(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  total_points INTEGER;
BEGIN
  SELECT COALESCE(SUM(a.points), 0)
  INTO total_points
  FROM user_achievements ua
  JOIN achievements a ON ua.achievement_id = a.id
  WHERE ua.user_id = user_id_param;
  
  RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener los mejores afiliados para un período
CREATE OR REPLACE FUNCTION get_top_affiliates_for_period(
  start_date_param TIMESTAMPTZ,
  end_date_param TIMESTAMPTZ,
  limit_param INTEGER DEFAULT 100
)
RETURNS TABLE (
  user_id UUID,
  total_sales BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.affiliate_id::UUID,
    COUNT(s.id) AS total_sales
  FROM 
    sales s
  WHERE 
    s.created_at >= start_date_param AND
    s.created_at <= end_date_param
  GROUP BY 
    s.affiliate_id
  ORDER BY 
    total_sales DESC
  LIMIT 
    limit_param;
END;
$$ LANGUAGE plpgsql;

-- Políticas de seguridad para las tablas de gamificación
-- Achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY achievements_select ON achievements FOR SELECT USING (true);

-- User Achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_achievements_select ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_achievements_insert ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboards
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
CREATE POLICY leaderboards_select ON leaderboards FOR SELECT USING (true);

-- Leaderboard Entries
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY leaderboard_entries_select ON leaderboard_entries FOR SELECT USING (true);

-- Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY goals_select ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY goals_insert ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY goals_update ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY goals_delete ON goals FOR DELETE USING (auth.uid() = user_id);

-- Themes
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY themes_select ON themes FOR SELECT USING (true);

-- User Preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_preferences_select ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_preferences_insert ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_preferences_update ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Daily Tips
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY daily_tips_select ON daily_tips FOR SELECT USING (true);
