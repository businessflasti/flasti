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

  console.log('🚀 Cargando botón de Mercado Pago...');

  const mpContainer = document.getElementById(containerId);
  if (!mpContainer) {
    console.error(`❌ No se encontró el contenedor: ${containerId}`);
    return;
  }

  // Limpiar el contenedor
  mpContainer.innerHTML = '';

  // Crear el botón directamente (más rápido y confiable)
  createMercadoPagoButton(mpContainer);
}

/**
 * Función para crear el botón de Mercado Pago (usando nuestro diseño propio)
 */
function createMercadoPagoButton(mpContainer: HTMLElement): void {
  // Limpiar el contenedor
  mpContainer.innerHTML = '';

  // Obtener precio actual
  let amountARS = 9900;
  const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
  const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

  if (finalDiscountApplied) {
    amountARS = 9900;
  } else if (discountApplied) {
    amountARS = 9900;
  }

  console.log(`💰 Precio: AR$ ${amountARS.toLocaleString('es-AR')}`);

  // Crear botón directamente (más rápido y confiable)
  createFallbackButton(mpContainer, amountARS);
}

// Función para crear el botón oficial de Mercado Pago (diseño propio)
function createFallbackButton(container: HTMLElement, amount: number, initPoint?: string): void {
  // Limpiar completamente el contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const button = document.createElement('button');
  button.className = 'w-full py-3.5 px-6 bg-[#FEE74E] hover:bg-[#FFD700] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:scale-[1.02]';
  button.style.fontSize = '20px';
  button.style.marginTop = '-5px';
  button.innerHTML = `
    <img src="/redes/mp.png" alt="Mercado Pago" width="28" height="28" style="object-fit: contain;" />
    <span style="color: #112081; font-weight: 700;">Mercado Pago</span>
  `;

  button.addEventListener('click', () => {
    button.disabled = true;
    button.className = 'w-full py-3.5 px-6 bg-[#FFD700] font-semibold rounded-lg flex items-center justify-center gap-3 shadow-md cursor-not-allowed opacity-90';
    button.innerHTML = `
      <svg class="animate-spin h-5 w-5" style="color: #112081;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span style="color: #112081;">Redirigiendo a Mercado Pago...</span>
    `;

    // Si hay un initPoint, abrir esa URL, de lo contrario crear una nueva preferencia
    if (initPoint) {
      setTimeout(() => {
        window.location.href = initPoint;
      }, 500);
    } else {
      // Crear preferencia y redirigir
      fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Acceso completo a Flasti – Microtareas ilimitadas',
          unitPrice: amount,
          currency: 'ARS',
          quantity: 1
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          console.error('No se recibió init_point');
          button.innerHTML = '<span style="color: white;">Error al procesar. Intenta de nuevo.</span>';
          button.disabled = false;
          button.className = 'w-full py-3.5 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        button.innerHTML = '<span style="color: white;">Error al procesar. Intenta de nuevo.</span>';
        button.disabled = false;
        button.className = 'w-full py-3.5 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3';
      });
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
