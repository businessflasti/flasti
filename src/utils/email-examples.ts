/**
 * Este archivo contiene ejemplos de cómo enviar correos electrónicos personalizados
 * desde diferentes partes de la aplicación.
 */

/**
 * Envía un correo de bienvenida a un nuevo usuario
 * @param email Correo electrónico del usuario
 * @param name Nombre del usuario
 */
export async function sendWelcomeEmailExample(email: string, name: string) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        type: 'welcome',
        to: email,
        data: {
          name
        }
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error al enviar correo de bienvenida:', error);
    return false;
  }
}

/**
 * Envía una notificación de comisión recibida
 * @param email Correo electrónico del usuario
 * @param data Datos de la comisión
 */
export async function sendCommissionEmailExample(
  email: string,
  data: {
    name: string;
    amount: string;
    balance: string;
    transactionId: string;
    date: string;
    productName: string;
    saleAmount: string;
    commissionRate: string;
  }
) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        type: 'commission',
        to: email,
        data
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error al enviar notificación de comisión:', error);
    return false;
  }
}

/**
 * Envía una notificación de retiro procesado
 * @param email Correo electrónico del usuario
 * @param data Datos del retiro
 */
export async function sendWithdrawalEmailExample(
  email: string,
  data: {
    name: string;
    amount: string;
    balance: string;
    transactionId: string;
    requestDate: string;
    processDate: string;
    paymentMethod: string;
  }
) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        type: 'withdrawal',
        to: email,
        data
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error al enviar notificación de retiro:', error);
    return false;
  }
}

/**
 * Envía una notificación de ascenso de nivel
 * @param email Correo electrónico del usuario
 * @param data Datos del ascenso
 */
export async function sendLevelUpgradeEmailExample(
  email: string,
  data: {
    name: string;
    level: number;
    commissionRate: number;
  }
) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      },
      body: JSON.stringify({
        type: 'level-upgrade',
        to: email,
        data
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error al enviar notificación de ascenso de nivel:', error);
    return false;
  }
}
