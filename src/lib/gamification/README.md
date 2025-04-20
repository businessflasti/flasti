# Configuración de Gamificación para Flasti

Este directorio contiene los servicios y utilidades necesarios para implementar las funcionalidades de gamificación en la plataforma Flasti.

## Configuración de la Base de Datos

Para configurar la base de datos con las tablas y funciones necesarias, sigue estos pasos:

1. Crea las tablas necesarias ejecutando los siguientes comandos SQL en tu base de datos Supabase:

```sql
-- Tabla de logros
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY, 
  name TEXT NOT NULL, 
  description TEXT NOT NULL, 
  icon TEXT NOT NULL, 
  criteria JSONB NOT NULL, 
  points INTEGER NOT NULL DEFAULT 10, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de logros de usuario
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY, 
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE, 
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  UNIQUE(user_id, achievement_id)
);

-- Tabla de clasificaciones
CREATE TABLE IF NOT EXISTS leaderboards (
  id SERIAL PRIMARY KEY, 
  name TEXT NOT NULL, 
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')), 
  start_date TIMESTAMPTZ NOT NULL, 
  end_date TIMESTAMPTZ NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de entradas de clasificación
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id SERIAL PRIMARY KEY, 
  leaderboard_id INTEGER NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE, 
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
  score INTEGER NOT NULL DEFAULT 0, 
  rank INTEGER, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  UNIQUE(leaderboard_id, user_id)
);

-- Tabla de objetivos
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY, 
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
  name TEXT NOT NULL, 
  description TEXT, 
  type TEXT NOT NULL CHECK (type IN ('sales', 'clicks', 'earnings', 'custom')), 
  target_value INTEGER NOT NULL, 
  current_value INTEGER NOT NULL DEFAULT 0, 
  deadline TIMESTAMPTZ, 
  completed BOOLEAN NOT NULL DEFAULT FALSE, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de temas
CREATE TABLE IF NOT EXISTS themes (
  id SERIAL PRIMARY KEY, 
  name TEXT NOT NULL, 
  primary_color TEXT NOT NULL, 
  secondary_color TEXT NOT NULL, 
  accent_color TEXT NOT NULL, 
  is_dark BOOLEAN NOT NULL DEFAULT FALSE, 
  is_system BOOLEAN NOT NULL DEFAULT FALSE, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY, 
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
  theme_id INTEGER REFERENCES themes(id) ON DELETE SET NULL, 
  notification_settings JSONB DEFAULT '{}'::jsonb, 
  display_settings JSONB DEFAULT '{}'::jsonb, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  UNIQUE(user_id)
);

-- Tabla de tips diarios
CREATE TABLE IF NOT EXISTS daily_tips (
  id SERIAL PRIMARY KEY, 
  content TEXT NOT NULL, 
  category TEXT NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

2. Crea las funciones RPC necesarias ejecutando el archivo `db-setup.sql` en tu base de datos Supabase.

3. Inserta los datos iniciales:

```sql
-- Insertar logros predefinidos
INSERT INTO achievements (name, description, icon, criteria, points) 
VALUES 
('Primera Venta', 'Felicidades por tu primera venta como afiliado', 'trophy', '{"type": "sales", "count": 1}', 10),
('Afiliado Bronce', 'Has conseguido 5 ventas como afiliado', 'medal-bronze', '{"type": "sales", "count": 5}', 20),
('Afiliado Plata', 'Has conseguido 10 ventas como afiliado', 'medal-silver', '{"type": "sales", "count": 10}', 30),
('Afiliado Oro', 'Has conseguido 25 ventas como afiliado', 'medal-gold', '{"type": "sales", "count": 25}', 50),
('Afiliado Diamante', 'Has conseguido 50 ventas como afiliado', 'medal-diamond', '{"type": "sales", "count": 50}', 100),
('Tráfico Inicial', 'Has conseguido 100 clics en tus enlaces', 'clicks', '{"type": "clicks", "count": 100}', 15),
('Tráfico Medio', 'Has conseguido 500 clics en tus enlaces', 'clicks-medium', '{"type": "clicks", "count": 500}', 30),
('Tráfico Avanzado', 'Has conseguido 1000 clics en tus enlaces', 'clicks-advanced', '{"type": "clicks", "count": 1000}', 50),
('Primer Retiro', 'Has realizado tu primer retiro de comisiones', 'money', '{"type": "withdrawals", "count": 1}', 20),
('Perfil Completo', 'Has completado toda la información de tu perfil', 'profile', '{"type": "profile_completion", "count": 100}', 10)
ON CONFLICT DO NOTHING;

-- Insertar temas predefinidos
INSERT INTO themes (name, primary_color, secondary_color, accent_color, is_dark, is_system) 
VALUES 
('Flasti Claro', '#ffffff', '#f8fafc', '#ec4899', FALSE, TRUE),
('Flasti Oscuro', '#0f172a', '#1e293b', '#ec4899', TRUE, TRUE),
('Azul Océano', '#f8fafc', '#e0f2fe', '#0ea5e9', FALSE, FALSE),
('Azul Noche', '#0f172a', '#1e293b', '#0ea5e9', TRUE, FALSE),
('Verde Naturaleza', '#f8fafc', '#dcfce7', '#22c55e', FALSE, FALSE),
('Verde Bosque', '#0f172a', '#1e293b', '#22c55e', TRUE, FALSE),
('Púrpura Real', '#f8fafc', '#f3e8ff', '#9333ea', FALSE, FALSE),
('Púrpura Noche', '#0f172a', '#1e293b', '#9333ea', TRUE, FALSE),
('Ámbar Dorado', '#f8fafc', '#fef3c7', '#f59e0b', FALSE, FALSE),
('Ámbar Noche', '#0f172a', '#1e293b', '#f59e0b', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Insertar tips predefinidos
INSERT INTO daily_tips (content, category) 
VALUES 
('Personaliza tus enlaces con UTM parameters para rastrear mejor el origen de tus conversiones.', 'tracking'),
('Utiliza testimonios y casos de éxito en tus promociones para aumentar la credibilidad.', 'marketing'),
('Las publicaciones con imágenes obtienen un 150% más de engagement que las que solo tienen texto.', 'social_media'),
('Prueba diferentes llamadas a la acción (CTAs) para identificar cuáles generan más conversiones.', 'conversion'),
('Segmenta tu audiencia para enviar mensajes más relevantes y personalizados.', 'targeting'),
('Programa tus publicaciones en redes sociales durante las horas de mayor actividad de tu audiencia.', 'timing'),
('Crea contenido educativo que resuelva problemas reales de tu audiencia para establecerte como autoridad.', 'content'),
('Utiliza herramientas de análisis para identificar qué estrategias están funcionando mejor.', 'analytics'),
('Mantén una presencia constante en redes sociales para construir confianza con tu audiencia.', 'consistency'),
('Colabora con otros afiliados o creadores de contenido para ampliar tu alcance.', 'collaboration'),
('Optimiza tus páginas de destino para dispositivos móviles, ya que más del 50% del tráfico web proviene de smartphones.', 'mobile'),
('Incluye una sensación de urgencia en tus promociones para motivar acciones inmediatas.', 'psychology'),
('Utiliza el remarketing para reconectar con visitantes que no completaron una compra.', 'retargeting'),
('Crea tutoriales o guías sobre cómo utilizar los productos que promocionas.', 'education'),
('Mantén actualizada tu biografía en redes sociales con enlaces a tus ofertas actuales.', 'profile_optimization'),
('Utiliza hashtags relevantes y específicos para aumentar la visibilidad de tus publicaciones.', 'discoverability'),
('Responde rápidamente a comentarios y mensajes para mantener el interés de potenciales clientes.', 'engagement'),
('Analiza a tu competencia para identificar oportunidades y estrategias efectivas.', 'research'),
('Crea una lista de correo electrónico para mantener contacto directo con tu audiencia.', 'email_marketing'),
('Utiliza historias de Instagram y Facebook para crear contenido efímero que genere FOMO (miedo a perderse algo).', 'fomo')
ON CONFLICT DO NOTHING;
```

## Integración con OpenRouter para el Generador de Contenido con IA

Para integrar el generador de contenido con OpenRouter, sigue estos pasos:

1. Regístrate en [OpenRouter](https://openrouter.ai/) y obtén una API key.

2. Crea un archivo `.env.local` en la raíz del proyecto con la siguiente variable:

```
OPENROUTER_API_KEY=tu_api_key_aquí
```

3. Actualiza el archivo `src/lib/ai-service.ts` para utilizar la API de OpenRouter en lugar de las respuestas predefinidas.

## Notas Adicionales

- Las funcionalidades de gamificación están diseñadas para ser modulares y pueden activarse o desactivarse según sea necesario.
- Todas las funcionalidades están optimizadas para dispositivos móviles y de escritorio.
- Se recomienda revisar y ajustar las políticas de seguridad de la base de datos según las necesidades específicas del proyecto.
