-- ============================================
-- AGREGAR TEMA PREMIUM
-- ============================================

-- Insertar el tema Premium en la tabla seasonal_themes
INSERT INTO seasonal_themes (theme_name, is_active, logo_url, background_url)
VALUES (
    'premium',
    false,
    '/images/themes/premium/logo.png',
    '/images/themes/premium/background.jpg'
)
ON CONFLICT (theme_name) DO NOTHING;

-- Verificar temas existentes
SELECT * FROM seasonal_themes ORDER BY id;

-- ============================================
-- ✅ TEMA PREMIUM AGREGADO
-- ============================================
-- Este tema solo estará disponible para usuarios premium
-- Se activa automáticamente cuando el usuario desbloquea
-- las ofertas CPA Lead (overlay desbloqueado)
-- ============================================
