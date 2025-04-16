document.addEventListener('DOMContentLoaded', () => {
    // Navegación suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });
    // Configuración de Supabase (si está disponible)
    let supabase;
    try {
        const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';
        supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
    }

    // Verificar si el usuario está autenticado (versión simplificada)
    function checkUserAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            return {
                email: localStorage.getItem('userEmail'),
                user_metadata: {
                    full_name: localStorage.getItem('userName')
                }
            };
        }
        return null;
    }

    // Verificar si el usuario es premium (versión simplificada)
    function checkUserPremium() {
        return localStorage.getItem('isPremium') === 'true';
    }

    // Gestión de popups
    const benefitsPopup = document.getElementById('benefits-popup');
    const premiumPopup = document.getElementById('premium-popup');
    const closeButton = document.getElementById('close-benefits');
    const closePremiumButton = document.getElementById('close-premium');
    const getPremiumButton = document.getElementById('get-premium');

    // Mostrar popup de bienvenida después de 1 segundo
    setTimeout(() => {
        benefitsPopup.classList.add('active');
    }, 1000);

    // Cerrar popup de bienvenida
    closeButton.addEventListener('click', () => {
        benefitsPopup.classList.remove('active');
    });

    // Cerrar popup de bienvenida al hacer clic fuera
    benefitsPopup.addEventListener('click', (e) => {
        if (e.target === benefitsPopup) {
            benefitsPopup.classList.remove('active');
        }
    });

    // Cerrar popup premium
    if (closePremiumButton) {
        closePremiumButton.addEventListener('click', () => {
            premiumPopup.classList.remove('active');
        });
    }

    // Cerrar popup premium al hacer clic fuera
    if (premiumPopup) {
        premiumPopup.addEventListener('click', (e) => {
            if (e.target === premiumPopup) {
                premiumPopup.classList.remove('active');
            }
        });
    }

    // Botón para obtener premium
    if (getPremiumButton) {
        getPremiumButton.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // Botón para iniciar sesión desde el popup premium
    const loginPremiumButton = document.getElementById('login-premium');
    if (loginPremiumButton) {
        loginPremiumButton.addEventListener('click', () => {
            window.location.href = 'login_fixed.html';
        });
    }

    // Botón CTA en la sección de precios
    const premiumCtaButton = document.getElementById('premium-cta');
    if (premiumCtaButton) {
        premiumCtaButton.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // Botón de compartir
    const shareButton = document.getElementById('share-btn');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            // Implementación básica de compartir
            if (navigator.share && generatedImage.src) {
                navigator.share({
                    title: 'Mi imagen generada con Flasti AI',
                    text: 'Mira esta imagen que creé con Flasti AI',
                    url: generatedImage.src
                }).catch(error => {
                    console.error('Error al compartir:', error);
                });
            } else {
                alert('Tu navegador no soporta la función de compartir. Puedes descargar la imagen y compartirla manualmente.');
            }
        });
    }

    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const generatedImageContainer = document.getElementById('generated-image-container');
    const generatedImage = document.getElementById('generated-image');
    const downloadBtn = document.getElementById('download-btn');
    const imageGallery = document.getElementById('image-gallery');

    let isGenerating = false;
    const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
    const API_KEY = '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';

    const resetImageContainer = () => {
        generatedImageContainer.style.display = 'none';
        generatedImage.src = '';
        generatedImage.style.opacity = '1';
    };

    const showError = (message) => {
        console.error('Error:', message);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.background = 'rgba(255, 107, 107, 0.1)';

        const container = document.querySelector('.container');
        container.insertBefore(errorDiv, imageGallery);

        setTimeout(() => errorDiv.remove(), 5000);
    };

    const setLoadingState = (loading) => {
        isGenerating = loading;
        generateBtn.disabled = loading;
        generateBtn.textContent = loading ? 'Generando...' : 'Generar';
        promptInput.disabled = loading;
        if (loading) {
            generateBtn.style.opacity = '0.7';
            generateBtn.style.cursor = 'not-allowed';
        } else {
            generateBtn.style.opacity = '1';
            generateBtn.style.cursor = 'pointer';
        }
    };

    // Contador de imágenes generadas
    let imageCount = 0;

    // Función para cargar el contador de imágenes del usuario
    async function loadImageCount() {
        const user = await checkUserAuth();

        if (user) {
            // Si el usuario está autenticado, obtener el contador de la base de datos
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('image_count')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                // Si el usuario tiene un contador en la base de datos, usarlo
                if (data && data.image_count !== null) {
                    imageCount = data.image_count;
                    return;
                }
            } catch (error) {
                console.error('Error al cargar contador de imágenes:', error);
            }
        }

        // Si no hay usuario o hubo un error, usar el contador local
        imageCount = parseInt(localStorage.getItem('flasti_image_count') || '0');
    }

    // Cargar el contador al iniciar
    loadImageCount();

    // Función para verificar si el usuario puede generar más imágenes
    async function canGenerateMoreImages() {
        // Si el usuario está autenticado y es premium, puede generar ilimitadas
        const isPremium = await checkUserPremium();
        if (isPremium) return true;

        // Si no es premium, verificar el límite de 2 imágenes
        return imageCount < 2;
    }

    // Función para mostrar el popup de premium
    function showPremiumPopup() {
        if (premiumPopup) {
            premiumPopup.classList.add('active');
        }
    }

    // Función para incrementar el contador de imágenes
    async function incrementImageCount() {
        imageCount++;

        // Guardar en localStorage como respaldo
        localStorage.setItem('flasti_image_count', imageCount.toString());

        // Si el usuario está autenticado, actualizar en la base de datos
        const user = await checkUserAuth();
        if (user) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .update({ image_count: imageCount })
                    .eq('id', user.id);

                if (error) throw error;
            } catch (error) {
                console.error('Error al actualizar contador de imágenes:', error);
            }
        }

        // Actualizar contador en modo desarrollo
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            imageCountElement.textContent = imageCount.toString();
        }
    }

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            showError('Por favor, ingresa una descripción para la imagen.');
            return;
        }

        if (isGenerating) return;

        // Verificar si el usuario puede generar más imágenes
        const canGenerate = await canGenerateMoreImages();
        if (!canGenerate) {
            showPremiumPopup();
            return;
        }

        let response;
        try {
            setLoadingState(true);
            resetImageContainer();

            generatedImageContainer.style.display = 'block';
            generatedImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ3IDIgMiA2LjQ3IDIgMTJzNC40NyAxMCAxMCAxMCAxMC00LjQ3IDEwLTEwUzE3LjUzIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PC9zdmc+';
            generatedImage.style.opacity = '0.5';

            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'image/*'
                },
                body: JSON.stringify({
                    inputs: prompt
                }),
                mode: 'cors'
            });

            if (response.status === 503) {
                const retryAfter = response.headers.get('Retry-After') || 20;
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                throw new Error('El modelo se está cargando. Por favor, intenta de nuevo en unos segundos.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                const errorMessage = errorData.error || `Error en la generación de la imagen: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('image')) {
                console.error('Invalid content type:', contentType);
                throw new Error('La respuesta del servidor no es una imagen válida');
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            generatedImage.src = imageUrl;
            generatedImage.style.opacity = '1';
            generatedImage.onload = () => {
                generatedImageContainer.style.display = 'block';
                generatedImageContainer.scrollIntoView({ behavior: 'smooth' });

                // Incrementar el contador de imágenes solo si la generación fue exitosa
                incrementImageCount();

                // Si el usuario ha generado 2 imágenes, mostrar el popup de premium
                if (imageCount >= 2) {
                    setTimeout(() => {
                        showPremiumPopup();
                    }, 1500); // Mostrar después de 1.5 segundos para que el usuario vea la imagen primero
                }
            };
            generatedImage.onerror = () => {
                throw new Error('Error al cargar la imagen generada');
            };
        } catch (error) {
            console.error('Error al generar la imagen:', error);
            if (response) {
                console.error('Response status:', response.status);
                console.error('Response headers:', Object.fromEntries(response.headers));
                console.error('Response type:', response.type);
            }
            showError(error.message || 'Error al generar la imagen. Por favor, intenta de nuevo.');
            resetImageContainer();
        } finally {
            setLoadingState(false);
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (generatedImage.src) {
            downloadImage(generatedImage.src);
        }
    });

    function downloadImage(url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imagen-generada.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !generateBtn.disabled) {
            generateBtn.click();
        }
    });

    // Botón para ir a login/registro
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Verificar si hay un usuario autenticado y actualizar la UI
    function updateUIForUser() {
        const user = checkUserAuth();
        const loginButton = document.getElementById('login-button');
        const userInfo = document.getElementById('user-info');
        const imageCountElement = document.getElementById('image-count');

        // Cargar el contador de imágenes actualizado
        loadImageCount();

        // Actualizar contador en modo desarrollo
        if (imageCountElement) {
            imageCountElement.textContent = localStorage.getItem('flasti_image_count') || '0';
        }

        if (user) {
            // Si el usuario está autenticado
            if (loginButton && userInfo) {
                loginButton.style.display = 'none';
                userInfo.style.display = 'flex';
                document.getElementById('user-name').textContent = user.user_metadata?.full_name || 'Usuario';
            }

            // Verificar si el usuario es premium y resetear el contador si es necesario
            const isPremium = checkUserPremium();
            if (isPremium && imageCount >= 2) {
                // Si el usuario es premium, no necesitamos mostrar el límite
                imageCount = 0;

                // Actualizar en localStorage y en la base de datos
                localStorage.setItem('flasti_image_count', '0');

                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ image_count: 0 })
                        .eq('id', user.id);

                    if (error) throw error;
                } catch (error) {
                    console.error('Error al resetear contador de imágenes:', error);
                }
            }
        }
    }

    // Actualizar UI al cargar la página
    updateUIForUser();
});