// Script para verificar la configuración de Supabase
const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';

// Verificar que Supabase esté disponible
async function verificarSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.error('Error: Supabase no está definido');
            return;
        }
        
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Cliente Supabase inicializado correctamente');
        
        // Verificar si la tabla profiles existe
        console.log('Verificando tabla profiles...');
        const { data: profilesData, error: profilesError } = await supabaseClient
            .from('profiles')
            .select('*')
            .limit(1);
            
        if (profilesError) {
            console.error('Error al verificar tabla profiles:', profilesError);
        } else {
            console.log('Tabla profiles existe y es accesible');
            console.log('Estructura de profiles:', profilesData);
        }
        
        // Verificar si la tabla images existe
        console.log('Verificando tabla images...');
        const { data: imagesData, error: imagesError } = await supabaseClient
            .from('images')
            .select('*')
            .limit(1);
            
        if (imagesError) {
            console.error('Error al verificar tabla images:', imagesError);
        } else {
            console.log('Tabla images existe y es accesible');
            console.log('Estructura de images:', imagesData);
        }
        
        // Verificar si podemos crear un usuario
        console.log('Verificando creación de usuario...');
        const testEmail = `test_${Date.now()}@example.com`;
        const { data: userData, error: userError } = await supabaseClient.auth.signUp({
            email: testEmail,
            password: 'Password123!',
            options: {
                data: {
                    full_name: 'Test User',
                    is_premium: false,
                    image_count: 0
                }
            }
        });
        
        if (userError) {
            console.error('Error al crear usuario de prueba:', userError);
        } else {
            console.log('Usuario de prueba creado correctamente:', userData);
        }
        
    } catch (error) {
        console.error('Error al verificar Supabase:', error);
    }
}

// Ejecutar la verificación cuando se cargue la página
window.addEventListener('load', verificarSupabase);
