// Función para registrar un usuario en Supabase
async function registrarUsuario(email, password, name, isPremium) {
    try {
        // SOLUCIÓN ALTERNATIVA: Usar el método signInWithOtp para evitar el error de Database
        // Este método envía un enlace mágico al correo electrónico del usuario
        console.log('Intentando registro con OTP para:', email);
        
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: window.location.origin + '/dashboard.html',
                data: {
                    full_name: name,
                    is_premium: isPremium,
                    image_count: 0
                }
            }
        });
        
        console.log('Respuesta de registro con OTP:', data);
        
        if (error) {
            console.error('Error detallado de registro con OTP:', error);
            throw error;
        }
        
        // Si llegamos aquí, el enlace mágico se envió correctamente
        return { success: true, method: 'otp' };
    } catch (otpError) {
        console.error('Error en el proceso de registro con OTP:', otpError);
        
        // Si falla el método OTP, intentar el registro normal como último recurso
        try {
            console.log('Intentando registro normal como último recurso');
            
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        is_premium: isPremium,
                        image_count: 0
                    }
                }
            });
            
            console.log('Respuesta de registro normal:', data);
            
            if (error) {
                console.error('Error detallado de registro normal:', error);
                throw error;
            }
            
            return { success: true, method: 'password', data };
        } catch (signUpError) {
            console.error('Error en el proceso de registro normal:', signUpError);
            throw new Error(`Error al registrar usuario: ${signUpError.message}`);
        }
    }
}
