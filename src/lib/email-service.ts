import nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate } from './email-templates';

// Sistema de welcome desactivado en esta instancia: función no realiza envíos reales
export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('sendWelcomeEmail: El sistema de emails de bienvenida está desactivado. Simulando éxito para', userEmail);
    return { success: true };
  } catch (error) {
    console.error('sendWelcomeEmail: Error inesperado (simulado):', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

export default { sendWelcomeEmail };
