-- Tabla para historial de recompensas recibidas desde MyLead u otros offerwalls
CREATE TABLE IF NOT EXISTS rewards_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    transaction_id text NOT NULL,
    payout numeric(12,4) NOT NULL,
    currency text,
    status text,
    program_id text,
    program_name text,
    goal_id text,
    goal_name text,
    country_code text,
    ip text,
    virtual_amount numeric(12,4),
    cart_value numeric(12,4),
    cart_value_original numeric(12,4),
    raw_data jsonb,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, transaction_id)
);

-- Índice para búsquedas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_rewards_history_user_id ON rewards_history(user_id);
