-- Función para obtener estadísticas detalladas de afiliados
CREATE OR REPLACE FUNCTION get_affiliate_stats(
  user_id_param UUID,
  time_range_param TEXT
)
RETURNS JSONB AS $$
DECLARE
  start_date DATE;
  result JSONB;
BEGIN
  -- Determinar la fecha de inicio según el rango de tiempo
  CASE time_range_param
    WHEN 'week' THEN
      start_date := CURRENT_DATE - INTERVAL '7 days';
    WHEN 'month' THEN
      start_date := CURRENT_DATE - INTERVAL '30 days';
    WHEN 'year' THEN
      start_date := CURRENT_DATE - INTERVAL '365 days';
    ELSE
      start_date := CURRENT_DATE - INTERVAL '30 days';
  END CASE;

  -- Construir el resultado JSON
  WITH 
    -- Estadísticas de clics
    clicks_stats AS (
      SELECT
        al.app_id,
        a.name AS app_name,
        COUNT(av.id) AS clicks
      FROM
        affiliate_links al
        LEFT JOIN affiliate_visits av ON al.user_id = av.affiliate_id AND al.app_id = av.app_id
        LEFT JOIN apps a ON al.app_id = a.id
      WHERE
        al.user_id = user_id_param
        AND (av.created_at IS NULL OR av.created_at >= start_date)
      GROUP BY
        al.app_id, a.name
    ),
    -- Estadísticas de ventas
    sales_stats AS (
      SELECT
        s.app_id,
        a.name AS app_name,
        COUNT(s.id) AS sales,
        SUM(c.amount) AS commission
      FROM
        sales s
        JOIN commissions c ON s.id = c.sale_id
        LEFT JOIN apps a ON s.app_id = a.id
      WHERE
        s.affiliate_id = user_id_param
        AND s.created_at >= start_date
      GROUP BY
        s.app_id, a.name
    ),
    -- Estadísticas diarias
    daily_stats AS (
      SELECT
        DATE_TRUNC('day', COALESCE(av.created_at, s.created_at))::DATE AS date,
        COUNT(DISTINCT av.id) AS clicks,
        COUNT(DISTINCT s.id) AS sales,
        SUM(c.amount) AS commission
      FROM
        affiliate_links al
        LEFT JOIN affiliate_visits av ON al.user_id = av.affiliate_id AND al.app_id = av.app_id AND av.created_at >= start_date
        LEFT JOIN sales s ON al.user_id = s.affiliate_id AND al.app_id = s.app_id AND s.created_at >= start_date
        LEFT JOIN commissions c ON s.id = c.sale_id
      WHERE
        al.user_id = user_id_param
      GROUP BY
        DATE_TRUNC('day', COALESCE(av.created_at, s.created_at))::DATE
      HAVING
        DATE_TRUNC('day', COALESCE(av.created_at, s.created_at))::DATE IS NOT NULL
      ORDER BY
        date DESC
    ),
    -- Estadísticas combinadas por app
    combined_stats AS (
      SELECT
        COALESCE(cs.app_id, ss.app_id) AS app_id,
        COALESCE(cs.app_name, ss.app_name) AS app_name,
        COALESCE(cs.clicks, 0) AS clicks,
        COALESCE(ss.sales, 0) AS sales,
        COALESCE(ss.commission, 0) AS commission
      FROM
        clicks_stats cs
        FULL OUTER JOIN sales_stats ss ON cs.app_id = ss.app_id
    )
  
  SELECT 
    jsonb_build_object(
      'total_clicks', (SELECT COALESCE(SUM(clicks), 0) FROM clicks_stats),
      'total_sales', (SELECT COALESCE(SUM(sales), 0) FROM sales_stats),
      'total_commission', (SELECT COALESCE(SUM(commission), 0) FROM sales_stats),
      'app_stats', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'app_id', app_id,
            'app_name', app_name,
            'clicks', clicks,
            'sales', sales,
            'commission', commission
          )
        )
        FROM combined_stats
      ),
      'daily_stats', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'date', date,
            'clicks', clicks,
            'sales', sales,
            'commission', commission
          )
        )
        FROM daily_stats
      )
    ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
