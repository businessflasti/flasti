import { createClient } from '@supabase/supabase-js';
import Handlebars from 'handlebars';
let fs: typeof import('fs') | undefined;
let path: typeof import('path') | undefined;

if (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'node') {
  fs = require('fs');
  path = require('path');
}

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Plantillas de correo personalizadas
export enum EmailTemplate {
  WELCOME = 'welcome',
  COMMISSION_RECEIVED = 'commission-received',
  WITHDRAWAL_PROCESSED = 'withdrawal-processed',
  LEVEL_UPGRADE = 'level-upgrade'
}

// Asuntos de correo según el tipo
const emailSubjects: Record<EmailTemplate, string> = {
  [EmailTemplate.WELCOME]: '¡Bienvenido a flasti! - Tu viaje comienza aquí',
  [EmailTemplate.COMMISSION_RECEIVED]: '¡Has recibido una comisión! - flasti',
  [EmailTemplate.WITHDRAWAL_PROCESSED]: 'Retiro procesado con éxito - flasti',
  [EmailTemplate.LEVEL_UPGRADE]: '¡Felicidades por tu ascenso de nivel! - flasti'
};

// Caché de plantillas compiladas
const templateCache: Record<string, HandlebarsTemplateDelegate> = {};

/**
 * Obtiene una plantilla compilada de Handlebars
 * @param templateName Nombre de la plantilla
 * @returns Plantilla compilada
 */
async function getCompiledTemplate(templateName: EmailTemplate): Promise<HandlebarsTemplateDelegate> {
  // Si la plantilla ya está en caché, la devolvemos
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  if (!fs || !path) {
    // Si no estamos en entorno Node, retorna una función vacía para evitar errores
    return () => '';
  }

  try {
    // Ruta a la plantilla
    const templatePath = path.join(process.cwd(), 'email-templates', `${templateName}.html`);
    // Leer el contenido de la plantilla
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    // Compilar la plantilla
    const template = Handlebars.compile(templateSource);
    // Guardar en caché
    templateCache[templateName] = template;
    return template;
  } catch (error) {
    console.error(`Error al cargar la plantilla ${templateName}:`, error);
    throw new Error(`No se pudo cargar la plantilla de correo: ${templateName}`);
  }
}

/**
 * Envía un correo electrónico personalizado
 * @param to Dirección de correo del destinatario
 * @param templateName Nombre de la plantilla a utilizar
 * @param variables Variables para la plantilla
 * @returns Resultado del envío
 */
export async function sendCustomEmail(
  to: string,
  templateName: EmailTemplate,
  variables: Record<string, any>
): Promise<{ success: boolean; error?: any }> {
  try {
    // Obtener la plantilla compilada
    const template = await getCompiledTemplate(templateName);
    
    // Renderizar la plantilla con las variables
    const html = template(variables);
    
    // Obtener el asunto según el tipo de correo
    const subject = emailSubjects[templateName];
    
    // Enviar correo usando la API de Supabase
    const { error } = await supabase.auth.admin.sendEmail(to, {
      subject,
      html,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error };
  }
}

/**
 * Envía un correo de bienvenida a un nuevo usuario
 * @param to Dirección de correo del destinatario
 * @param name Nombre del usuario
 * @returns Resultado del envío
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<{ success: boolean; error?: any }> {
  return sendCustomEmail(to, EmailTemplate.WELCOME, { Name: name });
}

/**
 * Envía una notificación de comisión recibida
 * @param to Dirección de correo del destinatario
 * @param data Datos de la comisión
 * @returns Resultado del envío
 */
export async function sendCommissionEmail(
  to: string,
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
): Promise<{ success: boolean; error?: any }> {
  return sendCustomEmail(to, EmailTemplate.COMMISSION_RECEIVED, {
    Name: data.name,
    Amount: data.amount,
    Balance: data.balance,
    TransactionId: data.transactionId,
    Date: data.date,
    ProductName: data.productName,
    SaleAmount: data.saleAmount,
    CommissionRate: data.commissionRate
  });
}

/**
 * Envía una notificación de retiro procesado
 * @param to Dirección de correo del destinatario
 * @param data Datos del retiro
 * @returns Resultado del envío
 */
export async function sendWithdrawalEmail(
  to: string,
  data: {
    name: string;
    amount: string;
    balance: string;
    transactionId: string;
    requestDate: string;
    processDate: string;
    paymentMethod: string;
  }
): Promise<{ success: boolean; error?: any }> {
  return sendCustomEmail(to, EmailTemplate.WITHDRAWAL_PROCESSED, {
    Name: data.name,
    Amount: data.amount,
    Balance: data.balance,
    TransactionId: data.transactionId,
    RequestDate: data.requestDate,
    ProcessDate: data.processDate,
    PaymentMethod: data.paymentMethod
  });
}

/**
 * Envía una notificación de ascenso de nivel
 * @param to Dirección de correo del destinatario
 * @param data Datos del ascenso
 * @returns Resultado del envío
 */
export async function sendLevelUpgradeEmail(
  to: string,
  data: {
    name: string;
    level: number;
    commissionRate: number;
  }
): Promise<{ success: boolean; error?: any }> {
  return sendCustomEmail(to, EmailTemplate.LEVEL_UPGRADE, {
    Name: data.name,
    Level: data.level,
    CommissionRate: data.commissionRate
  });
}
