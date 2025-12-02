import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, email_type, user_email, user_name } = body;
    
    console.log('📧 Solicitud de envío de correo:', { user_id, email_type, user_email, user_name });
    
    if (!user_id || !email_type || !user_email) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Obtener token de autorización
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar que el usuario sea admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Error obteniendo perfil:', profileError);
      return NextResponse.json({ error: 'Error verificando permisos' }, { status: 500 });
    }

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    // Validar configuración SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ Configuración SMTP incompleta');
      return NextResponse.json({ 
        error: 'Configuración de correo incompleta. Contacta al administrador del sistema.' 
      }, { status: 500 });
    }

    // Obtener la plantilla de correo
    const templateKey = email_type === 'recovery_1' ? 'recovery_1' 
                      : email_type === 'recovery_2' ? 'recovery_2' 
                      : 'welcome';

    console.log('📄 Buscando plantilla:', templateKey);

    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .single();

    if (templateError) {
      console.error('❌ Error obteniendo plantilla:', templateError);
      return NextResponse.json({ 
        error: `Plantilla "${templateKey}" no encontrada en la base de datos` 
      }, { status: 404 });
    }

    if (!template) {
      return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 });
    }

    console.log('✅ Plantilla encontrada:', template.subject);

    // Reemplazar variables en el HTML
    let htmlContent = template.html_content;
    htmlContent = htmlContent.replace(/\{\{user_name\}\}/g, user_name || 'Usuario');
    htmlContent = htmlContent.replace(/\{\{user_email\}\}/g, user_email);

    // Configurar transporter de nodemailer
    console.log('📮 Configurando transporter SMTP...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verificar conexión SMTP
    try {
      await transporter.verify();
      console.log('✅ Conexión SMTP verificada');
    } catch (verifyError) {
      console.error('❌ Error verificando conexión SMTP:', verifyError);
      return NextResponse.json({ 
        error: 'Error de conexión con el servidor de correo. Verifica la configuración SMTP.',
        details: verifyError instanceof Error ? verifyError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Enviar correo
    console.log('📧 Enviando correo a:', user_email);
    try {
      const info = await transporter.sendMail({
        from: `"Flasti" <${process.env.SMTP_USER}>`,
        to: user_email,
        subject: template.subject,
        html: htmlContent,
      });
      console.log('✅ Correo enviado:', info.messageId);
    } catch (sendError) {
      console.error('❌ Error enviando correo:', sendError);
      return NextResponse.json({ 
        error: 'Error al enviar el correo',
        details: sendError instanceof Error ? sendError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Registrar el envío en la base de datos
    const { error: logError } = await supabase
      .from('user_email_logs')
      .insert({
        user_id,
        email_type,
        template_key: templateKey,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (logError) {
      console.error('⚠️ Error registrando log (correo enviado exitosamente):', logError);
    }

    console.log('✅ Proceso completado exitosamente');
    return NextResponse.json({ 
      success: true,
      message: 'Correo enviado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error general enviando correo:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
