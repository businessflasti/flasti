-- Vista para mostrar el historial de recompensas de un usuario
CREATE OR REPLACE VIEW user_rewards_history AS
SELECT
  r.id,
  r.user_id,
  r.transaction_id,
  r.payout,
  r.currency,
  r.status,
  r.program_id,
  r.program_name,
  r.goal_id,
  r.goal_name,
  r.country_code,
  r.created_at
FROM rewards_history r;

-- Vista para mostrar el historial de retiros de un usuario
CREATE OR REPLACE VIEW user_withdrawals_history AS
SELECT
  w.id,
  w.user_id,
  w.amount,
  w.currency,
  w.status,
  w.method,
  w.destination,
  w.created_at,
  w.processed_at
FROM withdrawals w;
