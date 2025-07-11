-- Función segura para sumar saldo al usuario (llamada desde el postback)
CREATE OR REPLACE FUNCTION add_balance(user_id uuid, amount numeric)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET balance = COALESCE(balance, 0) + amount WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
