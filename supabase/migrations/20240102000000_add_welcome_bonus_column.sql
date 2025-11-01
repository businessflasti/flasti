-- Agregar columna para rastrear si el usuario ya reclamó el bono de bienvenida
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_user_profiles_welcome_bonus_claimed 
ON public.user_profiles(welcome_bonus_claimed);
