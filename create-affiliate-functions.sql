-- Función para incrementar los clics de un enlace de afiliado
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(
  affiliate_id_param UUID,
  app_id_param INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.affiliate_links
  SET clicks = clicks + 1
  WHERE user_id = affiliate_id_param AND app_id = app_id_param;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar el balance de un usuario
CREATE OR REPLACE FUNCTION update_user_balance(
  user_id_param UUID,
  amount_param DECIMAL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles
  SET balance = COALESCE(balance, 0) + amount_param
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;
