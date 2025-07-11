-- Tabla para retiros solicitados por los usuarios
CREATE TABLE IF NOT EXISTS withdrawals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount numeric(12,4) NOT NULL,
    currency text DEFAULT 'USD',
    status text DEFAULT 'pendiente', -- pendiente, aprobado, rechazado, pagado
    method text, -- ej: PayPal, USDT, etc.
    destination text, -- email o dirección de retiro
    notes text,
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
);

-- Índice para búsquedas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
