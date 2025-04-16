-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de aplicaciones si no existe
CREATE TABLE IF NOT EXISTS public.apps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  icon TEXT,
  bg_gradient TEXT,
  icon_bg TEXT,
  icon_color TEXT,
  url TEXT NOT NULL,
  commission_rates JSONB DEFAULT '{"basic": 30, "premium": 40, "pro": 50}'::jsonb,
  hotmart_offer_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de enlaces de afiliado si no existe
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id INTEGER NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, app_id)
);

-- Crear tabla de visitas de afiliado si no existe
CREATE TABLE IF NOT EXISTS public.affiliate_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id INTEGER NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de ventas si no existe
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  app_id INTEGER NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  affiliate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_email TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de comisiones si no existe
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de registros de actividad si no existe
CREATE TABLE IF NOT EXISTS public.affiliate_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de perfiles de usuario si no existe
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'basic',
  balance DECIMAL(10, 2) DEFAULT 0,
  payment_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de aplicaciones si no existen
INSERT INTO public.apps (id, name, description, price, icon, bg_gradient, icon_bg, icon_color, url, hotmart_offer_code)
VALUES 
  (1, 'Flasti Imágenes', 'Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.', 10.00, 'image', 'from-[#ec4899]/20 to-[#f97316]/20', 'bg-[#ec4899]/10', 'text-[#ec4899]', 'https://flasti.com/images', 'mz63zpyh'),
  (2, 'Flasti AI', 'Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.', 15.00, 'sparkles', 'from-[#9333ea]/20 to-[#ec4899]/20', 'bg-[#9333ea]/10', 'text-[#9333ea]', 'https://flasti.com/ai', 'abcdefg')
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad RLS (Row Level Security)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

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

-- Políticas para user_profiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Crear función para incrementar clics
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

-- Crear función para actualizar balance de usuario
CREATE OR REPLACE FUNCTION update_user_balance(
  user_id_param UUID,
  amount_param DECIMAL
)
RETURNS VOID AS $$
BEGIN
  -- Crear perfil si no existe
  INSERT INTO public.user_profiles (user_id, balance)
  VALUES (user_id_param, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Actualizar balance
  UPDATE public.user_profiles
  SET 
    balance = COALESCE(balance, 0) + amount_param,
    updated_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Crear función para obtener estadísticas de afiliados
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
