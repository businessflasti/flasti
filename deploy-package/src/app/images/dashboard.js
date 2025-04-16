// Configuración de Supabase
const SUPABASE_URL = 'https://lflxpqryawqrbpdxvmka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbHhwcXJ5YXdxcmJwZHh2bWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTI3NDEsImV4cCI6MjA1ODk4ODc0MX0.QMmPkbK9T7ZHZygm5eEdrNA5nTLBWx-3CRw5TdpGaB0';

// API de Hugging Face
const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
const API_KEY = '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';

// Variables globales
let supabaseClient;
let isGenerating = false;
let imageCount = 0;
let isPremium = false;
let currentUser = null;

// Inicializar Supabase
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Cliente Supabase inicializado correctamente');
    } else {
        console.error('Error: Supabase no está definido');
        alert('Error al inicializar la autenticación. Por favor, recarga la página.');
    }
} catch (error) {
    console.error('Error al inicializar Supabase:', error);
    alert('Error al inicializar la autenticación. Por favor, recarga la página.');
}

// Función para mostrar errores
function showNotification(message, type = 'error') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Añadir al DOM
    document.body.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    // Configurar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Función para verificar autenticación
async function checkAuth() {
    try {
        if (!supabaseClient) {
            console.error('Cliente Supabase no inicializado');
            window.location.href = 'login.html';
            return false;
        }

        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (error) {
            console.error('Error al verificar autenticación:', error);
            window.location.href = 'login.html';
            return false;
        }

        if (!user) {
            console.log('Usuario no autenticado, redirigiendo a login...');
            window.location.href = 'login.html';
            return false;
        }

        console.log('Usuario autenticado:', user.email);
        currentUser = user;
        return true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Función para cargar datos del usuario
async function loadUserData() {
    if (!currentUser) return;

    try {
        // Mostrar nombre de usuario
        const userName = document.getElementById('user-name');
        const profileName = document.getElementById('profile-name');
        const profileNameDisplay = document.getElementById('profile-name-display');

        if (userName) userName.textContent = currentUser.user_metadata?.name || currentUser.email.split('@')[0];
        if (profileName) profileName.textContent = currentUser.user_metadata?.name || currentUser.email.split('@')[0];
        if (profileNameDisplay) profileNameDisplay.textContent = currentUser.user_metadata?.name || currentUser.email.split('@')[0];

        // Mostrar email
        const profileEmail = document.getElementById('profile-email');
        if (profileEmail) profileEmail.textContent = currentUser.email;

        // Mostrar fecha de registro
        const profileJoined = document.getElementById('profile-joined');
        if (profileJoined && currentUser.created_at) {
            const joinDate = new Date(currentUser.created_at);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            profileJoined.textContent = joinDate.toLocaleDateString('es-ES', options);
        }

        // Verificar si el usuario es premium
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('is_premium, image_count, created_at')
            .eq('id', currentUser.id)
            .single();

        if (error) {
            console.error('Error al cargar datos del perfil:', error);
            return;
        }

        // Todos los usuarios registrados se consideran premium
        isPremium = true;
        imageCount = data.image_count || 0;

        // Actualizar UI según el plan
        const userPlan = document.getElementById('user-plan');
        const profilePlan = document.getElementById('profile-plan-badge');

        if (userPlan) {
            userPlan.textContent = 'Premium'; // Siempre mostrar Premium
            userPlan.className = 'user-plan premium';
        }

        if (profilePlan) {
            profilePlan.textContent = 'Plan Premium'; // Siempre mostrar Plan Premium
            profilePlan.className = 'plan-badge premium';
        }

        // Cargar estadísticas
        await loadStatistics();

        // Cargar galería
        await loadGallery();

        // Configurar actualización en tiempo real
        setupRealtimeUpdates();

    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        showNotification('Error al cargar datos del usuario');
    }
}

// Función para cargar estadísticas
async function loadStatistics() {
    if (!currentUser) return;

    try {
        const imagesCreated = document.getElementById('images-created');
        const imagesSaved = document.getElementById('images-saved');
        const imagesDownloaded = document.getElementById('images-downloaded');

        // Obtener estadísticas desde Supabase
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('image_count, saved_count, download_count')
            .eq('id', currentUser.id)
            .single();

        if (error) {
            console.error('Error al cargar estadísticas:', error);
            return;
        }

        // Actualizar UI con animación
        updateStatWithAnimation(imagesCreated, data.image_count || 0);
        updateStatWithAnimation(imagesSaved, data.saved_count || 0);
        updateStatWithAnimation(imagesDownloaded, data.download_count || 0);

        // Actualizar contador global
        imageCount = data.image_count || 0;

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Función para actualizar estadística con animación
function updateStatWithAnimation(element, newValue) {
    if (!element) return;

    const currentValue = parseInt(element.textContent) || 0;

    // Si el valor no ha cambiado, no hacer nada
    if (currentValue === newValue) return;

    // Añadir clase para la animación
    element.classList.add('stat-updating');

    // Actualizar el valor
    element.textContent = newValue;

    // Quitar la clase después de la animación
    setTimeout(() => {
        element.classList.remove('stat-updating');
    }, 1000);
}

// Función para configurar actualizaciones en tiempo real
function setupRealtimeUpdates() {
    // Cancelar suscripción anterior si existe
    if (window.realtimeSubscription) {
        supabaseClient.removeSubscription(window.realtimeSubscription);
    }

    // Suscribirse a cambios en la tabla profiles
    window.realtimeSubscription = supabaseClient
        .channel('profile-changes')
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${currentUser.id}` },
            payload => {
                console.log('Perfil actualizado:', payload);
                // Actualizar estadísticas
                loadStatistics();
            }
        )
        .subscribe();

    // Suscribirse a cambios en la tabla images
    window.imagesSubscription = supabaseClient
        .channel('images-changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'images', filter: `user_id=eq.${currentUser.id}` },
            payload => {
                console.log('Cambio en imágenes:', payload);
                // Actualizar galería y estadísticas
                loadGallery();
                loadStatistics();
            }
        )
        .subscribe();
}

// Función para cargar galería
async function loadGallery() {
    if (!currentUser) return;

    const galleryContainer = document.getElementById('history-gallery');
    if (!galleryContainer) return;

    try {
        // Limpiar contenedor
        galleryContainer.innerHTML = '';

        // Obtener imágenes desde Supabase
        const { data, error } = await supabaseClient
            .from('images')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al cargar galería:', error);
            showNotification('Error al cargar tu galería de imágenes');
            return;
        }

        // Mostrar mensaje si no hay imágenes
        if (!data || data.length === 0) {
            galleryContainer.innerHTML = `
                <div class="empty-gallery">
                    <i class="fas fa-images empty-icon"></i>
                    <p>Aún no tienes imágenes guardadas</p>
                    <a href="#generator" class="create-first-btn" data-section="generator">Crear mi primera imagen</a>
                </div>
            `;

            // Añadir evento al botón
            const createFirstBtn = galleryContainer.querySelector('.create-first-btn');
            if (createFirstBtn) {
                createFirstBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchSection('generator');
                });
            }

            return;
        }

        // Mostrar contador de imágenes
        const galleryHeader = document.querySelector('.gallery-header h3');
        if (galleryHeader) {
            galleryHeader.innerHTML = `Tu Galería de Imágenes <span class="image-counter">${data.length}/5</span>`;
        }

        // Crear elementos para cada imagen
        data.forEach(image => {
            const date = new Date(image.created_at);
            const formattedDate = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            // Extraer el nombre del archivo de la URL para eliminar del storage
            const imageUrl = new URL(image.image_url);
            const pathParts = imageUrl.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const storagePath = `${currentUser.id}/${fileName}`;

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${image.image_url}" alt="${image.prompt}" class="gallery-image">
                <div class="gallery-info">
                    <div class="gallery-prompt">${image.prompt}</div>
                    <div class="gallery-date">${formattedDate}</div>
                </div>
                <div class="gallery-actions">
                    <a href="${image.image_url}" download="flasti-image.jpg" class="gallery-action download-action">
                        <i class="fas fa-download"></i>
                    </a>
                    <button class="gallery-action share-action">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="gallery-action delete-action" data-id="${image.id}" data-path="${storagePath}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            galleryContainer.appendChild(galleryItem);

            // Añadir evento al botón de eliminar
            const deleteBtn = galleryItem.querySelector('.delete-action');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    const imageId = deleteBtn.getAttribute('data-id');
                    const storagePath = deleteBtn.getAttribute('data-path');
                    if (imageId) {
                        if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
                            deleteImage(imageId, storagePath);
                        }
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error al cargar galería:', error);
        showNotification('Error al cargar tu galería de imágenes');
    }
}

// Función para generar imagen
async function generateImage() {
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const loadingIndicator = document.getElementById('loading-indicator');

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

    // Los usuarios registrados pueden generar imágenes sin límite
    // No se verifica el límite ni se muestra el popup premium

    isGenerating = true;

    // Actualizar UI
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    loadingIndicator.style.display = 'flex';

    // Limpiar resultado anterior
    resultContainer.innerHTML = '';

    // Ocultar botones de acción
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');

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

        // Asegurarse de que las referencias a los botones estén actualizadas
        // Mostrar botones de acción (solo descargar y compartir)
        const downloadBtn = document.getElementById('download-btn');
        const shareBtn = document.getElementById('share-btn');

        if (downloadBtn) downloadBtn.style.display = 'flex';
        if (shareBtn) shareBtn.style.display = 'flex';

        // Incrementar contador de imágenes para todos los usuarios
        imageCount++;
        await updateImageCount(imageCount);

        // Actualizar estadísticas
        await loadStatistics();

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

// Función para actualizar contador de imágenes
async function updateImageCount(count) {
    if (!currentUser) return;

    try {
        console.log('Actualizando contador de imágenes a:', count);

        // Primero, obtener los valores actuales
        const { data: profileData, error: fetchError } = await supabaseClient
            .from('profiles')
            .select('download_count')
            .eq('id', currentUser.id)
            .single();

        if (fetchError) {
            console.error('Error al obtener datos del perfil:', fetchError);
            return false;
        }

        // Incrementar el contador de descargas para mostrar actividad
        const downloadCount = (profileData.download_count || 0) + 1;

        // Actualizar en la base de datos
        const { error } = await supabaseClient
            .from('profiles')
            .update({
                image_count: count,
                download_count: downloadCount
            })
            .eq('id', currentUser.id);

        if (error) {
            console.error('Error al actualizar contador de imágenes:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al actualizar contador de imágenes:', error);
        return false;
    }
}

// Función para guardar imagen
async function saveImage() {
    if (!currentUser) return;

    const resultContainer = document.getElementById('result-container');
    const promptInput = document.getElementById('prompt-input');

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
        // Verificar si el usuario ya tiene 5 imágenes guardadas
        const { data: imagesData, error: countError } = await supabaseClient
            .from('images')
            .select('id')
            .eq('user_id', currentUser.id);

        if (countError) {
            throw countError;
        }

        if (imagesData && imagesData.length >= 5) {
            showNotification('Has alcanzado el límite de 5 imágenes guardadas. Elimina alguna para guardar más.', 'warning');
            return;
        }

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

        // Actualizar galería y estadísticas
        loadGallery();
        loadStatistics();

    } catch (error) {
        console.error('Error al guardar imagen:', error);
        showNotification('Error al guardar la imagen');
    }
}

// Función para eliminar imagen
async function deleteImage(imageId, storagePath) {
    if (!currentUser) return;

    try {
        // Eliminar de la base de datos
        const { error: deleteError } = await supabaseClient
            .from('images')
            .delete()
            .eq('id', imageId)
            .eq('user_id', currentUser.id);

        if (deleteError) {
            throw deleteError;
        }

        // Eliminar del storage si se proporciona la ruta
        if (storagePath) {
            const { error: storageError } = await supabaseClient
                .storage
                .from('images')
                .remove([storagePath]);

            if (storageError) {
                console.error('Error al eliminar imagen del storage:', storageError);
            }
        }

        // Actualizar contador de imágenes guardadas
        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('saved_count')
            .eq('id', currentUser.id)
            .single();

        if (!profileError && profileData.saved_count > 0) {
            const savedCount = profileData.saved_count - 1;
            await supabaseClient
                .from('profiles')
                .update({ saved_count: savedCount })
                .eq('id', currentUser.id);
        }

        showNotification('Imagen eliminada correctamente', 'success');

        // Actualizar galería y estadísticas
        loadGallery();
        loadStatistics();

    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        showNotification('Error al eliminar la imagen');
    }
}

// Función para descargar imagen
function downloadImage() {
    const resultContainer = document.getElementById('result-container');

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

        // Actualizar contador de descargas
        updateDownloadCount();

        showNotification('Imagen descargada correctamente', 'success');
    } catch (error) {
        console.error('Error al descargar imagen:', error);
        showNotification('Error al descargar la imagen');
    }
}

// Función para actualizar contador de descargas
async function updateDownloadCount() {
    if (!currentUser) return;

    try {
        console.log('Actualizando contador de descargas');

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('download_count')
            .eq('id', currentUser.id)
            .single();

        if (error) {
            console.error('Error al obtener contador de descargas:', error);
            return;
        }

        const downloadCount = (data.download_count || 0) + 1;
        console.log('Nuevo contador de descargas:', downloadCount);

        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ download_count: downloadCount })
            .eq('id', currentUser.id);

        if (updateError) {
            console.error('Error al actualizar contador de descargas:', updateError);
            return;
        }

        console.log('Contador de descargas actualizado correctamente');

        // Actualizar estadísticas inmediatamente
        await loadStatistics();

    } catch (error) {
        console.error('Error al actualizar contador de descargas:', error);
    }
}

// Función para compartir imagen
function shareImage() {
    const resultContainer = document.getElementById('result-container');

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

// Función para mostrar popup de premium
function showPremiumPopup() {
    const premiumPopup = document.getElementById('premium-popup');
    if (!premiumPopup) return;

    premiumPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar popup de premium
function closePremiumPopup() {
    const premiumPopup = document.getElementById('premium-popup');
    if (!premiumPopup) return;

    premiumPopup.classList.remove('active');
    document.body.style.overflow = '';
}

// Función para cambiar de sección
function switchSection(sectionId) {
    // Actualizar navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    // Actualizar secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Actualizar título
    const sectionTitle = document.getElementById('section-title');
    if (sectionTitle) {
        switch (sectionId) {
            case 'generator':
                sectionTitle.textContent = 'Generador de Imágenes';
                break;
            case 'gallery':
                sectionTitle.textContent = 'Galería de Imágenes';
                break;
            case 'profile':
                sectionTitle.textContent = 'Mi Perfil';
                break;
        }
    }

    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
        toggleSidebar(false);
    }
}

// Función para alternar sidebar en móvil
function toggleSidebar(show) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');

    if (!sidebar || !overlay) return;

    if (show === undefined) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    } else if (show) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Función para cerrar sesión
async function logout() {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error('Error al cerrar sesión:', error);
            showNotification('Error al cerrar sesión');
            return;
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showNotification('Error al cerrar sesión');
    }
}

// Función para mostrar el menú de notificaciones
function showNotificationsMenu() {
    // Verificar si ya existe un menú de notificaciones
    let notificationsMenu = document.querySelector('.notifications-menu');

    // Si ya existe, eliminarlo (toggle)
    if (notificationsMenu) {
        notificationsMenu.remove();
        return;
    }

    // Crear el menú de notificaciones
    notificationsMenu = document.createElement('div');
    notificationsMenu.className = 'notifications-menu';

    // Estilo para el menú
    notificationsMenu.style.position = 'absolute';
    notificationsMenu.style.top = '60px';
    notificationsMenu.style.right = '20px';
    notificationsMenu.style.width = '300px';
    notificationsMenu.style.background = 'var(--card-bg)';
    notificationsMenu.style.borderRadius = 'var(--card-radius)';
    notificationsMenu.style.border = '1px solid var(--card-border)';
    notificationsMenu.style.boxShadow = 'var(--card-shadow)';
    notificationsMenu.style.zIndex = '100';
    notificationsMenu.style.overflow = 'hidden';

    // Contenido del menú
    notificationsMenu.innerHTML = `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
            <h3 style="margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-bell"></i> Notificaciones
            </h3>
        </div>
        <div style="padding: 2rem 1rem; text-align: center;">
            <i class="fas fa-bell-slash" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <p style="margin: 0; color: var(--text-muted);">No tienes notificaciones nuevas</p>
        </div>
    `;

    // Añadir el menú al DOM
    document.body.appendChild(notificationsMenu);

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function closeMenu(e) {
        if (!notificationsMenu.contains(e.target) && e.target !== document.querySelector('.notifications')) {
            notificationsMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Función para alternar entre modo oscuro y claro
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode') || !body.classList.contains('light-mode');

    if (isDarkMode) {
        // Cambiar a modo claro
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('flasti_theme', 'light');

        // Cambiar icono
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    } else {
        // Cambiar a modo oscuro
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('flasti_theme', 'dark');

        // Cambiar icono
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// Función para aplicar el tema guardado
function applyTheme() {
    const savedTheme = localStorage.getItem('flasti_theme');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');

    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// Función para aplicar sugerencias
function applySuggestion(suggestion) {
    const promptInput = document.getElementById('prompt-input');
    if (!promptInput) return;

    promptInput.value = suggestion;
    promptInput.focus();
}

// Lista de sugerencias posibles para el dashboard (diferentes a las de la página principal)
const dashboardSuggestions = [
    "Retrato futurista con luces neón",
    "Paisaje de montañas con aurora boreal",
    "Robot explorador en un planeta rojo",
    "Criatura mística en un bosque de cristal",
    "Ciudad flotante con cascadas de energía",
    "Guerrero samurai con armadura tecnológica",
    "Dragón de hielo sobre un castillo",
    "Nave espacial saliendo de un portal",
    "Templo antiguo con tecnología futurista",
    "Sirena en una ciudad submarina",
    "Caballero con armadura de cristal",
    "Biblioteca mágica con libros flotantes",
    "Jardín zen en una estación espacial",
    "Tigre de energía en una selva digital",
    "Montañas flotantes con cascadas",
    "Laboratorio steampunk con inventos",
    "Faro en un acantilado durante tormenta",
    "Elefante mecánico en un desierto",
    "Portal dimensional en un templo",
    "Ballena voladora sobre un océano"
];

// Función para obtener sugerencias aleatorias para el dashboard
function getDashboardSuggestions() {
    // Verificar si hay sugerencias guardadas y si han pasado 3 horas
    const savedSuggestions = localStorage.getItem('flasti_dashboard_suggestions');
    const lastUpdate = localStorage.getItem('flasti_dashboard_suggestions_time');
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

    if (savedSuggestions && lastUpdate && (now - parseInt(lastUpdate)) < threeHours) {
        // Usar las sugerencias guardadas si no han pasado 3 horas
        return JSON.parse(savedSuggestions);
    }

    // Obtener 4 sugerencias aleatorias
    const shuffled = [...dashboardSuggestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    // Guardar las sugerencias y la hora actual
    localStorage.setItem('flasti_dashboard_suggestions', JSON.stringify(selected));
    localStorage.setItem('flasti_dashboard_suggestions_time', now.toString());

    return selected;
}

// Función para mostrar las sugerencias en la UI del dashboard
function displayDashboardSuggestions() {
    const suggestions = getDashboardSuggestions();
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
    const promptInput = document.getElementById('prompt-input');
    if (!promptInput) return;

    promptInput.value = suggestion;
    promptInput.focus();
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    // Cargar datos del usuario
    await loadUserData();

    // Mostrar sugerencias aleatorias
    displayDashboardSuggestions();



    // Configurar navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });

    // Configurar toggle de sidebar en móvil
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            toggleSidebar();
        });
    }

    // Configurar overlay para cerrar sidebar
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            toggleSidebar(false);
        });
    }

    // Configurar botón de generación
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }

    // No configuramos el botón de guardar ya que lo hemos eliminado

    // Configurar botón de descargar
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // Configurar botón de compartir
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareImage);
    }

    // No se configura el popup premium para usuarios registrados
    // ya que pueden generar imágenes sin límite

    // Configurar botón de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Permitir generar con Enter
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateImage();
            }
        });
    }

    // Configurar notificaciones
    const notificationsIcon = document.querySelector('.notifications');
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', showNotificationsMenu);
    }

    // Configurar toggle de tema
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Aplicar tema guardado
        applyTheme();
    }

    // Verificar si se debe actualizar las sugerencias cada 3 horas
    // incluso si el usuario no recarga la página
    setInterval(() => {
        displayDashboardSuggestions();
    }, 3 * 60 * 60 * 1000); // Cada 3 horas
});
