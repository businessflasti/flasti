-- Crear función para actualizar la URL del avatar
CREATE OR REPLACE FUNCTION update_avatar_url(user_id_param UUID, avatar_url_param TEXT)
RETURNS VOID AS $$
DECLARE
    profile_exists BOOLEAN;
    user_profile_exists BOOLEAN;
BEGIN
    -- Verificar si existe en profiles
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id_param) INTO profile_exists;
    
    -- Verificar si existe en user_profiles
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = user_id_param) INTO user_profile_exists;
    
    -- Actualizar en profiles si existe
    IF profile_exists THEN
        UPDATE profiles SET avatar_url = avatar_url_param WHERE id = user_id_param;
    END IF;
    
    -- Actualizar en user_profiles si existe
    IF user_profile_exists THEN
        UPDATE user_profiles SET avatar_url = avatar_url_param WHERE user_id = user_id_param;
    END IF;
    
    -- Si no existe en ninguna tabla, insertar en profiles
    IF NOT profile_exists AND NOT user_profile_exists THEN
        INSERT INTO profiles (id, avatar_url) VALUES (user_id_param, avatar_url_param);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
