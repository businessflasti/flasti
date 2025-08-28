"use client";

/**
 * Función para cargar Mercado Pago con un botón personalizado
 * @param cachedPreferenceId - ID de preferencia precargado
 * @param cachedInitPoint - URL de pago precargada
 * @returns Script de Mercado Pago
 */
export function loadMercadoPago(cachedPreferenceId: string | null = null, cachedInitPoint: string | null = null) {
  if (typeof window === 'undefined') return null;

  // Usar el contenedor específico para Mercado Pago
  const mpContainer = document.getElementById('mp-wallet-container');
  if (!mpContainer) return null;
  
  // Mostrar mensaje de carga
  mpContainer.innerHTML = '<div class="animate-pulse text-white/70 text-center py-4">Conectando con Mercado Pago...</div>';

  // Precio fijo en pesos argentinos: 11.500 ARS
  const amountARS = 11500;

  // Si ya tenemos un preferenceId precargado, crear un botón personalizado
  if (cachedPreferenceId && cachedInitPoint) {
    console.log('Usando preferenceId precargado:', cachedPreferenceId);
    
    // Crear un botón personalizado con estilo verde
    createCustomButton(mpContainer, amountARS, cachedInitPoint);
    
    return null;
  }

  // Si no tenemos un preferenceId precargado, obtenerlo desde nuestro endpoint
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
    // Crear un botón personalizado con el initPoint obtenido
    createCustomButton(mpContainer, amountARS, data.init_point);
  })
  .catch(error => {
    console.error('Error:', error);
    
    // Si hay un error, mostrar un botón de respaldo
    createFallbackButton(mpContainer, amountARS);
  });

  return null;
}

/**
 * Crea un botón personalizado para Mercado Pago
 * @param container - Contenedor donde se agregará el botón
 * @param amount - Monto en pesos argentinos
 * @param initPoint - URL de pago de Mercado Pago
 */
function createCustomButton(container: HTMLElement, amount: number, initPoint: string) {
  // Limpiar el contenedor
  container.innerHTML = '';
  
  // Crear un botón personalizado con estilo verde
  const button = document.createElement('button');
  button.className = 'w-full py-4 px-6 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] duration-200';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4" />
    </svg>
    <span class="font-bold">¡PAGAR AHORA!</span>
    <span class="ml-2 bg-white/20 px-2 py-1 rounded text-sm">AR$ ${amount.toLocaleString('es-AR')}</span>
  `;
  
  // Agregar evento de clic al botón personalizado
  button.addEventListener('click', () => {
    // Mostrar animación de carga
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Procesando pago...
    `;
    
    // Redirigir a la URL de pago de Mercado Pago
    window.location.href = initPoint;
  });
  
  // Agregar el botón al contenedor
  container.appendChild(button);
}

/**
 * Crea un botón de respaldo en caso de error
 * @param container - Contenedor donde se agregará el botón
 * @param amount - Monto en pesos argentinos
 */
function createFallbackButton(container: HTMLElement, amount: number) {
  // Limpiar el contenedor
  container.innerHTML = '';
  
  // Crear un botón de respaldo
  const button = document.createElement('button');
  button.className = 'w-full py-4 px-6 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4" />
    </svg>
    <span class="font-bold">¡PAGAR AHORA!</span>
    <span class="ml-2 bg-white/20 px-2 py-1 rounded text-sm">AR$ ${amount.toLocaleString('es-AR')}</span>
  `;
  
  // Agregar evento de clic al botón de respaldo
  button.addEventListener('click', () => {
    // Mostrar animación de carga
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Procesando pago...
    `;
    
    // Redirigir a la página de registro
    setTimeout(() => {
      window.location.href = "https://flasti.com/register";
    }, 2000);
  });
  
  // Agregar el botón al contenedor
  container.appendChild(button);
}
