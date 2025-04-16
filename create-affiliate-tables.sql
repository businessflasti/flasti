-- Crear tabla de aplicaciones
CREATE TABLE IF NOT EXISTS public.apps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  icon TEXT,
  bg_gradient TEXT,
  icon_bg TEXT,
  icon_color TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de enlaces de afiliado
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  app_id INTEGER NOT NULL REFERENCES public.apps(id),
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de visitas de afiliado
CREATE TABLE IF NOT EXISTS public.affiliate_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id),
  app_id INTEGER NOT NULL REFERENCES public.apps(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  app_id INTEGER NOT NULL REFERENCES public.apps(id),
  amount DECIMAL NOT NULL,
  commission DECIMAL NOT NULL,
  affiliate_id UUID REFERENCES auth.users(id),
  buyer_id UUID,
  buyer_email TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de comisiones
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  sale_id UUID NOT NULL REFERENCES public.sales(id),
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de retiros
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Insertar aplicaciones iniciales
INSERT INTO public.apps (id, name, description, price, icon, bg_gradient, icon_bg, icon_color, url)
VALUES 
  (1, 'Flasti Imágenes', 'Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.', 10, 'image', 'from-[#ec4899]/20 to-[#f97316]/20', 'bg-[#ec4899]/10', 'text-[#ec4899]', 'https://flasti.com/images'),
  (2, 'Flasti AI', 'Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.', 15, 'sparkles', 'from-[#9333ea]/20 to-[#ec4899]/20', 'bg-[#9333ea]/10', 'text-[#9333ea]', 'https://flasti.com/ai')
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Políticas para apps
CREATE POLICY "Todos pueden ver apps" ON public.apps
  FOR SELECT USING (true);

-- Políticas para affiliate_links
CREATE POLICY "Usuarios pueden ver sus propios enlaces" ON public.affiliate_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propios enlaces" ON public.affiliate_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios enlaces" ON public.affiliate_links
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para affiliate_visits
CREATE POLICY "Usuarios pueden ver sus propias visitas" ON public.affiliate_visits
  FOR SELECT USING (auth.uid() = affiliate_id);

-- Políticas para sales
CREATE POLICY "Usuarios pueden ver sus propias ventas" ON public.sales
  FOR SELECT USING (auth.uid() = affiliate_id);

-- Políticas para commissions
CREATE POLICY "Usuarios pueden ver sus propias comisiones" ON public.commissions
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para withdrawals
CREATE POLICY "Usuarios pueden ver sus propios retiros" ON public.withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propios retiros" ON public.withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
