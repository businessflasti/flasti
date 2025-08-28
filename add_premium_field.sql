-- Script para agregar el campo is_premium a la tabla user_profiles
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna is_premium si no existe
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 2. Crear índice para optimizar consultas de usuarios premium
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_premium ON public.user_profiles(is_premium);

-- 3. Agregar columna para fecha de activación premium
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS premium_activated_at TIMESTAMP WITH TIME ZONE;

-- 4. Agregar columna para método de pago usado
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS premium_payment_method TEXT;

-- 5. Función para activar premium de un usuario
CREATE OR REPLACE FUNCTION activate_user_premium(
  user_id_param UUID,
  payment_method_param TEXT DEFAULT 'unknown'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    is_premium = TRUE,
    premium_activated_at = CURRENT_TIMESTAMP,
    premium_payment_method = payment_method_param,
    updated_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param;
  
  -- Retornar true si se actualizó alguna fila
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para verificar si un usuario es premium
CREATE OR REPLACE FUNCTION is_user_premium(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  premium_status BOOLEAN DEFAULT FALSE;
BEGIN
  SELECT is_premium INTO premium_status
  FROM public.user_profiles
  WHERE user_id = user_id_param;
  
  RETURN COALESCE(premium_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Vista para estadísticas de usuarios premium
CREATE OR REPLACE VIEW premium_users_stats AS
SELECT 
  COUNT(*) FILTER (WHERE is_premium = TRUE) as total_premium_users,
  COUNT(*) FILTER (WHERE is_premium = FALSE) as total_free_users,
  COUNT(*) as total_users,
  ROUND(
    (COUNT(*) FILTER (WHERE is_premium = TRUE)::DECIMAL / COUNT(*)::DECIMAL) * 100, 
    2
  ) as premium_conversion_rate,
  COUNT(*) FILTER (WHERE is_premium = TRUE AND premium_activated_at >= CURRENT_DATE) as premium_users_today,
  COUNT(*) FILTER (WHERE is_premium = TRUE AND premium_activated_at >= CURRENT_DATE - INTERVAL '7 days') as premium_users_this_week
FROM public.user_profiles;

-- 8. Verificar que los cambios se aplicaron correctamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
  AND column_name IN ('is_premium', 'premium_activated_at', 'premium_payment_method')
ORDER BY column_name;

-- 9. Mostrar estadísticas actuales
SELECT * FROM premium_users_stats;

-- 10. Función para buscar usuario por email (segura)
CREATE OR REPLACE FUNCTION get_user_by_email(email_param TEXT)
RETURNS TABLE(id UUID, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email
  FROM auth.users u
  WHERE u.email = email_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Agregar columna user_id a checkout_leads si no existe
ALTER TABLE public.checkout_leads 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 12. Crear índice para user_id en checkout_leads
CREATE INDEX IF NOT EXISTS idx_checkout_leads_user_id ON public.checkout_leads(user_id);

-- 13. Comentarios para documentación
COMMENT ON COLUMN public.user_profiles.is_premium IS 'Indica si el usuario tiene acceso premium activo';
COMMENT ON COLUMN public.user_profiles.premium_activated_at IS 'Fecha y hora cuando se activó el premium';
COMMENT ON COLUMN public.user_profiles.premium_payment_method IS 'Método de pago usado para activar premium (paypal, mercadopago, hotmart)';
COMMENT ON FUNCTION activate_user_premium(UUID, TEXT) IS 'Activa el estado premium para un usuario específico';
COMMENT ON FUNCTION is_user_premium(UUID) IS 'Verifica si un usuario tiene estado premium activo';
COMMENT ON FUNCTION get_user_by_email(TEXT) IS 'Busca un usuario por email de forma segura';