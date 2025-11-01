-- Agregar columna welcome_bonus_claimed a la tabla games_balance
-- Esta columna controla si el usuario ya reclamó su bono de bienvenida

ALTER TABLE games_balance 
ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_games_balance_welcome_bonus 
ON games_balance(user_id, welcome_bonus_claimed);

-- Comentario en la columna
COMMENT ON COLUMN games_balance.welcome_bonus_claimed IS 'Indica si el usuario ya reclamó su bono de bienvenida de 10 fichas gratis';
