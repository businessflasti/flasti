-- Función mejorada para incrementar los clics de un enlace de afiliado
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(
  affiliate_id_param UUID,
  app_id_param INTEGER
)
RETURNS VOID AS $$
DECLARE
  link_exists BOOLEAN;
BEGIN
  -- Verificar si existe el enlace
  SELECT EXISTS(
    SELECT 1 FROM public.affiliate_links 
    WHERE user_id = affiliate_id_param AND app_id = app_id_param
  ) INTO link_exists;
  
  -- Si el enlace existe, incrementar el contador
  IF link_exists THEN
    UPDATE public.affiliate_links
    SET 
      clicks = COALESCE(clicks, 0) + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = affiliate_id_param AND app_id = app_id_param;
    
    -- Registrar en el log para auditoría
    INSERT INTO public.affiliate_activity_logs (
      user_id, 
      activity_type, 
      details
    ) VALUES (
      affiliate_id_param,
      'click_increment',
      jsonb_build_object(
        'app_id', app_id_param,
        'timestamp', CURRENT_TIMESTAMP
      )
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
