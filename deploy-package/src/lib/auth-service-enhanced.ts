import { supabase } from './supabase';
import { authenticator } from 'otplib';
import { createTransport } from 'nodemailer';

export class AuthServiceEnhanced {
  private static instance: AuthServiceEnhanced;
  private emailTransporter: any;

  private constructor() {
    // Configurar el transportador de correo
    this.emailTransporter = createTransport({
      // Configurar según el proveedor de correo
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public static getInstance(): AuthServiceEnhanced {
    if (!AuthServiceEnhanced.instance) {
      AuthServiceEnhanced.instance = new AuthServiceEnhanced();
    }
    return AuthServiceEnhanced.instance;
  }

  /**
   * Genera un secreto 2FA para un usuario
   */
  public async generate2FASecret(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = authenticator.generateSecret();
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user?.email) {
      throw new Error('Usuario no encontrado');
    }

    // Guardar el secreto en la base de datos
    await supabase
      .from('user_2fa')
      .insert({
        user_id: userId,
        secret,
        enabled: false
      });

    // Generar URL para código QR
    const qrCodeUrl = authenticator.keyuri(user.email, 'Flasti', secret);

    return { secret, qrCodeUrl };
  }

  /**
   * Verifica un código 2FA
   */
  public async verify2FACode(userId: string, code: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_2fa')
      .select('secret')
      .eq('user_id', userId)
      .single();

    if (!data?.secret) {
      return false;
    }

    return authenticator.verify({
      token: code,
      secret: data.secret
    });
  }

  /**
   * Habilita 2FA para un usuario
   */
  public async enable2FA(userId: string, verificationCode: string): Promise<boolean> {
    const isValid = await this.verify2FACode(userId, verificationCode);

    if (!isValid) {
      return false;
    }

    await supabase
      .from('user_2fa')
      .update({ enabled: true })
      .eq('user_id', userId);

    return true;
  }

  /**
   * Deshabilita 2FA para un usuario
   */
  public async disable2FA(userId: string): Promise<void> {
    await supabase
      .from('user_2fa')
      .delete()
      .eq('user_id', userId);
  }

  /**
   * Envía un código de verificación por correo
   */
  public async sendVerificationCode(email: string): Promise<string> {
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await this.emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de verificación - Flasti',
      text: `Tu código de verificación es: ${verificationCode}`,
      html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`
    });

    // Guardar el código con tiempo de expiración
    await supabase
      .from('verification_codes')
      .insert({
        email,
        code: verificationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
      });

    return verificationCode;
  }

  /**
   * Verifica un código enviado por correo
   */
  public async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const { data } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!data) {
      return false;
    }

    // Eliminar el código usado
    await supabase
      .from('verification_codes')
      .delete()
      .eq('email', email)
      .eq('code', code);

    return true;
  }

  /**
   * Registra un intento fallido de inicio de sesión
   */
  public async logFailedLoginAttempt(email: string, ipAddress: string): Promise<void> {
    await supabase
      .from('login_attempts')
      .insert({
        email,
        ip_address: ipAddress,
        timestamp: new Date().toISOString()
      });
  }

  /**
   * Verifica si una cuenta está bloqueada por demasiados intentos fallidos
   */
  public async isAccountLocked(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .gte('timestamp', new Date(Date.now() - 30 * 60 * 1000).toISOString()); // Últimos 30 minutos

    return (data?.length || 0) >= 5; // Bloquear después de 5 intentos fallidos
  }
}

export const authServiceEnhanced = AuthServiceEnhanced.getInstance();