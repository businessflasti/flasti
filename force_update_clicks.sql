-- Función para forzar la actualización de los contadores de clics
CREATE OR REPLACE FUNCTION force_update_clicks(
  user_id_param UUID
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  updated_count INTEGER;
BEGIN
  -- Contar las visitas para cada enlace del usuario
  WITH visit_counts AS (
    SELECT 
      affiliate_id,
      app_id,
      COUNT(*) as visit_count
    FROM 
      affiliate_visits
    WHERE 
      affiliate_id = user_id_param
    GROUP BY 
      affiliate_id, app_id
  )
  
  -- Actualizar los contadores de clics en affiliate_links
  UPDATE affiliate_links al
  SET 
    clicks = vc.visit_count,
    updated_at = CURRENT_TIMESTAMP
  FROM 
    visit_counts vc
  WHERE 
    al.user_id = vc.affiliate_id AND
    al.app_id = vc.app_id AND
    al.user_id = user_id_param;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Devolver resultado
  SELECT jsonb_build_object(
    'success', TRUE,
    'updated_count', updated_count,
    'message', 'Contadores de clics actualizados correctamente'
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
