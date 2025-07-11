-- Permisos mínimos para que la app pueda leer y escribir recompensas y retiros
-- (ajusta los roles según tu configuración de Supabase)

-- Permitir a los usuarios leer su propio historial de recompensas
GRANT SELECT ON rewards_history TO authenticated;
GRANT SELECT ON user_rewards_history TO authenticated;

-- Permitir a los usuarios leer y crear retiros
GRANT SELECT, INSERT ON withdrawals TO authenticated;
GRANT SELECT ON user_withdrawals_history TO authenticated;

-- Permitir a la app ejecutar la función de sumar saldo
GRANT EXECUTE ON FUNCTION add_balance(uuid, numeric) TO authenticated;
