-- Tabla para rastrear las ofertas personalizadas completadas por cada usuario
CREATE TABLE IF NOT EXISTS public.custom_offers_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.custom_offers(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  amount_earned DECIMAL(10, 2) NOT NULL,
  UNIQUE(user_id, offer_id) -- Un usuario solo puede completar cada oferta una vez
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_custom_offers_completions_user ON public.custom_offers_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_offers_completions_offer ON public.custom_offers_completions(offer_id);

-- Políticas RLS
ALTER TABLE public.custom_offers_completions ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propias completaciones
CREATE POLICY "Users can view own completions" ON public.custom_offers_completions
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propias completaciones
CREATE POLICY "Users can insert own completions" ON public.custom_offers_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los admins pueden ver todas las completaciones
CREATE POLICY "Admins can view all completions" ON public.custom_offers_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );
