import nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate } from './email-templates';

// Configuración del transportador de email para Zoho
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.ZOHO_EMAIL || 'access@flasti.com',
      pass: process.env.ZOHO_APP_PASSWORD || '8A0D5LexU8hB'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};



// Función para enviar email de bienvenida
export const sendWelcomeEmail = async (
  userEmail: string, 
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Flasti',
        address: process.env.ZOHO_EMAIL || 'access@flasti.com'
      },
      headers: {
        'X-Avatar-URL': 'https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/Iso%20%231.png'
      },
      to: userEmail,
      subject: `${userName} 👋 Te damos la bienvenida a Flasti`,
      html: getWelcomeEmailTemplate({
        fullName: userName,
        email: userEmail
      }),
      text: `¡Hola ${userName}! Te damos la bienvenida a Flasti. Tu pago ha sido procesado exitosamente y tu cuenta está lista. Accede a tu dashboard en: https://flasti.com/register`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado exitosamente:', result.messageId);
    
    return { success: true };
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

export default { sendWelcomeEmail };
