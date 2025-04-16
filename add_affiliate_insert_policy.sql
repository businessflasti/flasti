-- Añadir política para permitir a los usuarios crear sus propios registros de afiliados
CREATE POLICY affiliates_insert_policy ON affiliates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Añadir política para permitir a los usuarios actualizar sus propios registros de afiliados
CREATE POLICY affiliates_update_policy ON affiliates
    FOR UPDATE USING (auth.uid() = user_id);
