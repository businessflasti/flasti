-- ============================================
-- SISTEMA DE INVERSIONES FLASTI CAPITAL
-- Ejecutar este script en Supabase SQL Editor
-- ============================================

-- 0. Crear ENUM para roles de usuario
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 0.1 Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    balance DOUBLE PRECISION NOT NULL DEFAULT 0,
    role "UserRole" NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 0.2 Crear índice para email
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- 1. Crear ENUM para estados de inversión
DO $$ BEGIN
    CREATE TYPE "InvestmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Crear ENUM para estados de retiro
DO $$ BEGIN
    CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear tabla de configuración de inversiones
CREATE TABLE IF NOT EXISTS investment_config (
    id TEXT PRIMARY KEY,
    current_value DOUBLE PRECISION NOT NULL DEFAULT 132.25,
    daily_change DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    min_investment DOUBLE PRECISION NOT NULL DEFAULT 5,
    max_investment DOUBLE PRECISION NOT NULL DEFAULT 10000,
    is_system_locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear tabla de períodos de inversión
CREATE TABLE IF NOT EXISTS investment_periods (
    id TEXT PRIMARY KEY,
    days INTEGER NOT NULL,
    rate_annual DOUBLE PRECISION NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Crear tabla de inversiones
CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    period_id TEXT NOT NULL,
    start_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP(3) NOT NULL,
    interest_rate DOUBLE PRECISION NOT NULL,
    estimated_return DOUBLE PRECISION NOT NULL,
    status "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT investments_period_id_fkey FOREIGN KEY (period_id) REFERENCES investment_periods(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT investments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Crear índices para investments
CREATE INDEX IF NOT EXISTS investments_user_id_idx ON investments(user_id);
CREATE INDEX IF NOT EXISTS investments_status_idx ON investments(status);

-- 7. Crear tabla de puntos del gráfico
CREATE TABLE IF NOT EXISTS chart_data_points (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Crear tabla de FAQs
CREATE TABLE IF NOT EXISTS investment_faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Crear tabla de solicitudes de retiro
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    investment_id TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP(3),
    notes TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT withdrawal_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. Crear índices para withdrawal_requests
CREATE INDEX IF NOT EXISTS withdrawal_requests_user_id_idx ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS withdrawal_requests_status_idx ON withdrawal_requests(status);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- 11. Insertar configuración por defecto
INSERT INTO investment_config (id, current_value, daily_change, min_investment, max_investment, is_system_locked, created_at, updated_at)
VALUES (
    gen_random_uuid()::text,
    132.25,
    2.5,
    5,
    10000,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 12. Insertar períodos de inversión (30, 45, 90 días)
INSERT INTO investment_periods (id, days, rate_annual, enabled, created_at, updated_at)
VALUES 
    (gen_random_uuid()::text, 30, 5.0, true, NOW(), NOW()),
    (gen_random_uuid()::text, 45, 7.5, true, NOW(), NOW()),
    (gen_random_uuid()::text, 90, 12.0, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 13. Insertar datos del gráfico
INSERT INTO chart_data_points (id, month, value, "order", created_at, updated_at)
VALUES 
    (gen_random_uuid()::text, 'Ene', 120.00, 1, NOW(), NOW()),
    (gen_random_uuid()::text, 'Feb', 125.50, 2, NOW(), NOW()),
    (gen_random_uuid()::text, 'Mar', 122.30, 3, NOW(), NOW()),
    (gen_random_uuid()::text, 'Abr', 128.75, 4, NOW(), NOW()),
    (gen_random_uuid()::text, 'May', 130.20, 5, NOW(), NOW()),
    (gen_random_uuid()::text, 'Jun', 132.25, 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 14. Insertar FAQs
INSERT INTO investment_faqs (id, question, answer, "order", enabled, created_at, updated_at)
VALUES 
    (
        gen_random_uuid()::text, 
        '¿Cómo se calculan los intereses?', 
        'Los intereses se calculan de forma proporcional según el período elegido y se acreditan automáticamente al finalizar el período de bloqueo. Por ejemplo, si inviertes $1,000 al 12% anual por 90 días, recibirás $29.59 en intereses.',
        1, 
        true, 
        NOW(), 
        NOW()
    ),
    (
        gen_random_uuid()::text, 
        '¿Puedo retirar antes del período?', 
        'No, los fondos quedan bloqueados durante el período seleccionado (30, 45 o 90 días). Esto garantiza la estabilidad del sistema y los rendimientos prometidos. Al finalizar el período, podrás retirar tu capital más los intereses generados.',
        2, 
        true, 
        NOW(), 
        NOW()
    ),
    (
        gen_random_uuid()::text, 
        '¿Es segura mi inversión?', 
        'Sí, Flasti Capital opera con total transparencia. Tus fondos se destinan al crecimiento real de la plataforma y contamos con más de 100,000 usuarios activos generando ingresos diariamente. Además, mantenemos un 10% de reservas de liquidez para garantizar la seguridad.',
        3, 
        true, 
        NOW(), 
        NOW()
    ),
    (
        gen_random_uuid()::text, 
        '¿Cuánto puedo invertir?', 
        'La inversión mínima es de $5 USD y la máxima es de $10,000 USD por usuario. Esto permite que cualquier persona pueda comenzar a invertir sin importar su capital inicial.',
        4, 
        true, 
        NOW(), 
        NOW()
    ),
    (
        gen_random_uuid()::text, 
        '¿A dónde van mis fondos?', 
        'Tus fondos se destinan al crecimiento y operación de la plataforma Flasti: 40% en infraestructura y hosting, 30% en marketing y adquisición de usuarios, 20% en desarrollo tecnológico, y 10% en reservas de liquidez.',
        5, 
        true, 
        NOW(), 
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- 15. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 16. Crear triggers para actualizar updatedAt
DROP TRIGGER IF EXISTS update_investment_config_updated_at ON investment_config;
CREATE TRIGGER update_investment_config_updated_at BEFORE UPDATE ON investment_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investment_periods_updated_at ON investment_periods;
CREATE TRIGGER update_investment_periods_updated_at BEFORE UPDATE ON investment_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investments_updated_at ON investments;
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chart_data_points_updated_at ON chart_data_points;
CREATE TRIGGER update_chart_data_points_updated_at BEFORE UPDATE ON chart_data_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investment_faqs_updated_at ON investment_faqs;
CREATE TRIGGER update_investment_faqs_updated_at BEFORE UPDATE ON investment_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_withdrawal_requests_updated_at ON withdrawal_requests;
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ACTUALIZAR USUARIO ADMIN EXISTENTE
-- ============================================

-- 17. Actualizar el usuario admin existente para que tenga balance inicial
UPDATE users 
SET 
    balance = 10000,
    role = 'ADMIN'
WHERE email = 'flasti.finanzas@gmail.com';

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Mostrar resumen de tablas creadas
SELECT 
    'users' as tabla,
    COUNT(*) as registros
FROM users
UNION ALL
SELECT 
    'investment_config' as tabla,
    COUNT(*) as registros
FROM investment_config
UNION ALL
SELECT 
    'investment_periods' as tabla,
    COUNT(*) as registros
FROM investment_periods
UNION ALL
SELECT 
    'chart_data_points' as tabla,
    COUNT(*) as registros
FROM chart_data_points
UNION ALL
SELECT 
    'investment_faqs' as tabla,
    COUNT(*) as registros
FROM investment_faqs
ORDER BY tabla;

-- Mostrar información del usuario admin
SELECT 
    email,
    name,
    role,
    balance,
    created_at
FROM users 
WHERE email = 'flasti.finanzas@gmail.com';

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================
-- Todas las tablas y datos iniciales han sido creados
-- El sistema de inversiones está listo para usar
-- ============================================
