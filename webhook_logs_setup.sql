-- Script para crear sistema de logs de webhooks
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de logs de webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL, -- 'mercadopago', 'paypal', 'hotmart'
  event_type TEXT NOT NULL, -- 'payment', 'purchase', etc.
  status TEXT NOT NULL, -- 'received', 'processed', 'error'
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  processing_time_ms INTEGER,
  user_email TEXT,
  transaction_id TEXT,
  amount DECIMAL(10, 2),
  premium_activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_webhook_logs_provider ON public.webhook_logs(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON public.webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_transaction_id ON public.webhook_logs(transaction_id);

-- 3. Habilitar RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- 4. Política para que solo admins puedan ver logs
CREATE POLICY "Solo admins pueden ver webhook logs" ON public.webhook_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() 
      AND (
        -- Aquí puedes agregar tu lógica de admin
        -- Por ejemplo, verificar si el usuario tiene un rol de admin
        user_id IN (
          SELECT user_id FROM public.admin_users
        )
      )
    )
  );

-- 5. Función para crear la tabla (para usar desde la API)
CREATE OR REPLACE FUNCTION create_webhook_logs_table()
RETURNS VOID AS $$
BEGIN
  -- Esta función no hace nada porque la tabla ya existe
  -- Pero es necesaria para evitar errores en la API
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para registrar webhook
CREATE OR REPLACE FUNCTION log_webhook(
  provider_param TEXT,
  event_type_param TEXT,
  status_param TEXT,
  request_data_param JSONB DEFAULT NULL,
  response_data_param JSONB DEFAULT NULL,
  error_message_param TEXT DEFAULT NULL,
  processing_time_ms_param INTEGER DEFAULT NULL,
  user_email_param TEXT DEFAULT NULL,
  transaction_id_param TEXT DEFAULT NULL,
  amount_param DECIMAL DEFAULT NULL,
  premium_activated_param BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.webhook_logs (
    provider,
    event_type,
    status,
    request_data,
    response_data,
    error_message,
    processing_time_ms,
    user_email,
    transaction_id,
    amount,
    premium_activated
  ) VALUES (
    provider_param,
    event_type_param,
    status_param,
    request_data_param,
    response_data_param,
    error_message_param,
    processing_time_ms_param,
    user_email_param,
    transaction_id_param,
    amount_param,
    premium_activated_param
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Vista para estadísticas de webhooks
CREATE OR REPLACE VIEW webhook_stats AS
SELECT 
  provider,
  COUNT(*) as total_webhooks,
  COUNT(*) FILTER (WHERE status = 'processed') as successful_webhooks,
  COUNT(*) FILTER (WHERE status = 'error') as failed_webhooks,
  COUNT(*) FILTER (WHERE premium_activated = TRUE) as premium_activations,
  AVG(processing_time_ms) as avg_processing_time_ms,
  MAX(created_at) as last_webhook_at
FROM public.webhook_logs
GROUP BY provider;

-- 8. Función para limpiar logs antiguos automáticamente
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
  cutoff_date := CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL;
  
  DELETE FROM public.webhook_logs 
  WHERE created_at < cutoff_date;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Verificar que todo se creó correctamente
SELECT 
  'webhook_logs' as table_name,
  COUNT(*) as total_logs
FROM public.webhook_logs
UNION ALL
SELECT 
  'webhook_stats' as view_name,
  COUNT(*) as providers
FROM webhook_stats;

-- 10. Comentarios para documentación
COMMENT ON TABLE public.webhook_logs IS 'Logs de todos los webhooks recibidos de proveedores de pago';
COMMENT ON FUNCTION log_webhook IS 'Registra un evento de webhook en los logs';
COMMENT ON FUNCTION cleanup_old_webhook_logs IS 'Limpia logs de webhooks antiguos';
COMMENT ON VIEW webhook_stats IS 'Estadísticas agregadas de webhooks por proveedor';