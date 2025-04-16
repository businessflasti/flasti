import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'flasti.business@gmail.com',
        pass: 'fmtz dwpc tqbl zlgq', // Contraseña de aplicación
      },
    });

    // Configurar el correo
    const mailOptions = {
      from: 'flasti.business@gmail.com',
      to,
      subject,
      text,
      html,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json(
      { error: 'Error al enviar el correo' },
      { status: 500 }
    );
  }
}
