/**
 * Funciones auxiliares para las notificaciones FOMO
 */

/**
 * Marca que el usuario ha completado un pago para detener las notificaciones FOMO
 */
export const markPaymentCompleted = (): void => {
  try {
    localStorage.setItem('flastiCompletedPayment', 'true');
    console.log('Pago completado: las notificaciones FOMO se detendrán');
  } catch (error) {
    console.error('Error al marcar el pago como completado:', error);
  }
};

/**
 * Reinicia el estado de las notificaciones FOMO (solo para pruebas)
 */
export const resetFomoState = (): void => {
  try {
    localStorage.removeItem('flastiFirstVisit');
    localStorage.removeItem('flastiCompletedPayment');
    localStorage.removeItem('flastiSessionId');
    sessionStorage.removeItem('flastiCurrentSessionId');
    sessionStorage.removeItem('flastiShownNotifications');
    sessionStorage.removeItem('flastiSessionNotifications');
    console.log('Estado de notificaciones FOMO reiniciado');
  } catch (error) {
    console.error('Error al reiniciar el estado de las notificaciones FOMO:', error);
  }
};
