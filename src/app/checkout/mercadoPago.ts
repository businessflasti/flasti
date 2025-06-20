"use client";

declare global {
  interface Window {
    MercadoPago: any;
    mercadoPagoInitialized: boolean;
    mercadoPagoButtonCreated: boolean;
    mercadoPagoCleanupInterval: number;
  }
}

/**
 * Función para eliminar todos los botones de Mercado Pago excepto uno
 */
function cleanupDuplicateButtons(): void {
  // Verificar si hay botones de Mercado Pago
  const allButtons = document.querySelectorAll('.mercadopago-button');
  if (allButtons.length > 1) {
    console.warn(`LIMPIEZA AUTOMÁTICA: Se encontraron ${allButtons.length} botones de Mercado Pago. Eliminando duplicados...`);

    // Mantener solo el primer botón
    for (let i = 1; i < allButtons.length; i++) {
      console.log(`Eliminando botón duplicado ${i+1}/${allButtons.length}`);
      allButtons[i].remove();
    }
  }
}

/**
 * Función optimizada para cargar Mercado Pago rápidamente
 * @param cachedPreferenceId - ID de preferencia precargado
 * @param cachedInitPoint - URL de pago precargada
 * @param containerId - ID del contenedor donde cargar Mercado Pago
 */
export function loadMercadoPago(cachedPreferenceId: string | null = null, cachedInitPoint: string | null = null, containerId: string = 'mp-wallet-container'): void {
  if (typeof window === 'undefined') return;

  console.log('🚀 Carga rápida de Mercado Pago iniciada...');

  const mpContainer = document.getElementById(containerId);
  if (!mpContainer) {
    console.error(`❌ No se encontró el contenedor: ${containerId}`);
    return;
  }

  // Limpiar solo el contenedor específico
  mpContainer.innerHTML = '';

  // Mostrar mensaje de carga más elegante
  const loadingDiv = document.createElement('div');  // Mismo fondo oscuro del contenedor
  loadingDiv.style.background = '#181824';
  loadingDiv.style.minHeight = '60px';
  loadingDiv.style.borderRadius = '8px';
  loadingDiv.style.overflow = 'hidden';
  loadingDiv.style.position = 'relative';
  loadingDiv.className = 'flex items-center justify-center py-4 text-white/70';
  loadingDiv.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="text-sm">Cargando Mercado Pago...</span>
  `;
  mpContainer.appendChild(loadingDiv);

  // Verificar si el script ya está cargado y MercadoPago está disponible
  const existingScript = document.getElementById('mercadopago-script');
  if (existingScript && window.MercadoPago) {
    // Si ya está cargado y disponible, crear el botón directamente
    console.log('⚡ Script ya cargado, creando botón inmediatamente');
    createMercadoPagoButton(mpContainer);
    return;
  }

  // Si el script existe pero MercadoPago no está disponible, esperar un poco
  if (existingScript && !window.MercadoPago) {
    console.log('⏳ Script cargando, esperando...');
    setTimeout(() => {
      if (window.MercadoPago) {
        createMercadoPagoButton(mpContainer);
      } else {
        console.log('⚠️ Timeout esperando MercadoPago, recargando script');
        loadMercadoPago(cachedPreferenceId, cachedInitPoint, containerId);
      }
    }, 1000);
    return;
  }

  // Crear script de Mercado Pago solo si no existe
  const script = document.createElement('script');
  script.src = 'https://sdk.mercadopago.com/js/v2';
  script.async = true;
  script.id = 'mercadopago-script';

  script.onload = () => {
    console.log('✅ Script de Mercado Pago cargado');
    createMercadoPagoButton(mpContainer);
  };

  script.onerror = () => {
    console.error('❌ Error al cargar script de Mercado Pago');
    createFallbackButton(mpContainer, 11500);
  };

  document.body.appendChild(script);
}

/**
 * Función para crear el botón de Mercado Pago
 */
function createMercadoPagoButton(mpContainer: HTMLElement): void {

  // Limpiar el contenedor
  mpContainer.innerHTML = '';

  // Verificar que MercadoPago está disponible
  if (!window.MercadoPago) {
    console.error('❌ MercadoPago no disponible');
    createFallbackButton(mpContainer, 11500);
    return;
  }

  // El feedback visual de error del formulario ahora se maneja en page.tsx para consistencia con PayPal.

  try {
    console.log('🔧 Inicializando Mercado Pago...');

    // Inicializar Mercado Pago
    const mp = new window.MercadoPago('APP_USR-c40ff253-7e56-4772-b16c-453133f3aa39', {
      locale: 'es-AR'
    });

    // Obtener precio actual
    let amountARS = 11500;
    const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
    const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

    if (finalDiscountApplied) {
      amountARS = 5750;
    } else if (discountApplied) {
      amountARS = 9200;
    }

    console.log(`💰 Precio: AR$ ${amountARS.toLocaleString('es-AR')}`);

    // Crear preferencia y botón
    fetch('/api/mercadopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Acceso a Flasti',
        unitPrice: amountARS,
        currency: 'ARS',
        quantity: 1
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('✅ PreferenceId obtenido:', data.id);

      // Crear contenedor para el botón
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'mp-button-container';
      mpContainer.appendChild(buttonContainer);

      // Crear botón de Mercado Pago
      const bricksBuilder = mp.bricks();
      bricksBuilder.create('wallet', 'mp-button-container', {
        initialization: {
          preferenceId: data.id,
        },
        customization: {
          texts: {
            action: `Pagar AR$ ${amountARS.toLocaleString('es-AR')}`,
            valueProp: ''
          },
          visual: {
            hideValueProp: true,
            buttonBackground: '#009ee3',
            borderRadius: '8px'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('🎉 Botón de Mercado Pago listo');
          },
          onError: (error: any) => {
            console.error('❌ Error en botón:', error);
            createFallbackButton(mpContainer, amountARS, data.init_point);
          },
          onSubmit: () => {
            console.log('💳 Pago iniciado');
          }
        }
      });
    })
    .catch(error => {
      console.error('❌ Error al obtener preferenceId:', error);
      createFallbackButton(mpContainer, amountARS);
    });
  } catch (error) {
    console.error('❌ Error al inicializar:', error);
    createFallbackButton(mpContainer, 11500);
  }
}

// Función auxiliar para crear un botón de respaldo
function createFallbackButton(container: HTMLElement, amount: number, initPoint?: string): void {
  // Limpiar completamente el contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const errorMessage = document.createElement('div');
  errorMessage.className = 'text-red-500 text-center text-sm mb-3';
  errorMessage.textContent = 'Hubo un problema al conectar con Mercado Pago. Puedes usar este botón alternativo:';
  container.appendChild(errorMessage);

  const button = document.createElement('button');
  button.className = 'w-full py-3 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
    Pagar AR$ ${amount.toLocaleString('es-AR')}
  `;

  button.addEventListener('click', () => {
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Procesando pago...
    `;

    // Si hay un initPoint, abrir esa URL, de lo contrario ir a la página de registro
    if (initPoint) {
      setTimeout(() => {
        window.open(initPoint, '_blank');
      }, 1000);
    } else {
      setTimeout(() => {
        window.location.href = "https://flasti.com/secure-registration-portal-7f9a2b3c5d8e";
      }, 2000);
    }
  });

  container.appendChild(button);
}

// Nueva función para verificar si el formulario es válido (mismo criterio que en CheckoutContent)
function isMercadoPagoFormValid(): boolean {
  const fullName = (document.getElementById('mercadopago-fullname') as HTMLInputElement)?.value || '';
  const email = (document.getElementById('mercadopago-email') as HTMLInputElement)?.value || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return fullName.trim().length >= 2 && email.trim() !== '' && emailRegex.test(email);
}
