// Configuración de Supabase
const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';

// Inicializar cliente de Supabase
let supabaseClient;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando autenticación...');

    // Inicializar Supabase
    initSupabase();

    // Configurar eventos de formularios
    setupFormEvents();

    // Verificar autenticación
    checkAuth();
});

// Inicializar Supabase
function initSupabase() {
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Cliente Supabase inicializado correctamente');
        } else {
            console.error('Error: Supabase no está definido');
            showError('Error al inicializar la autenticación. Por favor, recarga la página.');
        }
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
        showError('Error al inicializar la autenticación. Por favor, recarga la página.');
    }
}

// Configurar eventos de formularios
function setupFormEvents() {
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        console.log('Configurando formulario de registro');
        registerForm.addEventListener('submit', handleRegister);

        // También agregar evento al botón para mayor compatibilidad
        const registerButton = document.querySelector('.auth-button');
        if (registerButton) {
            registerButton.addEventListener('click', handleRegister);
        }
    }

    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Configurando formulario de login');
        loginForm.addEventListener('submit', handleLogin);

        // También agregar evento al botón para mayor compatibilidad
        const loginButton = document.querySelector('.auth-button');
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
        }
    }
}

// Verificar si el usuario está autenticado
async function checkAuth() {
    try {
        if (!supabaseClient) {
            console.error('Cliente Supabase no inicializado');
            return null;
        }

        const { data: { user } } = await supabaseClient.auth.getUser();

        // Obtener la ruta actual
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('login.html') || currentPath.includes('register.html');
        const isDashboardPage = currentPath.includes('dashboard.html');

        if (user) {
            // Usuario autenticado
            console.log('Usuario autenticado:', user.email);

            // Si estamos en la página de login o registro, redirigir al dashboard
            if (isAuthPage) {
                console.log('Redirigiendo a dashboard...');
                window.location.href = 'dashboard.html';
            }
        } else {
            // Usuario no autenticado
            console.log('Usuario no autenticado');

            // Si estamos en el dashboard, redirigir al login
            if (isDashboardPage) {
                console.log('Redirigiendo a login...');
                window.location.href = 'login.html';
            }
        }

        return user;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);

        // En caso de error, si estamos en el dashboard, redirigir al login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }

        return null;
    }
}

// Manejar el inicio de sesión
async function handleLogin(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    console.log('Ejecutando handleLogin...');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector('.auth-button');

    // Deshabilitar el botón durante el proceso
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
        // Limpiar mensajes de error previos
        hideError();

        // Validaciones básicas
        if (!email || !password) {
            throw new Error('Por favor, completa todos los campos');
        }

        if (!supabaseClient) {
            throw new Error('Error de conexión. Por favor, recarga la página.');
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Guardar información del usuario en localStorage
        localStorage.setItem('userEmail', email);

        // Mostrar mensaje de éxito
        showSuccess('¡Inicio de sesión exitoso!');

        // Redirigir al dashboard después de un breve momento
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        // Mostrar mensaje de error amigable
        let mensajeError = 'Error al iniciar sesión';

        if (error.message.includes('Invalid login credentials')) {
            mensajeError = 'Correo electrónico o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed')) {
            mensajeError = 'Por favor, confirma tu correo electrónico antes de iniciar sesión';
        } else {
            mensajeError += ': ' + error.message;
        }

        showError(mensajeError);
    } finally {
        // Restaurar el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
    }
}

// Manejar el registro
async function handleRegister(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    console.log('Ejecutando handleRegister...');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector('.auth-button');

    console.log('Datos del formulario:', { name, email, password, terms });

    // Deshabilitar el botón durante el proceso
    submitButton.disabled = true;
    submitButton.textContent = 'Creando cuenta...';

    // Limpiar mensajes de error previos
    hideError();

    try {
        // Validaciones
        if (!name || !email || !password) {
            throw new Error('Por favor, completa todos los campos');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        if (!terms) {
            throw new Error('Debes aceptar los términos y condiciones');
        }

        if (!supabaseClient) {
            throw new Error('Error de conexión. Por favor, recarga la página.');
        }

        // Verificar si el usuario viene de Hotmart (premium)
        const urlParams = new URLSearchParams(window.location.search);
        const isPremium = urlParams.get('premium') === 'true';

        // Registrar usuario en Supabase
        console.log('Registrando usuario:', { email, name, isPremium });

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

        if (error) throw error;

        // Guardar información del usuario en localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        // Verificar si se requiere confirmación de correo
        if (data?.user?.identities?.length === 0 || data?.user?.email_confirmed_at) {
            // El usuario ya existe o no requiere confirmación de correo
            if (isPremium) {
                showSuccess('¡Registro exitoso! Tu cuenta premium ha sido activada.');

                // Redirigir al dashboard después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                // Mostrar mensaje de éxito y redirigir
                showSuccess('¡Registro exitoso!');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        } else {
            // Se requiere confirmación de correo
            showSuccess('Se ha enviado un enlace de confirmación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y confirma tu cuenta.');
        }
    } catch (error) {
        console.error('Error al registrar:', error);

        // Mostrar mensaje de error amigable
        let mensajeError = 'Error al registrar';

        if (error.message.includes('already registered')) {
            mensajeError = 'Este correo electrónico ya está registrado';
        } else if (error.message.includes('password')) {
            mensajeError = 'La contraseña no cumple con los requisitos de seguridad';
        } else if (error.message.includes('Database error saving new user')) {
            mensajeError = 'Error al guardar el usuario en la base de datos. Es posible que el esquema de la base de datos no esté correctamente configurado.';
            console.error('Este error suele ocurrir cuando el trigger para crear el perfil de usuario no está funcionando correctamente.');
            console.error('Por favor, verifica que hayas ejecutado el esquema SQL en Supabase.');
        } else {
            mensajeError = error.message;
        }

        showError(mensajeError);
    } finally {
        // Restaurar el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Crear Cuenta';
    }
}

// Funciones auxiliares para mostrar mensajes
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('success');
        errorMessage.style.display = 'block';
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('success');
        errorMessage.style.display = 'block';
    } else {
        alert(message);
    }
}

function hideError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}
