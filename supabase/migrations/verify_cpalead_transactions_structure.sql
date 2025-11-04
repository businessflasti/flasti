-- Verificar y actualizar estructura de cpalead_transactions para soportar bono de bienvenida

-- Asegurar que la columna metadata existe y es tipo JSONB
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cpalead_transactions' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE cpalead_transactions ADD COLUMN metadata JSONB;
    COMMENT ON COLUMN cpalead_transactions.metadata IS 'Metadatos adicionales de la transacción (offer_name, description, campaign_name, etc)';
  END IF;
END $$;

-- Asegurar que la columna transaction_id existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cpalead_transactions' 
    AND column_name = 'transaction_id'
  ) THEN
    ALTER TABLE cpalead_transactions ADD COLUMN transaction_id TEXT;
    COMMENT ON COLUMN cpalead_transactions.transaction_id IS 'ID único de la transacción';
  END IF;
END $$;

-- Asegurar que la columna currency existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cpalead_transactions' 
    AND column_name = 'currency'
  ) THEN
    ALTER TABLE cpalead_transactions ADD COLUMN currency TEXT DEFAULT 'USD';
    COMMENT ON COLUMN cpalead_transactions.currency IS 'Moneda de la transacción';
  END IF;
END $$;

-- Crear índice para búsquedas por status si no existe
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_status 
ON cpalead_transactions(status);

-- Crear índice para búsquedas por user_id y status
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_user_status 
ON cpalead_transactions(user_id, status);

-- Crear índice para búsquedas por created_at
CREATE INDEX IF NOT EXISTS idx_cpalead_transactions_created_at 
ON cpalead_transactions(created_at DESC);

-- Comentarios adicionales
COMMENT ON TABLE cpalead_transactions IS 'Transacciones de CPALead y bonos del sistema (como bono de bienvenida)';
