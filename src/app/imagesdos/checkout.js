document.addEventListener('DOMContentLoaded', () => {
    // Capturar el parámetro ref de afiliado
    const affiliateRef = captureAffiliateRef();

    // Si hay un afiliado, registrar la visita a checkout
    if (affiliateRef) {
        console.log('Afiliado detectado en checkout:', affiliateRef);
        console.log('URL de checkout: https://flasti.com/images/checkout');
        // La función trackCheckoutVisit se llamará automáticamente desde affiliate-tracking.js
    }
    // Cargar el formulario de Hotmart
    const hotmartForm = document.getElementById('hotmart-form');

    // Función para manejar el indicador de desplazamiento
    if (hotmartForm) {
        hotmartForm.addEventListener('scroll', function() {
            // Calcular si el usuario ha llegado al final del formulario
            const isAtBottom = this.scrollHeight - this.scrollTop <= this.clientHeight + 50;

            // Añadir o quitar una clase para controlar la visibilidad del indicador
            if (isAtBottom) {
                this.classList.add('scrolled-to-bottom');
            } else {
                this.classList.remove('scrolled-to-bottom');
            }
        });
    }

    if (hotmartForm) {
        // Verificar si el usuario ya está autenticado
        checkUserAuth().then(user => {
            if (user) {
                // Si el usuario ya está autenticado, mostrar un mensaje informativo
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'user-message';
                userMessageDiv.innerHTML = `Estás conectado como <strong>${user.email}</strong><br>Al completar el pago, tu cuenta será actualizada automáticamente a Premium.<br><small style="opacity: 0.8; margin-top: 5px; display: block;">Desplázate hacia abajo para ver todo el formulario de pago.</small>`;

                // Insertar el mensaje antes del formulario de Hotmart
                const inlineCheckout = document.getElementById('inline_checkout');
                if (inlineCheckout) {
                    inlineCheckout.parentNode.insertBefore(userMessageDiv, inlineCheckout);
                }
            } else {
                // Si el usuario no está autenticado, mostrar un mensaje informativo
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'user-message';
                userMessageDiv.innerHTML = 'Después de completar el pago, serás redirigido para acceder a tu cuenta Premium.<br><small style="opacity: 0.8; margin-top: 5px; display: block;">Desplázate hacia abajo para ver todo el formulario de pago.</small>';

                // Insertar el mensaje antes del formulario de Hotmart
                const inlineCheckout = document.getElementById('inline_checkout');
                if (inlineCheckout) {
                    inlineCheckout.parentNode.insertBefore(userMessageDiv, inlineCheckout);
                }
            }

            // Obtener el ID del afiliado
            const affiliateRef = getCurrentAffiliateRef();

            // Opciones para el formulario de Hotmart
            const hotmartOptions = {
                offer: 'exk9eec7',
                width: '100%',
                height: 'auto',
                responsive: true
            };

            // Si hay un afiliado, agregar a las opciones
            if (affiliateRef) {
                hotmartOptions.aff = affiliateRef;
                hotmartOptions.src = 'flasti';
            }

            // Inicializar el formulario de Hotmart con opciones personalizadas
            const elements = checkoutElements.init('inlineCheckout', hotmartOptions);
            elements.mount('#inline_checkout');

        }).catch(error => {
            console.error('Error al verificar autenticación:', error);
            // Obtener el ID del afiliado
            const affiliateRef = getCurrentAffiliateRef();

            // Opciones para el formulario de Hotmart
            const hotmartOptions = {
                offer: 'exk9eec7',
                width: '100%',
                height: 'auto',
                responsive: true
            };

            // Si hay un afiliado, agregar a las opciones
            if (affiliateRef) {
                hotmartOptions.aff = affiliateRef;
                hotmartOptions.src = 'flasti';
            }

            // En caso de error, inicializar el formulario de Hotmart de todos modos
            const elements = checkoutElements.init('inlineCheckout', hotmartOptions);
            elements.mount('#inline_checkout');
        });
    }

    // Verificar si hay un parámetro de éxito en la URL (para cuando Hotmart redireccione de vuelta)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'approved') {
        // Verificar si el usuario ya está autenticado
        checkUserAuth().then(async user => {
            if (user) {
                // Si el usuario ya está autenticado, actualizar su cuenta a premium
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ is_premium: true })
                        .eq('id', user.id);

                    if (error) throw error;

                    // Mostrar mensaje de éxito
                    hotmartForm.innerHTML = `
                        <div class="success-message">
                            <h3>¡Felicidades!</h3>
                            <p>Tu cuenta ha sido actualizada a Premium correctamente.</p>
                            <p>Ahora puedes disfrutar de todas las funciones premium.</p>
                            <a href="dashboard.html" class="dashboard-link">Ir a mi panel</a>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error al actualizar a premium:', error);
                    hotmartForm.innerHTML = `
                        <div class="error-message">
                            <h3>Error</h3>
                            <p>Hubo un problema al actualizar tu cuenta a Premium.</p>
                            <p>Por favor, contacta con soporte.</p>
                            <a href="dashboard.html" class="dashboard-link">Ir a mi panel</a>
                        </div>
                    `;
                }
            } else {
                // Si el usuario no está autenticado, redirigir a la página de registro
                window.location.href = 'register.html?premium=true';
            }
        }).catch(error => {
            console.error('Error al verificar autenticación:', error);
            // En caso de error, redirigir a la página de registro
            window.location.href = 'register.html?premium=true';
        });
    }
});

// Función para verificar si el usuario está autenticado
async function checkUserAuth() {
    // Configuración de Supabase
    const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';
    const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

    if (!supabase) return null;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return null;
    }
}
