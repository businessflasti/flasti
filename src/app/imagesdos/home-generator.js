// Configuración de la API
const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
const API_KEY = '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';

// Variables globales
let isGenerating = false;
let imageCount = 0;
let isPremium = false;
let currentUser = null;

// Elementos del DOM
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const loadingIndicator = document.getElementById('loading-indicator');
const saveBtn = document.getElementById('save-btn');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const premiumPopup = document.getElementById('premium-popup');

// Inicializar Supabase
let supabaseClient;
try {
    if (typeof supabase !== 'undefined') {
        const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Cliente Supabase inicializado correctamente');
    }
} catch (error) {
    console.error('Error al inicializar Supabase:', error);
}

// Función para verificar autenticación
async function checkAuth() {
    try {
        if (!supabaseClient) return false;

        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (error || !user) {
            console.log('Usuario no autenticado');
            return false;
        }

        console.log('Usuario autenticado:', user.email);
        currentUser = user;

        // Verificar si el usuario es premium
        const { data, error: profileError } = await supabaseClient
            .from('profiles')
            .select('is_premium, image_count')
            .eq('id', user.id)
            .single();

        if (!profileError && data) {
            isPremium = data.is_premium || false;
            imageCount = data.image_count || 0;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return false;
    }
}

// Función para cargar contador de imágenes
async function loadImageCount() {
    // Si el usuario está autenticado, obtener contador de la base de datos
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        // Si no hay usuario, usar el contador local
        imageCount = parseInt(localStorage.getItem('flasti_image_count') || '0');
    }

    console.log('Contador de imágenes cargado:', imageCount);
}

// Función para verificar si el usuario puede generar más imágenes
async function canGenerateMoreImages() {
    // Si el usuario está autenticado y es premium, puede generar ilimitadas
    if (isPremium) return true;

    console.log('Verificando límite de imágenes. Contador actual:', imageCount);

    // Si no es premium, verificar el límite de 5 imágenes
    // Permitir exactamente 5 imágenes gratuitas
    if (imageCount >= 5) {
        console.log('Límite alcanzado. Mostrando popup premium...');
        // Mostrar el popup de premium cuando intenta generar la sexta imagen
        showPremiumPopup();

        // Mostrar mensaje de límite alcanzado y deshabilitar el botón
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.5';
            generateBtn.style.cursor = 'not-allowed';
            generateBtn.innerHTML = '<i class="fas fa-lock"></i> Límite Alcanzado';
        }

        // Mostrar mensaje en el contenedor de resultados
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="empty-result limit-reached">
                    <i class="fas fa-exclamation-circle empty-icon" style="color: #ff6b6b;"></i>
                    <p>Has alcanzado el límite de imágenes gratuitas</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Actualiza a Premium para generar imágenes ilimitadas</p>
                </div>
            `;
        }

        return false;
    } else {
        return true;
    }
}

// Función para mostrar el popup de premium
function showPremiumPopup() {
    console.log('Mostrando popup premium...');

    // Verificar si ya existe un popup
    if (document.querySelector('.premium-popup')) {
        console.log('Popup ya existe, no creando uno nuevo');
        return; // Evitar crear múltiples popups
    }

    // Crear el popup
    const popup = document.createElement('div');
    popup.className = 'premium-popup';
    popup.id = 'premium-popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(19, 17, 28, 0.95)';
    popup.style.backdropFilter = 'blur(10px)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '9999';

    // Contenido del popup
    popup.innerHTML = `
        <div style="background: rgba(30, 27, 46, 0.9); border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.3); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 1.5rem; border-bottom: 1px solid rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: space-between;">
                <h2 style="font-size: 1.5rem; margin: 0; display: flex; align-items: center; gap: 10px;"><i class="fas fa-crown" style="color: #a855f7;"></i> ¡Desbloquea Todo el Potencial!</h2>
            </div>

            <p style="padding: 1.5rem 1.5rem 0; text-align: center; font-size: 1.1rem;">Has alcanzado el límite de imágenes gratuitas</p>

            <div style="padding: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(168, 85, 247, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #a855f7;">
                        <i class="fas fa-infinity"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">Generación Ilimitada</h4>
                        <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin: 0;">Crea todas las imágenes que desees sin restricciones</p>
                    </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(168, 85, 247, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #a855f7;">
                        <i class="fas fa-palette"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">Alta Calidad</h4>
                        <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin: 0;">Accede a la máxima calidad de generación de imágenes</p>
                    </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(168, 85, 247, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #a855f7;">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">Almacenamiento</h4>
                        <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin: 0;">Guarda todas tus creaciones en la nube</p>
                    </div>
                </div>
            </div>

            <div style="text-align: center; padding: 1.5rem;">
                <span style="font-size: 3rem; font-weight: 700; background: linear-gradient(90deg, #6e8efb, #a777e3); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$5</span>
                <span style="font-size: 1rem; color: rgba(255, 255, 255, 0.7);">pago único</span>
            </div>

            <div style="padding: 0 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <a href="checkout.html" id="premium-btn" style="padding: 1rem; background: linear-gradient(90deg, #6e8efb, #a777e3); border-radius: 8px; color: white; font-weight: 500; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; text-decoration: none;">
                    <i class="fas fa-crown"></i> Obtener Premium
                </a>
                <button id="close-premium-popup" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border: none; border-radius: 8px; text-align: center; transition: all 0.3s ease; color: white; cursor: pointer;">
                    Continuar con Plan Gratuito
                </button>
            </div>
        </div>
    `;

    // Añadir el popup al body
    document.body.appendChild(popup);

    // Configurar el botón para cerrar el popup
    const closeButton = document.getElementById('close-premium-popup');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Cerrando popup premium...');
            const popup = document.getElementById('premium-popup');
            if (popup) {
                popup.remove();
                console.log('Popup removido correctamente');
            } else {
                console.log('No se encontró el popup para remover');
            }
        });
    } else {
        console.log('No se encontró el botón para cerrar el popup');
    }

    // Evitar que se cierre el popup haciendo clic fuera
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            // Hacer que el contenido parpadee para indicar que debe usar los botones
            const content = popup.querySelector('div');
            content.style.animation = 'pulse 0.5s';

            // Definir la animación de pulso
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
                    50% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0.4); }
                }
            `;
            document.head.appendChild(style);

            // Eliminar la animación después de 0.5 segundos
            setTimeout(() => {
                content.style.animation = '';
                style.remove();
            }, 500);
        }
    });
}

// Función para incrementar el contador de imágenes
async function incrementImageCount() {
    imageCount++;

    console.log('Incrementando contador de imágenes. Nuevo valor:', imageCount);

    // Guardar en localStorage como respaldo
    localStorage.setItem('flasti_image_count', imageCount.toString());

    // Si el usuario está autenticado, actualizar en la base de datos
    if (currentUser) {
        try {
            const { error } = await supabaseClient
                .from('profiles')
                .update({ image_count: imageCount })
                .eq('id', currentUser.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al actualizar contador de imágenes:', error);
        }
    }
}

// Función para generar imagen
async function generateImage() {
    if (!promptInput || !generateBtn || !resultContainer || !loadingIndicator) {
        console.error('Elementos no encontrados');
        return;
    }

    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Por favor, ingresa una descripción para la imagen');
        return;
    }

    if (isGenerating) return;

    // Verificar límite de imágenes para usuarios gratuitos
    const canGenerate = await canGenerateMoreImages();
    if (!canGenerate) {
        return;
    }

    isGenerating = true;

    // Actualizar UI
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    loadingIndicator.style.display = 'flex';

    // Limpiar resultado anterior
    resultContainer.innerHTML = '';
    if (saveBtn) saveBtn.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = 'none';

    try {
        // Llamar a la API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'image/*'
            },
            body: JSON.stringify({
                inputs: prompt
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la generación: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Mostrar imagen
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = prompt;
        img.className = 'result-image';
        resultContainer.innerHTML = '';
        resultContainer.appendChild(img);

        // Mostrar botones de acción (solo descargar y compartir)
        if (saveBtn) saveBtn.style.display = 'none'; // Ocultar botón de guardar
        if (downloadBtn) downloadBtn.style.display = 'flex';
        if (shareBtn) shareBtn.style.display = 'flex';

        // Incrementar contador de imágenes
        await incrementImageCount();

    } catch (error) {
        console.error('Error al generar imagen:', error);
        showNotification('Error al generar la imagen. Por favor, intenta de nuevo.');

        resultContainer.innerHTML = `
            <div class="empty-result error">
                <i class="fas fa-exclamation-circle empty-icon"></i>
                <p>Error al generar la imagen</p>
                <small>${error.message}</small>
            </div>
        `;
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generar Imagen';
        loadingIndicator.style.display = 'none';
    }
}

// Función para descargar imagen
function downloadImage() {
    if (!resultContainer) {
        console.error('Elemento no encontrado');
        return;
    }

    const img = resultContainer.querySelector('img');
    if (!img) {
        showNotification('No hay imagen para descargar');
        return;
    }

    try {
        // Crear enlace de descarga
        const a = document.createElement('a');
        a.href = img.src;
        a.download = `flasti-image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showNotification('Imagen descargada correctamente', 'success');
    } catch (error) {
        console.error('Error al descargar imagen:', error);
        showNotification('Error al descargar la imagen');
    }
}

// Función para compartir imagen
function shareImage() {
    if (!resultContainer) {
        console.error('Elemento no encontrado');
        return;
    }

    const img = resultContainer.querySelector('img');
    if (!img) {
        showNotification('No hay imagen para compartir');
        return;
    }

    // Verificar si la API de compartir está disponible
    if (navigator.share) {
        fetch(img.src)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], 'flasti-image.jpg', { type: 'image/jpeg' });

                navigator.share({
                    title: 'Imagen creada con Flasti Images',
                    text: 'Mira esta imagen que creé con Flasti Images',
                    files: [file]
                })
                .then(() => {
                    showNotification('Imagen compartida correctamente', 'success');
                })
                .catch(error => {
                    console.error('Error al compartir:', error);
                    showNotification('Error al compartir la imagen');
                });
            })
            .catch(error => {
                console.error('Error al preparar la imagen para compartir:', error);
                showNotification('Error al preparar la imagen para compartir');
            });
    } else {
        showNotification('Tu navegador no soporta la función de compartir');
    }
}

// Función para guardar imagen
async function saveImage() {
    if (!currentUser) {
        showNotification('Debes iniciar sesión para guardar imágenes');
        return;
    }

    if (!resultContainer || !promptInput) {
        console.error('Elementos no encontrados');
        return;
    }

    const img = resultContainer.querySelector('img');
    if (!img) {
        showNotification('No hay imagen para guardar');
        return;
    }

    try {
        // Convertir imagen a Blob
        const response = await fetch(img.src);
        const blob = await response.blob();

        // Subir imagen a Supabase Storage
        const fileName = `image_${Date.now()}.jpg`;
        const filePath = `${currentUser.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('images')
            .upload(filePath, blob, {
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            throw uploadError;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabaseClient
            .storage
            .from('images')
            .getPublicUrl(filePath);

        // Guardar referencia en la base de datos
        const { error: insertError } = await supabaseClient
            .from('images')
            .insert({
                user_id: currentUser.id,
                prompt: promptInput.value.trim(),
                image_url: publicUrl
            });

        if (insertError) {
            throw insertError;
        }

        // Actualizar contador de imágenes guardadas
        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('saved_count')
            .eq('id', currentUser.id)
            .single();

        if (!profileError) {
            const savedCount = (profileData.saved_count || 0) + 1;
            await supabaseClient
                .from('profiles')
                .update({ saved_count: savedCount })
                .eq('id', currentUser.id);
        }

        showNotification('Imagen guardada correctamente', 'success');

    } catch (error) {
        console.error('Error al guardar imagen:', error);
        showNotification('Error al guardar la imagen');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Lista de sugerencias posibles (excluyendo las de los ejemplos)
const allSuggestions = [
    // Excluimos: "Paisaje futurista con edificios flotantes y cielo púrpura"
    // Excluimos: "Gato con gafas de sol en una playa tropical"
    // Excluimos: "Bosque encantado con hadas y hongos brillantes"

    // Nuevas sugerencias que no coinciden con los ejemplos
    "Retrato estilo anime de un samurai",
    "Naturaleza fantástica con cascadas brillantes",
    "Ciudad cyberpunk bajo la lluvia",
    "Dragón de cristal en un cielo estrellado",
    "Astronauta en un planeta alienígena",
    "Robot vintage en un campo de flores",
    "Castillo medieval flotando entre nubes",
    "Sirena en las profundidades del océano",
    "Guerrero samurai bajo un árbol de cerezo",
    "Nave espacial atravesando un agujero de gusano",
    "Unicornio galáctico con melena de estrellas",
    "Ciudad steampunk con dirigibles",
    "Templo antiguo cubierto de vegetación",
    "Lobo místico con ojos brillantes",
    "Biblioteca infinita con escaleras imposibles",
    "Portal mágico entre dos mundos",
    "Caballero enfrentando a un dragón",
    "Laboratorio de alquimista con pociones brillantes",
    "Isla flotante con cascadas",
    "Montañas nevadas al atardecer",
    "Desierto con oasis y palmeras",
    "Ballena voladora sobre un océano de nubes",
    "Jardín zen con piedras levitantes",
    "Reloj de arena con galaxias en su interior",
    "Ciudad submarina con cúpulas de cristal",
    "Elefante mecánico con engranajes dorados",
    "Bosque de cristal bajo la luz de la luna",
    "Tren volador atravesando montañas",
    "Tigre de fuego en la selva nocturna"
];

// Función para obtener sugerencias aleatorias
function getRandomSuggestions() {
    // Verificar si hay sugerencias guardadas y si han pasado 3 horas
    const savedSuggestions = localStorage.getItem('flasti_suggestions');
    const lastUpdate = localStorage.getItem('flasti_suggestions_time');
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

    if (savedSuggestions && lastUpdate && (now - parseInt(lastUpdate)) < threeHours) {
        // Usar las sugerencias guardadas si no han pasado 3 horas
        return JSON.parse(savedSuggestions);
    }

    // Obtener 6 sugerencias aleatorias
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    // Guardar las sugerencias y la hora actual
    localStorage.setItem('flasti_suggestions', JSON.stringify(selected));
    localStorage.setItem('flasti_suggestions_time', now.toString());

    return selected;
}

// Función para mostrar las sugerencias en la UI
function displaySuggestions() {
    const suggestions = getRandomSuggestions();
    const container = document.querySelector('.suggestion-chips');

    if (!container) return;

    // Limpiar el contenedor
    container.innerHTML = '';

    // Añadir las sugerencias
    suggestions.forEach(suggestion => {
        const chip = document.createElement('span');
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion;
        chip.addEventListener('click', () => applySuggestion(suggestion));
        container.appendChild(chip);
    });
}

// Función para aplicar sugerencias
function applySuggestion(suggestion) {
    if (!promptInput) return;

    promptInput.value = suggestion;
    promptInput.focus();
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar contador de imágenes
    await loadImageCount();

    // Mostrar sugerencias aleatorias
    displaySuggestions();

    // Configurar botón de generación
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }

    // Configurar botón de guardar
    if (saveBtn) {
        saveBtn.addEventListener('click', saveImage);
    }

    // Configurar botón de descargar
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // Configurar botón de compartir
    if (shareBtn) {
        shareBtn.addEventListener('click', shareImage);
    }

    // Permitir generar con Enter
    if (promptInput) {
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateImage();
            }
        });
    }

    // Verificar si se debe actualizar las sugerencias cada 3 horas
    // incluso si el usuario no recarga la página
    setInterval(() => {
        displaySuggestions();
    }, 3 * 60 * 60 * 1000); // Cada 3 horas
});
