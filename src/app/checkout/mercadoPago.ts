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
 * Función para cargar Mercado Pago
 * @param cachedPreferenceId - ID de preferencia precargado (no usado actualmente)
 * @param cachedInitPoint - URL de pago precargada (no usado actualmente)
 */
export function loadMercadoPago(cachedPreferenceId: string | null = null, cachedInitPoint: string | null = null): void {
  if (typeof window === 'undefined') return;

  console.log('Iniciando carga de Mercado Pago...');

  // Detener cualquier intervalo de limpieza existente
  if (window.mercadoPagoCleanupInterval) {
    console.log('Deteniendo intervalo de limpieza anterior');
    clearInterval(window.mercadoPagoCleanupInterval);
    window.mercadoPagoCleanupInterval = 0;
  }

  // Iniciar un nuevo intervalo de limpieza que se ejecutará cada 500ms
  window.mercadoPagoCleanupInterval = window.setInterval(() => {
    cleanupDuplicateButtons();
  }, 500);

  // Usar el contenedor específico para Mercado Pago
  const mpContainer = document.getElementById('mp-wallet-container');
  if (!mpContainer) {
    console.error('No se encontró el contenedor de Mercado Pago');
    return;
  }

  // LIMPIEZA AGRESIVA: Eliminar TODOS los botones de Mercado Pago en el documento
  const existingButtons = document.querySelectorAll('.mercadopago-button');
  if (existingButtons.length > 0) {
    console.log(`LIMPIEZA INICIAL: Se encontraron ${existingButtons.length} botones de Mercado Pago existentes. Eliminando TODOS...`);
    existingButtons.forEach(button => button.remove());
  }

  // Eliminar TODOS los elementos del DOM relacionados con Mercado Pago
  // 1. Eliminar cualquier script existente
  const existingScripts = document.querySelectorAll('script[src*="mercadopago"]');
  existingScripts.forEach(script => {
    console.log('Eliminando script de Mercado Pago:', script);
    script.remove();
  });

  // 2. Eliminar cualquier script con ID específico
  const namedScript = document.getElementById('mercadopago-script');
  if (namedScript) {
    console.log('Eliminando script con ID mercadopago-script');
    namedScript.remove();
  }

  // 3. Limpiar completamente el contenedor
  while (mpContainer.firstChild) {
    mpContainer.removeChild(mpContainer.firstChild);
  }

  // 4. Agregar mensaje de carga
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
  loadingDiv.innerHTML = 'Conectando con Mercado Pago<span class="opacity-80">...</span>';
  mpContainer.appendChild(loadingDiv);

  // Crear un nuevo script de Mercado Pago
  const script = document.createElement('script');
  script.src = 'https://sdk.mercadopago.com/js/v2';
  script.async = true;
  script.id = 'mercadopago-script';

  script.onload = () => {
    console.log('Script de Mercado Pago cargado correctamente');

    // Verificar que el contenedor existe
    const mpContainer = document.getElementById('mp-wallet-container');
    if (!mpContainer) {
      console.error('No se encontró el contenedor de Mercado Pago después de cargar el script');
      return;
    }

    // LIMPIEZA AGRESIVA: Eliminar TODOS los botones de Mercado Pago en el documento
    const existingButtons = document.querySelectorAll('.mercadopago-button');
    if (existingButtons.length > 0) {
      console.log(`LIMPIEZA DESPUÉS DE CARGAR SCRIPT: Se encontraron ${existingButtons.length} botones de Mercado Pago. Eliminando TODOS...`);
      existingButtons.forEach(button => button.remove());
    }

    // Limpiar completamente el contenedor nuevamente
    while (mpContainer.firstChild) {
      mpContainer.removeChild(mpContainer.firstChild);
    }

    // Agregar mensaje de carga
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
    loadingDiv.innerHTML = 'Conectando con Mercado Pago<span class="opacity-80">...</span>';
    mpContainer.appendChild(loadingDiv);

    // Verificar que MercadoPago está disponible
    if (!window.MercadoPago) {
      console.error('El objeto MercadoPago no está disponible');
      mpContainer.innerHTML = '<div class="text-red-500 text-center py-3">Error al cargar Mercado Pago</div>';
      return;
    }

    try {
      console.log('Inicializando Mercado Pago...');

      // Inicializar Mercado Pago con la Public Key
      const mp = new window.MercadoPago('APP_USR-c40ff253-7e56-4772-b16c-453133f3aa39', {
        locale: 'es-AR'
      });

      // Crear el botón de pago
      const bricksBuilder = mp.bricks();

      // Obtener el precio actual desde localStorage
      let amountARS = 11500; // Valor por defecto: 11.500 ARS

      // Verificar si hay descuentos aplicados
      const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
      const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

      if (finalDiscountApplied) {
        amountARS = 5750; // 5.750 ARS para el descuento de $5 USD
        console.log('Aplicando descuento final: AR$ 5.750');
      } else if (discountApplied) {
        amountARS = 9200; // 9.200 ARS para el descuento de $8 USD
        console.log('Aplicando descuento: AR$ 9.200');
      } else {
        console.log('Precio normal: AR$ 11.500');
      }

      console.log('Obteniendo preferenceId para monto:', amountARS);

      // Obtener el preferenceId desde nuestro endpoint
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener preferenceId');
        }
        return response.json();
      })
      .then(data => {
        console.log('PreferenceId obtenido:', data.id);

        // LIMPIEZA AGRESIVA: Eliminar TODOS los botones de Mercado Pago en el documento
        const existingButtons = document.querySelectorAll('.mercadopago-button');
        if (existingButtons.length > 0) {
          console.log(`LIMPIEZA ANTES DE CREAR BOTÓN: Se encontraron ${existingButtons.length} botones de Mercado Pago. Eliminando TODOS...`);
          existingButtons.forEach(button => button.remove());
        }

        // Limpiar completamente el contenedor antes de crear el botón
        while (mpContainer.firstChild) {
          mpContainer.removeChild(mpContainer.firstChild);
        }

        // Verificar si ya existe un contenedor para el botón
        let buttonContainer = document.getElementById('mp-button-container');
        if (buttonContainer) {
          // Si ya existe, limpiarlo completamente
          while (buttonContainer.firstChild) {
            buttonContainer.removeChild(buttonContainer.firstChild);
          }
        } else {
          // Si no existe, crearlo
          buttonContainer = document.createElement('div');
          buttonContainer.id = 'mp-button-container';
          mpContainer.appendChild(buttonContainer);
        }

        console.log('Creando botón de Mercado Pago...');

        // Esperar un momento antes de crear el botón para asegurar que todo esté limpio
        setTimeout(() => {
          // LIMPIEZA FINAL: Eliminar cualquier botón que haya aparecido
          const finalButtons = document.querySelectorAll('.mercadopago-button');
          if (finalButtons.length > 0) {
            console.log(`LIMPIEZA FINAL: Se encontraron ${finalButtons.length} botones de Mercado Pago. Eliminando TODOS...`);
            finalButtons.forEach(button => button.remove());
          }

          // Crear el botón de Mercado Pago con el preferenceId obtenido
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
              buttonBackground: '#22c55e',
              borderRadius: '8px'
            }
          },
          callbacks: {
            onReady: () => {
              console.log('Mercado Pago listo');

              // LIMPIEZA FINAL DESPUÉS DE CREAR BOTÓN
              setTimeout(() => {
                // Verificar si hay botones duplicados en todo el documento
                const allButtons = document.querySelectorAll('.mercadopago-button');
                if (allButtons.length > 1) {
                  console.warn(`LIMPIEZA DESPUÉS DE CREAR BOTÓN: Se encontraron ${allButtons.length} botones de Mercado Pago en el documento. Eliminando duplicados...`);

                  // Mantener solo el primer botón dentro del contenedor específico
                  const mpButtonContainer = document.getElementById('mp-button-container');
                  if (mpButtonContainer) {
                    const containerButtons = mpButtonContainer.querySelectorAll('.mercadopago-button');
                    if (containerButtons.length > 0) {
                      // Mantener solo el primer botón dentro del contenedor
                      for (let i = 1; i < containerButtons.length; i++) {
                        containerButtons[i].remove();
                      }

                      // Eliminar todos los botones fuera del contenedor
                      allButtons.forEach(button => {
                        if (!mpButtonContainer.contains(button)) {
                          console.log('Eliminando botón fuera del contenedor');
                          button.remove();
                        }
                      });
                    }
                  } else {
                    // Si no hay contenedor específico, mantener solo el primer botón
                    for (let i = 1; i < allButtons.length; i++) {
                      allButtons[i].remove();
                    }
                  }
                }
              }, 100); // Esperar 100ms para asegurarse de que el botón se ha creado completamente
            },
            onError: (error: any) => {
              console.error('Error en Mercado Pago:', error);
              createFallbackButton(mpContainer, amountARS, data.init_point);
            },
            onSubmit: () => {
              console.log('Pago iniciado con Mercado Pago');
            }
          }
        });
        }, 100); // Esperar 100ms para asegurar que todo esté limpio
      })
      .catch(error => {
        console.error('Error al obtener preferenceId:', error);
        // Usar el valor de amountARS que está en el scope
        createFallbackButton(mpContainer, amountARS);
      });
    } catch (error) {
      console.error('Error al inicializar Mercado Pago:', error);
      // Usar un valor predeterminado para el fallback
      createFallbackButton(mpContainer, 11500);
    }
  };

  document.body.appendChild(script);
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
