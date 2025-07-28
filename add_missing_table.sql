-- Agregar tabla faltante para logs de actividad
CREATE TABLE IF NOT EXISTS public.affiliate_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_affiliate_activity_logs_user_id ON public.affiliate_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_activity_logs_created_at ON public.affiliate_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_activity_logs_activity_type ON public.affiliate_activity_logs(activity_type);

-- RLS
ALTER TABLE public.affiliate_activity_logs ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean solo sus logs
CREATE POLICY "Usuarios pueden ver sus propios logs" ON public.affiliate_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Política para insertar logs
CREATE POLICY "Sistema puede insertar logs" ON public.affiliate_activity_logs
  FOR INSERT WITH CHECK (true);